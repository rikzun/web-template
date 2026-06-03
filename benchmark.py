#!/usr/bin/env python3
import subprocess
import time
import os
import re
import shutil
import sys
import signal
import argparse
import json
from pathlib import Path
from datetime import datetime

WEBPACK_DIR = Path("./webpack")
RSPACK_DIR  = Path("./rspack")
RUNS        = 3

WEBPACK_APP   = WEBPACK_DIR / "src" / "App.tsx"
RSPACK_APP    = RSPACK_DIR  / "src" / "App.tsx"
WEBPACK_CACHE = WEBPACK_DIR / "node_modules" / ".cache"
RSPACK_CACHE  = RSPACK_DIR  / "node_modules" / ".cache"

IS_WINDOWS = sys.platform == "win32"

USE_COLOR = sys.stdout.isatty()

def c(text, code):
    return f"\033[{code}m{text}\033[0m" if USE_COLOR else text

BOLD   = lambda t: c(t, "1")
GREEN  = lambda t: c(t, "32")
CYAN   = lambda t: c(t, "36")
YELLOW = lambda t: c(t, "33")
RED    = lambda t: c(t, "31")
DIM    = lambda t: c(t, "2")

# Webpack: "webpack 5.x compiled successfully in 193 ms"
# Rspack:  "Rspack compiled successfully in 1.61 s"
_TIME_RE = re.compile(r"compiled\b.*?\bin\s+([\d.]+)\s*(ms|s)\b", re.IGNORECASE)

def parse_ms(line: str) -> float | None:
    m = _TIME_RE.search(line)
    if not m:
        return None
    value, unit = float(m.group(1)), m.group(2).lower()
    return value * 1000 if unit == "s" else value


def start_proc(cmd: str, cwd: Path) -> subprocess.Popen:
    kwargs = dict(
        args=cmd, shell=True, cwd=cwd,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    )
    if IS_WINDOWS:
        kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        kwargs["start_new_session"] = True
    return subprocess.Popen(**kwargs)


def kill_proc(proc: subprocess.Popen):
    try:
        if IS_WINDOWS:
            subprocess.call(
                ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        else:
            os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    except (ProcessLookupError, OSError):
        try:
            proc.terminate()
        except OSError:
            pass
    try:
        proc.wait(timeout=10)
    except subprocess.TimeoutExpired:
        proc.kill()

def clear_cache(path: Path):
    if path.exists():
        shutil.rmtree(path)


def run_and_parse(cmd: str, cwd: Path, timeout: int = 300) -> tuple[float | None, int, str]:
    result = subprocess.run(
        cmd, shell=True, cwd=cwd,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        timeout=timeout,
    )
    output = result.stdout.decode(errors="replace")
    ms = None
    for line in output.splitlines():
        parsed = parse_ms(line)
        if parsed is not None:
            ms = parsed
    return ms, result.returncode, output


def read_until_compiled(proc: subprocess.Popen, timeout_s: int,
                        line_queue=None) -> float | None:
    import queue as _queue
    deadline = time.perf_counter() + timeout_s
    if line_queue is not None:
        while time.perf_counter() < deadline:
            try:
                line = line_queue.get(timeout=max(deadline - time.perf_counter(), 0.05))
            except _queue.Empty:
                break
            if line is None:
                break
            ms = parse_ms(line)
            if ms is not None:
                return ms
    else:
        while time.perf_counter() < deadline:
            line = proc.stdout.readline().decode(errors="replace")
            if not line:
                break
            ms = parse_ms(line)
            if ms is not None:
                return ms
    return None


def measure(fn, runs: int) -> tuple[float | None, list[float]]:
    times = []
    for i in range(1, runs + 1):
        print(f"  {DIM(f'run {i}/{runs}...')}", end=" ", flush=True)
        ms = fn()
        if ms is None:
            print(RED("failed"))
        else:
            print(DIM(f"{ms:.0f} ms"))
            times.append(ms)
    if not times:
        return None, []
    return sum(times) / len(times), times

def prod_build(cwd: Path, with_cache: bool, cache_path: Path) -> float | None:
    if not with_cache:
        clear_cache(cache_path)
    ms, rc, out = run_and_parse("npm run build", cwd)
    if rc != 0:
        print(RED(f"    ✗ build failed (rc={rc})"))
        print(DIM(out[-500:]))
        return None
    if ms is None:
        print(RED("    ✗ couldn't parse build time from output"))
        print(DIM(out[-300:]))
    return ms


def dev_startup(cwd: Path, with_cache: bool, cache_path: Path) -> float | None:
    if not with_cache:
        clear_cache(cache_path)
    proc = start_proc("npm run start", cwd)
    try:
        ms = read_until_compiled(proc, timeout_s=60)
    finally:
        kill_proc(proc)
    if ms is None:
        print(RED("    ✗ dev server didn't report compiled time"))
    return ms


def hot_update(cwd: Path, app_path: Path, cache_path: Path, runs: int) -> tuple[float | None, list[float]]:
    import queue, threading

    if not cache_path.exists():
        run_and_parse("npm run build", cwd)

    original = app_path.read_text(encoding="utf-8")
    times = []

    proc = start_proc("npm run start", cwd)

    line_queue: queue.Queue = queue.Queue()

    def _reader():
        try:
            for raw in proc.stdout:
                line_queue.put(raw.decode(errors="replace"))
        except OSError:
            pass
        finally:
            line_queue.put(None)

    threading.Thread(target=_reader, daemon=True).start()

    try:
        read_until_compiled(proc, timeout_s=60, line_queue=line_queue)
        read_until_compiled(proc, timeout_s=5,  line_queue=line_queue)

        for i in range(runs):
            app_path.write_text(original + f"\n// benchmark-hmr-{i}\n", encoding="utf-8")
            ms = read_until_compiled(proc, timeout_s=30, line_queue=line_queue)
            app_path.write_text(original, encoding="utf-8")
            if ms is not None:
                times.append(ms)
            else:
                print(RED("    ✗ HMR didn't report compiled time"))
    finally:
        kill_proc(proc)
        app_path.write_text(original, encoding="utf-8")

    if not times:
        return None, []
    return sum(times) / len(times), times

def fmt_avg(avg: float | None) -> str:
    return f"  → avg: {avg:.0f} ms" if avg is not None else "  → all runs failed"


def benchmark_system(name: str, cwd: Path, cache_path: Path, app_path: Path, runs: int) -> dict:
    print(BOLD(CYAN(f"\n{'─'*50}")))
    print(BOLD(CYAN(f"  {name}")))
    print(BOLD(CYAN(f"{'─'*50}")))

    results = {}

    print(YELLOW("\n📦 Prod build (no cache)"))
    avg, _ = measure(lambda: prod_build(cwd, False, cache_path), runs)
    results["prod_no_cache"] = avg
    print(GREEN(fmt_avg(avg)))

    print(YELLOW("\n📦 Prod build (with cache)"))
    avg, _ = measure(lambda: prod_build(cwd, True, cache_path), runs)
    results["prod_with_cache"] = avg
    print(GREEN(fmt_avg(avg)))

    print(YELLOW("\n🚀 Dev server startup (no cache)"))
    avg, _ = measure(lambda: dev_startup(cwd, False, cache_path), runs)
    results["dev_no_cache"] = avg
    print(GREEN(fmt_avg(avg)))

    print(YELLOW("\n🚀 Dev server startup (with cache)"))
    avg, _ = measure(lambda: dev_startup(cwd, True, cache_path), runs)
    results["dev_with_cache"] = avg
    print(GREEN(fmt_avg(avg)))

    print(YELLOW("\n🔥 Hot update (HMR)"))
    avg, times = hot_update(cwd, app_path, cache_path, runs)
    for i, ms in enumerate(times, 1):
        print(f"  {DIM(f'run {i}/{runs}...')} {DIM(f'{ms:.0f} ms')}")
    results["hot_update"] = avg
    print(GREEN(fmt_avg(avg)))

    return results

CATEGORIES = [
    ("prod_no_cache",   "Prod Build (no cache)"),
    ("prod_with_cache", "Prod Build (with cache)"),
    ("dev_no_cache",    "Dev server startup (no cache)"),
    ("dev_with_cache",  "Dev server startup (with cache)"),
    ("hot_update",      "Hot update (HMR)"),
]

def fmt(ms: float | None) -> str:
    return " —        " if ms is None else f"{ms:>7.0f} ms"

def winner_note(w: float | None, r: float | None) -> str:
    if w is None or r is None:
        return ""
    ratio = max(w, r) / min(w, r)
    faster = "Rspack" if r < w else "Webpack"
    return f"  ← {faster} {ratio:.1f}x faster"

def print_report(webpack: dict, rspack: dict):
    print(BOLD(f"{'Category':<32} {'Webpack':<8} {'Rspack':<8}"))
    print(DIM("─" * 63))

    for key, label in CATEGORIES:
        w, r = webpack.get(key), rspack.get(key)
        line = f"{label:<32} {fmt(w)} {fmt(r)}"
        if r is not None and w is not None and r < w:
            print(GREEN(line))
        elif r is not None and w is not None and w < r:
            print(YELLOW(line))
        else:
            print(line)

def main():
    parser = argparse.ArgumentParser(description="Webpack vs Rspack benchmark")
    parser.add_argument("--runs",     type=int, default=RUNS,   help=f"Runs per category (default {RUNS})")
    parser.add_argument("--no-color", action="store_true",      help="Disable color output")
    parser.add_argument("--only",     choices=["webpack", "rspack"], help="Benchmark only one system")
    args = parser.parse_args()

    global USE_COLOR
    if args.no_color:
        USE_COLOR = False

    if not WEBPACK_DIR.exists() and args.only != "rspack":
        print(RED(f"✗ {WEBPACK_DIR} not found")); sys.exit(1)
    if not RSPACK_DIR.exists() and args.only != "webpack":
        print(RED(f"✗ {RSPACK_DIR} not found")); sys.exit(1)

    print(BOLD(CYAN("\n  ⚡  Build System Benchmark: Webpack vs Rspack")))
    print(DIM(f"  runs per category: {args.runs}"))

    webpack_results, rspack_results = {}, {}

    if args.only != "rspack":
        webpack_results = benchmark_system("Webpack", WEBPACK_DIR, WEBPACK_CACHE, WEBPACK_APP, args.runs)

    if args.only != "webpack":
        rspack_results  = benchmark_system("Rspack",  RSPACK_DIR,  RSPACK_CACHE,  RSPACK_APP,  args.runs)

    if webpack_results or rspack_results:
        print_report(webpack_results, rspack_results)

if __name__ == "__main__":
    main()