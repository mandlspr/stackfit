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
