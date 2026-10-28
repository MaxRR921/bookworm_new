import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Lock } from "lucide-react";
import { PostBody, RepliesList } from "@/components/bw/PostCard";
import { ReaderPage } from "@/components/bw/Shell";
import { ReactionBar } from "@/components/bw/ui";
import { isPostVisible } from "@/lib/gating";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post/$postId")({
  head: () => ({
    meta: [
      { title: "Discussion — Bookworm" },
      { name: "description", content: "A spoiler-gated discussion thread on The Great Gatsby." },
      { property: "og:title", content: "Discussion — Bookworm" },
      { property: "og:description", content: "A spoiler-gated discussion thread on The Great Gatsby." },
    ],
  }),
  component: () => (
    <ReaderPage>
      <PostView />
    </ReaderPage>
  ),
});

function PostView() {
  const { postId } = Route.useParams();
  const s = useStore();
  const post = s.posts.find((p) => p.id === postId);
  if (!post || !isPostVisible(post, s.chapter!, s.hindsight)) {
    return <div className="py-20 text-center text-muted-foreground"><Lock className="mx-auto mb-3" /> This discussion is from later in the book.</div>;
  }
  return (
    <>
      <Link to="/read" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft size={16} /> Back to chapter</Link>
      <article className={cn("rounded-2xl border bg-card p-5", post.prediction ? "border-2 border-prediction" : "border-border")}>
        <PostBody post={post} showChapter />
        <div className="mt-4"><ReactionBar id={post.id} counts={post.reactions} /></div>
      </article>
      <h2 className="mb-3 mt-8 text-xl font-semibold">Replies</h2>
      <RepliesList replies={post.replies} />
    </>
  );
}
