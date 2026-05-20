import json

from ws_server.webScokets_clients import clients


async def broadcast(topic, value):

    msg = json.dumps({
        "topic": topic,
        "value": value
    })

    dead = set()

    for client in clients:

        try:

            await client.send(msg)

        except:

            dead.add(client)

    for d in dead:

        clients.discard(d)


async def handle_ws(ws, adapter):

    clients.add(ws)

    print("dashboard conectado")

    try:

        async for message in ws:

            print("RAW:", message)

            try:

                obj = json.loads(message)

            except Exception as e:

                print("json invalido:", e)

                continue

            # IGNORA OBJETOS VAZIOS
            if not obj:

                continue

            # WRITE
            if (
                "table" in obj and
                "key" in obj and
                "value" in obj
            ):

                adapter.write(
                    obj["table"],
                    obj["key"],
                    obj["value"]
                )

                print(
                    "write:",
                    obj["table"],
                    obj["key"],
                    obj["value"]
                )

                continue

            print(
                "mensagem ignorada:",
                obj
            )

    except Exception as e:

        print(
            "erro ws:",
            e
        )

    finally:

        print(
            "dashboard desconectado"
        )

        clients.discard(ws)