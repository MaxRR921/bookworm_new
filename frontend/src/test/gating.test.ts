import { describe, expect, it } from "vitest";
import { eventsWith, filterPosts, isPostVisible, isReplyVisible, visibleEvents } from "@/lib/gating";
import type { Post } from "@/data/bookworm";

const post = (chapter: number, hindsight = false) => ({ chapter, hindsight }) as Post;

describe("spoiler gating", () => {
  it("hides posts from chapters after the reader's chapter", () => {
    expect(isPostVisible(post(5), 4)).toBe(false);
    expect(isPostVisible(post(4), 4)).toBe(true);
  });
  it("hides replies written by readers further ahead", () => {
    expect(isReplyVisible({ id: "r", user: "u", body: "", progress: 7 }, 6)).toBe(false);
    expect(isReplyVisible({ id: "r", user: "u", body: "", progress: 6 }, 6)).toBe(true);
  });
  it("shows hindsight posts only to finished readers in hindsight mode", () => {
    expect(isPostVisible(post(1, true), 8, true)).toBe(false);
    expect(isPostVisible(post(1, true), 9, false)).toBe(false);
    expect(isPostVisible(post(1, true), 9, true)).toBe(true);
  });
});

describe("visible events", () => {
  it("keeps events within the chosen chapter even when another chapter is requested", () => {
    expect(visibleEvents(4, 5)).toEqual([]);
    expect(visibleEvents(4).every((event) => event.chapter <= 4)).toBe(true);
    expect(visibleEvents(4)).toHaveLength(12);
  });
});

describe("combined filters", () => {
  const p = (id: string, characters: string[], events: string[]) => ({ id, characters, events }) as unknown as Post;
  const posts = [p("both", ["gatsby", "daisy"], ["e5a"]), p("gatsby", ["gatsby"], ["e4a"]), p("none", [], [])];
  const ids = (xs: Post[]) => xs.map((x) => x.id);
  it("needs every selected character and any selected event", () => {
    expect(ids(filterPosts(posts, [], []))).toEqual(["both", "gatsby", "none"]);
    expect(ids(filterPosts(posts, ["gatsby"], []))).toEqual(["both", "gatsby"]);
    expect(ids(filterPosts(posts, ["gatsby", "daisy"], []))).toEqual(["both"]);
    expect(ids(filterPosts(posts, ["gatsby"], ["e4a", "e9a"]))).toEqual(["gatsby"]);
    expect(ids(filterPosts(posts, ["daisy"], ["e4a"]))).toEqual([]);
  });
  it("narrows event choices to events featuring all selected characters", () => {
    const shared = eventsWith(visibleEvents(5), ["gatsby", "daisy"]).map((e) => e.id);
    expect(shared).toEqual(["e4c", "e5a", "e5b", "e5c"]);
  });
});
