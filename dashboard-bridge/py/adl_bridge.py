"""
adl_bridge.py — Lógica principal da bridge ADL ↔ Dashboard.

Você NÃO precisa editar esse arquivo.
Todas as configurações ficam em config.py.
"""

import asyncio
import json

import websockets
from networktables import NetworkTables

from config import (
    ROBOT_IP,
    WS_PORT,
    POLL_INTERVAL,
    PULSE_TIME,
    TABLES_AND_KEYS,
    KEY_DEFAULT_TYPES,
)

_clients: set = set()

def nt_connect(server_ip: str) -> None:
    if NetworkTables.isConnected():
        print(f"NT3 já conectado a {server_ip}")
        return
    NetworkTables.initialize(server=server_ip)
    print(f"NT3 → {server_ip} (aguardando...)")


def _get_table(name: str):
    return NetworkTables.getTable(name)


def _read(table, key: str):
    if key not in table.getKeys():
        return None
    return table.getValue(key, None)


def _ensure_entry(table, key: str) -> None:
    """Cria a entry no NT com o tipo correto se ainda não existir."""
    if key in table.getKeys():
        return

    kind = KEY_DEFAULT_TYPES.get(key, "number")

    if kind == "number_array":
        table.putNumberArray(key, [0.0, 0.0, 0.0, 0.0])
    elif kind == "bool":
        table.putBoolean(key, False)
    elif kind == "string":
        table.putString(key, "")
    else:
        table.putNumber(key, 0.0)


def _write(table, key: str, value) -> None:
    if isinstance(value, bool):
        table.putBoolean(key, value)
    elif isinstance(value, (int, float)):
        table.putNumber(key, value)
    elif isinstance(value, list):
        table.putNumberArray(key, value)
    else:
        table.putString(key, str(value))

async def _broadcast(topic: str, value) -> None:
    if not _clients:
        return

    msg = json.dumps({"topic": topic, "value": value})
    dead = []

    for ws in _clients:
        try:
            await ws.send(msg)
        except Exception:
            dead.append(ws)

    for ws in dead:
        _clients.discard(ws)

async def _nt_monitor() -> None:
    print("Monitor NT3 iniciado")

    while True:
        if not NetworkTables.isConnected():
            print("NT desconectado — aguardando reconexão...")
            await asyncio.sleep(2)
            continue

        for table_name, keys in TABLES_AND_KEYS.items():
            table = _get_table(table_name)

            for key in keys:
                _ensure_entry(table, key)
                value = _read(table, key)

                if value is not None:
                    topic_id = f"/{table_name}/{key}"
                    await _broadcast(topic_id, value)

        await asyncio.sleep(POLL_INTERVAL)


# ══════════════════════════════════════════════
# PULSE  (press → True, espera, → False)
# ══════════════════════════════════════════════

async def _pulse(table, key: str) -> None:
    table.putBoolean(key, True)
    await asyncio.sleep(PULSE_TIME)
    table.putBoolean(key, False)


# ══════════════════════════════════════════════
# WEBSOCKET HANDLER  (Dashboard → NT)
# ══════════════════════════════════════════════

async def _handle_ws(ws, path=None) -> None:
    _clients.add(ws)
    print(f"Dashboard conectado  ({len(_clients)} ativo(s))")

    try:
        async for raw in ws:
            try:
                obj = json.loads(raw)
            except Exception as e:
                print("JSON inválido:", e)
                continue

            if not obj:
                continue

            action     = obj.get("action")
            table_name = obj.get("table")
            key        = obj.get("key")
            value      = obj.get("value")

            if not table_name or not key:
                print("Mensagem ignorada (sem table/key):", obj)
                continue

            table = _get_table(table_name)

            if action == "press":
                asyncio.create_task(_pulse(table, key))

            elif action == "put" and value is not None:
                _write(table, key, value)
                print(f"write → {table_name}/{key} = {value}")

            else:
                print("Mensagem ignorada:", obj)

    except Exception as e:
        print(f"Erro WS: {type(e).__name__}: {e}")
    finally:
        _clients.discard(ws)
        print(f"Dashboard desconectado  ({len(_clients)} ativo(s))")


# ══════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════

async def _main() -> None:
    nt_connect(ROBOT_IP)

    asyncio.create_task(_nt_monitor())

    async with websockets.serve(
        _handle_ws,
        "0.0.0.0",
        WS_PORT,
        max_size=None,
        ping_interval=20,
        ping_timeout=30,
    ):
        print(f"WebSocket em ws://0.0.0.0:{WS_PORT}")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(_main())
