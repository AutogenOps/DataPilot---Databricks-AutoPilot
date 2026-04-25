from databricks.sdk import WorkspaceClient

from src.clients.databricks_client import get_databricks_config


def validate_databricks_connection_config() -> dict:
    try:
        config = get_databricks_config()
        return {
            "ok": True,
            "host": config.host,
            "timeoutMs": config.timeout_ms,
            "message": "Databricks config is present.",
        }
    except Exception as exc:
        return {
            "ok": False,
            "errorType": type(exc).__name__,
            "error": str(exc),
            "message": "Databricks credentials are missing or invalid. Set DATABRICKS_HOST and DATABRICKS_TOKEN.",
        }


def ping_databricks_api() -> dict:
    """Validate Databricks token/host by performing a lightweight API call."""
    try:
        config = get_databricks_config()

        client = WorkspaceClient(host=config.host, token=config.token)
        me = client.current_user.me()
        return {
            "ok": True,
            "host": config.host,
            "userName": getattr(me, "user_name", None),
            "displayName": getattr(me, "display_name", None),
            "message": "Databricks API reachable.",
        }
    except ValueError as exc:
        return {
            "ok": False,
            "errorType": type(exc).__name__,
            "error": str(exc),
            "message": "Databricks credentials are missing or invalid. Set DATABRICKS_HOST and DATABRICKS_TOKEN.",
        }
    except Exception as exc:  # pragma: no cover
        return {
            "ok": False,
            "errorType": type(exc).__name__,
            "error": str(exc),
            "message": "Failed to reach Databricks API. Check host/token permissions and network access.",
        }
