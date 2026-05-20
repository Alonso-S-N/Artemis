"use strict";

import {
  onNTMessage,
  ntSend,
  onConnectionChange
} from "../ws.js";

import { TOPICS } from "../topics.js";

// ═══════════════════════════════════════
// STATE META
// ═══════════════════════════════════════

const STATE_META = {

  IDLE: {
    icon: "○",
    desc: "Aguardando intenção"
  },

  MOVING: {
    icon: "⟶",
    desc: "Robô em movimento"
  },

  ACQUIRING: {
    icon: "⬇",
    desc: "Coletando game piece"
  },

  SCORING: {
    icon: "◎",
    desc: "Executando pontuação"
  },

  CLIMBING: {
    icon: "↑",
    desc: "Iniciando escalada"
  },

  BLOCKED: {
    icon: "✕",
    desc: "Estado bloqueado"
  },

  EMERGENCY: {
    icon: "⚠",
    desc: "ABORTAR — EMERGÊNCIA"
  },
};

// ═══════════════════════════════════════
// DOM
// ═══════════════════════════════════════

const el = {

  connDot:
    document.getElementById("conn-dot"),

  connLabel:
    document.getElementById("conn-label"),

  stateBadge:
    document.getElementById("state-badge"),

  stateIcon:
    document.getElementById("state-icon"),

  stateDesc:
    document.getElementById("state-desc"),

  endgameBanner:
    document.getElementById("endgame-banner"),

  dtypeBadge:
    document.getElementById("dtype-badge"),

  decisionReason:
    document.getElementById("decision-reason"),

  ctxVision:
    document.getElementById("ctx-vision"),

  ctxAligned:
    document.getElementById("ctx-aligned"),

  ctxShooter:
    document.getElementById("ctx-shooter"),

  ctxPiece:
    document.getElementById("ctx-piece"),

  ctxEndgame:
    document.getElementById("ctx-endgame"),

  ctxMoving:
    document.getElementById("ctx-moving"),

  ctxBattery:
    document.getElementById("ctx-battery"),

  ctxRpm:
    document.getElementById("ctx-rpm"),

  logList:
    document.getElementById("log-list"),
};

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════

let matchActive = false;

let rpmCurrent = 0;
let rpmTarget = 0;

const MAX_LOG = 60;

// ═══════════════════════════════════════
// CONNECTION
// ═══════════════════════════════════════

onConnectionChange((online) => {

  if (!el.connDot || !el.connLabel) {
    return;
  }

  if (online) {

    el.connDot.classList.add("live");

    el.connLabel.textContent = "ONLINE";

    addLog("WebSocket conectado", "ok");

  } else {

    el.connDot.classList.remove("live");

    el.connLabel.textContent = "OFFLINE";

    addLog(
      "Conexão perdida — reconectando...",
      "danger"
    );
  }
});

// ═══════════════════════════════════════
// TELEMETRY
// ═══════════════════════════════════════

onNTMessage((topic, value) => {

  switch (topic) {

    // ═════════ ADL ═════════

    case TOPICS.ADL.STATE:

      setState(String(value));
      break;

    case TOPICS.ADL.DECISION:

      setDecision(String(value));
      break;

    case TOPICS.ADL.INTENT:

      break;

    // ═════════ VISION ═════════

    case TOPICS.VISION.HAS_TARGET:

      setPill(el.ctxVision, Boolean(value));
      break;

    case TOPICS.VISION.ALIGNED:

      setPill(el.ctxAligned, Boolean(value));
      break;

    // ═════════ MECHANISMS ═════════

    case TOPICS.MECHANISMS.SHOOTER_READY:

      setPill(el.ctxShooter, Boolean(value));
      break;

    case TOPICS.MECHANISMS.HAS_GAME_PIECE:

      setPill(el.ctxPiece, Boolean(value));
      break;

    case TOPICS.MECHANISMS.SHOOTER_RPM_CURRENT:

      rpmCurrent = Number(value);

      updateRpm();

      break;

    case TOPICS.MECHANISMS.SHOOTER_RPM_TARGET:

      rpmTarget = Number(value);

      updateRpm();

      break;

    // ═════════ DRIVE ═════════

    case TOPICS.DRIVE.MOVING:

      setPill(el.ctxMoving, Boolean(value));
      break;

    // ═════════ GAME ═════════

    case TOPICS.GAME.ENDGAME: {

      const active = Boolean(value);

      setPill(
        el.ctxEndgame,
        active,
        true
      );

      if (el.endgameBanner) {

        el.endgameBanner.classList.toggle(
          "hidden",
          !active
        );
      }

      setMatchActive(active);

      break;
    }

    // ═════════ ROBOT ═════════

    case TOPICS.ROBOT.BATTERY_VOLTAGE: {

      const voltage = Number(value);

      if (!el.ctxBattery) {
        return;
      }

      el.ctxBattery.textContent =
        voltage.toFixed(2) + " V";

      el.ctxBattery.style.color =
        voltage < 10
          ? "var(--danger)"
          : voltage < 11
            ? "var(--warn)"
            : "var(--accent)";

      break;
    }

    // ═════════ STRESS ═════════

    case TOPICS.STRESS.BATTERY_VOLTAGE:

      document.getElementById(
        "battery-voltage"
      ).textContent =
        Number(value).toFixed(2) + " V";

      break;

    case TOPICS.STRESS.TOTAL_CURRENT:

      document.getElementById(
        "total-current"
      ).textContent =
        Number(value).toFixed(1) + " A";

      break;

    case TOPICS.STRESS.DRIVETRAIN_CURRENT:

      document.getElementById(
        "drivetrain-current"
      ).textContent =
        Number(value).toFixed(1) + " A";

      break;

    case TOPICS.STRESS.SCORE:

      document.getElementById(
        "stress-score"
      ).textContent =
        Number(value).toFixed(0);

      break;

    case TOPICS.STRESS.LEVEL: {

      const box =
        document.getElementById(
          "stress-status"
        );

      box.textContent = value;

      box.className =
        "status-box " +
        String(value).toLowerCase();

      break;
    }

    case TOPICS.STRESS.SPEED_SCALE: {

      const percent =
        Number(value) * 100;

      document.getElementById(
        "speed-scale"
      ).textContent =
        percent.toFixed(0) + "%";

      const warning =
        document.getElementById(
          "speed-warning"
        );

      if (percent < 100) {

        warning.classList.remove(
          "hidden"
        );

      } else {

        warning.classList.add(
          "hidden"
        );
      }

      break;
    }

    case TOPICS.STRESS.CHASSIS_SPEED:

      document.getElementById(
        "chassis-speed"
      ).textContent =
        Number(value).toFixed(2) +
        " m/s";

      break;
  }
});
// ═══════════════════════════════════════
// RPM
// ═══════════════════════════════════════

function updateRpm() {

  if (!el.ctxRpm) {
    return;
  }

  el.ctxRpm.textContent =
    `${rpmCurrent.toFixed(0)} / ${rpmTarget.toFixed(0)} rpm`;

  el.ctxRpm.style.color =
    Math.abs(rpmCurrent - rpmTarget) < 100
      ? "var(--ok)"
      : "var(--accent)";
}

// ═══════════════════════════════════════
// MATCH
// ═══════════════════════════════════════

function setMatchActive(active) {

  matchActive = active;

  document
    .querySelectorAll(".ibtn")
    .forEach(btn => {

      btn.disabled = active;

      btn.style.opacity =
        active ? "0.3" : "1";

      btn.style.cursor =
        active
          ? "not-allowed"
          : "pointer";
    });
}

// ═══════════════════════════════════════
// LOGS
// ═══════════════════════════════════════

function addLog(msg, type = "") {

  if (!el.logList) {
    return;
  }

  const ts =
    new Date()
      .toTimeString()
      .slice(0, 8);

  const div =
    document.createElement("div");

  div.className = "log-entry";

  div.innerHTML = `
    <span class="log-ts">${ts}</span>
    <span class="log-msg ${type}">
      ${msg}
    </span>
  `;

  el.logList.prepend(div);

  while (
    el.logList.children.length > MAX_LOG
  ) {
    el.logList.lastChild.remove();
  }
}

function clearLog() {

  if (el.logList) {
    el.logList.innerHTML = "";
  }
}

window.clearLog = clearLog;

// ═══════════════════════════════════════
// PILLS
// ═══════════════════════════════════════

function setPill(
  elem,
  on,
  warnMode = false
) {

  if (!elem) {
    return;
  }

  elem.textContent =
    on ? "ON" : "OFF";

  elem.className =
    "ctx-pill" +
    (
      on
        ? (
            warnMode
              ? " warn"
              : " on"
          )
        : ""
    );
}

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════

let lastState = "";

function setState(state) {

  if (state === lastState) {
    return;
  }

  lastState = state;

  const meta =
    STATE_META[state] || {
      icon: "?",
      desc: state
    };

  el.stateBadge.textContent = state;

  el.stateBadge.className =
    "state-badge " + state;

  el.stateIcon.textContent =
    meta.icon;

  el.stateIcon.className =
    "state-icon " + state;

  el.stateDesc.textContent =
    meta.desc;

  const logType =
    state === "EMERGENCY"
      ? "danger"
      : state === "BLOCKED"
        ? "warn"
        : state === "IDLE"
          ? ""
          : "ok";

  addLog(
    "Estado → " + state,
    logType
  );
}

// ═══════════════════════════════════════
// DECISION
// ═══════════════════════════════════════

function setDecision(raw) {

  let dtype = "EXECUTE";
  let reason = raw;

  if (raw.startsWith("HOLD: ")) {

    dtype = "HOLD";

    reason = raw.slice(6);
  }

  if (raw.startsWith("REJECT: ")) {

    dtype = "REJECT";

    reason = raw.slice(8);
  }

  el.dtypeBadge.textContent =
    dtype;

  el.dtypeBadge.className =
    "dtype-badge " + dtype;

  el.decisionReason.textContent =
    reason;

  const logType =
    dtype === "REJECT"
      ? "danger"
      : dtype === "HOLD"
        ? "warn"
        : "";

  addLog(
    `${dtype}: ${reason}`,
    logType
  );
}

// ═══════════════════════════════════════
// INTENTS
// ═══════════════════════════════════════

function sendIntent(cmd) {

  if (matchActive) {

    addLog(
      "⚠ Partida ativa — use o controle físico",
      "warn"
    );

    return;
  }

  ntSend({

    topic: TOPICS.ADL.INTENT,

    value: cmd
  });

  addLog(
    "→ " + cmd,
    "info"
  );
}

window.sendIntent = sendIntent;

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

addLog(
  "Dashboard iniciado",
  "info"
);