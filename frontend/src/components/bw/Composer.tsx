import { useState } from "react";
import type { CharacterId } from "@/data/bookworm";
import { visibleCharacters, visibleEvents } from "@/lib/gating";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Modal } from "./ui";

export function Composer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chapter, addPost } = useStore();
  const ch = chapter ?? 1;
  const [body, setBody] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [chars, setChars] = useState<CharacterId[]>([]);
  const [pred, setPred] = useState(false);
  const canPost = body.trim().length > 0 && events.length + chars.length > 0;
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const submit = () => {
    addPost({ chapter: ch, body: body.trim(), events, characters: chars, prediction: pred ? { resolvesAt: Math.min(9, ch + 2), outcome: "correct", agree: 50 } : undefined });
    setBody(""); setEvents([]); setChars([]); setPred(false); onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New post">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder={`What's on your mind in Chapter ${ch}?`}
        className="w-full resize-none rounded-xl border border-input bg-background p-3 text-[15px] leading-6 placeholder:text-muted-foreground focus:border-ring focus:outline-2 focus:outline-offset-0 focus:outline-ring/30" />
      <div className="mt-4 text-[13px] font-semibold">Moments</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {visibleEvents(ch).map((e) => (
          <button key={e.id} onClick={() => setEvents(toggle(events, e.id))}
            aria-pressed={events.includes(e.id)}
            className={cn("h-7 rounded-full px-3 text-xs font-semibold transition-colors", events.includes(e.id) ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent")}>
            {e.title}
          </button>
        ))}
      </div>
      <div className="mt-4 text-[13px] font-semibold">Characters</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {visibleCharacters(ch).map((c) => (
          <button key={c.id} onClick={() => setChars(toggle(chars, c.id))}
            aria-pressed={chars.includes(c.id)}
            className={cn("h-7 rounded-full px-3 text-xs font-semibold transition-colors", chars.includes(c.id) ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent")}>
            {c.name}
          </button>
        ))}
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-medium">
        <button role="switch" aria-checked={pred} onClick={() => setPred(!pred)}
          className={cn("relative h-6 w-11 rounded-full transition", pred ? "bg-primary" : "bg-input")}>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all", pred ? "left-5.5" : "left-0.5")} />
        </button>
        This is a prediction
      </label>
      {!canPost && <p className="mt-3 text-xs text-muted-foreground">Write something and pick at least one moment or character.</p>}
      <button disabled={!canPost} onClick={submit}
        className="mt-4 h-10 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
        Post
      </button>
    </Modal>
  );
}
