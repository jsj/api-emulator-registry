# Robinhood Banking MCP emulator

Stateful local emulator for Robinhood's Agentic Credit Card MCP surface.

## Upstream status

Robinhood's Banking MCP is available at `https://banking-agent.robinhood.com/mcp/banking`. The earlier `405 Method Not Allowed` result came from probing the POST-only MCP endpoint with a legacy SSE GET request, not from an upstream outage.

The live authenticated contract was verified on July 30, 2026. The emulator covers all seven observed tools:

- `banking_get_agent_card_balance`
- `banking_get_agent_card_creds`
- `banking_get_agent_card_policy`
- `banking_get_agent_card_status`
- `banking_get_agent_card_transactions`
- `banking_submit_feedback`
- `banking_wait_for_agent_card_approval`

## Verification

```bash
node @robinhood-banking/smoke.mjs
```

The smoke test covers OAuth, MCP initialization and discovery, card lookup and validation, transaction approval waits, feedback persistence, and representative error paths.
