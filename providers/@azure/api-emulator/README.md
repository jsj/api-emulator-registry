# @api-emulator/azure

Azure Resource Manager provides cloud resource APIs for subscriptions, resource groups, deployments, and managed resources.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/azure
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@azure/api-emulator.mjs --service azure
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /subscriptions`
- `GET /subscriptions/:subscriptionId`
- `GET /subscriptions/:subscriptionId/locations`
- `GET /providers`
- `GET /providers/:providerNamespace`
- `GET /subscriptions/:subscriptionId/providers`
- `GET /subscriptions/:subscriptionId/providers/:providerNamespace`
- `GET /subscriptions/:subscriptionId/resources`
- `GET /subscriptions/:subscriptionId/resourcegroups`
- `GET /subscriptions/:subscriptionId/resourceGroups`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/resources`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/resources`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `PUT /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `PUT /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `DELETE /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `DELETE /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `PUT /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `PUT /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `DELETE /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `DELETE /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `GET /azure/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
azure:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/en-us/rest/api/resources/resource-groups)
- [api-emulator](https://github.com/jsj/api-emulator)
