import asyncio
import json
import websockets

import nt_bridge
from config import TABLES, WS_PORT, POLL_INTERVAL, PULSE_TIME

clients: set = set()

# ─── Broadcast ──────────────────────────────────────────

async def _broadcast(topic: str, value):
    msg = json.dumps({"topic": topic, "value": value})
    dead = []
    for ws in list(clients):
        try:
            await ws.send(msg)
        except Exception:
            dead.append(ws)
    for ws in dead:
        clients.discard(ws)


# ─── Monitor NT → WS ────────────────────────────────────

async def _nt_monitor():
    print("Monitor NT3 iniciado")
    while True:
        if not nt_bridge.is_connected():
            print("NT desconectado — aguardando reconexão...")
            await asyncio.sleep(2)
            continue

        for table_name, keys in TABLES.items():
            table = nt_bridge.get_table(table_name)
            for key in keys:
                nt_bridge.ensure_entry(table, key)
                value = nt_bridge.read_value(table, key)
                if value is not None:
                    await _broadcast(f"/{table_name}/{key}", value)

        await asyncio.sleep(POLL_INTERVAL)


# ─── Pulse helper ───────────────────────────────────────

async def _pulse(table, key):
    table.putBoolean(key, True)
    await asyncio.sleep(PULSE_TIME)
    table.putBoolean(key, False)


# ─── Handler de mensagens recebidas do browser ──────────

async def _handle_ws(ws, path=None):
    clients.add(ws)
    print(f"WS conectado ({len(clients)} clientes)")

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
                print("mensagem ignorada (sem table/key):", obj)
                continue

            table = nt_bridge.get_table(table_name)

            if action == "press":
                asyncio.create_task(_pulse(table, key))
                print(f"pulse: {table_name}/{key}")

            elif action == "put" and value is not None:
                nt_bridge.write_value(table, key, value)
                print(f"write: {table_name}/{key} = {value}")

            # retrocompatibilidade com objetos sem "action"
            elif value is not None:
                nt_bridge.write_value(table, key, value)
                print(f"write (compat): {table_name}/{key} = {value}")

            else:
                print("mensagem ignorada:", obj)

    except Exception as e:
        print("erro WS:", e)
    finally:
        clients.discard(ws)
        print(f"WS desconectado ({len(clients)} clientes)")


# ─── Entry point ────────────────────────────────────────

async def run():
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
