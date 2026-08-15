window.STACKFIT_GOVERNANCE = [
  { id: "privacy", label: "Privacy / Data sensitivity" },
  { id: "oversight", label: "Human oversight" },
  { id: "transparency", label: "Transparency" },
  { id: "fairness", label: "Fairness / Bias" },
  { id: "security", label: "Security / Robustness" },
  { id: "accountability", label: "Accountability / Auditability" },
  { id: "regulatory", label: "Regulatory exposure" }
];

window.STACKFIT_GOVERNANCE_STATUS = {
  stop: { label: "Prohibited / Stop", icon: "⛔", rank: 4 },
  mandatory: { label: "Mandatory controls", icon: "🔴", rank: 3 },
  review: { label: "Review required", icon: "🟠", rank: 2 },
  safeguard: { label: "Safeguards required", icon: "🟡", rank: 1 },
  clear: { label: "No specific blocker identified", icon: "🟢", rank: 0 }
};

window.STACKFIT_HAS_FAIRNESS_TRIGGER = function (task, answers) {
  const answerText = Object.values(answers || {}).join(" ");
  return /\b(fairness|segment(?:ation|ed|ing|s)?|discriminat(?:ion|ory|e|ed|ing)?|proxy variable(?:s)?|bias(?:ed)?|unequal treatment|disparate impact|protected group(?:s)?|equity)\b/i.test(`${task || ""} ${answerText}`);
};

window.STACKFIT_FAIRNESS_STATUS = function (baseStatus, task, answers) {
  return baseStatus === "clear" && window.STACKFIT_HAS_FAIRNESS_TRIGGER(task, answers)
    ? "safeguard"
    : baseStatus;
};

window.STACKFIT_GOVERNANCE_ASSESSMENT = function (task, answers) {
  const a = answers || {};
  const severe = (a.impact || "").startsWith("Severe");
  const high = (a.impact || "").startsWith("High");
  const sensitive = (a.data || "").startsWith("Personal");
  const regulated = (a.data || "").startsWith("Highly");
  const internal = (a.data || "").startsWith("Internal");
  const lowImpact = (a.impact || "").startsWith("Low");
  const draftOnly = (a.operation || "").startsWith("Draft or advise only");
  const autonomous = (a.operation || "").includes("without");
  const monitored = (a.operation || "").includes("monitoring");
  const lowRiskDraft = internal && lowImpact && draftOnly;
  const recruitment = /\brecruit(?:ment|ing)\b/i.test(task || "") || (/\b(?:(?:job )?applicant(?:s)?|candidate(?:s)?)\b/i.test(task || "") && /\b(?:score|scoring|rank|ranking|select|selection|reject|rejection)\b/i.test(task || ""));

  return {
    privacy: regulated ? "mandatory" : sensitive ? "review" : lowRiskDraft ? "clear" : internal ? "safeguard" : "clear",
    oversight: (severe || high || monitored || autonomous) ? "mandatory" : lowRiskDraft ? "clear" : "safeguard",
    transparency: (high || severe) ? "review" : lowRiskDraft ? "clear" : "safeguard",
    fairness: window.STACKFIT_FAIRNESS_STATUS(severe ? "mandatory" : high ? "review" : "clear", task, a),
    security: (regulated || autonomous) ? "mandatory" : sensitive ? "review" : lowRiskDraft ? "clear" : "safeguard",
    accountability: (high || severe || monitored || autonomous) ? "mandatory" : lowRiskDraft ? "clear" : "safeguard",
    regulatory: recruitment ? "mandatory" : severe || regulated ? "review" : "clear"
  };
};
