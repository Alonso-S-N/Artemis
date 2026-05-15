"use strict";

import { onNTMessage } from "../ws.js";
import { Topics } from "../core/topics.js";

// ═══════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════

const TX_DEADBAND = 2;
const TX_MEDIUM   = 5;
const TX_STRONG   = 8;

// ═══════════════════════════════════════
// LIMELIGHT ARROW
// ═══════════════════════════════════════

function setupLimelightArrow(config) {

  const {
    arrowId,
    parentSelector,
    imgSelector
  } = config;

  const arrow =
    document.getElementById(arrowId);

  const parent =
    document.querySelector(parentSelector);

  const img =
    parent
      ? parent.querySelector(imgSelector)
      : null;

  if (!arrow || !parent || !img) {
    return;
  }

  // ═══════════════════════════════════════
  // BBOX
  // ═══════════════════════════════════════

  const bboxDiv =
    document.createElement("div");

  bboxDiv.className = "bbox";

  parent.appendChild(bboxDiv);

  // ═══════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════

  let hasTarget   = false;
  let tx           = null;
  let bbox         = null;
  let alignEnabled = false;

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════

  function render() {

    // BBOX sempre aparece
    // quando existe target

    if (hasTarget) {

      updateBBox();

    } else {

      bboxDiv.classList.remove(
        "visible"
      );
    }

    // seta só aparece
    // quando align ativo

    if (!hasTarget || !alignEnabled) {

      arrow.classList.remove(
        "visible"
      );

      arrow.classList.add(
        "hidden"
      );

      return;
    }

    updateArrow();
  }

  // ═══════════════════════════════════════
  // ARROW
  // ═══════════════════════════════════════

  function updateArrow() {

    if (
      tx === null ||
      Math.abs(tx) <= TX_DEADBAND
    ) {

      arrow.classList.remove(
        "visible"
      );

      arrow.classList.add(
        "hidden"
      );

      return;
    }

    arrow.classList.remove(
      "hidden",
      "arrow-left",
      "arrow-right"
    );

    const level =
      Math.abs(tx) >= TX_STRONG
        ? 3
        : Math.abs(tx) >= TX_MEDIUM
          ? 2
          : 1;

    if (tx > 0) {

      arrow.textContent =
        ">".repeat(level);

      arrow.classList.add(
        "arrow-left"
      );

    } else {

      arrow.textContent =
        "<".repeat(level);

      arrow.classList.add(
        "arrow-right"
      );
    }

    arrow.classList.add(
      "visible"
    );
  }

  // ═══════════════════════════════════════
  // BBOX UPDATE
  // ═══════════════════════════════════════

  function updateBBox() {

    if (
      !img.complete ||
      !bbox ||
      bbox.length !== 4 ||
      !img.naturalWidth
    ) {

      bboxDiv.classList.remove(
        "visible"
      );

      return;
    }

    const [x1, y1, x2, y2] = bbox;

    const rect =
      img.getBoundingClientRect();

    const sx =
      rect.width / img.naturalWidth;

    const sy =
      rect.height / img.naturalHeight;

    // imagem rotacionada 180°

    const flippedX1 =
      img.naturalWidth - x2;

    const flippedY1 =
      img.naturalHeight - y2;

    bboxDiv.style.left =
      (flippedX1 * sx) + "px";

    bboxDiv.style.top =
      (flippedY1 * sy) + "px";

    bboxDiv.style.width =
      ((x2 - x1) * sx) + "px";

    bboxDiv.style.height =
      ((y2 - y1) * sy) + "px";

    bboxDiv.classList.add(
      "visible"
    );
  }

  // ═══════════════════════════════════════
  // TELEMETRY
  // ═══════════════════════════════════════

  onNTMessage((topic, value) => {

    switch (topic) {

      case Topics.MODE_AIMLOCK_LIME2:

        alignEnabled =
          Number(value) !== 0;

        render();

        break;

      case Topics.LL_BACK_HAS_TARGET:

        hasTarget =
          Boolean(value);

        render();

        break;

      case Topics.LL_BACK_TX:

        tx =
          value == null
            ? null
            : Number(value);

        render();

        break;

      case Topics.LL_BACK_BBOX:

        bbox =
          Array.isArray(value) &&
          value.length === 4
            ? value.map(Number)
            : null;

        render();

        break;
    }
  });

  // ═══════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════

  render();
}

// ═══════════════════════════════════════
// SETUP
// ═══════════════════════════════════════

setupLimelightArrow({

  arrowId:
    "arrow-lime2",

  parentSelector: 
    "#lime2 .arrow-parent",

  imgSelector:
    "img",
});