(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const flow = $("#flow");
  const state = { task: "", answers: {}, capabilities: {}, governance: {}, stack: {}, overlaps: [] };
  let questionIndex = 0;

  const questions = [
    { id: "data", title: "What kind of data will it handle?", helper: "This changes privacy, security, and hosting requirements.", choices: ["Public or non-sensitive", "Internal business information", "Personal or confidential data", "Highly sensitive or regulated data"] },
    { id: "impact", title: "What happens if the output is wrong?", helper: "Think about the real-world consequence, not just output quality.", choices: ["Low impact — easy to correct", "Moderate impact — time or money lost", "High impact — affects people or important decisions", "Severe impact — safety, rights, employment, credit or legal status"] },
    { id: "operation", title: "How should the system operate?", helper: "Choose the highest level of independence you need.", choices: ["Draft or advise only", "Act after human approval", "Act autonomously with monitoring", "Act autonomously without routine review"] },
    { id: "inputs", title: "What must it work with?", helper: "Choose the input pattern closest to your task.", choices: ["Mostly text I provide", "Long documents or conversation history", "Current or private knowledge sources", "Text plus images, audio or other media"] }
  ];

  function esc(value) { const el = document.createElement("div"); el.textContent = value || ""; return el.innerHTML; }
  function button(label = "Continue", disabled = false) { return `<button class="primary" type="button" data-next ${disabled ? "disabled" : ""}>${label} →</button>`; }
  function setScreen(html) { flow.innerHTML = html; window.scrollTo({ top: Math.max(0, flow.offsetTop - 24), behavior: "smooth" }); }

  function taskScreen() {
    setScreen(`<form class="question" id="taskForm"><span class="step-label">Your task</span><h2>What are you trying to accomplish?</h2><p class="helper">Describe the outcome, who it affects, and what the system should do.</p><textarea id="taskInput" required minlength="12" placeholder="For example: Review incoming support requests, suggest a response using our help centre, and let an agent approve it before sending.">${esc(state.task)}</textarea><div class="actions"><span></span><button class="primary" type="submit" data-next ${state.task.trim() ? "" : "disabled"}>Check this task →</button></div></form>`);
    const input = $("#taskInput"), next = $("[data-next]");
    input.addEventListener("input", () => { state.task = input.value; next.disabled = input.value.trim().length < 12; });
    $("#taskForm").addEventListener("submit", e => { e.preventDefault(); state.task = input.value.trim(); questionIndex = 0; questionScreen(); });
  }

  function questionScreen() {
    const q = questions[questionIndex];
    setScreen(`<div class="question"><span class="step-label">Task check · ${questionIndex + 1} of ${questions.length}</span><h2>${q.title}</h2><p class="helper">${q.helper}</p><div class="choices">${q.choices.map((choice, i) => `<button class="choice ${state.answers[q.id] === choice ? "selected" : ""}" data-choice="${i}" type="button"><span class="choice-key">${String.fromCharCode(65+i)}</span>${choice}</button>`).join("")}</div><div class="actions"><button class="back" data-back type="button">← Back</button>${button(questionIndex === questions.length - 1 ? "Build capability profile" : "Continue", !state.answers[q.id])}</div></div>`);
    document.querySelectorAll("[data-choice]").forEach(el => el.addEventListener("click", () => { state.answers[q.id] = q.choices[Number(el.dataset.choice)]; questionScreen(); }));
    $("[data-next]").addEventListener("click", () => { if (++questionIndex < questions.length) questionScreen(); else buildAssessment(); });
    $("[data-back]").addEventListener("click", () => { if (questionIndex === 0) taskScreen(); else { questionIndex--; questionScreen(); } });
  }

  function buildAssessment() {
    const text = state.task.toLowerCase();
    const levels = Object.fromEntries(STACKFIT_CAPABILITIES.map(c => [c.id, 1]));
    const raise = (ids, level) => ids.forEach(id => levels[id] = Math.max(levels[id], level));
    raise(["reasoning"], /analy|decid|plan|strateg|research|diagnos|review/.test(text) ? 2 : 1);
    raise(["reliability"], state.answers.impact.startsWith("High") ? 3 : state.answers.impact.startsWith("Severe") ? 4 : 2);
    if (state.answers.operation.includes("approval")) raise(["toolUse", "reliability"], 3);
    if (state.answers.operation.includes("monitoring")) raise(["autonomy", "toolUse", "longHorizon"], 3);
    if (state.answers.operation.includes("without")) raise(["autonomy", "toolUse", "longHorizon", "reliability"], 4);
    if (state.answers.inputs.startsWith("Long")) raise(["context", "longHorizon"], 3);
    if (state.answers.inputs.startsWith("Current")) raise(["retrieval", "toolUse"], 3);
    if (state.answers.inputs.includes("images")) raise(["multimodality"], 3);
    if (/image|audio|video|scan|photo|voice/.test(text)) raise(["multimodality"], 3);
    if (/api|send|publish|update|create|execute|automat|agent/.test(text)) raise(["toolUse"], 3);
    if (/multi.step|workflow|ongoing|monitor|project/.test(text)) raise(["longHorizon"], 3);
    state.capabilities = levels;
    buildGovernance();
    profileScreen();
  }

  function buildGovernance() {
    const a = state.answers, severe = a.impact.startsWith("Severe"), high = a.impact.startsWith("High"), sensitive = a.data.startsWith("Personal"), regulated = a.data.startsWith("Highly");
    const autonomous = a.operation.includes("without"), monitored = a.operation.includes("monitoring");
    state.governance = {
      privacy: regulated ? "mandatory" : sensitive ? "review" : a.data.startsWith("Internal") ? "safeguard" : "clear",
      oversight: severe && autonomous ? "stop" : (severe || high || monitored || autonomous) ? "mandatory" : "safeguard",
      transparency: (high || severe) ? "review" : "safeguard",
      fairness: severe ? "mandatory" : high ? "review" : "clear",
      security: (regulated || autonomous) ? "mandatory" : sensitive ? "review" : "safeguard",
      accountability: (high || severe || monitored || autonomous) ? "mandatory" : "safeguard",
      regulatory: severe ? "review" : regulated ? "review" : "clear"
    };
    state.governanceConfidence = (severe || regulated) ? "Medium" : "High";
  }

  function profileScreen() {
    const rows = STACKFIT_CAPABILITIES.map(c => `<tr><td>${c.label}<small class="hide-mobile"><br>${c.hint}</small></td><td><span class="level level-${STACKFIT_LEVELS[state.capabilities[c.id]-1].toLowerCase()}">${STACKFIT_LEVELS[state.capabilities[c.id]-1]}</span></td></tr>`).join("");
    const gov = STACKFIT_GOVERNANCE.map(g => { const key = state.governance[g.id], s = STACKFIT_GOVERNANCE_STATUS[key]; return `<tr><td>${g.label}</td><td><span class="status status-${key}">${s.icon} ${s.label}</span></td></tr>`; }).join("");
    setScreen(`<div class="section"><div class="profile-head"><div><span class="step-label">Task profile</span><h2>What this task demands</h2></div><span class="confidence">Governance confidence <strong>${state.governanceConfidence}</strong></span></div><table class="heatmap"><thead><tr><th>Capability</th><th>Task need</th></tr></thead><tbody>${rows}</tbody></table><h3>Governance gate</h3><p class="subtle">Controls here cannot be offset by stronger technical performance.</p><table class="heatmap"><thead><tr><th>Area</th><th>Status</th></tr></thead><tbody>${gov}</tbody></table><details><summary>Why these governance statuses?</summary><p>This rule-based check uses your data sensitivity, consequence of error, and level of autonomy. It is a screening aid, not legal advice.</p><p><strong>Possible frameworks to review:</strong> GDPR for personal data; the EU AI Act for regulated AI uses; and BetrVG where workplace deployment and employee representation are relevant. These frameworks have distinct scopes and taxonomies.</p></details><div class="actions"><button class="back" data-back type="button">← Change answers</button>${button("Add my current stack")}</div></div>`);
    $("[data-back]").addEventListener("click", () => { questionIndex = questions.length - 1; questionScreen(); });
    $("[data-next]").addEventListener("click", stackScreen);
  }

  function stackScreen() {
    setScreen(`<div class="section"><span class="step-label">Current stack</span><h2>What tools do you already use?</h2><p class="helper">Enter names only where relevant. Separate multiple tools with commas. Products help assess coverage, but do not drive the task requirements.</p><div class="stack-grid">${STACKFIT_TOOL_CATEGORIES.map(c => `<div class="stack-field"><label for="stack-${c.id}">${c.label}</label><input id="stack-${c.id}" data-stack="${c.id}" type="text" value="${esc(state.stack[c.id] || "")}" placeholder="${c.id === "llm" ? "e.g. your current model" : "Optional"}"><small>${c.covers.length ? "Covers: " + c.covers.map(x => (STACKFIT_CAPABILITIES.find(c => c.id === x) || {label:x}).label).join(", ") : "Use for uncategorised components"}</small></div>`).join("")}</div><div class="actions"><button class="back" data-back type="button">← Capability profile</button>${button("Check stack fit")}</div></div>`);
    $("[data-back]").addEventListener("click", profileScreen);
    $("[data-next]").addEventListener("click", () => { document.querySelectorAll("[data-stack]").forEach(i => state.stack[i.dataset.stack] = i.value.trim()); detectOverlaps(); });
  }

  function detectOverlaps() {
    state.overlaps = STACKFIT_TOOL_CATEGORIES.filter(c => (state.stack[c.id] || "").split(",").filter(x => x.trim()).length > 1).map(c => ({ category: c.id, label: c.label, tools: state.stack[c.id].split(",").map(x => x.trim()).filter(Boolean), reason: "" }));
    if (state.overlaps.length) overlapScreen(0); else resultsScreen();
  }

  function overlapScreen(index) {
    const overlap = state.overlaps[index];
    setScreen(`<div class="question"><span class="step-label">Overlap check · ${index+1} of ${state.overlaps.length}</span><h2>Why are both tools part of your stack?</h2><p class="helper"><strong>${overlap.label}:</strong> ${overlap.tools.map(esc).join(" + ")}. Multiple tools may be justified; this helps assess the impact.</p><div class="choices">${STACKFIT_OVERLAP_REASONS.map((r,i) => `<button class="choice ${overlap.reason === r ? "selected" : ""}" data-choice="${i}" type="button"><span class="choice-key">${String.fromCharCode(65+i)}</span>${r}</button>`).join("")}</div><input id="otherReason" type="text" placeholder="Explain the other reason" value="${overlap.other || ""}" ${overlap.reason === "Other" ? "" : "hidden"}><div class="actions"><button class="back" data-back type="button">← Stack</button>${button(index === state.overlaps.length - 1 ? "See results" : "Continue", !overlap.reason)}</div></div>`);
    document.querySelectorAll("[data-choice]").forEach(el => el.addEventListener("click", () => { overlap.reason = STACKFIT_OVERLAP_REASONS[Number(el.dataset.choice)]; overlapScreen(index); }));
    const other = $("#otherReason"); if (other) other.addEventListener("input", () => overlap.other = other.value);
    $("[data-back]").addEventListener("click", stackScreen);
    $("[data-next]").addEventListener("click", () => { if (other) overlap.other = other.value; if (index + 1 < state.overlaps.length) overlapScreen(index + 1); else resultsScreen(); });
  }

  function assessCoverage() {
    const active = STACKFIT_TOOL_CATEGORIES.filter(c => state.stack[c.id]);
    return STACKFIT_CAPABILITIES.map(cap => {
      const covering = active.filter(c => c.covers.includes(cap.id));
      const need = state.capabilities[cap.id];
      const coverage = covering.length ? 3 : 1;
      return { cap, need, covering, coverage, fit: coverage >= Math.min(need, 3) };
    });
  }

  function freshness(item) {
    const years = (new Date("2026-08-13") - new Date(item.date)) / 31557600000;
    if (item.family === "volatile") return years <= 1 ? "Current" : years <= 2 ? "Aging" : "Stale";
    return years <= 3 ? "Current" : years <= 7 ? "Aging" : "Stale";
  }

  function resultsScreen() {
    const coverage = assessCoverage(), importantGaps = coverage.filter(r => r.need >= 3 && !r.fit);
    const blocker = Object.values(state.governance).includes("stop");
    const mandatory = Object.values(state.governance).includes("mandatory");
    const unjustified = state.overlaps.filter(o => !["Fallback / resilience","Specialisation by task","Validation / comparison","Provider / client constraint","Data residency / compliance"].includes(o.reason));
    const viable = !blocker && importantGaps.length === 0;
    const verdict = blocker || importantGaps.length > 2 ? "Not viable" : viable && unjustified.length ? "Overbuilt" : (mandatory || importantGaps.length) ? "Fit with conditions" : "Fit";
    const tech = importantGaps.length ? `Missing sufficient coverage for ${importantGaps.map(r => r.cap.label).join(", ")}.` : "The entered stack covers the task’s material technical requirements.";
    const gov = blocker ? "Stop: autonomous use is not acceptable for a severe-impact task without routine human review." : mandatory ? "Proceed only with the mandatory controls shown below." : "No governance blocker was identified; apply the listed safeguards.";
    const rows = coverage.map(r => `<tr><td>${r.cap.label}</td><td><span class="level level-${STACKFIT_LEVELS[r.need-1].toLowerCase()}">${STACKFIT_LEVELS[r.need-1]}</span></td><td>${r.covering.length ? `<span class="level level-high">High</span> ${r.covering.map(c => esc(state.stack[c.id])).join(", ")}` : "Missing"}</td><td><span class="fit ${r.fit ? "fit-good" : r.need >= 3 ? "fit-stop" : "fit-gap"}">${r.fit ? "✓ Sufficient" : r.need >= 3 ? "⛔ Gap" : "⚠ Limited"}</span></td></tr>`).join("");
    const minFix = blocker ? "Add mandatory human approval before consequential action and obtain a qualified governance review." : importantGaps.length ? `Add ${importantGaps.map(r => categoryFor(r.cap.id)).join(", ")} coverage, then reassess.` : unjustified.length ? "Remove or justify overlapping components that do not add resilience, specialisation, validation, or compliance value." : "No material correction required.";
    const overlapHtml = state.overlaps.length ? state.overlaps.map(o => `<div class="overlap"><strong>${o.label}: ${o.tools.map(esc).join(" + ")}</strong><p>Reason: ${esc(o.reason === "Other" ? o.other || "Other (not specified)" : o.reason)}</p><p>Estimated impact — Cost: Medium · Latency: Low · Complexity: Medium. ${unjustified.includes(o) ? "Contributes to Overbuilt verdict." : "Does not by itself imply waste."}</p></div>`).join("") : "<p>No same-category overlap detected.</p>";
    const evidence = STACKFIT_EVIDENCE.map(e => `<li><strong>${e.title}</strong> — ${e.supports}<br><small>Source: ${e.source} · Updated: ${e.date} · Last checked: ${e.checked} · ${freshness(e)}</small></li>`).join("");
    setScreen(`<div class="results"><div class="result-top"><span class="verdict">● ${verdict}</span><h2>Your stack is ${verdict.toLowerCase()}.</h2><p>${esc(state.task)}</p></div><div class="conditions"><div class="condition"><small>Technical condition</small><p>${tech}</p></div><div class="condition"><small>Governance condition</small><p>${gov}</p></div></div><div class="results-body"><h3>Stack fit</h3><p class="subtle">Task needs compared with category-level coverage in your current stack.</p><div style="overflow-x:auto"><table class="heatmap"><thead><tr><th>Requirement</th><th>Task need</th><th>Stack coverage</th><th>Fit</th></tr></thead><tbody>${rows}</tbody></table></div><div class="callout"><strong>Minimum correction</strong><br>${minFix}</div>${blocker ? '<button class="primary" type="button" id="alternatives">Show compliant alternatives</button><div id="alternativeText" hidden class="callout">Use a human-approval component, auditable decision logs, access controls, and a system that drafts rather than executes the consequential decision. Equivalent tools in each category may be valid.</div>' : ""}<h3>Governance gate <span class="confidence">Confidence: <strong>${state.governanceConfidence}</strong></span></h3><table class="heatmap"><tbody>${STACKFIT_GOVERNANCE.map(g => { const k=state.governance[g.id],s=STACKFIT_GOVERNANCE_STATUS[k]; return `<tr><td>${g.label}</td><td><span class="status status-${k}">${s.icon} ${s.label}</span></td></tr>`; }).join("")}</tbody></table><details><summary>Overlap and redundancy</summary>${overlapHtml}</details><details><summary>Evidence and freshness</summary><p>Evidence supports individual dimensions and is not combined into a universal score. No live product benchmark or pricing claims are used.</p><ul>${evidence}</ul></details><details><summary>Method and legal context</summary><p>This V1 uses inspectable task and category rules. Governance is a non-compensable gate. GDPR, the EU AI Act, and BetrVG may be relevant in different circumstances; they do not share a legal taxonomy. This result is a screening aid, not legal advice.</p></details><div class="actions"><button class="back" data-back type="button">← Edit stack</button><button class="primary" data-restart type="button">Check another task</button></div></div></div>`);
    if ($("#alternatives")) $("#alternatives").addEventListener("click", () => { $("#alternativeText").hidden = false; $("#alternatives").hidden = true; });
    $("[data-back]").addEventListener("click", stackScreen); $("[data-restart]").addEventListener("click", reset);
  }

  function categoryFor(capId) { const c = STACKFIT_TOOL_CATEGORIES.find(x => x.covers.includes(capId)); return c ? c.label : capId; }
  function reset() { state.task=""; state.answers={}; state.stack={}; state.overlaps=[]; questionIndex=0; $("#intro").hidden=false; $("#resetButton").hidden=true; taskScreen(); }
  $("#resetButton").addEventListener("click", reset);
  $("#resetButton").hidden = false;
  taskScreen();
})();
