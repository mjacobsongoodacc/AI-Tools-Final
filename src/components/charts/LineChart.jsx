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

const tooltipCursor = { fill: 'rgba(250,250,250,0.05)' };
const tooltipContentStyle = {
  borderRadius: 12,
  border: '1px solid rgba(250,250,250,0.15)',
  background: '#0A0A0A',
  color: '#FAFAFA',
};

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
      <div className="flex items-center justify-center text-bone-40 text-sm" style={{ height }}>
        No time-series data yet.
      </div>
    );
  }

  const fmt = valueFormatter ?? ((v) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : '—'));
  const tickFill = 'rgba(250,250,250,0.70)';
  const legendColor = 'rgba(250,250,250,0.70)';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ left: 4, right: showLegend ? 8 : 12, top: 8, bottom: 4 }}>
        {showGridLines && (
          <CartesianGrid stroke="rgba(250,250,250,0.10)" strokeDasharray="3 3" vertical={false} />
        )}
        <XAxis
          dataKey={index}
          tick={{ fill: tickFill, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          width={yAxisWidth}
          tick={{ fill: tickFill, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => fmt(v)}
        />
        <Tooltip
          cursor={tooltipCursor}
          formatter={(v, name) => [fmt(v), name]}
          labelStyle={{ color: 'rgba(250,250,250,0.70)', fontSize: 11 }}
          contentStyle={tooltipContentStyle}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: legendColor }} />}
        {categories.map((key, i) => (
          <Line
            key={key}
            type={curve}
            dataKey={key}
            name={key}
            stroke={
              colors?.length
                ? palette[i % palette.length]
                : i === 0
                  ? '#FAFAFA'
                  : palette[i % palette.length]
            }
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
