/** Lightweight SVG charts in the Hubcycle visual language (no chart library). */

const DEEP = "#00414F";
const CORAL = "#FF684D";
const SKY = "#A1D0DB";
const CLOUD = "#F2F2F2";
const INK = "#0F2024";

export function RadarChart({
  labels,
  values,
  size = 340,
}: {
  labels: string[];
  values: number[]; // 0–100
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 52;
  const n = labels.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, radius: number) => [
    cx + Math.cos(angle(i)) * radius,
    cy + Math.sin(angle(i)) * radius,
  ];
  const poly = values
    .map((v, i) => pt(i, (Math.max(v, 4) / 100) * r).join(","))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md" role="img" aria-label="Radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={labels.map((_, i) => pt(i, r * f).join(",")).join(" ")}
          fill="none"
          stroke={CLOUD}
          strokeWidth={1.2}
        />
      ))}
      {labels.map((_, i) => {
        const [x, y] = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={CLOUD} strokeWidth={1.2} />;
      })}
      <polygon points={poly} fill={`${CORAL}33`} stroke={CORAL} strokeWidth={2.5} strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = pt(i, (Math.max(v, 4) / 100) * r);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={CORAL} />;
      })}
      {labels.map((lab, i) => {
        const [x, y] = pt(i, r + 26);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={11}
            fill={DEEP}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={600}
          >
            {lab}
          </text>
        );
      })}
    </svg>
  );
}

export function Bar100({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      {label ? <div className="w-44 shrink-0 text-sm text-ink/80">{label}</div> : null}
      <div className="relative h-2.5 flex-1 rounded-full bg-cloud">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, background: DEEP }}
        />
      </div>
      <div className="w-9 text-right text-sm font-semibold text-deep">{value}</div>
    </div>
  );
}

/** SOSIE-style 1–5 adequacy scale. */
export function Scale5({ value, label, sublabel }: { value: number; label: string; sublabel?: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{label}</div>
        {sublabel ? <div className="truncate text-xs text-ink/50">{sublabel}</div> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="inline-block h-3.5 w-8 rounded-full"
            style={{
              background: i <= Math.round(value) ? (value >= 3 ? DEEP : CORAL) : CLOUD,
            }}
          />
        ))}
      </div>
      <div className="w-8 text-right text-sm font-bold text-deep">{value}</div>
    </div>
  );
}

export interface MapDot {
  x: number; // 0–1 (reflection → action)
  y: number; // 0–1 (systems → people)
  label: string;
  color?: string;
  highlight?: boolean;
}

export function TeamMap({
  dots,
  axisX,
  axisY,
  quadrants,
  size = 460,
}: {
  dots: MapDot[];
  axisX: string;
  axisY: string;
  quadrants?: [string, string, string, string]; // TL TR BL BR
  size?: number;
}) {
  const pad = 44;
  const w = size;
  const h = size * 0.72;
  const px = (x: number) => pad + x * (w - pad * 2);
  const py = (y: number) => h - pad - y * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Team map">
      <rect x={pad} y={pad} width={w - pad * 2} height={h - pad * 2} fill="#FBFBFB" stroke={CLOUD} rx={18} />
      <line x1={w / 2} y1={pad} x2={w / 2} y2={h - pad} stroke={CLOUD} strokeWidth={1.5} />
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke={CLOUD} strokeWidth={1.5} />
      {quadrants ? (
        <>
          <text x={pad + 10} y={pad + 18} fontSize={10.5} fill={`${INK}66`}>{quadrants[0]}</text>
          <text x={w - pad - 10} y={pad + 18} fontSize={10.5} fill={`${INK}66`} textAnchor="end">{quadrants[1]}</text>
          <text x={pad + 10} y={h - pad - 8} fontSize={10.5} fill={`${INK}66`}>{quadrants[2]}</text>
          <text x={w - pad - 10} y={h - pad - 8} fontSize={10.5} fill={`${INK}66`} textAnchor="end">{quadrants[3]}</text>
        </>
      ) : null}
      <text x={w / 2} y={h - 10} fontSize={11} fill={DEEP} textAnchor="middle" fontWeight={600}>
        {axisX}
      </text>
      <text
        x={12}
        y={h / 2}
        fontSize={11}
        fill={DEEP}
        textAnchor="middle"
        fontWeight={600}
        transform={`rotate(-90 12 ${h / 2})`}
      >
        {axisY}
      </text>
      {dots.map((d, i) => (
        <g key={i}>
          <circle
            cx={px(d.x)}
            cy={py(d.y)}
            r={d.highlight ? 10 : 7}
            fill={d.highlight ? CORAL : d.color ?? DEEP}
            stroke="white"
            strokeWidth={2}
          />
          <text
            x={px(d.x)}
            y={py(d.y) - (d.highlight ? 15 : 12)}
            fontSize={10.5}
            fill={INK}
            textAnchor="middle"
            fontWeight={d.highlight ? 700 : 500}
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function DistBars({
  data,
}: {
  data: { label: string; value: number; color?: string }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3" style={{ height: 180 }}>
      {data.map((d, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div className="text-xs font-bold text-deep">{d.value}</div>
          <div
            className="w-full rounded-t-xl"
            style={{ height: `${(d.value / max) * 78}%`, background: d.color ?? SKY, minHeight: d.value > 0 ? 6 : 2 }}
          />
          <div className="h-8 text-center text-[10px] leading-tight text-ink/70">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
