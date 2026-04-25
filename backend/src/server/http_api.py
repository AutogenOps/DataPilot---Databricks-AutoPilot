from __future__ import annotations

import time

from starlette.applications import Starlette
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route

from src.config.env import env
from src.server.logs import log_buffer
from src.server.chat_router import handle_chat_message
from src.tools.databricks.clusters import list_clusters, start_cluster, terminate_cluster
from src.tools.databricks.connection import (
    ping_databricks_api,
    validate_databricks_connection_config,
)
from src.tools.databricks.jobs import get_job_url, list_jobs, run_job
from src.tools.databricks.pipelines import list_pipelines, start_pipeline, stop_pipeline


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception as exc:
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            log_buffer.add(
                "ERROR",
                f"{request.method} {request.url.path} -> 500 ({elapsed_ms}ms) {type(exc).__name__}: {exc}",
            )
            raise

        elapsed_ms = int((time.perf_counter() - start) * 1000)
        log_buffer.add(
            "INFO",
            f"{request.method} {request.url.path} -> {response.status_code} ({elapsed_ms}ms)",
        )
        return response


def _health(_request: Request) -> JSONResponse:
    return JSONResponse({"ok": True, "service": "datapilot-backend"})


def _databricks_validate(_request: Request) -> JSONResponse:
    data = validate_databricks_connection_config()
    status = 200 if data.get("ok") else 503
    return JSONResponse(data, status_code=status)


def _databricks_ping(_request: Request) -> JSONResponse:
    data = ping_databricks_api()
    status = 200 if data.get("ok") else 503
    return JSONResponse(data, status_code=status)


def _clusters(_request: Request) -> JSONResponse:
    data = list_clusters()
    status = 200 if data.get("ok") else 503
    return JSONResponse(data, status_code=status)


def _jobs(_request: Request) -> JSONResponse:
    data = list_jobs()
    status = 200 if data.get("ok") else 503
    return JSONResponse(data, status_code=status)


def _pipelines(_request: Request) -> JSONResponse:
    data = list_pipelines()
    status = 200 if data.get("ok") else 503
    return JSONResponse(data, status_code=status)


async def _chat(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    message = (body or {}).get("message")
    data = handle_chat_message(message if isinstance(message, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


async def _jobs_run(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    job_id = (body or {}).get("jobId")
    data = run_job(job_id if isinstance(job_id, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


def _jobs_url(request: Request) -> JSONResponse:
    job_id = request.query_params.get("jobId", "")
    data = get_job_url(job_id)
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


async def _pipelines_start(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    pipeline_id = (body or {}).get("pipelineId")
    data = start_pipeline(pipeline_id if isinstance(pipeline_id, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


async def _pipelines_stop(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    pipeline_id = (body or {}).get("pipelineId")
    data = stop_pipeline(pipeline_id if isinstance(pipeline_id, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


async def _clusters_terminate(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    cluster_id = (body or {}).get("clusterId")
    data = terminate_cluster(cluster_id if isinstance(cluster_id, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


async def _clusters_start(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "errorType": "ValueError",
                "error": "Invalid JSON body.",
                "message": "Invalid JSON body.",
            },
            status_code=400,
        )

    cluster_id = (body or {}).get("clusterId")
    data = start_cluster(cluster_id if isinstance(cluster_id, str) else "")
    status = 200 if data.get("ok") else (400 if data.get("errorType") == "ValueError" else 503)
    return JSONResponse(data, status_code=status)


def _logs(request: Request) -> JSONResponse:
    try:
        limit = int(request.query_params.get("limit", "200"))
    except ValueError:
        limit = 200

    limit = max(1, min(limit, 1000))
    return JSONResponse({"ok": True, "entries": log_buffer.tail(limit=limit)})


def create_app() -> Starlette:
    app = Starlette(
        debug=False,
        routes=[
            # Health
            Route("/health", _health, methods=["GET"]),
            Route("/api/health", _health, methods=["GET"]),

            # Databricks
            Route("/databricks/validate", _databricks_validate, methods=["GET"]),
            Route("/databricks/ping", _databricks_ping, methods=["GET"]),
            Route("/api/databricks/validate", _databricks_validate, methods=["GET"]),
            Route("/api/databricks/ping", _databricks_ping, methods=["GET"]),

            # Clusters
            Route("/clusters", _clusters, methods=["GET"]),
            Route("/clusters/start", _clusters_start, methods=["POST"]),
            Route("/clusters/terminate", _clusters_terminate, methods=["POST"]),
            Route("/api/clusters", _clusters, methods=["GET"]),
            Route("/api/clusters/start", _clusters_start, methods=["POST"]),
            Route("/api/clusters/terminate", _clusters_terminate, methods=["POST"]),

            # Jobs
            Route("/jobs", _jobs, methods=["GET"]),
            Route("/jobs/run", _jobs_run, methods=["POST"]),
            Route("/jobs/url", _jobs_url, methods=["GET"]),
            Route("/api/jobs", _jobs, methods=["GET"]),
            Route("/api/jobs/run", _jobs_run, methods=["POST"]),
            Route("/api/jobs/url", _jobs_url, methods=["GET"]),

            # Pipelines
            Route("/pipelines", _pipelines, methods=["GET"]),
            Route("/pipelines/start", _pipelines_start, methods=["POST"]),
            Route("/pipelines/stop", _pipelines_stop, methods=["POST"]),
            Route("/api/pipelines", _pipelines, methods=["GET"]),
            Route("/api/pipelines/start", _pipelines_start, methods=["POST"]),
            Route("/api/pipelines/stop", _pipelines_stop, methods=["POST"]),

            # Chat + logs
            Route("/chat", _chat, methods=["POST"]),
            Route("/logs", _logs, methods=["GET"]),
            Route("/api/chat", _chat, methods=["POST"]),
            Route("/api/logs", _logs, methods=["GET"]),
        ],
    )

    log_buffer.add("INFO", "HTTP API initialized")

    app.add_middleware(RequestLoggingMiddleware)

    # Keep CORS narrow; allow one or many comma-separated origins.
    allowed_origins = [
        origin.strip()
        for origin in (env.cors_allowed_origin or "").split(",")
        if origin.strip()
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    return app
