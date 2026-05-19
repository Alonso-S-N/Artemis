import asyncio
import json

from ws_server.webScokets_clients import clients
from telemetry.telemetryRegister import ALL_TOPICS

async def monitor(adapter):

    while True:

        for topic in ALL_TOPICS:

            value = adapter.read(
                topic.table,
                topic.key
            )

            if value is None:
                continue

            msg = json.dumps({
                "topic": topic.id,
                "value": value
            })

            dead = []

            for ws in list(clients):

                try:
                    await ws.send(msg)

                except:
                    dead.append(ws)

            for ws in dead:
                clients.discard(ws)

        await asyncio.sleep(0.1)