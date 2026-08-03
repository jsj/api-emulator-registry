# Robinhood Banking MCP emulator

This package provides a stateful local emulator for the Robinhood Agentic Credit Card MCP API.

## Upstream status

The Robinhood Banking MCP is available at `https://banking-agent.robinhood.com/mcp/banking`.

A legacy SSE GET request caused the earlier `405 Method Not Allowed` result. The POST-only MCP endpoint remained available.

We made sure that the live authenticated contract was correct on July 30, 2026. The emulator supports all seven observed tools:

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
