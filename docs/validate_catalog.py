#!/usr/bin/env python3
"""Validate the chatgpt_lab project catalog and required project docs.

Only Python's standard library is used; individual experiments need no
common runtime or build system.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "docs" / "projects.json"
REQUIRED_FIELDS = (
    "id", "title", "subtitle", "description", "path",
    "language", "kind", "status", "howToRun",
)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
APPS = ROOT / "apps"  # Experiments are direct children of apps/.


def check() -> list[str]:
    problems: list[str] = []
    for path in (ROOT / "README.md", ROOT / "AGENTS.md",
                 ROOT / "docs" / "README.md", ROOT / "docs" / "AGENTS.md"):
        if not path.is_file():
            problems.append(f"Missing required root/docs file: {path.relative_to(ROOT)}")

    if not CATALOG.is_file():
        return problems + ["Missing docs/projects.json"]

    try:
        data = json.loads(CATALOG.read_text(encoding="utf-8"))
    except (ValueError, OSError) as exc:
        return problems + [f"Invalid project catalog: {exc}"]

    if not isinstance(data, dict) or data.get("schemaVersion") != 1:
        return problems + ["Catalog schemaVersion must be 1"]
    if data.get("repository") != "Doldas/chatgpt_lab":
        problems.append("Catalog repository must be Doldas/chatgpt_lab")
    projects = data.get("projects")
    if not isinstance(projects, list):
        return problems + ["Catalog projects must be an array"]

    actual_dirs = {
        item.name
        for item in APPS.iterdir()
        if item.is_dir()
        and not item.name.startswith(".")
        
    }
    seen_ids: set[str] = set()
    seen_paths: set[str] = set()

    for index, entry in enumerate(projects):
        label = f"projects[{index}]"
        if not isinstance(entry, dict):
            problems.append(f"{label} must be an object")
            continue
        for key in REQUIRED_FIELDS:
            if not isinstance(entry.get(key), str) or not entry[key].strip():
                problems.append(f"{label}.{key} must be a nonempty string")

        project_id, path = entry.get("id"), entry.get("path")
        if not isinstance(project_id, str) or not SLUG.fullmatch(project_id):
            problems.append(f"{label}.id must be kebab-case")
        elif project_id in seen_ids:
            problems.append(f"Duplicate project id: {project_id}")
        else:
            seen_ids.add(project_id)

        if not isinstance(path, str) or not path.startswith("apps/") or not SLUG.fullmatch(path[5:]):
            problems.append(f"{label}.path must be apps/<kebab-case-directory>")
            continue
        if path in seen_paths:
            problems.append(f"Duplicate project path: {path}")
        seen_paths.add(path)

        project_dir = ROOT / path
        if not project_dir.is_dir():
            problems.append(f"Missing project directory: {path}")
        else:
            for name in ("README.md", "AGENTS.md"):
                if not (project_dir / name).is_file():
                    problems.append(f"Missing project documentation: {path}/{name}")

        if not isinstance(entry.get("hasLiveDemo"), bool):
            problems.append(f"{label}.hasLiveDemo must be a boolean")
        elif entry["hasLiveDemo"]:
            url = entry.get("liveUrl")
            if not isinstance(url, str) or not (
                urlparse(url).scheme == "https" and urlparse(url).netloc
            ):
                problems.append(f"{label}.liveUrl requires a verified https URL")
        elif "liveUrl" in entry:
            problems.append(f"{label}.liveUrl must be absent when hasLiveDemo=false")

    for path in sorted(actual_dirs - {p[5:] for p in seen_paths}):
        problems.append(f"Experiment directory lacks catalog entry: {path}")
    for path in sorted({p[5:] for p in seen_paths} - actual_dirs):
        problems.append(f"Catalog entry has no matching experiment directory: {path}")
    return problems


if __name__ == "__main__":
    errors = check()
    if errors:
        for error in errors:
            print("ERROR:", error, file=sys.stderr)
        raise SystemExit(1)
    print("PASS: catalog, project directories, README.md and AGENTS.md are consistent.")
