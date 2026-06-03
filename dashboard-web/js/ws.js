"use strict";

// ═══════════════════════════════════════
// WS.JS — WebSocket único compartilhado
// HYDRA #9163
// ═══════════════════════════════════════

const WS_URL = "ws://127.0.0.1:5901/nt/dashboard";

const _handlers    = [];
const _connHandlers = [];
const _subscribers = {};  // topic → [fn, fn, ...]

let _ws = null;

// ─── API pública ────────────────────────────────────────

// Recebe TODOS os tópicos (uso interno dos módulos antigos)
export function onNTMessage(fn) {
  _handlers.push(fn);
}

// Assina um tópico específico — uso recomendado
export function subscribe(topic, fn) {
  if (!_subscribers[topic]) _subscribers[topic] = [];
  _subscribers[topic].push(fn);
}

export function ntSend(payload) {
  if (_ws && _ws.readyState === WebSocket.OPEN) {
    _ws.send(JSON.stringify(payload));
  }
}

export function onConnectionChange(fn) {
  _connHandlers.push(fn);
}

// ─── WebSocket ──────────────────────────────────────────

function connect() {
  _ws = new WebSocket(WS_URL);

  _ws.onopen = () => {
    console.log("WS conectado");
    _connHandlers.forEach(fn => fn(true));
  };

  _ws.onmessage = (ev) => {
    let msg;
    try { msg = JSON.parse(ev.data); } catch { return; }
    if (!msg || msg.topic === undefined || msg.value === undefined) return;

    console.log("RAW:", ev.data);
    console.log("PARSED:", msg);

    // despacha para handlers genéricos
    _handlers.forEach(fn => fn(msg.topic, msg.value));

    // despacha para subscribers específicos
    const subs = _subscribers[msg.topic];
    if (subs) subs.forEach(fn => fn(msg.value));
  };

  _ws.onclose = () => {
    console.log("WS desconectado — reconectando...");
    _connHandlers.forEach(fn => fn(false));
    setTimeout(connect, 1200);
  };

  _ws.onerror = () => { try { _ws.close(); } catch {} };
}

connect();