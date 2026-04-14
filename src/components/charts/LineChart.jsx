import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_COLORS } from './palette.js';

const tooltipCursor = { fill: '#F8FAFC' };

export default function LineChart({
  data = [],
  index,
  categories = [],
  colors,
  valueFormatter,
  yAxisWidth = 44,
  showLegend = false,
  showGridLines = true,
  height = 240,
  curve = 'monotone',
}) {
  const palette = colors?.length ? colors : CHART_COLORS;

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-slate-400 text-sm" style={{ height }}>
        No time-series data yet.
      </div>
    );
  }

  const fmt = valueFormatter ?? ((v) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : '—'));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ left: 4, right: showLegend ? 8 : 12, top: 8, bottom: 4 }}>
        {showGridLines && (
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
        )}
        <XAxis
          dataKey={index}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          width={yAxisWidth}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => fmt(v)}
        />
        <Tooltip
          cursor={tooltipCursor}
          formatter={(v, name) => [fmt(v), name]}
          labelStyle={{ color: '#64748B', fontSize: 11 }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />}
        {categories.map((key, i) => (
          <Line
            key={key}
            type={curve}
            dataKey={key}
            name={key}
            stroke={palette[i % palette.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
