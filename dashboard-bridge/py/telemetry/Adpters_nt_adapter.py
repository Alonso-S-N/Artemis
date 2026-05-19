from networktables import NetworkTables

class NTAdapter:

    def __init__(self, server_ip):
        self.server_ip = server_ip

    def connect(self):

        if not NetworkTables.isConnected():
            NetworkTables.initialize(server=self.server_ip)

    def get_table(self, name):
        return NetworkTables.getTable(name)

    def read(self, table_name, key):

        table = self.get_table(table_name)

        if key not in table.getKeys():
            return None

        return table.getValue(key, None)

    def write(self, table_name, key, value):

        table = self.get_table(table_name)

        if isinstance(value, bool):
            table.putBoolean(key, value)

        elif isinstance(value, (int, float)):
            table.putNumber(key, value)

        elif isinstance(value, list):
            table.putNumberArray(key, value)

        else:
            table.putString(key, str(value))