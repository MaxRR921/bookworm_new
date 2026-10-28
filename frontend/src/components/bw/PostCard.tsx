import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, MessageCircle, Sparkles } from "lucide-react";
import type { Post, Reply } from "@/data/bookworm";
import { splitReplies } from "@/lib/gating";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { EventPill, ReactionBar, UserAvatar } from "./ui";

export function PredictionBar({ post }: { post: Post }) {
  const { votes, vote, chapter } = useStore();
  const p = post.prediction!;
  const my = votes[post.id];
  const agree = p.agree;
  const resolved = (chapter ?? 0) >= p.resolvesAt;
  return (
    <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-prediction transition-all duration-500" style={{ width: `${agree}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{agree}% agree</span>
        {resolved && <span className="font-medium text-foreground">Resolved: {p.outcome === "correct" ? "✓ Correct" : "✗ Incorrect"}</span>}
        <span>{100 - agree}% disagree</span>
      </div>
      {!resolved && (
        <div className="flex gap-2">
          {(["agree", "disagree"] as const).map((v) => (
            <button key={v} onClick={(e) => { e.stopPropagation(); vote(post.id, v); }}
              className={cn("flex-1 rounded-full border px-3 py-1 text-xs font-medium capitalize transition",
                my === v ? "border-prediction bg-prediction-soft" : "border-border hover:bg-muted")}>
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PostBody({ post, showChapter, tags = true }: { post: Post; showChapter?: boolean | undefined; tags?: boolean | undefined }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <UserAvatar name={post.user} />
        <div className="min-w-0">
          <div className="text-sm font-semibold">{post.user}</div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {showChapter && <span>Chapter {post.chapter}</span>}
            {post.hindsight && <span className="italic text-event">Written in hindsight</span>}
            {post.mine && <span>just now</span>}
          </div>
        </div>
        {post.prediction && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-prediction-soft px-2.5 py-0.5 text-xs font-semibold text-foreground">
            <Sparkles size={12} /> Prediction
          </span>
        )}
      </div>
      {tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.events.map((e) => <EventPill key={e} id={e} />)}
        </div>
      )}
      <p className="mt-3 leading-relaxed">{post.body}</p>
      {post.prediction && <PredictionBar post={post} />}
    </>
  );
}

export function PostCard({ post, showChapter, tags, thread }: {
  post: Post; showChapter?: boolean | undefined; tags?: boolean | undefined; thread?: boolean | undefined;
}) {
  const { chapter } = useStore();
  const { visible } = splitReplies(post.replies, chapter ?? 0);
  const navigate = useNavigate();
  return (
    <div role="link" tabIndex={0} onClick={() => navigate({ to: "/post/$postId", params: { postId: post.id } })}
      className={cn("block cursor-pointer rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2",
        post.prediction ? "border-2 border-prediction" : "border-border")}>
      <PostBody post={post} showChapter={showChapter} tags={tags} />
      <div className="mt-3 flex items-center justify-between gap-2">
        <ReactionBar id={post.id} counts={post.reactions} />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle size={14} /> {visible.length}</span>
      </div>
      {thread && <ReplyThread replies={post.replies} />}
    </div>
  );
}

/** Reddit-style replies under a post: a thread line that collapses them, each reply indented under its author. */
export function ReplyThread({ replies }: { replies: Reply[] }) {
  const { chapter } = useStore();
  const [open, setOpen] = useState(true);
  const { visible, hidden, nextUnlock } = splitReplies(replies, chapter ?? 0);
  if (!visible.length && !hidden.length) return null;
  return (
    // Clicks in the thread stay here instead of opening the post.
    <div className="mt-3 flex gap-1 border-t pt-3" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Collapse replies" : "Expand replies"}
        className="group flex w-5 shrink-0 justify-center">
        <span className="w-0.5 rounded-full bg-border transition-colors group-hover:bg-event" />
      </button>
      {open ? (
        <div className="min-w-0 flex-1 space-y-3">
          {visible.map((r) => (
            <div key={r.id}>
              <div className="flex items-center gap-2 text-xs">
                <UserAvatar name={r.user} size={20} />
                <span className="font-semibold">{r.user}</span>
                <span className="text-muted-foreground">· was on Ch {r.progress}</span>
              </div>
              <p className="mt-1 pl-7 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
          {hidden.length > 0 && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={12} /> {hidden.length} more {hidden.length === 1 ? "reply unlocks" : "replies unlock"} at Chapter {nextUnlock}
            </p>
          )}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="text-xs text-muted-foreground hover:text-foreground">
          {visible.length} {visible.length === 1 ? "reply" : "replies"} collapsed
        </button>
      )}
    </div>
  );
}

export function RepliesList({ replies }: { replies: Reply[] }) {
  const { chapter } = useStore();
  const { visible, hidden, nextUnlock } = splitReplies(replies, chapter ?? 0);
  return (
    <div className="space-y-3">
      {visible.map((r) => (
        <div key={r.id} className="flex gap-3 rounded-xl bg-muted/60 p-3">
          <UserAvatar name={r.user} size={28} />
          <div>
            <div className="text-xs font-semibold">{r.user} <span className="font-normal text-muted-foreground">· was on Ch {r.progress}</span></div>
            <p className="mt-0.5 text-sm">{r.body}</p>
          </div>
        </div>
      ))}
      {hidden.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
          <Lock size={14} /> {hidden.length} {hidden.length === 1 ? "reply unlocks" : "replies unlock"} at Chapter {nextUnlock}
        </div>
      )}
      {visible.length === 0 && hidden.length === 0 && <p className="text-sm text-muted-foreground">No replies yet.</p>}
    </div>
  );
}
