import type { Character } from "@/data/bookworm";

/** values: index 0 = chapter 1; null before appearance. Only values up to `upTo` are drawn. */
export function SentimentChart({ c, values, upTo }: { c: Character; values: (number | null)[]; upTo: number }) {
  const W = 560, H = 200, pad = 32;
  const x = (i: number) => pad + (i * (W - pad * 2)) / 8;
  const y = (v: number) => H - pad - ((v - 1) / 4) * (H - pad * 2);
  const pts = values.map((v, i) => (v != null && i < upTo ? { i, v } : null)).filter(Boolean) as { i: number; v: number }[];
  const d = pts.map((p, k) => `${k ? "L" : "M"}${x(p.i)},${y(p.v)}`).join(" ");
  const last = pts.at(-1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Reader sentiment for ${c.name}`}>
      {[1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <line x1={pad} x2={W - pad} y1={y(v)} y2={y(v)} className="stroke-border" strokeDasharray="2 4" />
          <text x={8} y={y(v) + 4} className="fill-muted-foreground text-[10px]">{v}★</text>
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">{i + 1}</text>
      ))}
      <path d={d} fill="none" className="stroke-character transition-all duration-500" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r={4} className="fill-character transition-all duration-500" />)}
      {last && upTo < 9 && (
        <>
          <line x1={x(last.i)} y1={y(last.v)} x2={x(8)} y2={y(last.v)} className="stroke-muted-foreground" strokeWidth={2} strokeDasharray="4 6" opacity={0.5} />
          <text x={x(8)} y={y(last.v) - 10} textAnchor="end" className="fill-muted-foreground text-[11px] italic">Keep reading to see where this goes</text>
        </>
      )}
    </svg>
  );
}
