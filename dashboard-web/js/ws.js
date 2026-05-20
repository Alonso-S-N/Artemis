"use strict";

const WS_URL =
  "ws://127.0.0.1:5901/nt/dashboard";

const _handlers = [];

const _connHandlers = [];

const _subscriptions = new Map();

let _ws = null;

// ═══════════════════════════════
// PUBLIC API
// ═══════════════════════════════

export function onNTMessage(fn) {

  _handlers.push(fn);
}

export function onConnectionChange(fn) {

  _connHandlers.push(fn);
}

export function ntSend(payload) {

  if (
    _ws &&
    _ws.readyState === WebSocket.OPEN
  ) {

    _ws.send(
      JSON.stringify(payload)
    );
  }
}

export function subscribe(
  topic,
  callback
) {

  _subscriptions.set(
    topic,
    callback
  );
}

// ═══════════════════════════════
// CONNECTION
// ═══════════════════════════════

function connect() {

  _ws = new WebSocket(WS_URL);

  _ws.onopen = () => {

    console.log(
      "WS conectado"
    );

    _connHandlers.forEach(
      fn => fn(true)
    );

    // RESUBSCRIBE
    for (
      const [topic]
      of _subscriptions
    ) {

      _ws.send(JSON.stringify({

        subscribe: topic

      }));
    }
  };

  _ws.onmessage = (ev) => {

    console.log(
      "RAW:",
      ev.data
    );

    let msg;

    try {

      msg = JSON.parse(ev.data);

    } catch (e) {

      console.error(
        "json invalido",
        e
      );

      return;
    }

    console.log(
      "PARSED:",
      msg
    );

    if (
      !msg ||
      msg.topic === undefined ||
      msg.value === undefined
    ) {

      return;
    }

    const sub =
      _subscriptions.get(
        msg.topic
      );

    if (sub) {

      sub(msg.value);
    }

    _handlers.forEach(fn =>

      fn(
        msg.topic,
        msg.value
      )
    );
  };

  _ws.onclose = () => {

    console.log(
      "WS desconectado"
    );

    _connHandlers.forEach(
      fn => fn(false)
    );

    setTimeout(
      connect,
      1200
    );
  };

  _ws.onerror = (err) => {

    console.error(
      "WS erro:",
      err
    );

    try {

      _ws.close();

    } catch {}
  };
}

connect();