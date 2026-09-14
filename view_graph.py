"""Render probe_kg/graph_chunk_entity_relation.graphml as a standalone HTML page."""
import json, html, pathlib, xml.etree.ElementTree as ET

GRAPHML = pathlib.Path("probe_kg/graph_chunk_entity_relation.graphml")
OUT = pathlib.Path("graph.html")
NS = "{http://graphml.graphdrawing.org/xmlns}"

root = ET.parse(GRAPHML).getroot()
keys = {k.get("id"): k.get("attr.name") for k in root.findall(f"{NS}key")}
def props(el):
    return {keys.get(d.get("key"), d.get("key")): (d.text or "") for d in el.findall(f"{NS}data")}

nodes, index = [], {}
for n in root.iter(f"{NS}node"):
    p = props(n)
    index[n.get("id")] = len(nodes)
    nodes.append({
        "id": n.get("id"),
        "type": p.get("entity_type", "unknown"),
        "desc": p.get("description", ""),
        "chapters": sorted(set(p.get("file_path", "").split("<SEP>")) - {""}),
        "deg": 0,
    })

edges = []
for e in root.iter(f"{NS}edge"):
    s, t = index.get(e.get("source")), index.get(e.get("target"))
    if s is None or t is None:
        continue
    p = props(e)
    edges.append({
        "s": s, "t": t,
        "desc": p.get("description", ""),
        "keywords": p.get("keywords", ""),
        "chapters": sorted(set(p.get("file_path", "").split("<SEP>")) - {""}),
    })
    nodes[s]["deg"] += 1
    nodes[t]["deg"] += 1

data = json.dumps({"nodes": nodes, "edges": edges}).replace("</", "<\\/")
OUT.write_text(pathlib.Path("graph_template.html").read_text().replace("__DATA__", data))
print(f"{OUT} — {len(nodes)} entities, {len(edges)} relations")
