"""Submit a Shortcut spreadsheet job and download its completed workbook."""

import os
import sys
import time

import requests


BASE_URL = os.environ.get("SHORTCUT_API_BASE_URL", "https://api.shortcut.ai/api/spreadsheets").rstrip("/")
PROMPT = "Create a simple monthly budget spreadsheet with categories for income and expenses"
POLL_SECONDS = float(os.environ.get("SHORTCUT_POLL_SECONDS", "5"))


def main():
    api_key = os.environ.get("SHORTCUT_API_KEY")
    if not api_key:
        print("Set SHORTCUT_API_KEY in your shell before running this script.", file=sys.stderr)
        return 1

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {api_key}"})

    print("Submitting spreadsheet job...", flush=True)
    response = session.post(BASE_URL, json={"prompt": PROMPT}, timeout=30)
    response.raise_for_status()
    run_id = response.json()["runId"]
    print(f"Job submitted: {run_id}", flush=True)

    while True:
        response = session.get(f"{BASE_URL}/{run_id}", timeout=30)
        response.raise_for_status()
        job = response.json()
        status = job["status"]
        print(f"Job status: {status}", flush=True)

        if status == "completed":
            if not job.get("downloadUrl"):
                print("Job completed without a downloadable workbook.")
                return 0

            print("Downloading result.xlsx...", flush=True)
            # The documented endpoint keeps the API key on Shortcut's host.
            with session.get(f"{BASE_URL}/{run_id}/download", stream=True, timeout=60) as download:
                download.raise_for_status()
                with open("result.xlsx", "wb") as output:
                    for chunk in download.iter_content(chunk_size=64 * 1024):
                        if chunk:
                            output.write(chunk)
            print("Saved result.xlsx")
            return 0

        if status in ("failed", "cancelled"):
            print(f"Job {status}: {job.get('error', 'No details provided.')}", file=sys.stderr)
            return 1

        if status not in ("queued", "running", "finalizing"):
            print(f"Unexpected job status: {status}", file=sys.stderr)
            return 1

        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except requests.RequestException as error:
        print(f"Shortcut API request failed: {error}", file=sys.stderr)
        sys.exit(1)
