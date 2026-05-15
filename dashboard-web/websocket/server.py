import json

from websocket.clients import clients

async def handle_ws(ws, adapter):

    clients.add(ws)

    print(f" WS conectado ({len(clients)})")

    try:

        async for message in ws:

            obj = json.loads(message)

            topic_id = obj.get("topic")
            value = obj.get("value")

            from telemetry.registry import ALL_TOPICS

            topic = next(
                (t for t in ALL_TOPICS if t.id == topic_id),
                None
            )

            if topic:
                adapter.write(topic, value)

    finally:

        clients.discard(ws)

        print(f" WS desconectado ({len(clients)})")