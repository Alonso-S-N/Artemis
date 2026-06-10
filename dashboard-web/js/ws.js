"use strict";

// ═══════════════════════════════════════
// HYDRA #9163
// ═══════════════════════════════════════

const WS_URL = "ws://127.0.0.1:5901";

const _handlers = [];
const _connHandlers = [];
const _subscribers = {};

let _ws = null;

// ──────────────────────────────────────
// API pública
// ──────────────────────────────────────

export function onNTMessage(fn) {
  _handlers.push(fn);
}

export function subscribe(topic, fn) {
  if (!_subscribers[topic]) {
    _subscribers[topic] = [];
  }

  _subscribers[topic].push(fn);

  console.log(
    "[SUBSCRIBE]",
    topic,
    "total:",
    _subscribers[topic].length
  );
}

export function ntSend(payload) {
  if (!_ws) return;

  if (_ws.readyState === WebSocket.OPEN) {
    _ws.send(JSON.stringify(payload));
  } else {
    console.warn("WS fechado, mensagem ignorada:", payload);
  }
}

export function onConnectionChange(fn) {
  _connHandlers.push(fn);
}

// ──────────────────────────────────────
// WebSocket
// ──────────────────────────────────────

function connect() {
  console.log("Conectando em:", WS_URL);

  _ws = new WebSocket(WS_URL);

  _ws.onopen = () => {
    console.log("WS conectado");
    _connHandlers.forEach(fn => fn(true));
  };

  _ws.onmessage = (ev) => {
    let msg;

    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      console.error("JSON inválido:", ev.data);
      return;
    }

    if (!msg) return;

    const topic = msg.topic;
    const value = msg.value;

    console.log(
      "[RX]",
      topic,
      value
    );

    // handlers genéricos
    for (const fn of _handlers) {
      try {
        fn(topic, value);
      } catch (e) {
        console.error("Erro handler:", e);
      }
    }

    // subscribers específicos
    const subs = _subscribers[topic];

    if (!subs || subs.length === 0) {
      console.warn(
        "[SEM SUBSCRIBER]",
        topic
      );
      return;
    }

    for (const fn of subs) {
      try {
        fn(value);
      } catch (e) {
        console.error(
          "Erro subscriber",
          topic,
          e
        );
      }
    }
  };

  _ws.onclose = (ev) => {
    console.warn(
      "WS desconectado",
      ev.code,
      ev.reason
    );

    _connHandlers.forEach(fn => fn(false));

    setTimeout(connect, 1200);
  };

  _ws.onerror = (err) => {
    console.error("WS erro:", err);

    try {
      _ws.close();
    } catch {}
  };
}

connect();