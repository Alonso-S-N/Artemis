from networktables import NetworkTables

import time


class NTAdapter:

    def __init__(self, server_ip):

        self.server_ip = server_ip

    # ═══════════════════════════════
    # CONNECT
    # ═══════════════════════════════

    def connect(self):

        if not NetworkTables.isConnected():

            print(
                "conectando ao robo:",
                self.server_ip
            )

            NetworkTables.initialize(
                server=self.server_ip
            )

            # espera conectar
            time.sleep(2)

            print(
                "NT connected:",
                NetworkTables.isConnected()
            )

    # ═══════════════════════════════
    # TABLE
    # ═══════════════════════════════

    def get_table(self, name):

        return NetworkTables.getTable(name)

    # ═══════════════════════════════
    # READ
    # ═══════════════════════════════

    def read(self, table_name, key):

        table = self.get_table(
            table_name
        )

        keys = table.getKeys()

        if key not in keys:

            return None

        return table.getValue(
            key,
            None
        )

    # ═══════════════════════════════
    # WRITE
    # ═══════════════════════════════

    def write(
        self,
        table_name,
        key,
        value
    ):

        table = self.get_table(
            table_name
        )

        if isinstance(value, bool):

            table.putBoolean(
                key,
                value
            )

        elif isinstance(
            value,
            (int, float)
        ):

            table.putNumber(
                key,
                value
            )

        elif isinstance(value, list):

            table.putNumberArray(
                key,
                value
            )

        else:

            table.putString(
                key,
                str(value)
            )

    # ═══════════════════════════════
    # DEBUG TABLE
    # ═══════════════════════════════

    def debug_table(self, table_name):

        table = self.get_table(
            table_name
        )

        print(
            "\nTABLE:",
            table_name
        )

        keys = table.getKeys()

        print(
            "KEYS:",
            keys
        )

        for key in keys:

            try:

                value = table.getValue(
                    key,
                    None
                )

                print(
                    " ",
                    key,
                    "=",
                    value
                )

            except Exception as e:

                print(
                    "erro:",
                    e
                )