clients = set()

async def broadcast(message):

    dead = []

    for ws in clients:

        try:
            await ws.send(message)

        except:
            dead.append(ws)

    for ws in dead:
        clients.discard(ws)