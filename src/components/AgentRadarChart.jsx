import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

export default function AgentRadarChart({ confidenceScores }) {
  const entries = Object.entries(confidenceScores ?? {});
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-bone-40 text-sm text-center px-4">
        Agent confidence data will appear here after analysis runs.
      </div>
    );
  }

  const data = entries.map(([agent, score]) => ({
    subject: agent.replace(/ Agent$/i, '').trim(),
    A: Math.round(Number(score)),
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart outerRadius={85} data={data}>
        <PolarGrid stroke="rgba(250,250,250,0.10)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(250,250,250,0.70)', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(250,250,250,0.40)', fontSize: 9 }} />
        <Radar name="Confidence" dataKey="A" stroke="#FAFAFA" fill="#FAFAFA" fillOpacity={0.08} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}%`, 'Confidence']} contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(250,250,250,0.15)', borderRadius: 12, color: '#FAFAFA' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
