import asyncio
import websockets

from ws_server.handlers import handle_ws

async def run(adapter, port):

    async with websockets.serve(
        lambda ws: handle_ws(ws, adapter),
        "0.0.0.0",
        port
    ):

        print(f"WS em {port}")

        await asyncio.Future()