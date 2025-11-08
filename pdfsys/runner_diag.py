# Run: python pdfsys/runner_diag.py pdfsys/stamp_pdf.py run
import json, os, sys, importlib.util, inspect, traceback
path = sys.argv[1] if len(sys.argv)>1 else "pdfsys/stamp_pdf.py"
fn   = sys.argv[2] if len(sys.argv)>2 else "run"
if not os.path.exists(path):
    print(json.dumps({"ok":False,"code":"FILE_NOT_FOUND","path":path})); raise SystemExit(2)
spec = importlib.util.spec_from_file_location("pdfsys.stamp_pdf", path)
mod = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(mod)
except Exception:
    print(json.dumps({"ok":False,"code":"IMPORT_ERROR","trace":traceback.format_exc()})); raise SystemExit(2)
out = {"ok": hasattr(mod, fn), "exports":[x for x in dir(mod) if not x.startswith("_")]}
if hasattr(mod, fn): out["signature"] = str(inspect.signature(getattr(mod, fn)))
print(json.dumps(out, indent=2)); raise SystemExit(0 if out["ok"] else 2)
