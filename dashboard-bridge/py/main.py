import asyncio

from telemetry.Adapters_nt_adapter import NTAdapter
from telemetry.telemetry_loop import telemetry_loop

from monitor import monitor

from ws_server.server import run as ws_run

ROBOT_IP = "10.91.63.2"
WS_PORT = 5901


async def main():

    adapter = NTAdapter(ROBOT_IP)

    adapter.connect()
    adapter.debug_table("SmartDashboard")

    adapter.debug_table("Shuffleboard")

    adapter.debug_table("datatable")

    adapter.debug_table("stress")
    adapter.debug_table("Telemetry")

    adapter.debug_table("Drive")

    adapter.debug_table("Robot")
    await asyncio.gather(

        monitor(adapter),

        telemetry_loop(adapter),

        ws_run(adapter, WS_PORT)
    )


if __name__ == "__main__":

    asyncio.run(main())