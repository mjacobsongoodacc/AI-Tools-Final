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

const tooltipCursor = { fill: 'rgba(250,250,250,0.05)' };
const tooltipContentStyle = {
  borderRadius: 12,
  border: '1px solid rgba(250,250,250,0.15)',
  background: '#0A0A0A',
  color: '#FAFAFA',
};

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
      <div className="flex items-center justify-center text-bone-40 text-sm" style={{ height }}>
        No chart data yet.
      </div>
    );
  }

  const fmt = valueFormatter ?? ((v) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : '—'));
  const isHorizontal = layout === 'horizontal';
  const rechartsLayout = isHorizontal ? 'vertical' : 'horizontal';
  const radiusVertical = [4, 4, 0, 0];
  const radiusHorizontal = [0, 4, 4, 0];
  const tickFill = 'rgba(250,250,250,0.70)';
  const legendColor = 'rgba(250,250,250,0.70)';

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
            stroke="rgba(250,250,250,0.10)"
            strokeDasharray="3 3"
            vertical={isHorizontal}
            horizontal={!isHorizontal}
          />
        )}
        {isHorizontal ? (
          <>
            <XAxis type="number" tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
            <YAxis type="category" dataKey={index} width={yAxisWidth} tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey={index} tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis width={yAxisWidth} tick={{ fill: tickFill, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
          </>
        )}
        <Tooltip
          cursor={tooltipCursor}
          formatter={(v, name) => [fmt(v), name]}
          labelStyle={{ color: 'rgba(250,250,250,0.70)', fontSize: 11 }}
          contentStyle={tooltipContentStyle}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: legendColor }} />}
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
              ? data.map((_, j) => (
                  <Cell
                    key={`cell-${j}`}
                    fill="#000000"
                    stroke="#FAFAFA"
                    strokeWidth={1}
                  />
                ))
              : null}
            {showDataLabels && categories.length === 1 && i === 0 && (
              <LabelList
                dataKey={key}
                position={isHorizontal ? 'right' : 'top'}
                formatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
                style={{ fontSize: 10, fontFamily: 'DM Mono, ui-monospace, monospace', fill: '#FAFAFA' }}
              />
            )}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
