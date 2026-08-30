from pathlib import Path

_backend_app_dir = Path(__file__).resolve().parent.parent / "Backend" / "app"
__path__ = [str(_backend_app_dir)]
