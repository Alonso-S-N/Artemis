# main.py — ponto de entrada
# Não edite este arquivo. Configure em config.py.

import asyncio
import http.server
import threading
import os

import nt_bridge
import ws_server

DASHBOARD_PATH = r"C:\Users\Usuario\Artemis\dashboard-web"
HTTP_PORT = 5800


def start_http_server():
    os.chdir(DASHBOARD_PATH)
    handler = http.server.SimpleHTTPRequestHandler
    httpd = http.server.HTTPServer(("0.0.0.0", HTTP_PORT), handler)
    print(f"Dashboard em http://localhost:{HTTP_PORT}")
    httpd.serve_forever()


async def main():
    # servidor HTTP em thread separada (não bloqueia o asyncio)
    thread = threading.Thread(target=start_http_server, daemon=True)
    thread.start()

    nt_bridge.connect()
    await ws_server.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Encerrando...")