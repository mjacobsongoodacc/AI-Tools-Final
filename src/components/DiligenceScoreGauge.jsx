import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

function barFill(diligenceScore) {
  const s = Number(diligenceScore) || 0;
  return s >= 7 ? '#22C55E' : s >= 4 ? '#F59E0B' : '#EF4444';
}

export default function DiligenceScoreGauge({ displayScore, diligenceScore }) {
  const fill = barFill(diligenceScore);
  const pct = Math.min(100, Math.max(0, (Number(displayScore) || 0) * 10));
  const data = [{ name: 'score', value: pct, fill }];

  return (
    <div className="relative w-[140px] h-[140px] flex-shrink-0 mx-auto sm:mx-0">
      <ResponsiveContainer width={140} height={140}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="58%"
          outerRadius="92%"
          barSize={14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            fill={fill}
            background={{ fill: '#F1F5F9' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-1">
        <span className="font-mono-data text-[32px] font-bold text-slate-900 leading-none tracking-tight">
          {(Number(displayScore) || 0).toFixed(1)}
        </span>
        <span className="text-slate-400 text-xs font-medium mt-0.5">/10</span>
      </div>
    </div>
  );
}
