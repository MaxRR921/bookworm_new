# Task: Build a LightRAG retrieval probe

## Why this exists

We're building **BookWorm** — a spoiler-free book discussion platform. A reader sets their progress (say, chapter 7\) and can ask questions about the book; the system answers using only what the reader has actually read.

The planned architecture builds **cumulative knowledge graphs per chapter**: graph `ch007` contains chapters 1–7 merged, so the graph a reader queries physically cannot contain later text. We intend to use **LightRAG** ([https://github.com/HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)) to build those graphs.

**Before committing to LightRAG, we need to see how it actually retrieves.** This task is that probe. Nothing more.

## The specific question under test

LightRAG claims a **dual-level retrieval** design:

- `local` mode — searches *entity* embeddings, aimed at specific/factual questions  
- `global` mode — searches *relationship* embeddings, aimed at thematic/abstract questions  
- `hybrid` — both; `naive` — plain vector chunk search, no graph

Our whole reason for wanting a graph is the belief that **"why did X happen" is a fundamentally different retrieval problem than "what is X"**, and that embedding similarity over chunks can't capture the difference.

**So the question this probe must answer is:**

> Does `global` mode actually retrieve materially different content than `naive` mode for causal and thematic questions — or is it the same chunks with extra steps?

If yes, the graph earns its place. If no, we save a lot of work and use something simpler.

## NON-GOALS — do not build these

This is the important section. Do **not** implement:

- ❌ Chapter snapshots, workspaces, or the cumulative per-chapter graph pipeline  
- ❌ Any spoiler gating, position filtering, or ceiling logic  
- ❌ Postgres/Neo4j/Milvus — default file storage only  
- ❌ A CLI with argparse, a config system, classes, or a package structure  
- ❌ Tests, CI, Docker, logging frameworks, retries, or error taxonomies  
- ❌ An eval harness or scoring of answer quality

**One Python file. No dependencies beyond `lightrag-hku` and the stdlib.** If you find yourself adding a second module, stop — you've misread the task.

## What to build

A single script, `probe_lightrag.py`, that does exactly this:

1. **Get the text.** Download *The Great Gatsby* from Project Gutenberg (`https://www.gutenberg.org/cache/epub/64317/pg64317.txt` — public domain in the US). Cache it locally so reruns don't re-download.  
2. **Split into chapters.** Strip Gutenberg's `*** START` / `*** END` boilerplate, split on the roman-numeral chapter headings. **Assert loudly** if the split finds fewer chapters than expected — a silent under-split would invalidate the whole run. Don't weaken the assert to make it pass; fix the regex.  
3. **Ingest the first 3 chapters only.** One `ainsert()` call per chapter, in order, into a single LightRAG instance. Pass `file_paths=f"ch{n:03d}"` — this labels each chapter's entities and relations with their source, and we want to confirm that metadata actually lands.  
4. **Run the query matrix.** 4 questions × 4 modes \= 16 queries, each with `QueryParam(only_need_context=True)` so we get the **retrieved context, not a generated answer**. A fluent answer hides what the graph did; the raw context shows it.  
5. **Write one file per (question, mode)** to `probe_out/<label>__<mode>.txt`, each with the question and mode in a header so the files are readable standalone.  
6. **Print a summary table** to stdout: question label, mode, and character count of the returned context.

### The question matrix

These span question *types*, not topics. Keep all four — the contrast between rows is the experiment.

| Label | Question |
| :---- | :---- |
| `factual` | Who is Nick Carraway? |
| `causal` | Why did Tom take Nick to meet Myrtle? |
| `relational` | What is the relationship between Tom and Daisy? |
| `thematic` | What does the valley of ashes represent? |

Modes: `naive`, `local`, `global`, `hybrid`.

All four questions are answerable from chapters 1–3. That's deliberate — this probe tests retrieval quality, not spoiler behavior.

## Reference implementation

This is a **sketch, not a spec**. It was written without running against the installed version.

**Verify every API call against the actual installed LightRAG before trusting it** — check the README quickstart and `lightrag/lightrag.py`. The library moves fast and import paths, the storage-initialization sequence, and `QueryParam` fields have all changed across releases. If something below doesn't match reality, the installed library is right and this file is wrong.

import asyncio, os, re, pathlib, urllib.request

from lightrag import LightRAG, QueryParam

from lightrag.llm.openai import gpt\_4o\_mini\_complete, openai\_embed

from lightrag.kg.shared\_storage import initialize\_pipeline\_status

BOOK\_URL \= "https://www.gutenberg.org/cache/epub/64317/pg64317.txt"

N\_CHAPTERS \= 3

WORK\_DIR \= "./probe\_kg"

OUT\_DIR \= pathlib.Path("./probe\_out")

QUESTIONS \= {

    "factual":    "Who is Nick Carraway?",

    "causal":     "Why did Tom take Nick to meet Myrtle?",

    "relational": "What is the relationship between Tom and Daisy?",

    "thematic":   "What does the valley of ashes represent?",

}

MODES \= \["naive", "local", "global", "hybrid"\]

def chapters():

    cache \= pathlib.Path("gatsby.txt")

    if not cache.exists():

        cache.write\_bytes(urllib.request.urlopen(BOOK\_URL).read())

    text \= cache.read\_text(encoding="utf-8", errors="ignore")

    text \= text.split("\*\*\* START", 1)\[-1\].split("\*\*\* END", 1)\[0\]

    parts \= re.split(r"\\n\\s\*(?:Chapter\\s+)?(\[IVX\]{1,6})\\s\*\\n", text)\[1:\]

    out \= \[parts\[i \+ 1\].strip() for i in range(0, len(parts), 2)\]

    assert len(out) \>= N\_CHAPTERS, f"chapter split found only {len(out)} — fix the regex"

    return out\[:N\_CHAPTERS\]

async def main():

    OUT\_DIR.mkdir(exist\_ok=True)

    os.makedirs(WORK\_DIR, exist\_ok=True)

    rag \= LightRAG(

        working\_dir=WORK\_DIR,

        embedding\_func=openai\_embed,

        llm\_model\_func=gpt\_4o\_mini\_complete,

    )

    \# Both required in current versions; skipping them fails in confusing ways.

    await rag.initialize\_storages()

    await initialize\_pipeline\_status()

    for n, text in enumerate(chapters(), 1):

        print(f"ingesting ch{n} ({len(text.split())} words)...")

        await rag.ainsert(text, file\_paths=f"ch{n:03d}")

    for label, q in QUESTIONS.items():

        for mode in MODES:

            ctx \= await rag.aquery(q, param=QueryParam(mode=mode, only\_need\_context=True))

            (OUT\_DIR / f"{label}\_\_{mode}.txt").write\_text(

                f"Q: {q}\\nMODE: {mode}\\n{'=' \* 70}\\n{ctx}"

            )

            print(f"  {label:11} {mode:7} \-\> {len(str(ctx)):\>6} chars")

    print(f"\\nwrote {len(QUESTIONS) \* len(MODES)} files to {OUT\_DIR}/")

    print(f"graph: {WORK\_DIR}/graph\_chunk\_entity\_relation.graphml")

if \_\_name\_\_ \== "\_\_main\_\_":

    asyncio.run(main())

## Setup

pip install "lightrag-hku\[api\]"

export OPENAI\_API\_KEY=sk-...

python probe\_lightrag.py

Expected cost: **a few cents.** Three chapters ≈ 27k tokens, chunked into \~15–20 pieces, one extraction call each, through `gpt-4o-mini`.

Expected runtime: a couple of minutes, mostly extraction.

## Gotchas

- `initialize_storages()` **and** `initialize_pipeline_status()` are both required. Omitting either produces confusing downstream errors rather than a clear failure.  
- **Delete `probe_kg/` between runs** or ingests compound into the existing graph.  
- Insert chapters strictly in order.  
- If Gutenberg's formatting differs from what the regex expects, fix the regex — do not lower the assertion threshold to make it pass.

## Definition of done

The script runs clean and produces:

1. `probe_out/` containing 16 files, none empty  
2. `probe_kg/graph_chunk_entity_relation.graphml` — the knowledge graph, inspectable XML  
3. A printed 16-row summary table

Then report back with:

- **The summary table** (the char counts per question × mode)  
- **A sample of extracted entities** from the graphml — 5–10 entity names with their descriptions, so we can judge extraction quality  
- **Whether `ch001` / `ch002` / `ch003` appear in the `source_id` fields** on entities and relations. We need to confirm position metadata survives ingestion — the real pipeline depends on it.  
- **Your read on the core question:** for `causal` and `thematic`, did `global` return materially different content than `naive`, or roughly the same material? Quote a short excerpt from each to support the call.

Do not draw conclusions about spoiler safety, and do not start building the gating pipeline. This probe answers one question; we'll decide what to build after seeing the output.  
