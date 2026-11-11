"use client";

interface NavPoint {
  date: string;
  nav: number;
}

interface NavChartProps {
  points: NavPoint[];
}

export default function NavChart({ points }: NavChartProps) {
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  if (points.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Not enough NAV history to render a chart.
      </div>
    );
  }

  const sorted = [...points].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const xs = sorted.map((_, i) => i);
  const ys = sorted.map((p) => p.nav);
  const xMin = 0;
  const xMax = sorted.length - 1;
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const yRange = yMax === yMin ? 1 : yMax - yMin;

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xScale = (i: number) => padding.left + (i - xMin) / (xMax === xMin ? 1 : xMax - xMin) * plotWidth;
  const yScale = (v: number) => padding.top + plotHeight - ((v - yMin) / yRange) * plotHeight;

  const line = sorted
    .map((_, i) => `${xScale(i)},${yScale(sorted[i].nav)}`)
    .join(" ");

  const firstDate = new Date(sorted[0].date).toLocaleDateString("en-BD");
  const lastDate = new Date(sorted[sorted.length - 1].date).toLocaleDateString("en-BD");

  return (
    <div className="w-full max-w-xl">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex justify-between">
        <span>{firstDate}</span>
        <span>{lastDate}</span>
      </div>
      <svg
        width={width}
        height={height}
        className="w-full h-48 block"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="NAV history"
      >
        <defs>
          <linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${padding.top + plotHeight} ${line} ${width - padding.right},${padding.top + plotHeight}`}
          fill="url(#navGradient)"
        />
        <polyline
          points={line}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top + plotHeight}
          x2={width - padding.right}
          y2={padding.top + plotHeight}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {sorted.length > 0 && [
          sorted[0],
          sorted[Math.floor(sorted.length / 2)],
          sorted[sorted.length - 1],
        ]
          .filter((p, idx, arr) => arr.findIndex((x) => x.date === p.date) === idx)
          .map((p) => {
            const i = sorted.indexOf(p);
            return (
              <g key={p.date}>
                <circle cx={xScale(i)} cy={yScale(p.nav)} r={3} fill="#10b981" stroke="white" strokeWidth="1.5" />
                <text
                  x={xScale(i)}
                  y={yScale(p.nav) - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {p.nav.toFixed(2)}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}
