# nt_bridge.py — comunicação com NetworkTables 3
# Não edite este arquivo. Configure em config.py.

import time
from networktables import NetworkTables
from config import ROBOT_IP, NT_TIMEOUT, DEFAULT_VALUES


def connect():
    if NetworkTables.isConnected():
        print(f"NT3 → {ROBOT_IP} (já conectado)")
        return
    NetworkTables.initialize(server=ROBOT_IP)
    print(f"NT3 → {ROBOT_IP} (aguardando conexão, timeout={NT_TIMEOUT}s...)")
    waited = 0.0
    interval = 0.1
    while not NetworkTables.isConnected() and waited < NT_TIMEOUT:
        time.sleep(interval)
        waited += interval

    if NetworkTables.isConnected():
        print("NT conectado ✅")
    else:
        print("⚠️ NT não conectado após timeout — continuará tentando em background")


def get_table(name: str):
    return NetworkTables.getTable(name)


def read_value(table, key):
    if key not in table.getKeys():
        return None
    return table.getValue(key, None)


def ensure_entry(table, key):
    """Cria a entry com valor padrão se ainda não existir."""
    if key in table.getKeys():
        return
    default = DEFAULT_VALUES.get(key)
    if default is not None:
        if isinstance(default, bool):
            table.putBoolean(key, default)
        elif isinstance(default, list):
            table.putNumberArray(key, default)
        elif isinstance(default, str):
            table.putString(key, default)
        else:
            table.putNumber(key, default)
    else:
        table.putNumber(key, 0.0)


def write_value(table, key, value):
    if isinstance(value, bool):
        table.putBoolean(key, value)
    elif isinstance(value, (int, float)):
        table.putNumber(key, value)
    elif isinstance(value, list):
        table.putNumberArray(key, value)
    else:
        table.putString(key, str(value))


def is_connected() -> bool:
    return NetworkTables.isConnected()
