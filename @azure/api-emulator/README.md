# @api-emulator/azure

Azure Resource Manager provides cloud resource APIs for subscriptions, resource groups, deployments, and managed resources.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/azure
```

## Run

```bash
npx -p api-emulator api --plugin ./@azure/api-emulator.mjs --service azure
```

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
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `PUT /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `PUT /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `DELETE /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName`
- `DELETE /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments`
- `GET /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `GET /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `PUT /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `PUT /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `DELETE /subscriptions/:subscriptionId/resourcegroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `DELETE /subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Resources/deployments/:deploymentName`
- `GET /azure/inspect/state`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
azure:
  subscriptionId: 00000000-0000-0000-0000-000000000000
  resourceGroups:
    - name: emulator-rg
      location: eastus
```

## Links

- [Official API docs](https://learn.microsoft.com/en-us/rest/api/resources/resource-groups)
- [Azure CLI](https://github.com/Azure/azure-cli)
- [api-emulator](https://github.com/jsj/api-emulator)
