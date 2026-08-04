---
name: create-feature
description: >-
  Implement new or materially redesigned user-facing UI in the trackmyprop
  desktop renderer when the user requested code changes. Use for pages,
  sections, components, multi-state flows, and redesigns under apps/desktop.
  Do not use for read-only reviews or audits, pure diagnosis, narrow
  single-rule fixes, mechanical refactors, backend- or native-first work, or
  marketing UI.
---

# Create a Desktop Feature

Ship renderer UI through the existing trackmyprop product system. Keep this
skill focused on orchestration; let the project's canonical documents, source,
tests, and narrow specialist skills own implementation doctrine.

## Authority

Apply sources in this order:

1. The user's request and [AGENTS.md](../../../AGENTS.md).
2. Product, architecture, ADR, context, and rule documents.
3. Shipping source code and tests in the affected surface.
4. Generic skills and external guidance.

When sources disagree, follow the higher authority and record a genuine
conflict instead of blending both rules.

## Route and Scope

1. Resolve the repository from the current Git root.
2. Confirm that the request authorizes implementation in the desktop renderer.
3. Select one track:
   - **Build:** add a new component, page, section, or user flow.
   - **Redesign:** materially change a shipping surface or interaction model.
4. Name the owned renderer surface and the user outcome.
5. Inspect `git status` and preserve unrelated work.
6. Re-route when backend, native, diagnosis, audit, or marketing work becomes
   the dominant risk rather than stretching this workflow.

Compress the workflow for an obvious local edit. Do not turn a small change
into a redesign or repository-wide cleanup.

## Load Context Progressively

Always read:

- [AGENTS.md](../../../AGENTS.md)
- [desktop surface context](../../../apps/desktop/CONTEXT.md)
- [desktop UI consistency](../../../docs/agent-rules/ui-consistency.md)
- [docs maintenance](../../../docs/agent-rules/docs-maintenance.md)

Load only when relevant:

- Read [PRODUCT.md](../../../PRODUCT.md) and the relevant product sections of
  [DESIGN.md](../../../DESIGN.md) when choosing product or visual direction.
- Search [the desktop glossary](../../../apps/desktop/GLOSSARY.md) for the
  feature nouns, surface names, and owners. Read the matching section rather
  than the whole file.
- Read `ARCHITECTURE.md`, root `CONTEXT.md`, `CONTEXT-MAP.md`, and relevant ADRs
  when data ownership, RPC, preload, native, or cross-surface behavior changes.
- Read `.agents/rules/dev-servers.md` before any development-server decision.
- Read package scripts and nearby tests before selecting verification commands.

## Catalyze Specialist Skills

This skill owns orchestration, not every discipline. After recon, invoke each
needed specialist by reading and applying its `SKILL.md`; naming it does not
count.

Use the current agent by default. Spawn a specialist subagent only for bounded,
independent analysis or review; give it exact artifacts and consolidate its
result before editing.

Start with zero to two specialists. Use more only when separate material risks
have separate owners. Never stack broad and narrow skills over one concern or
add neighboring skills merely because the user named one.

| Need | Route |
| --- | --- |
| Shared primitive, registry operation, or unfamiliar shadcn/Base UI API | [`shadcn`](../shadcn/SKILL.md) |
| Forms, keyboard behavior, semantics, or accessibility | [`better-accessibility`](../better-accessibility/SKILL.md) |
| Layout or responsive structure | [`better-layout`](../better-layout/SKILL.md) |
| Copy, typography, or color | [`better-writing`](../better-writing/SKILL.md), [`better-typography`](../better-typography/SKILL.md), or [`better-colors`](../better-colors/SKILL.md) |
| Visual polish, icons, or hover and press detail | [`better-ui`](../better-ui/SKILL.md) |
| Bespoke gestures, springs, drag, clip-path, or physical motion | [`emil-design-eng`](../emil-design-eng/SKILL.md), narrowly scoped |
| Motion jank, measurement, scrolling, paint, or layer risk | [`fixing-motion-performance`](../fixing-motion-performance/SKILL.md) |
| Review after nontrivial motion changes | [`review-animations`](../review-animations/SKILL.md) |
| Audio, predictive prefetch, morphing icons, or complex presence/container motion | Relevant sections of [`userinterface-wiki`](../userinterface-wiki/SKILL.md) |
| Reusable API, boolean-prop growth, compound component, or provider architecture | [`vercel-composition-patterns`](../vercel-composition-patterns/SKILL.md) |
| Demonstrated waterfall, bundle, rendering, subscription, or re-render risk | [`vercel-react-best-practices`](../vercel-react-best-practices/SKILL.md) |
| Nontrivial test design, mocks, fixtures, or configuration | [`vitest`](../vitest/SKILL.md), after checking the installed version |

Do not hide alternate top-level workflows inside this one:

- Route read-only UI surface audits to [`improve-ui`](../improve-ui/SKILL.md)
  and broader codebase audits or roadmaps to [`improve`](../improve/SKILL.md).
- Use [`better-interface`](../better-interface/SKILL.md) and
  [`grill-me`](../grill-me/SKILL.md) only when the user invokes them.
- Keep [`impeccable`](../impeccable/SKILL.md),
  [`frontend-design`](../frontend-design/SKILL.md), and
  [`ui-skills-root`](../ui-skills-root/SKILL.md) as alternate workflows.
- Never automatically route the legacy broad
  [`make-interfaces-feel-better`](../make-interfaces-feel-better/SKILL.md) or
  [`fixing-accessibility`](../fixing-accessibility/SKILL.md); their current
  owners are `better-ui` and `better-accessibility`.
- Use [`animation-vocabulary`](../animation-vocabulary/SKILL.md) only to name an
  effect the user cannot identify, not as motion implementation guidance.
- Route an explicit public-web standards audit to
  [`web-design-guidelines`](../web-design-guidelines/SKILL.md), outside ordinary
  desktop implementation.

## Workflow

### 1. Recon

- Inspect the named or current shipping surface before planning.
- Search by feature noun across the renderer, glossary, tests, and shared
  primitives before creating anything.
- Trace the nearest owner, all entry points to the affected entity, the data
  source, and the renderer/preload/native boundary.
- Reuse the nearest shipping component and interaction grammar. Prefer
  importing or extending its owner over copying markup.
- Identify the states that apply: loading, empty, partial, error, disabled,
  permission, saving, success, keyboard, reduced-motion, and narrow layout.
- Capture rendered evidence from an existing beta or Helium tab when useful.
  Never start local development solely to obtain a screenshot.

### 2. Resolve Material Uncertainty

Infer placement, data ownership, existing primitives, and routine states from
the repository. Ask one question only when different answers materially change
behavior, scope, data, or design direction. Offer two or three choices with a
recommendation.

For a redesign, separate settled improvements from genuine taste forks. The
original implementation request already authorizes ordinary work; do not add a
blanket confirmation gate.

### 3. Plan

Record a compact plan containing:

- user outcome and acceptance criteria
- files to create, modify, or delete
- existing owner or pattern to reuse
- component and data flow
- relevant states and motion decision
- tests and verification route
- visual-QA route
- documentation and glossary decisions

Keep the plan internal for an obvious local change. Share it when the work is
high-risk, spans multiple systems, contains a design fork, or the user asks to
review it first.

### 4. Implement

- Work only inside the accepted surface and required supporting layers.
- Follow the canonical product and renderer documents instead of restating
  their detailed rules here.
- Preserve existing component ownership and interaction grammar.
- Add or update tests with behavior, not after it.
- Re-route or pause if backend/native work becomes the primary feature rather
  than a subordinate implementation tail.
- Do not fix unrelated audit findings while passing through the code.

### 5. Focused Review

- Review the final diff against desktop context and UI consistency.
- Exercise the relevant states, entry points, keyboard path, and narrow layout.
- Invoke only specialists justified by the touched behavior.
- Fix high-confidence findings owned by the change. Report uncertain or
  unrelated findings without expanding scope.

Run Shadscan only for shared primitives, broad accessibility or design-system
changes, or an explicit user request. When used, compare the same pinned
version and coverage before and after. Block only applicable findings
introduced or exposed by the owned change; never require a repository-wide
100/A score.

### 6. Maintain Docs and Vocabulary

Apply [docs maintenance](../../../docs/agent-rules/docs-maintenance.md) before
final verification.

Update [the desktop glossary](../../../apps/desktop/GLOSSARY.md) only when the
change adds or renames durable vocabulary, ownership, a section, navigation,
an RPC concept, or a cross-surface primitive. Do not turn it into a component
inventory and do not create an HTML mirror.

### 7. Verify

Use targeted checks while iterating. Before completion, run:

```bash
bun run verify:desktop
```

Add the relevant surface gate when supporting layers changed:

- Docs: `bun run --cwd docs-site build`
- Backend: targeted tests, then `bun run verify:backend`
- Rust/native: targeted tests plus the applicable Rust gate or the cargo check
  required by `AGENTS.md`
- Marketing/root: the relevant root typecheck, lint, tests, or marketing gate
- Agent guidance: `bun run verify:agent-assets`

For observable UI, reuse an existing Helium or product tab when available.
Check affected states, light/dark, interface presets when tokens or selection
changed, narrow width, relevant sidebar states, measurements, and console
errors. If no representative surface is running and local development was not
requested, report that visual QA was not run.

When a check fails, fix the cause and rerun it while safe progress remains. Do
not use an arbitrary retry count. Stop only when further progress requires a
material user choice, new authority, unavailable external state, or a genuine
verification blocker.

### 8. Report

Report the user-visible outcome, important boundary changes, verification and
visual QA, docs and glossary decisions, and genuine blockers.

Do not auto-commit, push, deploy, or start local development. Follow
`AGENTS.md` for the complete safety and release policy.
