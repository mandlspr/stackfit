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
