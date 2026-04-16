import LineChart from './charts/LineChart.jsx';

function parseMonth(m) {
  if (typeof m !== 'string') return null;
  const [y, mo] = m.split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(mo)) return null;
  return y * 12 + (mo - 1);
}

function formatMoneyCompact(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  const abs = Math.abs(x);
  if (abs >= 1e6) return `$${(x / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(x / 1e3).toFixed(0)}K`;
  return `$${x.toFixed(0)}`;
}

function computeCagr(points, key) {
  const valid = points.filter((p) => Number(p[key]) > 0);
  if (valid.length < 2) return null;
  const a = valid[0];
  const b = valid[valid.length - 1];
  const v0 = Number(a[key]);
  const v1 = Number(b[key]);
  if (!(v0 > 0 && v1 > 0)) return null;
  const t0 = parseMonth(a.month);
  const t1 = parseMonth(b.month);
  let years = t0 != null && t1 != null ? (t1 - t0) / 12 : (valid.length - 1) / 12;
  if (!Number.isFinite(years) || years <= 0) years = (valid.length - 1) / 12;
  if (years <= 0) return null;
  return Math.pow(v1 / v0, 1 / years) - 1;
}

export default function TractionTrajectory({ tractionTimeline }) {
  const rows = Array.isArray(tractionTimeline) ? tractionTimeline : [];
  const data = rows.map((row) => ({
    month: row.month ?? row.date ?? '—',
    users: Number(row.users ?? row.activeUsers ?? 0),
    revenue: Number(row.revenue ?? row.mrr ?? 0),
  }));

  const hasUsers = data.some((d) => d.users > 0);
  const hasRev = data.some((d) => d.revenue > 0);

  if (!hasUsers && !hasRev) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-bone-40 text-sm text-center px-4">
        Traction timelines will populate when the workflow returns <span className="font-mono-data text-xs">tractionTimeline</span> with monthly users and revenue.
      </div>
    );
  }

  const cagrRev = computeCagr(data, 'revenue');
  const cagrUsers = computeCagr(data, 'users');
  const cagr = cagrRev != null ? cagrRev : cagrUsers;
  const cagrLabel = cagrRev != null ? 'Revenue CAGR' : 'Users CAGR';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-bone-40 text-[10px] font-semibold uppercase tracking-wide">Growth (first → last)</p>
        <p className="text-sm text-bone-70">
          {cagr != null && Number.isFinite(cagr) ? (
            <>
              <span className="text-bone-40">{cagrLabel}: </span>
              <span className="font-mono-data font-semibold text-white tabular-nums">{(cagr * 100).toFixed(1)}%</span>
            </>
          ) : (
            <span className="text-bone-40">CAGR needs two positive points.</span>
          )}
        </p>
      </div>
      {hasUsers && (
        <div>
          <p className="text-xs text-bone-40 mb-1">Users</p>
          <LineChart
            data={data}
            index="month"
            categories={['users']}
            colors={['#FAFAFA']}
            height={140}
            yAxisWidth={40}
            valueFormatter={(v) => (Number.isFinite(Number(v)) ? Number(v).toLocaleString() : '—')}
          />
        </div>
      )}
      {hasRev && (
        <div>
          <p className="text-xs text-bone-40 mb-1">Revenue</p>
          <LineChart
            data={data}
            index="month"
            categories={['revenue']}
            colors={['#22C55E']}
            height={140}
            yAxisWidth={48}
            valueFormatter={formatMoneyCompact}
          />
        </div>
      )}
    </div>
  );
}
