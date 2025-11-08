import json, os, sys, importlib.util, inspect, traceback
p = sys.argv[1] if len(sys.argv)>1 else "pdfsys/stamp_pdf.py"
name = "pdfsys.stamp_pdf"
if not os.path.exists(p): print(json.dumps({"ok":False,"code":"FILE_NOT_FOUND","path":p})); sys.exit(2)
spec = importlib.util.spec_from_file_location(name, p); mod = importlib.util.module_from_spec(spec)
try: spec.loader.exec_module(mod)
except Exception as e: print(json.dumps({"ok":False,"code":"IMPORT_ERROR","trace":traceback.format_exc()})); sys.exit(2)
out = {"ok": hasattr(mod,"run"), "exports":[x for x in dir(mod) if not x.startswith("_")]}
if hasattr(mod,"run"): out["signature"] = str(inspect.signature(mod.run))
print(json.dumps(out, indent=2)); sys.exit(0 if out["ok"] else 2)
