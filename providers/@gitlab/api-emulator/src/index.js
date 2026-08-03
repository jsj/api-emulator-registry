function now() {
  return new Date().toISOString();
}

function projectPath(project) {
  return project.path_with_namespace ?? `${project.namespace}/${project.path}`;
}

function projectUrl(baseUrl, project) {
  return `${baseUrl}/${projectPath(project)}`;
}

function issueUrl(baseUrl, project, issue) {
  return `${projectUrl(baseUrl, project)}/-/issues/${issue.iid}`;
}

function mergeRequestUrl(baseUrl, project, mergeRequest) {
  return `${projectUrl(baseUrl, project)}/-/merge_requests/${mergeRequest.iid}`;
}

function resolveProject(store, encodedPath) {
  const path = decodeURIComponent(encodedPath);
  return store.collection("gitlab:projects", ["path_with_namespace"]).findOneBy("path_with_namespace", path);
}

function getProjectOr404(c, store, encodedPath) {
  const project = resolveProject(store, encodedPath);
  if (!project) return [undefined, c.json({ message: "404 Project Not Found" }, 404)];
  return [project, undefined];
}

function getMergeRequestOr404(c, store, project, iid) {
  const mergeRequests = store.collection("gitlab:merge_requests", ["project_id", "iid"]);
  const mergeRequest = mergeRequests.all().find((candidate) => (
    candidate.project_id === project.id && candidate.iid === Number(iid)
  ));
  if (!mergeRequest) return [undefined, c.json({ message: "404 Merge Request Not Found" }, 404)];
  return [mergeRequest, undefined];
}

function withMergeRequestWebUrl(baseUrl, project, mergeRequest) {
  return {
    ...mergeRequest,
    web_url: mergeRequest.web_url || mergeRequestUrl(baseUrl, project, mergeRequest),
  };
}

export const plugin = {
  name: "gitlab",
  register(app, store, _webhooks, baseUrl) {
    const projects = store.collection("gitlab:projects", ["path_with_namespace"]);
    const issues = store.collection("gitlab:issues", ["project_id", "iid"]);
    const notes = store.collection("gitlab:notes", ["issue_id"]);
    const mergeRequests = store.collection("gitlab:merge_requests", ["project_id", "iid"]);
    const mergeRequestNotes = store.collection("gitlab:merge_request_notes", ["merge_request_id"]);
    const mergeRequestDiscussions = store.collection("gitlab:merge_request_discussions", ["merge_request_id"]);

    app.get("/api/v4/user", (c) => c.json({ id: 1001, username: "sample-user", name: "Sample User" }));

    app.get("/api/v4/projects/:project", (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      return c.json({
        ...project,
        web_url: projectUrl(baseUrl, project),
        http_url_to_repo: `${projectUrl(baseUrl, project)}.git`,
      });
    });

    app.get("/api/v4/projects/:project/issues", (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      const labels = c.req.query("labels")?.split(",").filter(Boolean) ?? [];
      const projectIssues = issues.all().filter((issue) => {
        if (issue.project_id !== project.id) return false;
        return labels.every((label) => issue.labels.includes(label));
      });
      return c.json(projectIssues.map((issue) => ({ ...issue, web_url: issueUrl(baseUrl, project, issue) })));
    });

    app.post("/api/v4/projects/:project/issues", async (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      const body = await c.req.parseBody();
      const projectIssues = issues.findBy("project_id", project.id);
      const iid = Number(body.iid ?? projectIssues.length + 1);
      const issue = issues.insert({
        project_id: project.id,
        iid,
        title: String(body.title ?? "Untitled issue"),
        description: String(body.description ?? ""),
        labels: String(body.labels ?? body.label ?? "").split(",").filter(Boolean),
        state: "opened",
        assignees: [],
        web_url: "",
      });
      return c.json({ ...issue, web_url: issueUrl(baseUrl, project, issue) }, 201);
    });

    app.get("/api/v4/projects/:project/issues/:iid", (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      const issue = issues.all().find((candidate) => (
        candidate.project_id === project.id && candidate.iid === Number(c.req.param("iid"))
      ));
      if (!issue) return c.json({ message: "404 Issue Not Found" }, 404);
      return c.json({ ...issue, web_url: issueUrl(baseUrl, project, issue) });
    });

    app.put("/api/v4/projects/:project/issues/:iid", async (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      const issue = issues.all().find((candidate) => (
        candidate.project_id === project.id && candidate.iid === Number(c.req.param("iid"))
      ));
      if (!issue) return c.json({ message: "404 Issue Not Found" }, 404);
      const body = await c.req.parseBody();
      const addLabels = String(body.add_labels ?? body.labels ?? "").split(",").filter(Boolean);
      const removeLabels = String(body.remove_labels ?? "").split(",").filter(Boolean);
      const labels = Array.from(new Set([...issue.labels.filter((label) => !removeLabels.includes(label)), ...addLabels]));
      const updated = issues.update(issue.id, { ...body, labels });
      return c.json({ ...updated, web_url: issueUrl(baseUrl, project, updated) });
    });

    app.post("/api/v4/projects/:project/issues/:iid/notes", async (c) => {
      const [project, response] = getProjectOr404(c, store, c.req.param("project"));
      if (response) return response;
      const issue = issues.all().find((candidate) => (
        candidate.project_id === project.id && candidate.iid === Number(c.req.param("iid"))
      ));
      if (!issue) return c.json({ message: "404 Issue Not Found" }, 404);
      const body = await c.req.parseBody();
      const note = notes.insert({ issue_id: issue.id, body: String(body.body ?? body.message ?? ""), system: false });
      return c.json(note, 201);
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json(withMergeRequestWebUrl(baseUrl, project, mergeRequest));
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid/changes", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json({
        ...withMergeRequestWebUrl(baseUrl, project, mergeRequest),
        changes: mergeRequest.changes ?? [],
      });
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid/diffs", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json(mergeRequest.diffs ?? mergeRequest.changes ?? []);
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid/versions", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json(mergeRequest.versions ?? [{
        id: 1,
        head_commit_sha: mergeRequest.sha,
        base_commit_sha: mergeRequest.diff_refs?.base_sha,
        start_commit_sha: mergeRequest.diff_refs?.start_sha,
        diffs: mergeRequest.diffs ?? mergeRequest.changes ?? [],
      }]);
    });

    app.post("/api/v4/projects/:project/merge_requests/:iid/notes", async (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      const body = await c.req.parseBody();
      const note = mergeRequestNotes.insert({
        merge_request_id: mergeRequest.id,
        body: String(body.body ?? body.message ?? ""),
        system: false,
      });
      return c.json(note, 201);
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid/notes", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json(mergeRequestNotes.findBy("merge_request_id", mergeRequest.id));
    });

    app.post("/api/v4/projects/:project/merge_requests/:iid/discussions", async (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      const body = await c.req.parseBody();
      const note = {
        id: `${Date.now()}`,
        type: "DiffNote",
        body: String(body.body ?? body.message ?? ""),
        position: Object.fromEntries(
          Object.entries(body)
            .filter(([key]) => key.startsWith("position["))
            .map(([key, value]) => [key.slice(9, -1), value]),
        ),
        system: false,
      };
      const discussion = mergeRequestDiscussions.insert({
        merge_request_id: mergeRequest.id,
        individual_note: true,
        notes: [note],
      });
      return c.json(discussion, 201);
    });

    app.get("/api/v4/projects/:project/merge_requests/:iid/discussions", (c) => {
      const [project, projectResponse] = getProjectOr404(c, store, c.req.param("project"));
      if (projectResponse) return projectResponse;
      const [mergeRequest, mergeRequestResponse] = getMergeRequestOr404(c, store, project, c.req.param("iid"));
      if (mergeRequestResponse) return mergeRequestResponse;
      return c.json(mergeRequestDiscussions.findBy("merge_request_id", mergeRequest.id));
    });

    app.get("/api/v4/groups/:group/iterations", (c) => {
      const iterations = store.collection("gitlab:iterations", ["group_path"]).findBy("group_path", decodeURIComponent(c.req.param("group")));
      const state = c.req.query("state");
      return c.json(state === "current" ? iterations.slice(0, 1) : iterations);
    });

    if (projects.all().length === 0) {
      projects.insert({
        id: 1000,
        name: "sample-project",
        path: "sample-project",
        namespace: "example/team",
        path_with_namespace: "example/team/sample-project",
        default_branch: "main",
        created_at: now(),
      });
    }

    if (mergeRequests.all().length === 0) {
      mergeRequests.insert({
        project_id: 1000,
        iid: 1,
        title: "Improve sample validation flow",
        description: "Generic fixture merge request for emulator smoke coverage.",
        state: "opened",
        source_branch: "feature/sample-validation",
        target_branch: "main",
        sha: "1111111111111111111111111111111111111111",
        diff_refs: {
          base_sha: "0000000000000000000000000000000000000000",
          start_sha: "0000000000000000000000000000000000000000",
          head_sha: "1111111111111111111111111111111111111111",
        },
        changes: [{
          old_path: "src/validator.ts",
          new_path: "src/validator.ts",
          a_mode: "100644",
          b_mode: "100644",
          new_file: false,
          renamed_file: false,
          deleted_file: false,
          diff: "@@ -1,5 +1,7 @@\n export function buildResult(input) {\n+  if (!input.items?.length) return null;\n   return {\n     title: input.title,\n+    items: input.items,\n   };\n }\n",
        }],
        diffs: [{
          old_path: "src/validator.ts",
          new_path: "src/validator.ts",
          new_file: false,
          renamed_file: false,
          deleted_file: false,
          diff: "@@ -1,5 +1,7 @@\n export function buildResult(input) {\n+  if (!input.items?.length) return null;\n   return {\n     title: input.title,\n+    items: input.items,\n   };\n }\n",
        }],
        versions: [],
        web_url: "",
      });
    }
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  const projects = store.collection("gitlab:projects", ["path_with_namespace"]);
  const issues = store.collection("gitlab:issues", ["project_id", "iid"]);
  const iterations = store.collection("gitlab:iterations", ["group_path"]);
  const mergeRequests = store.collection("gitlab:merge_requests", ["project_id", "iid"]);

  for (const project of config.projects ?? []) projects.insert(project);
  for (const issue of config.issues ?? []) issues.insert(issue);
  for (const iteration of config.iterations ?? []) iterations.insert(iteration);
  for (const mergeRequest of config.merge_requests ?? []) mergeRequests.insert(mergeRequest);
}

export const label = "GitLab API emulator";
export const endpoints = "GET/POST/PUT /api/v4/projects/:project/issues, notes, groups/:group/iterations";
export const contract = {
  service: "gitlab",
  endpoints,
};
export const initConfig = {
  gitlab: {
    projects: [],
    issues: [],
    iterations: [],
    merge_requests: [],
  },
};
