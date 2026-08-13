const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const context = { window: {} };
vm.runInNewContext(
  fs.readFileSync(require.resolve("../data/governance.js"), "utf8"),
  context
);

const handshakeTask = "Handshake segments employers and candidates to tailor marketplace outreach.";

assert.equal(
  context.window.STACKFIT_FAIRNESS_STATUS("clear", handshakeTask, {}),
  "safeguard",
  "Handshake segmentation must raise Fairness / Bias from green to safeguards required"
);

assert.equal(
  context.window.STACKFIT_HAS_FAIRNESS_TRIGGER("Summarise a public product manual", {}),
  false,
  "An unrelated task must not trigger the fairness rule"
);

assert.equal(
  context.window.STACKFIT_FAIRNESS_STATUS("review", "Check the model for bias", {}),
  "review",
  "The trigger must not lower an existing stronger Fairness / Bias status"
);

console.log("governance fairness trigger tests passed");
