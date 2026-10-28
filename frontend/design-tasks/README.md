# Design tasks

Bookworm-specific styling, tried one concept at a time on top of the clean base look.
Each concept sits behind a flag in `src/lib/experiments.ts`; flip it to `false` to see the base look again.

Mark a concept by editing its **Status** (here and in its file): `keep` or `dead`.

| # | Concept | Impeccable command | Flag | Status |
|---|---|---|---|---|
| 01 | [Reading ribbon](01-reading-ribbon.md) | `delight` | `ribbon` | testing |
| 02 | [Book type for reading text](02-book-type.md) | `typeset` | — | queued |
| 03 | [Bookcloth colour](03-bookcloth-colour.md) | `colorize` | — | queued |
| 04 | [Chapter progress spine](04-chapter-spine.md) | `delight` | — | queued |

**Workflow:** `queued` → `testing` (built behind its flag) → you mark `keep` (flag removed, concept becomes default) or `dead` (code and flag deleted).
