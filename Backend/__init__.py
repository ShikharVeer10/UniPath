from pathlib import Path

_backend_root = Path(__file__).resolve().parent
__path__ = [str(_backend_root)]
