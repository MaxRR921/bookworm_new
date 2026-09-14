import asyncio, os, re, pathlib, urllib.request

from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from lightrag.kg.shared_storage import initialize_pipeline_status

BOOK_URL = "https://www.gutenberg.org/cache/epub/64317/pg64317.txt"
N_CHAPTERS = 3
EXPECTED_CHAPTERS = 9
WORK_DIR = "./probe_kg"
OUT_DIR = pathlib.Path("./probe_out")

QUESTIONS = {
    "factual":    "Who is Nick Carraway?",
    "causal":     "Why did Tom take Nick to meet Myrtle?",
    "relational": "What is the relationship between Tom and Daisy?",
    "thematic":   "What does the valley of ashes represent?",
}
MODES = ["naive", "local", "global", "hybrid"]


def chapters():
    cache = pathlib.Path("gatsby.txt")
    if not cache.exists():
        cache.write_bytes(urllib.request.urlopen(BOOK_URL).read())
    text = cache.read_text(encoding="utf-8", errors="ignore")
    text = text.split("*** START", 1)[-1].split("*** END", 1)[0]
    # Chapter headings are centred roman numerals; the flush-left ones are the
    # table of contents, so require indentation.
    parts = re.split(r"\n[ \t]{2,}([IVXL]{1,6})[ \t]*\n", text)[1:]
    out = [parts[i + 1].strip() for i in range(0, len(parts), 2)]
    assert len(out) == EXPECTED_CHAPTERS, f"chapter split found {len(out)} — fix the regex"
    return out[:N_CHAPTERS]


async def main():
    OUT_DIR.mkdir(exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)
    rag = LightRAG(
        working_dir=WORK_DIR,
        # openai_embed is a bare function here; LightRAG wants an EmbeddingFunc.
        embedding_func=EmbeddingFunc(
            embedding_dim=1536, max_token_size=8192, func=openai_embed
        ),
        llm_model_func=gpt_4o_mini_complete,
    )
    await rag.initialize_storages()
    await initialize_pipeline_status()

    for n, text in enumerate(chapters(), 1):
        print(f"ingesting ch{n} ({len(text.split())} words)...")
        await rag.ainsert(text, file_paths=f"ch{n:03d}")

    for label, q in QUESTIONS.items():
        for mode in MODES:
            ctx = await rag.aquery(q, param=QueryParam(mode=mode, only_need_context=True))
            (OUT_DIR / f"{label}__{mode}.txt").write_text(
                f"Q: {q}\nMODE: {mode}\n{'=' * 70}\n{ctx}"
            )
            print(f"  {label:11} {mode:7} -> {len(str(ctx)):>6} chars")

    await rag.finalize_storages()
    print(f"\nwrote {len(QUESTIONS) * len(MODES)} files to {OUT_DIR}/")
    print(f"graph: {WORK_DIR}/graph_chunk_entity_relation.graphml")


if __name__ == "__main__":
    asyncio.run(main())
