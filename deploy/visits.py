"""초소형 방문자 카운터 — 파이썬 표준 라이브러리만 사용.

nginx와 같은 컨테이너에서 127.0.0.1:8100으로 떠 있고,
nginx가 /api/visits 요청만 이쪽으로 프록시한다.

- GET  /api/visits  → {"count": N}
- POST /api/visits  → 카운트 +1 후 {"count": N}
카운트는 /data/visits.txt에 저장 (컨테이너 재빌드에도 볼륨으로 유지).
"""
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DATA_FILE = os.environ.get("VISITS_FILE", "/data/visits.txt")
_lock = threading.Lock()


def _read() -> int:
    try:
        with open(DATA_FILE, encoding="ascii") as f:
            return int(f.read().strip() or 0)
    except (OSError, ValueError):
        return 0


def _write(n: int) -> None:
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="ascii") as f:
        f.write(str(n))
    os.replace(tmp, DATA_FILE)


class Handler(BaseHTTPRequestHandler):
    def _send(self, count: int) -> None:
        body = json.dumps({"count": count}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path.rstrip("/") == "/api/visits":
            with _lock:
                self._send(_read())
        else:
            self.send_error(404)

    def do_POST(self) -> None:  # noqa: N802
        if self.path.rstrip("/") == "/api/visits":
            with _lock:
                n = _read() + 1
                _write(n)
                self._send(n)
        else:
            self.send_error(404)

    def log_message(self, *args) -> None:  # 로그 소음 제거
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8100), Handler).serve_forever()
