from __future__ import annotations

from mcp.server.fastmcp import FastMCP

from src.tools.databricks.connection import (
    ping_databricks_api,
    validate_databricks_connection_config,
)
from src.tools.databricks.jobs import list_jobs, run_job, stop_job
from src.tools.databricks.pipelines import list_pipelines, start_pipeline, stop_pipeline


def register_mcp_tools(mcp: FastMCP) -> None:
    """Register MCP tools.

    Keep MCP tool declarations in this module so adding new tools is just:
    1) implement backend helper in src/tools/
    2) add a new @mcp.tool here
    """

    @mcp.tool(name="databricks_validate_connection_config")
    def databricks_validate_connection_config() -> dict:
        """Validate Databricks environment configuration only (no API call)."""

        return validate_databricks_connection_config()

    @mcp.tool(name="databricks_ping")
    def databricks_ping() -> dict:
        """Ping Databricks API using the configured host/token."""

        return ping_databricks_api()

    @mcp.tool(name="databricks_jobs_status")
    def databricks_jobs_status() -> dict:
        """Return job list with status/last run information."""

        return list_jobs()

    @mcp.tool(name="databricks_jobs_run")
    def databricks_jobs_run(jobId: str) -> dict:  # noqa: N803
        """Trigger a Databricks job run now."""

        return run_job(jobId)

    @mcp.tool(name="databricks_jobs_stop")
    def databricks_jobs_stop(jobId: str) -> dict:  # noqa: N803
        """Stop (cancel) the most recent active run for a Databricks job."""

        return stop_job(jobId)

    @mcp.tool(name="databricks_pipelines_status")
    def databricks_pipelines_status() -> dict:
        """Return pipeline list with current status information."""

        return list_pipelines()

    @mcp.tool(name="databricks_pipelines_start")
    def databricks_pipelines_start(pipelineId: str) -> dict:  # noqa: N803
        """Start a DLT pipeline update."""

        return start_pipeline(pipelineId)

    @mcp.tool(name="databricks_pipelines_stop")
    def databricks_pipelines_stop(pipelineId: str) -> dict:  # noqa: N803
        """Stop a running DLT pipeline."""

        return stop_pipeline(pipelineId)
