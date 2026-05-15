import asyncio

from adapters.nt_adapter import NTAdapter

from websocket.clients import broadcast

from monitor.telemetry_monitor import telemetry_monitor

from services.websocket_service import run as ws_run
from services.limelight_service import run as limelight_run

ROBOT_IP = "10.91.63.2"
WS_PORT = 5901

async def main():

    print(" HYDRA #9163 iniciando...")

    adapter = NTAdapter(ROBOT_IP)

    print(" Conectando NT...")
    adapter.connect()

    print(" Iniciando monitor...")

    monitor_task = asyncio.create_task(
        telemetry_monitor(adapter, broadcast)
    )

    print(" Iniciando limelight...")

    limelight_task = asyncio.create_task(
        limelight_run()
    )

    print(" Iniciando websocket...")

    websocket_task = asyncio.create_task(
        ws_run(adapter, WS_PORT)
    )

    await asyncio.gather(
        monitor_task,
        limelight_task,
        websocket_task
    )

if __name__ == "__main__":

    try:
        asyncio.run(main())

    except KeyboardInterrupt:
        print(" Encerrando...")