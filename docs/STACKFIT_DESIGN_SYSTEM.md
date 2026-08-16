# StackFit Design System

This document describes the visual system implemented in `styles.css`, `index.html`, and the UI-rendering portions of `app.js`. It records the current frontend rather than proposing a new design.

## Design principles

- **Editorial decision support:** information hierarchy and scanability take priority over decoration.
- **Dark, restrained foundation:** near-black page and panel colors keep attention on task requirements, verdicts, and governance states.
- **Violet for product interaction:** violet identifies the brand, active choices, focus, labels, and primary actions.
- **Semantic color for meaning:** green, yellow, orange, and red communicate progressively stronger conditions and risks.
- **Flat structure:** surfaces are separated with tone, spacing, and thin borders rather than elevation effects.
- **Compact clarity:** small radii, concise labels, structured tables, and controlled line lengths support dense decision content.
- **Progressive disclosure:** evidence, legal context, and overlap details remain behind native disclosure controls.

## Color palette

### Foundation and typography

| Token / use | Value | Role |
|---|---:|---|
| `--paper` | `#0b0b0e` | Page background |
| `--surface` | `#121217` | Main flow shell |
| `--surface-raised` | `#17171e` | Condition summary blocks |
| Input / result background | `#0e0e13` | Text inputs and result header region |
| Choice / stack-field background | `#101015` | Interactive rows and stack-entry panels |
| `--ink` | `#f4f4f7` | Primary text |
| `--muted` | `#9b9ca8` | Supporting and explanatory text |
| `--line` | `#2a2a33` | Standard border |
| `--line-soft` | `#202027` | Subtle dividers and table rules |

### Brand and interaction

| Token / use | Value | Role |
|---|---:|---|
| `--violet` | `#8b7cf6` | Primary CTA, brand mark, labels, focus border |
| `--violet-soft` | `rgba(139, 124, 246, .14)` | Selected choice, focus ring, Medium capability |
| Hero violet | `#b8afff` | Secondary line of the main headline |
| CTA hover | `#9b8df8` | Primary-button hover state |

## Semantic status colors

Semantic treatments combine low-opacity backgrounds, restrained foreground colors, and translucent borders.

| Meaning | Foreground | Soft background | Applied to |
|---|---:|---:|---|
| Clear / sufficient / fit | `--green: #72c59c` | `--green-soft` | `.status-clear`, `.fit-good`, default verdict |
| Safeguards / High need | `--yellow: #dec56d` | `--yellow-soft` | `.status-safeguard`, `.level-high` |
| Review / partial gap | `--orange: #e39a61` | `--orange-soft` | `.status-review`, `.fit-gap`, conditional verdict, minimum-correction callout |
| Mandatory / stop / critical risk | `--red: #e77878` | `--red-soft` | `.status-mandatory`, `.status-stop`, `.fit-stop`, `.level-critical`, blocking verdict |

Capability levels use a related but distinct scale: Low is neutral gray, Medium is violet, High is yellow, and Critical is red. Verdict color is inferred from statuses in the rendered result: review or partial-gap content makes it orange; mandatory or stop content takes precedence and makes it red.

## Typography hierarchy

The system uses an Inter-like system stack without an external font dependency:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

- **Body:** `16px`, `1.55` line height, primary cool white or muted gray.
- **Hero `h1`:** fluid `43–72px`, `0.98` line height, `790` weight, tight `-.06em` tracking.
- **Screen `h2`:** fluid `29–42px`, `1.08` line height, `740` weight.
- **Result title:** fluid `44–72px`, with tighter `-.055em` tracking for verdict prominence.
- **Section `h3`:** `25px`, `720` weight, `-.035em` tracking.
- **Eyebrows and step labels:** `11px`, uppercase, violet, `760` weight, `.15em` tracking.
- **Table headers:** `10px`, uppercase, muted, `760` weight, `.11em` tracking.
- **Badges:** `11px`, `780` weight, compact `1.3` line height.
- **Supporting text:** generally `12–14px` with reduced contrast; it never competes with labels, values, or statuses.

## Spacing rhythm

The implementation uses a practical rhythm centered around 8–16px increments, with larger editorial separations:

- Compact gaps: `8–12px` for label-to-content and adjacent controls.
- Component gaps: `12–18px` for choices, cards, table headings, and disclosure rows.
- Section spacing: `22–30px` around actions, callouts, and screen content.
- Major result separation: `38–54px` in result headers and content sections.
- Fluid screen padding: `.question` and `.section` use `clamp(28px, 5vw, 50px)`; result content uses `clamp(30px, 5vw, 54px)`.
- The main layout is capped at `1060px`; primary content and flow surfaces are capped at `900px`.

## Borders

- Standard surfaces and controls use a `1px solid var(--line)` border.
- Tables and low-emphasis separation use `var(--line-soft)`.
- Status badges use translucent borders derived from their semantic foreground color.
- The minimum-correction callout adds a `3px` orange left border for emphasis.
- Header, result regions, and disclosures rely on borders rather than shadows to establish structure.

## Corner radius

Radii are deliberately small:

- `4px`: status badges, choice keys, and callouts.
- `5px`: brand mark, buttons, text inputs, choices, verdict badge, and overlap items.
- `6px`: stack fields and condition blocks.
- `8px`: the main flow shell.

The system does not use pill-shaped controls or large rounded containers.

## Shadows

Persistent component shadows are intentionally absent. Focused form controls use only a restrained `2px` violet-soft focus ring. Separation otherwise comes from border, spacing, and tonal contrast.

## Cards and surfaces

- **Flow shell:** the primary bounded workspace, using `--surface`, a thin border, and an `8px` radius.
- **Question / section panel:** shared padded content region within the flow shell.
- **Stack field:** a compact two-column-entry card with its label, input, and coverage hint.
- **Condition block:** a raised dark summary surface with a border and `6px` radius.
- **Overlap item:** a bordered detail item rendered only inside the overlap disclosure.
- **Callout:** an orange-tinted correction or alternative block, visually distinct without appearing elevated.

## Buttons and CTAs

- **Primary CTA (`.primary`):** solid violet, near-black text, `13px 20px` padding, `5px` radius, and strong weight. Hover lightens the violet; disabled state reduces opacity to `.34` and removes pointer affordance.
- **Back action (`.back`):** borderless muted text that becomes white on hover.
- **Header text action (`.text-button`):** transparent, thin-bordered, muted, and compact.
- **Choice button (`.choice`):** full-width flat row. Hover and selected states share a violet border and violet-soft background.
- **Choice key:** a fixed `27px` square marker that supports keyboard-like scanning without dominating the option text.

## Tables

The `.heatmap` pattern is used for capability profiles, stack fit, and governance status.

- Tables collapse borders and use horizontal rules rather than row cards.
- Headers are small, uppercase, muted, and left-aligned.
- Cells use `15px 14px` padding on larger screens.
- The first column carries stronger text weight and contrast.
- Supporting descriptions use reduced contrast and lighter weight.
- Capability, coverage, fit, and governance values are rendered as semantic badges for fast scanning.
- The results table sits in an overflow container so narrow screens can preserve the column model rather than distort values.

## Verdict presentation

The result begins with `.result-top`, a near-black region separated by a bottom border. Its hierarchy is:

1. Compact semantic verdict badge.
2. Large sentence-form result title.
3. Muted task summary with a controlled maximum width.

The verdict badge is green by default, orange when the result contains review or partial-gap states, and red when mandatory or stop states are present. Mandatory/stop styling takes precedence through CSS rule order.

## Technical condition and Governance condition blocks

Immediately below the verdict, `.conditions` creates a two-column summary grid. Each `.condition` block contains:

- a `10px` uppercase violet label;
- a concise cool-white condition statement;
- a raised dark surface, thin border, `20px` padding, and `6px` radius.

The pair collapses to one column below `700px` while retaining its labels and order.

## Empty-section behavior

The UI generates overlap content separately from its disclosure wrapper. `Overlap and redundancy` is rendered only when at least one overlap item exists; an empty placeholder section is not shown. Evidence and method/legal disclosures remain visible because the current implementation always supplies content for them. Hidden compliant alternatives remain in the DOM only when the blocker path creates that optional action.

## Responsive behavior

The single breakpoint is `700px`.

- Main and header padding reduce.
- Brand size reduces from `26px` to `22px`.
- Intro spacing becomes more compact.
- Stack-entry and condition grids collapse from two columns to one.
- Table cell padding reduces to `12px 8px`, while tables remain horizontally scrollable where needed.
- Supplemental capability hints marked `.hide-mobile` are hidden.
- Profile headers stack vertically.
- Result-title sizing settles at `43px`, and result-top padding is reduced.

Fluid `clamp()` sizing handles the range above and around the breakpoint for headings and major panel padding.

## Motion and interaction rules

- There are no CSS animations or transitions.
- Hover, selected, disabled, and focus states change immediately.
- Focus is shown with a violet border and restrained ring.
- Screen changes use native DOM replacement and a smooth scroll to the flow shell; there are no decorative entrance or exit animations.
- Native `<details>` elements provide disclosure behavior without custom motion.
- Interaction styling communicates state or affordance only.

## What StackFit intentionally avoids

- Heavy gradients
- Strong glow
- Decorative neon
- Large rounded SaaS cards
- Unnecessary animation
- Visual elements without decision-support value

## Reusable components

The following patterns can transfer directly to another AI governance or decision-support product:

- **Editorial application shell:** bounded content width, quiet header, and near-black foundation.
- **Task-first hero:** concise category eyebrow, decisive headline, and restrained explanatory copy.
- **One-question flow panel:** step label, focused prompt, helper text, selectable rows, and forward/back actions.
- **Semantic badge system:** shared level, governance-status, coverage, fit, and verdict treatments.
- **Decision heatmap table:** requirement, need, coverage, and fit arranged for rapid comparison.
- **Governance gate table:** governance dimension paired with an action-oriented semantic status.
- **Verdict header:** status badge, large verdict statement, and task recap.
- **Dual condition summary:** side-by-side technical and governance implications.
- **Minimum-correction callout:** restrained risk-colored action summary.
- **Progressive-disclosure evidence section:** native details/summary treatment for sources and methodology.
- **Conditional empty-state suppression:** omit optional sections when there is no decision-relevant content.
- **Stack-entry grid:** labeled component fields with compact capability hints.
