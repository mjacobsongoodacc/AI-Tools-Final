function dotClass(kind, value, unitEconomics) {
  const u = unitEconomics ?? {};
  if (kind === 'neutral') return 'bg-bone-25';
  if (kind === 'ltvCac') {
    const r = Number(value);
    if (!Number.isFinite(r)) return 'bg-bone-25';
    if (r >= 3) return 'bg-green-500';
    if (r >= 1) return 'bg-amber-500';
    return 'bg-red-500';
  }
  if (kind === 'margin') {
    const g = Number(value);
    if (!Number.isFinite(g)) return 'bg-bone-25';
    if (g >= 70) return 'bg-green-500';
    if (g >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }
  if (kind === 'payback') {
    const p = Number(u.paybackMonths ?? value);
    if (!Number.isFinite(p)) return 'bg-bone-25';
    if (p <= 12) return 'bg-green-500';
    if (p <= 24) return 'bg-amber-500';
    return 'bg-red-500';
  }
  return 'bg-bone-25';
}

function fmtNum(n, suffix = '') {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`;
}

function Card({ label, value, dotKind, dotValue, unitEconomics }) {
  return (
    <div className="bg-black border border-bone-15 rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-bone-40 text-[10px] font-semibold uppercase tracking-wide">{label}</span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass(dotKind, dotValue, unitEconomics)}`} aria-hidden />
      </div>
      <p className="font-mono-data text-2xl font-bold text-white leading-tight">{value}</p>
    </div>
  );
}

export default function UnitEconomicsGrid({ unitEconomics }) {
  if (unitEconomics == null || typeof unitEconomics !== 'object') {
    return (
      <div className="bg-black border border-bone-15 rounded-sm p-8 flex items-center justify-center text-bone-40 text-sm text-center">
        Unit economics will appear once the KPI agent extracts them.
      </div>
    );
  }

  const ltv = unitEconomics.ltv ?? unitEconomics.LTV;
  const cac = unitEconomics.cac ?? unitEconomics.CAC;
  const ratio = unitEconomics.ltvCacRatio ?? unitEconomics.ltv_cac_ratio;
  const gm = unitEconomics.grossMargin ?? unitEconomics.gross_margin;
  const payback = unitEconomics.paybackMonths ?? unitEconomics.payback_months;

  const hasAny =
    [ltv, cac, ratio, gm].some((v) => v != null && v !== '' && Number.isFinite(Number(v)));

  if (!hasAny) {
    return (
      <div className="bg-black border border-bone-15 rounded-sm p-8 flex items-center justify-center text-bone-40 text-sm text-center">
        Unit economics will appear once the KPI agent extracts them.
      </div>
    );
  }

  const ratioNum = Number(ratio);
  const gmNum = Number(gm);
  const gmDisplay = Number.isFinite(gmNum) ? `${gmNum.toFixed(0)}%` : '—';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="LTV" value={fmtNum(ltv, '')} dotKind="neutral" dotValue={0} unitEconomics={unitEconomics} />
        <Card label="CAC" value={fmtNum(cac, '')} dotKind="neutral" dotValue={0} unitEconomics={unitEconomics} />
        <Card
          label="LTV : CAC"
          value={Number.isFinite(ratioNum) ? `${ratioNum.toFixed(1)}x` : '—'}
          dotKind="ltvCac"
          dotValue={ratioNum}
          unitEconomics={unitEconomics}
        />
        <Card
          label="Gross Margin"
          value={gmDisplay}
          dotKind="margin"
          dotValue={gmNum}
          unitEconomics={unitEconomics}
        />
      </div>
      {payback != null && payback !== '' && (
        <div className="flex items-center justify-between gap-3 rounded-sm border border-bone-15 bg-bone-5 px-4 py-2.5">
          <span className="text-bone-40 text-xs font-medium uppercase tracking-wide">Payback</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotClass('payback', payback, unitEconomics)}`} aria-hidden />
            <span className="font-mono-data text-sm font-semibold text-white">{fmtNum(payback, ' mo')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
