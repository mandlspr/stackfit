window.STACKFIT_TOOL_CATEGORIES = [
  { id: "llm", label: "LLM / Model", covers: ["reasoning", "reliability", "context", "multimodality"] },
  { id: "crm", label: "CRM", covers: ["context"] },
  { id: "retrieval", label: "Retrieval / Search", covers: ["retrieval"] },
  { id: "database", label: "Database / Data layer", covers: ["context", "retrieval"] },
  { id: "orchestration", label: "Orchestration / Automation", covers: ["autonomy", "longHorizon"] },
  { id: "approval", label: "Human approval", covers: ["reliability", "oversight"] },
  { id: "monitoring", label: "Monitoring / Observability", covers: ["reliability", "accountability"] },
  { id: "guardrails", label: "Guardrails / Security", covers: ["reliability", "security"] },
  { id: "memory", label: "Memory / Context", covers: ["context", "longHorizon"] },
  { id: "evaluation", label: "Evaluation / Testing", covers: ["reliability"] },
  { id: "execution", label: "Execution / APIs", covers: ["toolUse", "autonomy"] },
  { id: "other", label: "Other", covers: [] }
];

window.STACKFIT_OVERLAP_REASONS = [
  "Fallback / resilience", "Specialisation by task", "Validation / comparison",
  "Provider / client constraint", "Data residency / compliance",
  "Cost optimisation", "Latency optimisation", "Other"
];

window.STACKFIT_COVERAGE_STATUS = function (coveringCount, taskNeed) {
  if (coveringCount === 0) return "Missing";
  return taskNeed === 4 ? "Partial" : "Covered";
};

window.STACKFIT_COVERAGE_IS_SUFFICIENT = function (coverage, taskNeed) {
  return taskNeed === 1 || coverage === "Covered";
};

window.STACKFIT_IS_BLOCKING_TECHNICAL_GAP = function (coverage, taskNeed) {
  return taskNeed >= 3 && !window.STACKFIT_COVERAGE_IS_SUFFICIENT(coverage, taskNeed);
};

window.STACKFIT_GAP_CORRECTION = function (capabilityId, capabilityLabel, coveringCategoryLabels, missingCategoryLabel) {
  if (!coveringCategoryLabels.length) return `Add ${missingCategoryLabel} coverage.`;
  if (capabilityId === "reliability") return "Reliability: strengthen validation, testing, and pre-decision human review.";
  if (capabilityId === "autonomy") return "Autonomy: constrain automated decision authority and require human approval before consequential action.";
  if (capabilityId === "toolUse") return "Tool Use: strengthen execution controls around external system actions.";
  return `${capabilityLabel}: strengthen or validate the existing ${coveringCategoryLabels.join(", ")} coverage.`;
};

window.STACKFIT_OVERALL_VERDICT = function (governance, importantGapCount, unjustifiedOverlapCount) {
  const statuses = Object.values(governance || {});
  const blocker = statuses.includes("stop");
  const mandatory = statuses.includes("mandatory");
  const viable = !blocker && importantGapCount === 0;
  if (blocker || importantGapCount > 2) return "Not viable";
  if (viable && unjustifiedOverlapCount) return "Overbuilt";
  return mandatory || importantGapCount ? "Fit with conditions" : "Fit";
};
