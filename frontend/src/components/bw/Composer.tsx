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
        className="w-full resize-none rounded-2xl border border-input bg-background p-3 outline-none focus:border-event" />
      <div className="mt-4 text-sm font-semibold">Attach to…</div>
      <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Events</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {visibleEvents(ch).map((e) => (
          <button key={e.id} onClick={() => setEvents(toggle(events, e.id))}
            className={cn("rounded-full border px-2.5 py-1 text-xs transition", events.includes(e.id) ? "border-event bg-event text-primary-foreground" : "border-border text-event hover:bg-event-soft")}>
            {e.title}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Characters</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {visibleCharacters(ch).map((c) => (
          <button key={c.id} onClick={() => setChars(toggle(chars, c.id))}
            className={cn("rounded-full border px-2.5 py-1 text-xs transition", chars.includes(c.id) ? "border-character bg-character text-primary-foreground" : "border-border text-character hover:bg-character-soft")}>
            {c.name}
          </button>
        ))}
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
        <button role="switch" aria-checked={pred} onClick={() => setPred(!pred)}
          className={cn("relative h-6 w-11 rounded-full transition", pred ? "bg-prediction" : "bg-muted")}>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all", pred ? "left-5.5" : "left-0.5")} />
        </button>
        This is a prediction
      </label>
      {!canPost && <p className="mt-3 text-xs text-muted-foreground">Write something and add at least one tag.</p>}
      <button disabled={!canPost} onClick={submit}
        className="mt-4 w-full rounded-full bg-primary py-2.5 font-medium text-primary-foreground transition disabled:opacity-40">
        Post
      </button>
    </Modal>
  );
}
