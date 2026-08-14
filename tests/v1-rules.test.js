const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const context = { window: {} };
for (const file of ["capabilities.js", "governance.js", "evidence.js", "tools.js"]) {
  vm.runInNewContext(fs.readFileSync(require.resolve(`../data/${file}`), "utf8"), context);
}

// Handshake scenario: low-impact answers previously produced green Fairness / Bias.
const handshake = {
  task: "Handshake receives a user-provided note, combines it with account-level data and portfolio context from Supabase, then runs Webhook → PII redaction → Supabase → classification and segmentation using proxy variables → minority calculation → merge → human review logic → Notion.",
  answers: {
    data: "Public or non-sensitive",
    impact: "Low impact — easy to correct",
    operation: "Draft or advise only",
    inputs: "Mostly text I provide"
  }
};
const handshakeBaseFairness = "clear";
assert.equal(
  context.window.STACKFIT_FAIRNESS_STATUS(handshakeBaseFairness, handshake.task, handshake.answers),
  "safeguard",
  "Handshake must end with yellow Fairness / Bias safeguards"
);

const gdpr = context.window.STACKFIT_EVIDENCE.find(item => item.title.includes("Data Protection"));
assert.equal(context.window.STACKFIT_EVIDENCE_FRESHNESS(gdpr), "Current");
assert.equal(context.window.STACKFIT_COVERAGE_STATUS(1, 3), "Covered");
assert.equal(context.window.STACKFIT_COVERAGE_STATUS(1, 4), "Partial");
assert.equal(context.window.STACKFIT_COVERAGE_STATUS(0, 3), "Missing");
assert.equal(context.window.STACKFIT_CONTEXT_LEVEL(handshake.task), 2, "Handshake Context must be Medium");
assert.equal(context.window.STACKFIT_LONG_HORIZON_LEVEL(handshake.task), 2, "Handshake Long-horizon must be Medium");

console.log("StackFit V1 targeted rule tests passed");
