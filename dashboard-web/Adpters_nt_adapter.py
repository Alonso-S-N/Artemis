from networktables import NetworkTables

from adapters.base import TelemetryAdapter
from telemetry.topics import *

class NTAdapter(TelemetryAdapter):

    NT_MAPPING = {
        BATTERY_VOLTAGE: ("Robot", "BatteryVoltage"),
        ROBOT_STATE: ("ADL", "state"),
        ROBOT_DECISION: ("ADL", "decision"),
        HAS_TARGET: ("Vision", "HasTarget"),
        ALIGNED: ("Vision", "Aligned"),
        SHOOTER_READY: ("Mechanisms", "ShooterReady"),
        HAS_GAME_PIECE: ("Mechanisms", "HasGamePiece"),
    }

    def __init__(self, server_ip):
        self.server_ip = server_ip

    def connect(self):
        if not NetworkTables.isConnected():
            NetworkTables.initialize(server=self.server_ip)

    def _entry(self, topic):
        table_name, key = self.NT_MAPPING[topic]
        table = NetworkTables.getTable(table_name)
        return table, key

    def read(self, topic):

        table, key = self._entry(topic)

        value = table.getValue(key, topic.default)

        return value

    def write(self, topic, value):

        table, key = self._entry(topic)

        if isinstance(value, bool):
            table.putBoolean(key, value)

        elif isinstance(value, (int, float)):
            table.putNumber(key, value)

        elif isinstance(value, list):
            table.putNumberArray(key, value)

        else:
            table.putString(key, str(value))