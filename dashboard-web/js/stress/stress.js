"use strict";

import { subscribe } from "../ws.js";
import { Topics } from "../core/topics.js";

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════

const stress = {

  batteryVoltage: 0,
  totalCurrent: 0,
  drivetrainCurrent: 0,
  stressScore: 0,
  stressLevel: "LOW",
  speedScale: 1,
  chassisSpeed: 0,
};

// ═══════════════════════════════════════
// DOM
// ═══════════════════════════════════════

const el = {

  batteryVoltage:
    document.getElementById("battery-voltage"),

  totalCurrent:
    document.getElementById("total-current"),

  drivetrainCurrent:
    document.getElementById("drivetrain-current"),

  stressScore:
    document.getElementById("stress-score"),

  chassisSpeed:
    document.getElementById("chassis-speed"),

  speedScale:
    document.getElementById("speed-scale"),

  stressStatus:
    document.getElementById("stress-status"),

  speedWarning:
    document.getElementById("speed-warning"),
};

// ═══════════════════════════════════════
// TOPIC SUBSCRIPTIONS
// ═══════════════════════════════════════

subscribe(

  Topics.STRESS_BATTERY_VOLTAGE,

  value => {

    stress.batteryVoltage =
      Number(value);

    render();
  }
);

subscribe(

  Topics.STRESS_TOTAL_CURRENT,

  value => {

    stress.totalCurrent =
      Number(value);

    render();
  }
);

subscribe(

  Topics.STRESS_DRIVETRAIN_CURRENT,

  value => {

    stress.drivetrainCurrent =
      Number(value);

    render();
  }
);

subscribe(

  Topics.STRESS_SCORE,

  value => {

    stress.stressScore =
      Number(value);

    render();
  }
);

subscribe(

  Topics.STRESS_LEVEL,

  value => {

    stress.stressLevel =
      String(value);

    render();
  }
);

subscribe(

  Topics.STRESS_SPEED_SCALE,

  value => {

    stress.speedScale =
      Number(value);

    render();
  }
);

subscribe(

  Topics.STRESS_CHASSIS_SPEED,

  value => {

    stress.chassisSpeed =
      Number(value);

    render();
  }
);

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

// ═══════════════════════════════════════
// NUMBERS
// ═══════════════════════════════════════

function renderNumbers() {

  setText(
    el.batteryVoltage,
    stress.batteryVoltage,
    " V",
    2
  );

  setText(
    el.totalCurrent,
    stress.totalCurrent,
    " A",
    1
  );

  setText(
    el.drivetrainCurrent,
    stress.drivetrainCurrent,
    " A",
    1
  );

  setText(
    el.stressScore,
    stress.stressScore,
    "",
    0
  );

  setText(
    el.chassisSpeed,
    stress.chassisSpeed,
    " m/s",
    2
  );

  if (el.speedScale) {

    el.speedScale.innerText =
      Math.round(
        stress.speedScale * 100
      ) + "%";
  }
}

// ═══════════════════════════════════════
// STATUS
// ═══════════════════════════════════════

function renderStressStatus() {

  if (!el.stressStatus) {
    return;
  }

  el.stressStatus.textContent =
    stress.stressLevel;

  el.stressStatus.className = "";

  switch (stress.stressLevel) {

    case "LOW":

      el.stressStatus.classList.add(
        "status-ok"
      );

      break;

    case "MEDIUM":

      el.stressStatus.classList.add(
        "status-medium"
      );

      break;

    case "HIGH":

      el.stressStatus.classList.add(
        "status-high"
      );

      break;

    case "CRITICAL":

      el.stressStatus.classList.add(
        "status-critical"
      );

      break;
  }
}

// ═══════════════════════════════════════
// WARNINGS
// ═══════════════════════════════════════

function renderWarnings() {

  if (!el.speedWarning) {
    return;
  }

  const lowVoltage =
    stress.batteryVoltage < 11.0;

  const speedLimited =
    stress.speedScale < 1.0;

  el.speedWarning.classList.toggle(
    "hidden",
    !(lowVoltage && speedLimited)
  );
}

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

function setText(
  elem,
  value,
  suffix = "",
  decimals = 0
) {

  if (!elem) {
    return;
  }

  if (
    typeof value !== "number" ||
    !isFinite(value)
  ) {

    return;
  }

  elem.innerText =
    value.toFixed(decimals) + suffix;
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

render();