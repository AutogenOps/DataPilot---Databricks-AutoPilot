# Backend (Databricks + MCP + Claude)

This backend is Python-first and connects Databricks with an MCP server using Claude as the LLM provider.

## Folder Structure

- `src/main.py`: startup entrypoint
- `src/config/env.py`: environment parsing and validation
- `src/server/mcp_server.py`: MCP server bootstrap
- `src/clients/databricks_client.py`: Databricks connection config layer
- `src/clients/anthropic_client.py`: Claude (Anthropic) client bootstrap
- `src/tools/databricks/`: Databricks-specific MCP tool modules
- `src/types/models.py`: shared backend types

## Setup

1. Fill values in `backend/.env`.
2. Create and activate a virtual environment.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run server:

```bash
python -m src.main
```

## Current Scope

Only base connectivity scaffolding is created in this step.
Monitoring tools and operational APIs will be added next.
