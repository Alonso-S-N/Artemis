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
  // garante array e regista handler
  if (!_subscribers[topic]) _subscribers[topic] = [];
  _subscribers[topic].push(fn);
  // log para debug
  console.log("[SUBSCRIBE]", topic, "handlers:", _subscribers[topic].length);
  // retorna unsubscribe
  return () => {
    _subscribers[topic] = (_subscribers[topic] || []).filter(h => h !== fn);
    console.log("[UNSUBSCRIBE]", topic, "handlers:", _subscribers[topic].length);
  };
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
      const subs = _subscribers[msg.topic];
      console.log("[RX]", msg.topic, msg.value, "subscribers:", subs ? subs.length : 0);
      if (!subs || subs.length === 0) {
        console.warn("[SEM SUBSCRIBER]", msg.topic, "known topics:", Object.keys(_subscribers));
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