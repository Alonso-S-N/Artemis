"use strict";

import { onNTMessage, ntSend, onConnectionChange } from "../ws.js";
import { TOPICS } from "../topics.js";


const STATE_META = {
  IDLE:      { icon: "○", desc: "Aguardando intenção" },
  MOVING:    { icon: "⟶", desc: "Robô em movimento" },
  ACQUIRING: { icon: "⬇", desc: "Coletando game piece" },
  SCORING:   { icon: "◎", desc: "Executando pontuação" },
  CLIMBING:  { icon: "↑", desc: "Iniciando escalada" },
  BLOCKED:   { icon: "✕", desc: "Estado bloqueado" },
  EMERGENCY: { icon: "⚠", desc: "ABORTAR — EMERGÊNCIA" },
};

const el = {
  connDot:        document.getElementById("conn-dot"),
  connLabel:      document.getElementById("conn-label"),
  stateBadge:     document.getElementById("state-badge"),
  stateIcon:      document.getElementById("state-icon"),
  stateDesc:      document.getElementById("state-desc"),
  endgameBanner:  document.getElementById("endgame-banner"),
  dtypeBadge:     document.getElementById("dtype-badge"),
  decisionReason: document.getElementById("decision-reason"),
  ctxVision:      document.getElementById("ctx-vision"),
  ctxAligned:     document.getElementById("ctx-aligned"),
  ctxShooter:     document.getElementById("ctx-shooter"),
  ctxPiece:       document.getElementById("ctx-piece"),
  ctxEndgame:     document.getElementById("ctx-endgame"),
  ctxMoving:      document.getElementById("ctx-moving"),
  ctxBattery:     document.getElementById("ctx-battery"),
  ctxRpm:         document.getElementById("ctx-rpm"),
  logList:        document.getElementById("log-list"),
};

let matchActive = false;
let rpmCurrent  = 0;
let rpmTarget   = 0;
let lastState   = "";
const MAX_LOG   = 60;

onConnectionChange((online) => {
  if (!el.connDot || !el.connLabel) return;

  el.connDot.classList.toggle("live", online);
  el.connLabel.textContent = online ? "ONLINE" : "OFFLINE";
  addLog(
    online ? "WebSocket conectado" : "Conexão perdida — reconectando...",
    online ? "ok" : "danger"
  );
});

onNTMessage((topic, value) => {
  switch (topic) {

    
    case TOPICS.ADL.STATE:
      setState(String(value));
      break;

    case TOPICS.ADL.DECISION:
      setDecision(String(value));
      break;

    case TOPICS.VISION.HAS_TARGET:
      setPill(el.ctxVision, Boolean(value));
      break;

    case TOPICS.VISION.ALIGNED:
      setPill(el.ctxAligned, Boolean(value));
      break;

    // ── Mechanisms ───────────────────────
    case TOPICS.MECHANISMS.SHOOTER_READY:
      setPill(el.ctxShooter, Boolean(value));
      break;

    case TOPICS.MECHANISMS.HAS_GAME_PIECE:
      setPill(el.ctxPiece, Boolean(value));
      break;

    case TOPICS.SHOOTER_RPM_CURRENT:
      rpmCurrent = Number(value);
      updateRpm();
      break;

    case TOPICS.SHOOTER_RPM_TARGET:
      rpmTarget = Number(value);
      updateRpm();
      break;

    // ── Drive ────────────────────────────
    case TOPICS.DRIVE.MOVING:
      setPill(el.ctxMoving, Boolean(value));
      break;

    // ── Game ─────────────────────────────
    case TOPICS.GAME.ENDGAME: {
      const active = Boolean(value);
      setPill(el.ctxEndgame, active, true);
      el.endgameBanner?.classList.toggle("hidden", !active);
      setMatchActive(active);
      break;
    }

    // ── Robot (battery no header) ────────
    case TOPICS.ROBOT.BATTERY_VOLTAGE: {
      const v = Number(value);
      if (!el.ctxBattery) break;
      el.ctxBattery.textContent = v.toFixed(2) + " V";
      el.ctxBattery.style.color =
        v < 10  ? "var(--danger)" :
        v < 11  ? "var(--warn)"   :
                  "var(--accent)";
      break;
    }

    // STRESS é tratado em stress.js — não duplicar aqui
  }
});

function updateRpm() {
  if (!el.ctxRpm) return;
  el.ctxRpm.textContent = `${rpmCurrent.toFixed(0)} / ${rpmTarget.toFixed(0)} rpm`;
  el.ctxRpm.style.color =
    Math.abs(rpmCurrent - rpmTarget) < 100 ? "var(--ok)" : "var(--accent)";
}

function setMatchActive(active) {
  matchActive = active;
  document.querySelectorAll(".ibtn").forEach(btn => {
    btn.disabled       = active;
    btn.style.opacity  = active ? "0.3" : "1";
    btn.style.cursor   = active ? "not-allowed" : "pointer";
  });
}

function addLog(msg, type = "") {
  if (!el.logList) return;
  const ts  = new Date().toTimeString().slice(0, 8);
  const div = document.createElement("div");
  div.className = "log-entry";
  div.innerHTML = `<span class="log-ts">${ts}</span><span class="log-msg ${type}">${msg}</span>`;
  el.logList.prepend(div);
  while (el.logList.children.length > MAX_LOG) el.logList.lastChild.remove();
}

function clearLog() {
  if (el.logList) el.logList.innerHTML = "";
}

window.clearLog = clearLog;

function setPill(elem, on, warnMode = false) {
  if (!elem) return;
  elem.textContent = on ? "ON" : "OFF";
  elem.className   = "ctx-pill" + (on ? (warnMode ? " warn" : " on") : "");
}


function setState(state) {
  if (state === lastState) return;
  lastState = state;

  const meta = STATE_META[state] ?? { icon: "?", desc: state };

  el.stateBadge.textContent = state;
  el.stateBadge.className   = "state-badge " + state;
  el.stateIcon.textContent  = meta.icon;
  el.stateIcon.className    = "state-icon " + state;
  el.stateDesc.textContent  = meta.desc;

  const logType =
    state === "EMERGENCY" ? "danger" :
    state === "BLOCKED"   ? "warn"   :
    state === "IDLE"      ? ""       : "ok";

  addLog("Estado → " + state, logType);
}

function setDecision(raw) {
  let dtype  = "EXECUTE";
  let reason = raw;

  if (raw.startsWith("HOLD: "))   { dtype = "HOLD";   reason = raw.slice(6); }
  if (raw.startsWith("REJECT: ")) { dtype = "REJECT"; reason = raw.slice(8); }

  el.dtypeBadge.textContent = dtype;
  el.dtypeBadge.className   = "dtype-badge " + dtype;
  el.decisionReason.textContent = reason;

  const logType = dtype === "REJECT" ? "danger" : dtype === "HOLD" ? "warn" : "";
  addLog(`${dtype}: ${reason}`, logType);
}


function sendIntent(cmd) {
  if (matchActive) {
    addLog("⚠ Partida ativa — use o controle físico", "warn");
    return;
  }
  ntSend({ table: "ADL", key: "intent", action: "put", value: cmd });
  addLog("→ " + cmd, "info");
}

window.sendIntent = sendIntent;


addLog("Dashboard iniciado", "info");