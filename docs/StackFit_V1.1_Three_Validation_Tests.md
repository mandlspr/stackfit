StackFit V1.1 — Three Validation Tests

Project: StackFit
Purpose: Validate that StackFit differentiates between low-risk, governed, and high-risk AI use cases
Documented by: ChatGPT · GPT-5.6 Sol
Date: 15.08.2026
Status: V1.1 validated through 3 contrast tests

1. Why these tests

StackFit was designed to answer:

Is the current AI/tool stack sufficient, proportionate, and appropriately governed for a specific task?

Three deliberately different use cases were tested:

Low-risk internal drafting

Governed operational workflow — Handshake

High-risk recruitment scoring

Goal:

Low-risk task
→ simple stack
→ low governance burden

Governed workflow
→ more complex stack
→ safeguards / review required

High-risk decision system
→ strong governance controls
→ significant regulatory exposure

2. Test 1 — Internal Marketing Draft

Task

Generate a first draft of an internal marketing announcement from a short product brief. The output is reviewed by a marketing manager before publication. No customer data, no automated publishing, and no external actions.

Answers

Question

Answer

Data

B — Internal business information

Consequence of error

A — Low impact — easy to correct

Operating mode

A — Draft or advise only

Input pattern

A — Mostly text I provide

Stack

LLM / Model
Claude Sonnet 5

Human approval
Marketing manager review

All other categories
[blank]

Final capability profile

Capability

Need

Reasoning

Medium

Reliability

Medium

Autonomy

Low

Tool Use

Low

Context

Low

Knowledge / Retrieval

Low

Multimodality

Low

Long-horizon

Low

Governance result

Area

Status

Privacy / Data sensitivity

🟢 No specific blocker identified

Human oversight

🟢 No specific blocker identified

Transparency

🟢 No specific blocker identified

Fairness / Bias

🟢 No specific blocker identified

Security / Robustness

🟢 No specific blocker identified

Accountability / Auditability

🟢 No specific blocker identified

Regulatory exposure

🟢 No specific blocker identified

Final verdict

● Fit

Technical condition:

The entered stack covers the task’s material technical requirements.

Minimum correction:

No material correction required.

What this test proved

A minimal stack can be enough.

Missing autonomy, retrieval, orchestration, or execution components are not real gaps when the task does not require them.

Low-risk internal drafting should not automatically trigger governance warnings.

Corrections triggered

Tool Use calibration

draft/advice-only tasks → Tool Use = Low unless actual execution is required.

Low-capability gap logic

Task need = Low + no dedicated component must not create a blocking gap.

Low-risk governance calibration

simple internal drafting can legitimately return green governance statuses.

3. Test 2 — Handshake Governance Workflow

Task

Analyze CSM notes to detect AI governance signals. Redact personal names before classification, classify each signal across governance dimensions, assess confidence, dynamically identify minority business segments for fairness monitoring, and route ambiguous or equity-sensitive cases for human review. Store the resulting governance signals for internal Product/Compliance monitoring.

Answers

Question

Answer

Data

C — Personal or confidential data

Consequence of error

B — Moderate impact

Operating mode

B — Act after human approval

Input pattern

C — Current or private knowledge sources

Runtime stack

LLM / Model
gpt-5-nano

Database / Data layer
Supabase

Orchestration / Automation
n8n

Human approval
CSM human review

Monitoring / Observability
Notion

Guardrails / Security
PII redaction step

Evaluation / Testing
Hoppscotch

Execution / APIs
n8n Webhook

Other
Equity Watch

Final calibrated capability profile

Capability

Need

Reasoning

Medium

Reliability

High

Autonomy

Low

Tool Use

High

Context

Medium

Knowledge / Retrieval

High

Multimodality

Low

Long-horizon

Medium

Governance result

Area

Status

Privacy / Data sensitivity

🟠 Review required

Human oversight

🟡 Safeguards required

Transparency

🟡 Safeguards required

Fairness / Bias

🟡 Safeguards required

Security / Robustness

🟠 Review required

Accountability / Auditability

🟡 Safeguards required

Regulatory exposure

🟢 No specific blocker identified

Governance confidence:

High

Final verdict

● Fit with conditions

Technical condition:

The entered stack covers the task’s material technical requirements.

Governance condition:

Technical coverage is sufficient. Governance reviews and safeguards must be addressed before deployment.

What this test proved

Handshake validated the core StackFit thesis:

A task does not need a larger or more sophisticated model simply because stronger models exist.

The prototype stack was sufficient:

gpt-5-nano
+ Supabase
+ n8n
+ CSM human review
+ Notion
+ Hoppscotch
+ n8n Webhook
+ PII redaction
+ Equity Watch

It also proved that technical fit and governance fit must remain separate.

Technical fit does not override unresolved governance conditions.

Corrections triggered

Fairness trigger

fairness / segmentation / proxy-risk must not default to green.

Legal freshness

laws must not become stale simply because the original publication date is old.

Coverage labels

use Covered / Partial / Missing.

Context calibration

user input + account data + portfolio/database context → at least Context = Medium.

Long-horizon calibration

deterministic multi-step workflows should not become High just because they contain many steps.

4. Test 3 — AI Recruitment Scoring

Task

Use AI to score job applicants based on CVs and interview notes, rank candidates, and automatically reject applicants below a defined score. Recruiters review only the remaining candidates.

Answers used

Question

Answer

Data

C — Personal or confidential data

Consequence of error

D — Severe impact — safety, rights, employment, credit or legal status

Operating mode

D — Act autonomously without routine review

Input pattern

B — Long documents or conversation history

Initial capability profile observed

Capability

Initial need

Reasoning

Medium

Reliability

Critical

Autonomy

Critical

Tool Use

Critical

Context

High

Knowledge / Retrieval

Low

Multimodality

Low

Long-horizon

Critical

Initial governance result observed

Area

Initial status

Privacy / Data sensitivity

🟠 Review required

Human oversight

⛔ Prohibited / Stop

Transparency

🟠 Review required

Fairness / Bias

🔴 Mandatory controls

Security / Robustness

🔴 Mandatory controls

Accountability / Auditability

🔴 Mandatory controls

Regulatory exposure

🟠 Review required

Governance confidence:

Medium

Problems revealed

1. Regulatory exposure too weak

🟠 Review required was too mild for AI-based recruitment scoring / ranking / rejection.

2. Human oversight wording too absolute

⛔ Prohibited / Stop implied that the entire use case was prohibited.

The intended meaning was:

The current design is not acceptable as-is without mandatory human oversight.

3. Long-horizon confused risk severity with execution complexity

The severe consequence of error pushed Long-horizon to Critical, even though:

CVs + notes
→ scoring
→ ranking
→ threshold
→ rejection

is still a deterministic pipeline.

5. V1.1 Corrections from the Recruitment Test

Recruitment / employment regulatory exposure

If the task involves:

recruitment;

candidate scoring;

ranking;

selection;

automated rejection;

then:

Regulatory exposure
≥ 🔴 Mandatory controls

Human oversight

For significant automated decisions without routine human review:

Human oversight
= 🔴 Mandatory controls

Meaning:

Current design not acceptable as-is without human oversight.

⛔ Prohibited / Stop is reserved for genuinely prohibited use cases.

Long-horizon

Impact severity must not determine long-horizon capability.

For a deterministic recruitment pipeline:

Long-horizon = Medium

High / Critical remains reserved for:

sustained goal pursuit;

adaptive planning;

re-evaluation;

extended autonomous execution.

6. Recruitment Regression Test — V1.1

Expected and validated key results:

Reliability = Critical
Context = High
Long-horizon = Medium

Fairness / Bias = 🔴 Mandatory controls
Regulatory exposure = 🔴 Mandatory controls
Human oversight = 🔴 Mandatory controls

Codex validation passed for:

Handshake

Marketing draft

Governance tests

V1 rules

No UI redesign or unrelated logic was changed.

Note: The recruitment case was validated through regression tests after the V1.1 correction. A separate final live-browser result was not yet captured after the correction.

7. Comparison

Test

Technical complexity

Governance intensity

Result

Internal marketing draft

Low

Low

Fit

Handshake

Medium

Medium / controlled

Fit with conditions

Recruitment scoring

High-impact / regulated

High

Not viable

The important result is not only the final label.

StackFit now differentiates why a task is acceptable, conditional, or problematic.

8. What the Test Suite Demonstrates

Case A — Minimalism

Simple task
+ simple stack
+ low risk
→ do not over-engineer

Case B — Governance-aware fit

Operational AI workflow
+ multiple systems
+ PII / fairness / HITL
→ technical fit
+ governance safeguards

Case C — High-risk escalation

Significant decision about people
+ automated rejection
+ employment context
→ mandatory controls
+ stronger oversight
+ higher regulatory exposure

9. Current StackFit V1.1 Status

Validated through the three contrast scenarios:

✅ low-risk drafting

✅ governed operational workflow

✅ high-risk recruitment scenario

✅ fairness trigger

✅ legal freshness logic

✅ low-capability gap handling

✅ context calibration

✅ long-horizon calibration

✅ recruitment regulatory escalation

✅ human-oversight wording

✅ non-regression tests

Known V1.1 limitation:

The question flow still relies heavily on the same core questions and is not yet fully adaptive by use case.

This is documented as a prototype limitation rather than a blocker.

10. Core Takeaway

Do not ask which AI model is strongest. Ask what is sufficient, proportionate, and appropriately governed for the task.

Marketing draft
→ minimal stack is enough

Handshake
→ Fit with conditions; technical coverage is sufficient, but governance reviews and safeguards must be addressed

Recruitment scoring
→ Not viable; stronger governance controls are mandatory
