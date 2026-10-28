import { Link } from "@tanstack/react-router";
import { CirclePlus, Lock, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Post, Reply } from "@/data/bookworm";
import { splitReplies } from "@/lib/gating";
import { EXPERIMENTS } from "@/lib/experiments";
import { useStore } from "@/lib/store";
import { PredictionBar } from "./PostCard";
import { eventById, ReactionBar, UserAvatar } from "./ui";

// Avatar on top of a thread line; clicking the line collapses everything beside it, as on Reddit.
// A line is drawn only where something nests below (`line`); a leaf collapses from its avatar instead.
function Gutter({ name, size, open, onToggle, line = true }: { name: string; size: number; open: boolean; onToggle: () => void; line?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width: size }}>
      {line ? <UserAvatar name={name} size={size} /> : (
        <button onClick={open ? onToggle : undefined} aria-label={open ? "Collapse" : undefined} className="rounded-full" tabIndex={open ? 0 : -1}>
          <UserAvatar name={name} size={size} />
        </button>
      )}
      {open && line && (
        <button onClick={onToggle} aria-label="Collapse" className="group flex w-full flex-1 justify-center pt-1.5">
          <span className="w-px bg-border transition-colors group-hover:w-0.5 group-hover:bg-foreground/40" />
        </button>
      )}
    </div>
  );
}

/** A post as a Reddit-style top-level comment, with its replies nested under it.
 *  Moment tags are solid while a moment is selected (`tags`); otherwise faint, and tapping one selects it (`onTag`). */
export function ThreadPost({ post, showChapter, tags, onTag }: {
  post: Post; showChapter: boolean; tags: boolean; onTag?: ((eventId: string) => void) | undefined;
}) {
  const { chapter } = useStore();
  const [open, setOpen] = useState(true);
  const { visible, hidden, nextUnlock } = splitReplies(post.replies, chapter ?? 0);
  return (
    <article className="flex gap-3 py-4">
      <Gutter name={post.user} size={32} open={open} onToggle={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="flex min-h-8 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
          <span className="text-[13px] font-semibold text-foreground">{post.user}</span>
          {showChapter && <span>· Ch {post.chapter}</span>}
          {post.hindsight && <span>· written in hindsight</span>}
          {post.prediction && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-prediction-soft px-2 py-0.5 font-semibold text-foreground">
              <Sparkles size={11} className="text-prediction" /> Prediction
            </span>
          )}
          {/* Moment flairs: solid while a moment is selected; otherwise quiet outlines you can tap to follow. */}
          {tags ? post.events.map((e) => (
            <span key={e} className="ml-1 rounded-full bg-event-soft px-2 py-0.5 font-semibold text-event">{eventById(e)?.title}</span>
          )) : onTag && post.events.map((e) => (
            <button key={e} onClick={() => onTag(e)} title="Show only this moment"
              className="ml-1 rounded-full px-2 py-0.5 font-medium text-muted-foreground ring-1 ring-inset ring-border transition-colors hover:bg-muted hover:text-foreground">
              {eventById(e)?.title}
            </button>
          ))}
        </header>
        {open ? (
          <>
            <p className="mt-0.5 max-w-[68ch] text-[15px] leading-6">{post.body}</p>
            {post.prediction && <PredictionBar post={post} />}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <ReactionBar id={post.id} counts={post.reactions} />
              <Link to="/post/$postId" params={{ postId: post.id }}
                className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MessageCircle size={14} /> Reply
              </Link>
            </div>
            {(visible.length > 0 || hidden.length > 0) && (
              <div className="mt-3 space-y-4">
                {visible.map((r) => <ThreadReply key={r.id} reply={r} />)}
                {hidden.length > 0 && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {EXPERIMENTS.ribbon
                      ? <span aria-hidden className="h-3 w-2 bg-ribbon" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)" }} />
                      : <Lock size={12} />} {hidden.length} more {hidden.length === 1 ? "reply unlocks" : "replies unlock"} at Chapter {nextUnlock}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <Expand onClick={() => setOpen(true)} count={visible.length + 1} />
        )}
      </div>
    </article>
  );
}

function ThreadReply({ reply }: { reply: Reply }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex gap-2">
      <Gutter name={reply.user} size={24} open={open} onToggle={() => setOpen(false)} line={false} />
      <div className="min-w-0 flex-1">
        <div className="flex min-h-6 items-center gap-1.5 text-xs">
          <span className="font-semibold">{reply.user}</span>
          <span className="text-muted-foreground">· was on Ch {reply.progress}</span>
        </div>
        {open ? <p className="max-w-[68ch] text-[14px] leading-[1.45rem]">{reply.body}</p> : <Expand onClick={() => setOpen(true)} count={1} />}
      </div>
    </div>
  );
}

function Expand({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button onClick={onClick} className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
      <CirclePlus size={14} /> {count} {count === 1 ? "comment" : "comments"} collapsed
    </button>
  );
}
