"use strict";

import { CONFIG, TOPICS } from "./config.js"; // novo import

// ═══════════════════════════════════════
// HYDRA #9163
// ═══════════════════════════════════════

const WS_URL = CONFIG.WS_URL ?? "ws://127.0.0.1:5901";

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
    console.log("[WS] aberto");
    _connHandlers.forEach(fn => fn(true));
  };

  _ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      console.log("[RX]", msg.topic, msg.value);
      const subs = _subscribers[msg.topic];
      if (!subs || subs.length === 0) {
        console.warn("[SEM SUBSCRIBER]", msg.topic);
      } else {
        subs.forEach(fn => fn(msg.value));
      }
      _handlers.forEach(h => h(msg));
    } catch (e) {
      console.error("Mensagem WS inválida:", e);
    }
  };

  _ws.onclose = () => {
    console.log("[WS] fechado");
    _connHandlers.forEach(fn => fn(false));
    // reconectar after short delay
    setTimeout(connect, 1000);
  };

  _ws.onerror = (err) => { console.error("WS error", err); };
}

connect();