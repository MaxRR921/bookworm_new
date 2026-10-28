<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Bookworm is a no-backend prototype: all dummy data lives in src/data/bookworm.ts, app state in src/lib/store.tsx, spoiler rules in src/lib/gating.ts (tested) — keeps content easy to edit and gating in one place.
- Posts in the chapter feed and topic threads render Reddit-style (ThreadPost in Thread.tsx): no cards, nested replies, collapsible thread lines; moment tags are faint in "All discussion" (tapping one selects that moment) and solid once a moment is selected.
- Filters: moments only (characters are not filtered or tagged for now). "Group topics" on the discussion card animates the feed (MomentsFeed): cards rise into a grid, then merge into one card per moment with a post count and an accordion of that thread; "Show only this moment" sets the single event filter.
