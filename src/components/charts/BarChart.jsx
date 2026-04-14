import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from 'recharts';
import { CHART_COLORS } from './palette.js';

const tooltipCursor = { fill: '#F8FAFC' };

export default function BarChart({
  data = [],
  index,
  categories = [],
  colors,
  valueFormatter,
  yAxisWidth = 52,
  showLegend = false,
  showGridLines = true,
  height = 240,
  layout = 'vertical',
  stacked = false,
  showDataLabels = false,
}) {
  const palette = colors?.length ? colors : CHART_COLORS;

  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-slate-400 text-sm" style={{ height }}>
        No chart data yet.
      </div>
    );
  }

  const fmt = valueFormatter ?? ((v) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : '—'));
  const isHorizontal = layout === 'horizontal';
  const rechartsLayout = isHorizontal ? 'vertical' : 'horizontal';
  const radiusVertical = [4, 4, 0, 0];
  const radiusHorizontal = [0, 4, 4, 0];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={rechartsLayout}
        margin={
          isHorizontal
            ? { left: 4, right: 16, top: 8, bottom: 4 }
            : { left: 4, right: 12, top: 8, bottom: 4 }
        }
      >
        {showGridLines && (
          <CartesianGrid
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            vertical={isHorizontal}
            horizontal={!isHorizontal}
          />
        )}
        {isHorizontal ? (
          <>
            <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
            <YAxis type="category" dataKey={index} width={yAxisWidth} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey={index} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis width={yAxisWidth} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
          </>
        )}
        <Tooltip
          cursor={tooltipCursor}
          formatter={(v, name) => [fmt(v), name]}
          labelStyle={{ color: '#64748B', fontSize: 11 }}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />}
        {categories.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            stackId={stacked ? 'a' : undefined}
            fill={palette[i % palette.length]}
            radius={isHorizontal ? radiusHorizontal : radiusVertical}
            maxBarSize={32}
          >
            {!stacked && categories.length === 1
              ? data.map((_, j) => <Cell key={`cell-${j}`} fill={palette[j % palette.length]} />)
              : null}
            {showDataLabels && categories.length === 1 && i === 0 && (
              <LabelList
                dataKey={key}
                position={isHorizontal ? 'right' : 'top'}
                formatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
                className="fill-slate-500"
                style={{ fontSize: 10, fontFamily: 'DM Mono, ui-monospace, monospace' }}
              />
            )}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
