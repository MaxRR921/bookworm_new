# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Readers partway through a book who want to talk about what they've read so far without being spoiled, usually right after finishing a chapter.

## Product Purpose

Bookworm is a spoiler-free discussion space for a single book, read chapter by chapter. A reader says which chapter they're on, and the discussion they see (posts, replies, characters, key moments) is limited to what they have read. Success is a reader finishing a chapter, opening Bookworm, and immediately finding conversation about what just happened, with nothing ahead of them leaking through.

## Positioning

Discussion is gated by the reader's progress and organised around the book's key moments. Unlike a subreddit or Goodreads thread, nothing past your chapter is visible, and readers can jump straight into the thread about a specific scene instead of scrolling one undifferentiated feed.

## Operating Context

- A reader picks their current chapter ("You're on Chapter N"), then reads that chapter's discussion.
- Posts are tagged with moments (book events) and characters; replies record the chapter the replier was on and unlock only when the reader reaches it.
- Readers can post, react, reply, and make predictions that others vote on and that resolve as the book progresses.

## Capabilities and Constraints

- Current stage: a pitch/demo piece. Polish of the demo flow matters most.
- No backend: all content is dummy data in `frontend/src/data/bookworm.ts`; app state lives in `frontend/src/lib/store.tsx`; spoiler rules live in `frontend/src/lib/gating.ts` and are tested.
- One demo book: *The Great Gatsby* (9 chapters). Other shelf titles are shown as unavailable.
- Web app built with TanStack Start, React and Tailwind, connected to Lovable; the branch must stay working and editable there.
- Terminology: "moments" are the book's key events; "Group topics" clusters the feed by moment.

## Brand Commitments

- Visual direction: the category standard, played straight (chosen over custom worlds on 2026-10-27). Benchmark: Reddit (new) for threaded discussion; its craft level is the bar.

## Evidence on Hand

- Demo content only: dummy posts, replies, users, predictions and reactions in `frontend/src/data/bookworm.ts`.
- No real users, testimonials, metrics or press exist. Future work must not invent them.

## Product Principles

1. Never spoil: nothing beyond the reader's chapter appears, directly or by implication.
2. Discussion first: every view exists to help a reader find and join conversation about what they just read.
3. Moments are the way in: key scenes are how readers navigate and filter discussion.
4. Demo clarity over breadth: the core flow should read instantly to someone seeing it for the first time.
