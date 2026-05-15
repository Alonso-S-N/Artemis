import asyncio
import json

from telemetry.registry import ALL_TOPICS

async def telemetry_monitor(adapter, broadcast):

    print("📡 Telemetry monitor iniciado")

    last_values = {}

    while True:

        for topic in ALL_TOPICS:

            value = adapter.read(topic)

            if last_values.get(topic.id) == value:
                continue

            last_values[topic.id] = value

            msg = json.dumps({
                "topic": topic.id,
                "value": value
            })

            await broadcast(msg)

        await asyncio.sleep(0.05)