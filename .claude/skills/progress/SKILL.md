---
name: progress
description: Show where Breeze build stands. Compact, actionable status from BACKLOG.md.
---

# /progress — Breeze build status

Show where Breeze stands. Fast, compact, actionable.

## Steps

1. Read `BACKLOG.md` from the project root.
2. Parse milestones, stories, status markers (○ pending · → in progress · ✓ done · ✗ blocked).
3. Compute: total stories done / total, hours estimated / hours actual, current milestone progress, current story (the first `→` or first `○` after all `✓`).
4. Show the compact view (≤15 lines).
5. If a `Build Log` section has entries, surface the most recent 1-2.

## Output format

ALWAYS open with:

**"Here's where Breeze stands."**

Then:

```
Breeze — [milestone X of 4: name]

  [✓ or →] M1   Mobile MVP Core         [done/12 · X.Xh actual / 38h est]
  [✓ or →] M1.5 Marketing + Compliance  [done/5 · X.Xh actual / 14h est]
  [○ or →] M2   Subscription + Mechanics [done/10 · X.Xh actual / 25h est]
  [○]      M3   HR Dashboard + Launch   [done/5 · 0h actual / 13h est]

Current: #N [story title]
Status:  [→ in progress / ○ next up / ✗ blocked because X]
Hours:   X.X actual / Yh estimated for this story

Last shipped: #N-1 [story title] (Xh actual vs Yh est)
Recent log:   [last Build Log entry, if any]

Next: [exact action to take — usually "Build story #N from BACKLOG.md"]
```

If a story is blocked (✗), show the block reason from the row and recommend an action (resolve dependency, ask user, defer).

If a milestone is fully done, show next milestone's first story as Current.

If all milestones done, show:

```
Breeze — ALL MILESTONES DONE

  ✓ M1   Mobile MVP Core         [12/12 · X.Xh actual / 38h est]
  ✓ M1.5 Marketing + Compliance  [5/5 · X.Xh actual / 14h est]
  ✓ M2   Subscription + Mechanics [10/10 · X.Xh actual / 25h est]
  ✓ M3   HR Dashboard + Launch   [5/5 · X.Xh actual / 13h est]

Total: 32/32 stories · X.Xh actual / 90h est · variance: ±Xh

Next: ship to production. Run /loop /watch-app-store-review or move to /iterate.
```

## Rules

- Total output: ≤15 lines (≤25 if all-done variant).
- Hours rounded to nearest 0.5h.
- Variance = (actual - estimated). Highlight if actual > 1.3 × estimated → warning of estimation drift.
- NEVER guess status — only what BACKLOG.md says.
- If BACKLOG.md is missing → say so, suggest re-running /build to regenerate.
- If status markers are inconsistent (multiple `→` in same milestone) → flag it.

## Estimation calibration

If 5+ stories have `Actual` filled in:
- Compute average ratio (actual/estimated) across completed stories
- If ratio > 1.3 → suggest: "Tu pace real está 30%+ sobre estimación. Considera re-estimar M[next] con esa proporción."
- If ratio < 0.7 → suggest: "Estás 30%+ bajo estimación. Pace excelente."
