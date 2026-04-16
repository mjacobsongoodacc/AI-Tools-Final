import { BarChartIcon } from '@radix-ui/react-icons';

const ACCENT_COLORS = ['#FAFAFA', '#EF4444', 'rgba(250,250,250,0.60)', 'rgba(250,250,250,0.40)', '#F59E0B'];

export default function ComparableCompanies({ comparables }) {
  if (!comparables || comparables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <div className="w-10 h-10 bg-bone-5 rounded-sm flex items-center justify-center">
          <BarChartIcon width={18} height={18} className="text-bone-25" />
        </div>
        <p className="text-bone-40 text-sm">Comparable company analysis will appear here once the n8n workflow outputs a <code className="mx-1 px-1.5 py-0.5 bg-bone-5 rounded-sm text-bone-70 text-xs">market.comparables</code> array.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {comparables.map((company, i) => (
        <div
          key={i}
          className="border border-bone-15 rounded-sm overflow-hidden bg-black"
          style={{ borderLeftWidth: 3, borderLeftColor: ACCENT_COLORS[i % ACCENT_COLORS.length] }}
        >
          <div className="px-4 py-3 border-b border-bone-15 flex items-center justify-between gap-2">
            <p className="text-white font-semibold text-sm truncate">{company.name}</p>
            {company.stage && (
              <span className="text-xs text-bone-40 bg-bone-5 px-2 py-0.5 rounded-full flex-shrink-0">{company.stage}</span>
            )}
          </div>
          {company.metrics && (
            <div className="px-4 py-3 space-y-1.5">
              {Object.entries(company.metrics).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-bone-40 text-xs">{k}</span>
                  <span className="font-mono-data text-xs text-white font-medium">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
