import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import BarChart from './charts/BarChart.jsx';

function formatArr(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  const abs = Math.abs(x);
  if (abs >= 1e6) return `$${(x / 1e6).toFixed(1)}M`;
  return `$${(x / 1e3).toFixed(0)}K`;
}

export default function ARRGrowthChart({ arrHistory }) {
  const rows = Array.isArray(arrHistory) ? arrHistory : [];
  const data = rows.map((row, i) => ({
    period: row.period ?? row.quarter ?? `Q${i + 1}`,
    arr: Number(row.arr ?? row.value ?? 0),
    growth: row.growth != null ? Number(row.growth) : null,
  }));

  const hasArr = data.some((d) => d.arr > 0);
  if (!hasArr) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-slate-400 text-sm text-center px-4">
        ARR history will populate when the workflow returns <span className="font-mono-data text-xs">financials.arrHistory</span> with quarterly ARR points.
      </div>
    );
  }

  const withArr = data.filter((d) => d.arr > 0);
  const latest = withArr.length ? withArr[withArr.length - 1] : data[data.length - 1];
  const prev = withArr.length >= 2 ? withArr[withArr.length - 2] : null;
  let qoq = null;
  if (latest && prev && prev.arr > 0) {
    qoq = (latest.arr - prev.arr) / prev.arr;
  }
  if (latest?.growth != null && Number.isFinite(latest.growth)) {
    qoq = latest.growth;
  }

  const up = qoq != null && qoq >= 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mb-1">Current ARR</p>
          <p className="font-mono-data text-2xl font-bold text-slate-900">{formatArr(latest?.arr)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mb-1">QoQ Growth</p>
          <div className={`inline-flex items-center gap-1 font-mono-data text-lg font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>
            {qoq != null && Number.isFinite(qoq) ? (
              <>
                {up ? <ThickArrowUpIcon width={20} height={20} /> : <ThickArrowDownIcon width={20} height={20} />}
                {(qoq * 100).toFixed(1)}%
              </>
            ) : (
              <span className="text-slate-400 font-medium text-base">—</span>
            )}
          </div>
        </div>
      </div>
      <BarChart
        data={data}
        index="period"
        categories={['arr']}
        height={240}
        valueFormatter={formatArr}
        yAxisWidth={56}
      />
    </div>
  );
}
