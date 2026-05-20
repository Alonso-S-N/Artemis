import asyncio

from ws_server.handlers import broadcast


async def telemetry_loop(adapter):

    print(
        "telemetry loop iniciado"
    )

    while True:

        try:

            # ═══════════════════════════════
            # ROBOT STRESS
            # ═══════════════════════════════

            battery_voltage = adapter.read(
                "RobotStress",
                "batteryVoltage"
            )

            total_current = adapter.read(
                "RobotStress",
                "totalCurrent"
            )

            drivetrain_current = adapter.read(
                "RobotStress",
                "drivetrainCurrent"
            )

            stress_score = adapter.read(
                "RobotStress",
                "stressScore"
            )

            stress_level = adapter.read(
                "RobotStress",
                "stressLevel"
            )

            speed_scale = adapter.read(
                "RobotStress",
                "speedScale"
            )

            chassis_speed = adapter.read(
                "RobotStress",
                "chassisSpeed"
            )

            # ═══════════════════════════════
            # DEBUG
            # ═══════════════════════════════

            print(
                "battery:",
                battery_voltage
            )

            # ═══════════════════════════════
            # BROADCAST
            # ═══════════════════════════════

            if battery_voltage is not None:

                await broadcast(
                    "stressBatteryVoltage",
                    battery_voltage
                )

            if total_current is not None:

                await broadcast(
                    "stressTotalCurrent",
                    total_current
                )

            if drivetrain_current is not None:

                await broadcast(
                    "stressDrivetrainCurrent",
                    drivetrain_current
                )

            if stress_score is not None:

                await broadcast(
                    "stressScore",
                    stress_score
                )

            if stress_level is not None:

                await broadcast(
                    "stressLevel",
                    stress_level
                )

            if speed_scale is not None:

                await broadcast(
                    "stressSpeedScale",
                    speed_scale
                )

            if chassis_speed is not None:

                await broadcast(
                    "stressChassisSpeed",
                    chassis_speed
                )

        except Exception as e:

            print(
                "erro telemetry:",
                e
            )

        await asyncio.sleep(0.05)