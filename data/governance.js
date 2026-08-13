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
  return /\b(fairness|segment(?:ation|ed|ing|s)?|discriminat(?:ion|ory|e|ed|ing)?|proxy variable(?:s)?|bias(?:ed)?|unequal treatment)\b/i.test(`${task || ""} ${answerText}`);
};

window.STACKFIT_FAIRNESS_STATUS = function (baseStatus, task, answers) {
  return baseStatus === "clear" && window.STACKFIT_HAS_FAIRNESS_TRIGGER(task, answers)
    ? "safeguard"
    : baseStatus;
};
