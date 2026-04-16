import BarChart from './charts/BarChart.jsx';

function formatMarket(n) {
  const x = Number(n);
  if (!Number.isFinite(x) || x <= 0) return '—';
  if (x >= 1e9) return `$${(x / 1e9).toFixed(1)}B`;
  if (x >= 1e6) return `$${(x / 1e6).toFixed(0)}M`;
  if (x >= 1e3) return `$${(x / 1e3).toFixed(0)}K`;
  return `$${x.toFixed(0)}`;
}

export default function MarketSizingBars({ market }) {
  const tam = Number(market?.tam ?? 0);
  const sam = Number(market?.sam ?? 0);
  const som = Number(market?.som ?? 0);
  const hasAny = tam > 0 || sam > 0 || som > 0;

  if (!hasAny) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-bone-40 text-sm text-center px-4">
        Market sizing (TAM / SAM / SOM) will populate when the workflow returns <span className="font-mono-data text-xs">market.tam</span>, <span className="font-mono-data text-xs">market.sam</span>, and <span className="font-mono-data text-xs">market.som</span>.
      </div>
    );
  }

  const data = [
    { segment: 'TAM', value: tam },
    { segment: 'SAM', value: sam },
    { segment: 'SOM', value: som },
  ];

  let percentOfSom = null;
  if (som > 0 && sam > 0) percentOfSom = ((som / sam) * 100).toFixed(1);
  else if (som > 0 && tam > 0) percentOfSom = ((som / tam) * 100).toFixed(1);

  const headline =
    percentOfSom != null
      ? `Targeting ${percentOfSom}% of a ${formatMarket(som)} SOM`
      : `Beachhead SOM: ${formatMarket(som)}`;

  return (
    <div className="space-y-3">
      <p className="text-sm text-bone-70 leading-snug">{headline}</p>
      <BarChart
        data={data}
        index="segment"
        categories={['value']}
        layout="horizontal"
        height={200}
        valueFormatter={formatMarket}
        yAxisWidth={44}
        showDataLabels
      />
      <p className="text-[11px] text-bone-40">
        SOM label shows modeled near-term revenue pool; scales use compact currency notation.
      </p>
    </div>
  );
}
