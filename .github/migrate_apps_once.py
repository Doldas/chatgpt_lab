#!/usr/bin/env python3
"""One-shot repo migration. Runs only on the explicitly named PR branch."""
import json
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
CAT = ROOT / "docs" / "projects.json"
data = json.loads(CAT.read_text(encoding="utf8"))
names = [item["path"] for item in data["projects"]]
assert len(names) == len(set(names))
assert all(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", n) for n in names)
assert not (ROOT / "apps").exists(), "apps directory already exists; abort rather than overwrite"
(ROOT / "apps").mkdir()
for name in names:
    old = ROOT / name
    assert old.is_dir() and (old / "README.md").is_file() and (old / "AGENTS.md").is_file(), name
    subprocess.run(["git", "mv", name, "apps/" + name], cwd=ROOT, check=True)
    item = next(p for p in data["projects"] if p["path"] == name)
    item["path"] = "apps/" + name
    run = item["howToRun"]
    # Adjust root-relative URLs and commands, not historical object names.
    for prefix in names:
        run = run.replace("chatgpt_lab/" + prefix + "/", "chatgpt_lab/apps/" + prefix + "/")
        run = re.sub(r"(?<![\w/])" + re.escape(prefix) + r"/", "apps/" + prefix + "/", run)
    item["howToRun"] = run
    if item.get("liveUrl"):
        item["liveUrl"] = item["liveUrl"].replace("chatgpt_lab/" + name + "/", "chatgpt_lab/apps/" + name + "/")
        # A new URL is only verified after deployment; don't advertise it yet.
        item.pop("liveUrl")
        item["hasLiveDemo"] = False
CAT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf8")

# Update root-relative commands, imported paths, CI triggers and links.
# Avoid rewriting history in docs/ACTIVITY.md; append a dated transition note.
extensions = {".md", ".html", ".css", ".js", ".mjs", ".cjs", ".json", ".yml", ".yaml", ".py", ".sh"}
for base in (ROOT / "apps", ROOT / "docs", ROOT / ".github"):
    for file in base.rglob("*"):
        if not file.is_file() or file.suffix not in extensions or file == CAT or file.name.startswith("migrate_apps_once"):
            continue
        if file == ROOT / "docs" / "ACTIVITY.md":
            continue
        original = file.read_text(encoding="utf8")
        result = original
        for name in names:
            # Only replace standalone root-relative references, preserving
            # already nested apps paths and local ./ URLs inside each app.
            result = re.sub(r"(?<![\w/])" + re.escape(name) + r"/",
                            "apps/" + name + "/", result)
        # Instructions for path layout.
        if file == ROOT / "docs" / "PROJECT_GUIDE.md":
            result = result.replace("toppnivåmapp", "undermapp under apps/")
        if result != original:
            file.write_text(result, encoding="utf8")

validator = ROOT / "docs" / "validate_catalog.py"
text = validator.read_text(encoding="utf8")
text = text.replace('EXCLUDED_ROOT_DIRS = {"docs"}  # Docs is a separate subproject, not a catalog entry.',
                    'APPS = ROOT / "apps"  # All experiments live here; docs stays at repo root.')
text = text.replace('for item in ROOT.iterdir()', 'for item in APPS.iterdir()')
text = text.replace('and item.name not in EXCLUDED_ROOT_DIRS', '')
text = text.replace('if not isinstance(path, str) or not SLUG.fullmatch(path):',
                    'if not isinstance(path, str) or not path.startswith("apps/") or not SLUG.fullmatch(path[5:]):')
text = text.replace('must be a single kebab-case directory', 'must be apps/<kebab-case-directory>')
text = text.replace('project_dir = ROOT / path', 'project_dir = ROOT / path')
text = text.replace('for path in sorted(actual_dirs - seen_paths):', 'for path in sorted(actual_dirs - {p[5:] for p in seen_paths}):')
text = text.replace('for path in sorted(seen_paths - actual_dirs):', 'for path in sorted({p[5:] for p in seen_paths} - actual_dirs):')
validator.write_text(text, encoding="utf8")

# Keep root intro and AI guidance consistent with new architecture.
for path in (ROOT / "AGENTS.md", ROOT / "README.md", ROOT / "docs" / "AI_HANDOFF.md", ROOT / "docs" / "PROJECT_GUIDE.md", ROOT / "docs" / "AGENTS.md", ROOT / "docs" / "README.md"):
    s = path.read_text(encoding="utf8")
    s = s.replace("Varje vanlig mapp direkt under repo-roten", "Varje undermapp direkt under apps/")
    s = s.replace("Varje ny toppnivåmapp", "Varje ny mapp under apps/")
    s = s.replace("toppnivåmappar", "appar under apps/")
    s = s.replace("toppnivåmapp", "mapp under apps/")
    s = s.replace("på rotnivå", "under apps/")
    s = s.replace("direkt under repo-roten", "direkt under apps/")
    s = s.replace("varje **annan** toppnivåmapp", "varje undermapp i **apps/**")
    s = s.replace("Varje **annan** toppnivåmapp", "Varje undermapp i **apps/**")
    path.write_text(s, encoding="utf8")

activity = ROOT / "docs" / "ACTIVITY.md"
activity.write_text(activity.read_text(encoding="utf8") +
"""\n## 2026-10-10 – Samla alla experiment i apps/\n\n- **Vad:** Flyttade alla registrerade experiment med git mv till `apps/<projekt>/`, utan att ändra `docs/`-projektets placering. Uppdaterade katalog, validator, arbetsflöden och referenser.\n- **Varför:** En tydlig repo-rot med separata appar och dokumentation.\n- **Verifiering:** `python3 docs/validate_catalog.py`, Node-testsviter och filkontroller körs i PR-CI. Live-URL:er markeras ej verifierade till dess att Pages är publicerat med de nya sökvägarna.\n- **Gränser:** Historiska PR-länkar och commit-historik ändras inte. Mänskligt merge-beslut.\n""", encoding="utf8")

# Never leave a one-shot pushing workflow on the target branch.
(ROOT / ".github" / "workflows" / "one-shot-apps-migration.yml").unlink()
pathlib.Path(__file__).unlink()
subprocess.run(["python3", "docs/validate_catalog.py"], cwd=ROOT, check=True)
