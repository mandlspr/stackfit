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

const handshakeGovernanceWorkflow = {
  task: "Analyze CSM notes to detect AI governance signals. Redact personal names before classification, classify each signal across governance dimensions, assess confidence, dynamically identify minority business segments for fairness monitoring, and route ambiguous or equity-sensitive cases for human review. Store the resulting governance signals for internal Product/Compliance monitoring.",
  answers: {
    data: "Personal or confidential data",
    impact: "Moderate impact — time or money lost",
    operation: "Act after human approval",
    inputs: "Current or private knowledge sources"
  }
};
const handshakeGovernance = context.window.STACKFIT_GOVERNANCE_ASSESSMENT(handshakeGovernanceWorkflow.task, handshakeGovernanceWorkflow.answers);
const handshakeCapabilities = context.window.STACKFIT_CAPABILITY_ASSESSMENT(handshakeGovernanceWorkflow.task, handshakeGovernanceWorkflow.answers);
const handshakeStack = { llm: "gpt-5-nano", database: "Supabase", orchestration: "n8n", approval: "CSM human review", monitoring: "Notion", guardrails: "PII redaction step", evaluation: "Hoppscotch", execution: "n8n Webhook", other: "Equity Watch" };
const handshakeCategories = context.window.STACKFIT_TOOL_CATEGORIES.filter(category => handshakeStack[category.id]);
const handshakeTechnicalGaps = context.window.STACKFIT_CAPABILITIES.filter(capability => {
  const coveringCount = handshakeCategories.filter(category => category.covers.includes(capability.id)).length;
  const coverage = context.window.STACKFIT_COVERAGE_STATUS(coveringCount, handshakeCapabilities[capability.id]);
  return context.window.STACKFIT_IS_BLOCKING_TECHNICAL_GAP(coverage, handshakeCapabilities[capability.id]);
});
assert.equal(handshakeTechnicalGaps.length, 0, "Handshake technical coverage must remain sufficient");
assert.equal(handshakeGovernance.privacy, "review", "Handshake Privacy status must remain Review required");
assert.equal(handshakeGovernance.security, "review", "Handshake Security status must remain Review required");
assert.equal(context.window.STACKFIT_OVERALL_VERDICT(handshakeGovernance, 0, 0), "Fit with conditions", "Technically sufficient Handshake must retain governance conditions in the verdict");
assert.equal(
  context.window.STACKFIT_GOVERNANCE_SUMMARY(handshakeGovernance, true),
  "Technical coverage is sufficient. Governance reviews and safeguards must be addressed before deployment."
);

// Exact V1 contrast scenario: internal marketing drafting, reviewed by a human,
// with no customer data, automated publishing, API/database access, or external action.
const marketingDraft = {
  task: "Draft internal marketing copy from text I provide for a human to review before publication. It uses non-sensitive internal business information, has a low consequence of error, uses no customer data, and performs no automated publishing, API calls, database access, or external actions.",
  answers: {
    data: "Internal business information",
    impact: "Low impact — easy to correct",
    operation: "Draft or advise only",
    inputs: "Mostly text I provide"
  }
};

assert.equal(context.window.STACKFIT_TOOL_USE_LEVEL(marketingDraft.task, marketingDraft.answers), 1, "Draft-only Tool Use must be Low");
for (const capability of ["autonomy", "retrieval", "longHorizon", "toolUse"]) {
  assert.equal(
    context.window.STACKFIT_COVERAGE_IS_SUFFICIENT(context.window.STACKFIT_COVERAGE_STATUS(0, 1), 1),
    true,
    `Missing dedicated ${capability} coverage must not block a Low task need`
  );
}
assert.equal(context.window.STACKFIT_IS_BLOCKING_TECHNICAL_GAP("Missing", 1), false);
const marketingGovernance = context.window.STACKFIT_GOVERNANCE_ASSESSMENT(marketingDraft.task, marketingDraft.answers);
for (const area of ["privacy", "oversight", "transparency", "security", "accountability", "fairness", "regulatory"]) {
  assert.equal(marketingGovernance[area], "clear", `${area} may remain green for the low-risk marketing draft`);
}
const marketingHasBlocker = Object.values(marketingGovernance).some(status => status === "stop" || status === "mandatory");
const marketingHasTechnicalGap = context.window.STACKFIT_IS_BLOCKING_TECHNICAL_GAP("Missing", 1);
assert.equal(marketingHasBlocker, false);
assert.equal(marketingHasTechnicalGap, false);
assert.equal(context.window.STACKFIT_OVERALL_VERDICT(marketingGovernance, 0, 0), "Fit", "Marketing draft verdict must be Fit");
assert.equal(context.window.STACKFIT_GOVERNANCE_SUMMARY(marketingGovernance, true), "No specific governance blocker or unresolved condition was identified.");

const recruitment = {
  task: "Use AI to score job applicants based on CVs and interview notes, rank candidates, and automatically reject applicants below a defined score. Recruiters review only the remaining candidates.",
  answers: {
    data: "Personal or confidential data",
    impact: "Severe impact — safety, rights, employment, credit or legal status",
    operation: "Act autonomously without routine review",
    inputs: "Long documents or conversation history"
  }
};
const recruitmentCapabilities = context.window.STACKFIT_CAPABILITY_ASSESSMENT(recruitment.task, recruitment.answers);
assert.equal(recruitmentCapabilities.reliability, 4, "Recruitment Reliability must be Critical");
assert.equal(recruitmentCapabilities.context, 3, "Recruitment Context must be High");
assert.equal(recruitmentCapabilities.longHorizon, 2, "Deterministic recruitment Long-horizon must be Medium");
const recruitmentGovernance = context.window.STACKFIT_GOVERNANCE_ASSESSMENT(recruitment.task, recruitment.answers);
assert.equal(recruitmentGovernance.fairness, "mandatory", "Recruitment Fairness / Bias must require mandatory controls");
assert.equal(recruitmentGovernance.regulatory, "mandatory", "Recruitment Regulatory exposure must require mandatory controls");
assert.equal(recruitmentGovernance.oversight, "mandatory", "Automated rejection must require mandatory human oversight");
assert.notEqual(recruitmentGovernance.oversight, "stop", "Automated rejection must not label the use case prohibited");
const recruitmentStack = {
  llm: "GPT-5.6",
  database: "ATS / Applicant database",
  orchestration: "n8n",
  approval: "Recruiter review after AI screening",
  monitoring: "Audit log",
  guardrails: "Access controls + PII handling",
  evaluation: "Bias / fairness testing",
  execution: "ATS API",
  other: "Automated rejection threshold"
};
const recruitmentCategories = context.window.STACKFIT_TOOL_CATEGORIES.filter(category => recruitmentStack[category.id]);
for (const categoryId of Object.keys(recruitmentStack)) {
  assert.ok(recruitmentCategories.some(category => category.id === categoryId), `${categoryId} must remain recognized as present`);
}
const recruitmentGaps = context.window.STACKFIT_CAPABILITIES.map(capability => {
  const covering = recruitmentCategories.filter(category => category.covers.includes(capability.id));
  const need = recruitmentCapabilities[capability.id];
  const coverage = context.window.STACKFIT_COVERAGE_STATUS(covering.length, need);
  return { capability, covering, need, coverage };
}).filter(row => context.window.STACKFIT_IS_BLOCKING_TECHNICAL_GAP(row.coverage, row.need));
assert.deepEqual(Array.from(recruitmentGaps, row => row.capability.id), ["reliability", "autonomy", "toolUse"]);
assert.ok(recruitmentGaps.every(row => row.coverage === "Partial" && row.covering.length > 0), "Critical gaps must retain Partial coverage from existing categories");
assert.equal(context.window.STACKFIT_OVERALL_VERDICT(recruitmentGovernance, recruitmentGaps.length, 0), "Not viable");
const recruitmentCorrection = recruitmentGaps.map(row => context.window.STACKFIT_GAP_CORRECTION(
  row.capability.id,
  row.capability.label,
  row.covering.map(category => category.label),
  row.covering[0].label
)).join(" ");
assert.match(recruitmentCorrection, /strengthen validation, testing, and pre-decision human review/i);
assert.match(recruitmentCorrection, /constrain automated decision authority and require human approval/i);
assert.match(recruitmentCorrection, /strengthen execution controls/i);
assert.doesNotMatch(recruitmentCorrection, /Add (?:LLM \/ Model|Orchestration \/ Automation|Execution \/ APIs)/i);

console.log("StackFit V1 targeted rule tests passed");
