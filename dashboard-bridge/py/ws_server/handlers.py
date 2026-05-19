import json

from ws_server.webScokets_clients import clients

async def handle_ws(ws, adapter):

    clients.add(ws)

    try:

        async for message in ws:

            obj = json.loads(message)

            adapter.write(
                obj["table"],
                obj["key"],
                obj["value"]
            )

    finally:

        clients.discard(ws)