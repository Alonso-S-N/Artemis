import websockets

from websocket.server import handle_ws

async def run(adapter, port):

    async with websockets.serve(
        lambda ws: handle_ws(ws, adapter),
        "0.0.0.0",
        port,
        ping_interval=20,
        ping_timeout=30,
        max_size=None
    ):

        print(f"🚀 WS em :{port}")

        await asyncio.Future()