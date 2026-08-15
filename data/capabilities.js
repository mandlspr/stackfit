window.STACKFIT_CAPABILITIES = [
  { id: "reasoning", label: "Reasoning", hint: "Analysis, planning and judgment" },
  { id: "reliability", label: "Reliability", hint: "Consistent, verifiable output" },
  { id: "autonomy", label: "Autonomy", hint: "Work without step-by-step direction" },
  { id: "toolUse", label: "Tool Use", hint: "Act through tools and APIs" },
  { id: "context", label: "Context", hint: "Handle long or connected inputs" },
  { id: "retrieval", label: "Knowledge / Retrieval", hint: "Find current or private information" },
  { id: "multimodality", label: "Multimodality", hint: "Work across text, image or audio" },
  { id: "longHorizon", label: "Long-horizon", hint: "Sustain multi-step work" }
];

window.STACKFIT_LEVELS = ["Low", "Medium", "High", "Critical"];

window.STACKFIT_CONTEXT_LEVEL = function (task) {
  const text = task || "";
  const hasUserInput = /\b(user[- ]provided|note|input|submission|message)\b/i.test(text);
  const hasAccountData = /\b(account[- ]level|account data|account record|customer account)\b/i.test(text);
  const hasAdditionalContext = /\b(portfolio|database|supabase|data context)\b/i.test(text);
  return hasUserInput && hasAccountData && hasAdditionalContext ? 2 : 1;
};

window.STACKFIT_LONG_HORIZON_LEVEL = function (task) {
  const text = task || "";
  if (/\b(sustained goal pursuit|extended autonomous execution|re-evaluat(?:e|es|ion|ing)|reassess(?:ment|es|ing)?|long-running autonomous|adaptive planning)\b/i.test(text)) return 3;
  const deterministicRecruitmentFlow = /\b(score|scoring|rank|ranking)\b/i.test(text) && /\b(reject|rejection|threshold)\b/i.test(text);
  if (deterministicRecruitmentFlow || /\b(workflow|pipeline|multi-step|webhook|redaction|merge)\b|→/i.test(text)) return 2;
  return 1;
};

window.STACKFIT_TOOL_USE_LEVEL = function (task, answers) {
  const text = task || "";
  const operation = (answers && answers.operation) || "";
  const draftOnly = operation.startsWith("Draft or advise only");
  const affirmativeText = text.replace(/\b(?:no|without)\b[^.?!]*/gi, "");
  const requiresExecution = /\b(api|webhook|send|publish|deploy|update (?:a |the )?(?:record|database|crm)|execute|automated? publishing|external action|database access)\b/i.test(affirmativeText);
  return draftOnly && !requiresExecution ? 1 : requiresExecution ? 3 : 1;
};

window.STACKFIT_CAPABILITY_ASSESSMENT = function (task, answers) {
  const a = answers || {};
  const text = (task || "").toLowerCase();
  const levels = Object.fromEntries(window.STACKFIT_CAPABILITIES.map(capability => [capability.id, 1]));
  const raise = (ids, level) => ids.forEach(id => levels[id] = Math.max(levels[id], level));

  raise(["reasoning"], /analy|decid|plan|strateg|research|diagnos|review/.test(text) ? 2 : 1);
  raise(["reliability"], (a.impact || "").startsWith("High") ? 3 : (a.impact || "").startsWith("Severe") ? 4 : 2);
  if ((a.operation || "").includes("approval")) raise(["toolUse", "reliability"], 3);
  if ((a.operation || "").includes("monitoring")) raise(["autonomy", "toolUse"], 3);
  if ((a.operation || "").includes("without")) raise(["autonomy", "toolUse", "reliability"], 4);
  if ((a.inputs || "").startsWith("Long")) raise(["context"], 3);
  if ((a.inputs || "").startsWith("Current")) raise(["retrieval", "toolUse"], 3);
  if ((a.inputs || "").includes("images")) raise(["multimodality"], 3);
  if (/image|audio|video|scan|photo|voice/.test(text)) raise(["multimodality"], 3);
  raise(["toolUse"], window.STACKFIT_TOOL_USE_LEVEL(task, a));
  raise(["context"], window.STACKFIT_CONTEXT_LEVEL(task));
  raise(["longHorizon"], window.STACKFIT_LONG_HORIZON_LEVEL(task));
  return levels;
};
