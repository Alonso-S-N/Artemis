import asyncio
import limelight.AI_Data

async def run():

    loop = asyncio.get_running_loop()

    await loop.run_in_executor(
        None,
        limelight.AI_Data.main_loop
    )