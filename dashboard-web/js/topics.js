"use strict";

import { subscribe } from "./ws.js";
import { TOPICS } from "./config.js"; // ou ajuste o caminho se seu config estiver em outro lugar


const stress = {
  batteryVoltage:    0,
  totalCurrent:      0,
  drivetrainCurrent: 0,
  stressScore:       0,
  stressLevel:       "LOW",
  speedScale:        1,
  chassisSpeed:      0,
};

// ═══════════════════════════════════════
// DOM
// ═══════════════════════════════════════

const el = {
  batteryVoltage:    document.getElementById("battery-voltage"),
  totalCurrent:      document.getElementById("total-current"),
  drivetrainCurrent: document.getElementById("drivetrain-current"),
  stressScore:       document.getElementById("stress-score"),
  chassisSpeed:      document.getElementById("chassis-speed"),
  speedScale:        document.getElementById("speed-scale"),
  stressStatus:      document.getElementById("stress-status"),
  speedWarning:      document.getElementById("speed-warning"),
};

// ═══════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════

subscribe(TOPICS.STRESS.BATTERY_VOLTAGE, v => {
  stress.batteryVoltage = Number(v); render();
});

subscribe(TOPICS.STRESS.TOTAL_CURRENT, v => {
  stress.totalCurrent = Number(v); render();
});

subscribe(TOPICS.STRESS.DRIVETRAIN_CURRENT, v => {
  stress.drivetrainCurrent = Number(v); render();
});

subscribe(TOPICS.STRESS.SCORE, v => {
  stress.stressScore = Number(v); render();
});

subscribe(TOPICS.STRESS.LEVEL, v => {
  stress.stressLevel = String(v); render();
});

subscribe(TOPICS.STRESS.SPEED_SCALE, v => {
  stress.speedScale = Number(v); render();
});

subscribe(TOPICS.STRESS.CHASSIS_SPEED, v => {
  stress.chassisSpeed = Number(v); render();
});

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════

function render() {
  requestAnimationFrame(() => {
    renderNumbers();
    renderStressStatus();
    renderWarnings();
  });
}

function renderNumbers() {
  setText(el.batteryVoltage,    stress.batteryVoltage,    " V",   2);
  setText(el.totalCurrent,      stress.totalCurrent,      " A",   1);
  setText(el.drivetrainCurrent, stress.drivetrainCurrent, " A",   1);
  setText(el.stressScore,       stress.stressScore,       "",     0);
  setText(el.chassisSpeed,      stress.chassisSpeed,      " m/s", 2);

  if (el.speedScale) {
    el.speedScale.innerText = Math.round(stress.speedScale * 100) + "%";
  }
}

function renderStressStatus() {
  if (!el.stressStatus) return;

  el.stressStatus.textContent = stress.stressLevel;
  el.stressStatus.className = "";

  const classMap = {
    LOW:      "status-ok",
    MEDIUM:   "status-medium",
    HIGH:     "status-high",
    CRITICAL: "status-critical",
  };

  el.stressStatus.classList.add(
    classMap[stress.stressLevel] ?? "status-ok"
  );
}

function renderWarnings() {
  if (!el.speedWarning) return;

  const lowVoltage  = stress.batteryVoltage < 11.0;
  const speedLimited = stress.speedScale < 1.0;

  el.speedWarning.classList.toggle("hidden", !(lowVoltage && speedLimited));
}

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

function setText(elem, value, suffix = "", decimals = 0) {
  if (!elem || typeof value !== "number" || !isFinite(value)) return;
  elem.innerText = value.toFixed(decimals) + suffix;
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

render();