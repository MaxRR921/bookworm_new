"""Trace every stage of a LightRAG retrieval.

    .venv/bin/python trace_query.py "Why did Tom take Nick to meet Myrtle?" global

Modes: naive | local | global | hybrid | mix

Wraps the three vector stores and the keyword extractor, so each stage reports
what it searched, what came back, and with what cosine score.
"""
import asyncio, os, sys, pathlib

# Read the key out of .env so this is a one-command script.
for line in pathlib.Path(".env").read_text().splitlines():
    if line.startswith("LLM_BINDING_API_KEY="):
        os.environ.setdefault("OPENAI_API_KEY", line.split("=", 1)[1].strip())

from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from lightrag.kg.shared_storage import initialize_pipeline_status
from lightrag import operate

QUESTION = sys.argv[1] if len(sys.argv) > 1 else "Why did Tom take Nick to meet Myrtle?"
MODE = sys.argv[2] if len(sys.argv) > 2 else "hybrid"
OUT = pathlib.Path("trace_out"); OUT.mkdir(exist_ok=True)

log = []
def say(s=""):
    print(s)
    log.append(s)

def head(n, t):
    say(f"\n{'─' * 78}\nSTEP {n}  {t}\n{'─' * 78}")

def wrap_vdb(vdb, name, step):
    original = vdb.query
    async def traced(query, top_k, *a, **kw):
        res = await original(query, top_k, *a, **kw)
        head(step, f"{name} — vector search")
        say(f'search text : "{query}"')
        say(f"top_k={top_k}  cosine_threshold={vdb.cosine_better_than_threshold}")
        say(f"returned    : {len(res)} hits\n")
        for i, r in enumerate(res[:15], 1):
            label = r.get("entity_name") or f"{r.get('src_id')} ←→ {r.get('tgt_id')}" or r["id"]
            say(f"  {i:>2}. {r['distance']:.4f}  {label}")
            if r.get("content"):
                say(f"        {r['content'][:110].replace(chr(9), ' ').splitlines()[0]}")
        if len(res) > 15:
            say(f"  … {len(res) - 15} more")
        return res
    vdb.query = traced


async def main():
    rag = LightRAG(
        working_dir="./probe_kg",
        embedding_func=EmbeddingFunc(embedding_dim=1536, max_token_size=8192, func=openai_embed),
        llm_model_func=gpt_4o_mini_complete,
    )
    await rag.initialize_storages()
    await initialize_pipeline_status()

    say(f"QUESTION : {QUESTION}\nMODE     : {MODE}")

    original_kw = operate.get_keywords_from_query
    async def traced_kw(*a, **kw):
        hl, ll = await original_kw(*a, **kw)
        head(1, "keyword extraction (one LLM call)")
        say(f"low-level  (→ entity search, used by local/hybrid) : {ll}")
        say(f"high-level (→ edge search,   used by global/hybrid): {hl}")
        if MODE == "local" and not ll: say("!! local mode with no low-level keywords — retrieval will be empty")
        if MODE == "global" and not hl: say("!! global mode with no high-level keywords — retrieval will be empty")
        return hl, ll
    operate.get_keywords_from_query = traced_kw

    # Stage 2 of each path: the graph expansion off the vector hits.
    def wrap_expand(fn_name, step, title, describe):
        original = getattr(operate, fn_name)
        async def traced(seeds, *a, **kw):
            found = await original(seeds, *a, **kw)
            head(step, title)
            say(f"expanding {len(seeds)} vector hits into {len(found)} connected items\n")
            for x in found[:12]:
                say("  " + describe(x))
            if len(found) > 12:
                say(f"  … {len(found) - 12} more")
            return found
        setattr(operate, fn_name, traced)

    wrap_expand("_find_most_related_edges_from_entities", "2b",
                "LOCAL expansion — entities ➜ their edges",
                lambda e: f"{e.get('src_tgt', (e.get('src_id'), e.get('tgt_id')))}")
    wrap_expand("_find_most_related_entities_from_relationships", "3b",
                "GLOBAL expansion — edges ➜ their endpoint entities",
                lambda n: f"{n.get('entity_name')}")

    wrap_vdb(rag.entities_vdb, "ENTITIES (local path)", 2)
    wrap_vdb(rag.relationships_vdb, "RELATIONSHIPS (global path)", 3)
    wrap_vdb(rag.chunks_vdb, "CHUNKS (naive/mix path)", 4)

    ctx = await rag.aquery(QUESTION, param=QueryParam(mode=MODE, only_need_context=True))
    ctx = str(ctx)

    head(5, "assembled context (what the LLM would have received)")
    for section in ("Knowledge Graph Data (Entity):", "Knowledge Graph Data (Relationship):",
                    "Document Chunks", "Reference Document List"):
        if section in ctx:
            body = ctx.split(section, 1)[1]
            say(f"  {section:38} {body.count(chr(123)):>3} entries")
    say(f"\n  total: {len(ctx)} chars")

    stem = "".join(c if c.isalnum() else "_" for c in QUESTION)[:40]
    (OUT / f"{stem}__{MODE}.trace.txt").write_text("\n".join(log) + "\n\n" + "=" * 78 + "\nFULL CONTEXT\n" + "=" * 78 + "\n" + ctx)
    say(f"\nwrote {OUT}/{stem}__{MODE}.trace.txt")
    await rag.finalize_storages()

asyncio.run(main())
