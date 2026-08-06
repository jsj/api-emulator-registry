# @api-emulator/azure

Azure Resource Manager provides cloud resource APIs for subscriptions, resource groups, deployments, and managed resources.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/azure
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@azure/api-emulator.mjs --service azure
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
azure:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/en-us/rest/api/resources/resource-groups)
- [api-emulator](https://github.com/jsj/api-emulator)
