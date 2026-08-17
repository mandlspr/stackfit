# AI Stack Fit Checker — V1 Specification

## 1. Goal

Build a lightweight personal decision tool that answers:

**Can I accomplish this task with my current AI/tool stack, under what conditions, and is the stack unnecessarily complex?**

The tool must evaluate the **task first**, not start from model/vendor names.

Target hosting: **GitHub Pages**

Tech stack:
- Vanilla HTML
- Vanilla CSS
- Vanilla JavaScript
- No React
- No backend
- No database
- No authentication
- No external UI framework unless strictly necessary

## 2. Core Decision Flow

TASK → ADAPTIVE QUESTIONS → CAPABILITY REQUIREMENTS → GOVERNANCE CHECK → CURRENT STACK → STACK COVERAGE + GAPS → OVERLAP / REDUNDANCY CHECK → OVERALL VERDICT

The interface asks **one question at a time**. Do not add a progress bar.

## 3. Screen 1 — Task

Primary input:

**What are you trying to accomplish?**

Use a large text area.

After submission, ask only questions that could materially change:
- capability requirements
- governance risk
- tool category requirements
- final verdict

Avoid unnecessary questioning.

## 4. Capability Profile

Generate a visual heatmap.

Scale:
- Low
- Medium
- High
- Critical

Dimensions:
1. Reasoning
2. Reliability
3. Autonomy
4. Tool Use
5. Context
6. Knowledge / Retrieval
7. Multimodality
8. Long-horizon

Context calibration:
- When the same decision flow combines a user-provided note or input, account-level data, and additional portfolio or database context, Context must be at least `Medium`.

Long-horizon calibration:
- A short, explicitly wired deterministic workflow is `Medium`, even when it contains many steps.
- Reserve `High` for sustained goal pursuit, planning, re-evaluation, or extended autonomous execution.
- Long-horizon is independent of consequence severity. A deterministic recruitment pipeline such as CV + interview notes → scoring → ranking → threshold → rejection is `Medium`; severe impact does not raise it to High or Critical.

Tool Use calibration:
- A task that only drafts or advises from user-provided text is `Low` when it does not publish automatically, call APIs, access a database, or take external actions.
- Do not recommend `Execution / APIs` unless the task materially requires tool execution.

Do NOT classify capabilities as Required / Recommended / Nice to have.
Do NOT show specific products/models at this stage.

## 5. Governance Check

### Fairness trigger rule

If the task or user answers mention fairness, segmentation, discrimination, proxy variables, bias, or unequal treatment, `Fairness / Bias` must not default to `🟢 No specific blocker identified`.

Minimum default:
`🟡 Safeguards required`

A green status is only allowed when the tool has enough context to justify why no meaningful fairness concern applies.

Low-risk internal drafting calibration:
- For non-sensitive internal business information, low consequence of error, draft/advice-only operation, human review before publication, no customer data, and no automated publishing or external action, Privacy / Data sensitivity, Human oversight, Transparency, Security / Robustness, and Accountability / Auditability may be `🟢 No specific blocker identified`.
- Fairness / Bias and Regulatory exposure may also remain green unless a task-specific trigger exists.

Governance is a **non-compensable gate**.

A strong technical fit must never cancel a governance blocker.

Recruitment and oversight calibration:
- AI-based recruitment, candidate scoring, ranking, selection, or automated rejection sets `Regulatory exposure` to at least `🔴 Mandatory controls`.
- Automated rejection or a similarly significant decision without routine human review requires `🔴 Mandatory controls` for Human oversight: the current design is not acceptable as-is.
- Use `⛔ Prohibited / Stop` only when the use case itself is genuinely prohibited, not merely because mandatory human oversight is absent from the current design.

Evaluate:
- Privacy / Data sensitivity
- Human oversight
- Transparency
- Fairness / Bias
- Security / Robustness
- Accountability / Auditability
- Regulatory exposure

Display action-oriented statuses:
- ⛔ Prohibited / Stop
- 🔴 Mandatory controls
- 🟠 Review required
- 🟡 Safeguards required
- 🟢 No specific blocker identified

Legal references must remain hidden in the main view and appear only in details.

Potential frameworks:
- EU AI Act
- GDPR
- BetrVG

Do not pretend these frameworks use the same legal taxonomy.

## 6. Governance Confidence

Only governance receives a confidence indicator.

Values:
- High
- Medium
- Low

Rules:

**High**  
Enough information to support the classification.

**Medium**  
One unresolved point could change the governance verdict.

**Low**  
Critical information is missing. Ask another question or require human review before giving a firm recommendation.

Do not add technical-confidence scoring in V1.

## 7. Current Stack

Ask for the user's stack only **after** the task capability profile.

Use guided selection.

Suggested categories:
- LLM / Model
- CRM
- Retrieval / Search
- Database / Data layer
- Orchestration / Automation
- Human approval
- Monitoring / Observability
- Guardrails / Security
- Memory / Context
- Evaluation / Testing
- Execution / APIs
- Other

Allow multiple tools per category.

Individual stack components can be:
- Required
- Recommended
- Nice to have

Specific products are secondary and should never drive the primary analysis.

## 8. Stack Fit Heatmap

Main result should be visual, not card-heavy.

Suggested columns:

| Requirement | Task Need | Stack Coverage | Fit |
|---|---|---|---|

Example:

| Reasoning | High | Covered | ✓ |
| Reliability | Critical | Partial | ⚠ |
| Retrieval | High | Covered | ✓ |
| Human oversight | Required | Missing | ⛔ |

Stack coverage strength uses only:
- `Covered` — a relevant stack category is present and the task need is not Critical
- `Partial` — some relevant coverage exists, but the available evidence cannot establish sufficient coverage for the task need
- `Missing` — no relevant stack category is present

Coverage affects the verdict only when the task materially requires the capability. A `Low` task need is sufficient without a dedicated stack component and must not create a blocking gap. In particular, Low Autonomy, Knowledge / Retrieval, and Long-horizon needs do not require orchestration, retrieval, or memory components.

Minimum corrections must distinguish `Partial` from `Missing` coverage. When a relevant stack category is present but provides only Partial coverage, recommend strengthening, constraining, validating, or adding controls within the existing category; never say to add that category. Use `Add [category]` only when the category is genuinely missing.

Do not express stack coverage as Low / Medium / High or imply benchmark-level product performance without reliable evidence. The task requirement scale remains Low / Medium / High / Critical.

## 9. Overall Verdict

Return ONE overall verdict:
- Fit
- Fit with conditions
- Overbuilt
- Not viable

Under the verdict, separately show:

### Technical condition
What technically works or fails.

### Governance condition
What governance controls or blockers exist.

Rules:
- Governance blockers cannot be offset by technical performance.
- `Fit` requires sufficient technical coverage and no unresolved governance safeguards, reviews, mandatory controls, or blockers that materially condition deployment.
- `Fit with conditions` applies when the stack is technically sufficient or correctable and no prohibited condition exists, but governance safeguards, reviews, or mandatory controls must be resolved before or during deployment.
- A meaningful `🟠 Review required` prevents a simple `Fit`. Unresolved `🟡 Safeguards required` also produces `Fit with conditions` when the safeguards materially condition deployment.
- Aggregate the technical result and governance conditions into the verdict; do not mechanically copy a single worst status color.
- `Overbuilt` means the stack is viable but unnecessarily complex/costly.
- Do not automatically redesign the architecture when a blocker exists.

When a blocker is detected:
1. State the blocker.
2. State the minimum correction required.
3. Offer **Show compliant alternatives** as an optional action.

## 10. Overlap / Redundancy Detection

If several tools appear to cover substantially the same function, flag an overlap.

Do NOT immediately label it wasteful.

Ask:

**Why are both tools part of your stack?**

Options:
- Fallback / resilience
- Specialisation by task
- Validation / comparison
- Provider / client constraint
- Data residency / compliance
- Cost optimisation
- Latency optimisation
- Other

If `Other`, allow free text.

The justification must remain visible in the detailed result.

## 11. Overlap Impact

For each overlap, estimate:
- Cost impact
- Latency impact
- Complexity impact

If reliable numerical data exists:
- show numbers
- if sources disagree, show a range

If reliable figures do not exist:
- use Low / Medium / High

Never create false precision.

Also indicate whether the overlap contributes to the `Overbuilt` verdict.

## 12. Evidence Model

Benchmarks are **partial evidence**, never universal truth.

Examples:
- METR Time Horizons → autonomy / long-horizon evidence
- Coding benchmarks → software task evidence
- Tool-use benchmarks → action/tool-use evidence
- Factuality benchmarks → reliability evidence
- Multimodal benchmarks → multimodality evidence

Never collapse conflicting sources into one magic score.

If reliable sources conflict:
- show the disagreement
- explain which source is most relevant to the current task

## 13. Evidence Freshness

Every evidence item should have a simple freshness status:
- Current
- Aging
- Stale

Use two general internal freshness families:

### Volatile
Examples:
- pricing
- model specifications
- benchmarks
- latency
- context limits
- feature availability

These age quickly.

### Stable
Examples:
- governance frameworks
- legal principles
- methodological frameworks

These age more slowly.

### Legal / regulatory sources

Legal and regulatory evidence uses a separate internal freshness rule. Do not determine freshness from the original publication date alone.

Evaluate:
- whether the source is still in force/current
- the last official verification/check date
- whether it has been amended, superseded, or replaced

An in-force source with recently verified official status may remain `Current` even when its original publication date is old. A superseded or replaced source is `Stale`; an unverified amendment or aging official check makes it at least `Aging`.

Detailed evidence view should show:
- Source
- Publication/update date
- Last checked date
- Freshness status

A stale official source must not automatically override a more recent credible independent source.

## 14. Product / Vendor Recommendations

Exact products are a **late-stage optional output**.

Primary recommendation format:

> You need an LLM with these capabilities + these tool categories/components.

Not:

> Use Model X.

Equivalent tools in a category may be valid.

The final product choice remains the user's decision.

## 15. UX Principles

The tool is for personal use first.

Priorities:
1. Fast
2. Clear
3. Visual
4. Low cognitive load
5. Minimal number of questions
6. No unnecessary enterprise complexity

UI guidance:
- Use heatmaps as primary output
- Avoid large walls of text
- Use expandable details
- Keep legal citations behind click/details
- Keep source details behind click/details
- Keep overlap explanations behind click/details
- One question at a time
- No progress bar
- Avoid excessive cards

## 16. Suggested File Structure

```text
ai-stack-fit-checker/
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── capabilities.js
│   ├── governance.js
│   ├── tools.js
│   └── evidence.js
└── README.md
```

## 17. V1 Scope Guardrails

DO build:
- Task entry
- Adaptive question flow
- Capability heatmap
- Governance heatmap
- Governance confidence
- Guided stack selection
- Stack fit heatmap
- Overlap detection
- Overall verdict
- Expandable evidence/details
- Local in-browser state

DO NOT build in V1:
- User accounts
- Database
- Backend
- RAG pipeline
- Autonomous agent
- Complex ML scoring
- Live ingestion of dozens of benchmarks
- Universal “best AI” ranking
- Enterprise permissions
- Collaboration features
- Billing
- Admin panel

## 18. Initial Logic Can Be Rule-Based

V1 may use transparent JavaScript rules.

Prefer rules that are easy to inspect and modify over complex scoring.

Example principle:

```js
if (governanceBlocker) {
  technicalStrengthCannotOverride = true;
}
```

Prioritize explainability.

## 19. Definition of Done

V1 is successful when a user can:
1. Describe one AI-related task.
2. Answer a small number of adaptive questions.
3. See the required capability profile.
4. See any governance constraints.
5. Enter their existing stack.
6. See missing, sufficient, and overlapping components.
7. Receive one clear verdict.
8. Understand the minimum change required.
9. Inspect evidence only when desired.
10. Run the entire application as a static GitHub Pages site.

## 20. First Codex Instruction

Use this specification as the source of truth.

Build the smallest functional implementation first.

Do not add new architecture, dependencies, screens, scoring dimensions, or features unless they are required by this specification.

When a design choice is ambiguous, prefer:
- fewer dependencies
- fewer screens
- fewer questions
- clearer explanations
- easier modification
