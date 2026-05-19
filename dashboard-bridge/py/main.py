import asyncio

from telemetry.Adpters_nt_adapter import NTAdapter
from monitor import monitor

from ws_server.server import run as ws_run

ROBOT_IP = "10.91.63.2"
WS_PORT = 5901

async def main():

    adapter = NTAdapter(ROBOT_IP)

    adapter.connect()

    await asyncio.gather(
        monitor(adapter),
        ws_run(adapter, WS_PORT)
    )

if __name__ == "__main__":

    asyncio.run(main())