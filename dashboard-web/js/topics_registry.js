"use strict";
import { TOPICS } from "./config.js";
import { subscribe } from "./ws.js";

function walk(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === "string") {
      // inscrito no-op — evita warnings repetidos
      subscribe(v, () => {});
    } else if (typeof v === "object" && v !== null) {
      walk(v);
    }
  }
}

walk(TOPICS);