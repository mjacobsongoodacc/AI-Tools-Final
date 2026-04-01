import { useState } from 'react';
import {
  Zap,
  FileText,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  Download,
  Copy,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockAnalysis, mockDocuments } from '../data/mockData';

// --- Shared sub-components ---

function CitationBadge({ doc, page }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
      <ExternalLink size={10} />
      {page ? `${doc}, p.${page}` : doc}
    </span>
  );
}

function ConfidencePill({ score, label }) {
  const color =
    score >= 80
      ? 'bg-green-50 border-green-200 text-green-700'
      : score >= 55
      ? 'bg-amber-50 border-amber-200 text-amber-700'
      : 'bg-red-50 border-red-200 text-red-600';
  const dot =
    score >= 80 ? 'bg-green-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label ?? `${score}%`}
    </span>
  );
}

function Skeleton({ lines = 4 }) {
  return (
    <div className="space-y-3 py-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-100 rounded-lg"
          style={{ width: `${85 + (i % 3) * 5}%` }}
        />
      ))}
    </div>
  );
}

// --- Tab panels ---

function ExecutiveSummaryPanel({ data, loading }) {
  if (loading) return <Skeleton lines={8} />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ConfidencePill score={data.confidence} label={`${data.confidence}% confidence`} />
        <div className="flex flex-wrap gap-2">
          {data.citations.map((c, i) => (
            <CitationBadge key={i} doc={c.doc} page={c.page} />
          ))}
        </div>
      </div>
      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
        {data.content.split('\n\n').map((para, i) => (
          <p key={i} className="mb-4 text-slate-700 text-sm leading-relaxed last:mb-0">{para}</p>
        ))}
      </div>
    </div>
  );
}

function SortIcon({ column, sortBy, sortDir }) {
  if (sortBy !== column) return <ChevronUp size={12} className="text-slate-300 opacity-0 group-hover:opacity-100" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-blue-500" />
    : <ChevronDown size={12} className="text-blue-500" />;
}

function KPIPanel({ data, loading }) {
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const sorted = [...data].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy];
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <Skeleton lines={12} />;

  const cols = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' },
    { key: 'source', label: 'Source' },
    { key: 'confidenceScore', label: 'Confidence' },
  ];

  return (
    <div className="overflow-x-auto -mx-6 px-0">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-y border-slate-100">
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                className="group text-left px-5 py-3 text-slate-500 font-medium text-xs cursor-pointer hover:text-slate-700 whitespace-nowrap select-none"
                onClick={() => handleSort(col.key)}
              >
                <span className="flex items-center gap-1.5">
                  {col.label}
                  <SortIcon column={col.key} sortBy={sortBy} sortDir={sortDir} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.map((kpi) => (
            <tr key={kpi.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3.5 text-slate-800 font-medium">{kpi.metric}</td>
              <td className="px-5 py-3.5 text-slate-700 font-mono text-sm">{kpi.value}</td>
              <td className="px-5 py-3.5">
                <CitationBadge doc={kpi.source.split(',')[0]} page={kpi.source.split('p.')[1]} />
              </td>
              <td className="px-5 py-3.5">
                <ConfidencePill score={kpi.confidenceScore} label={`${kpi.confidenceScore}%`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarketPanel({ data, loading }) {
  if (loading) return <Skeleton lines={7} />;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <ConfidencePill score={data.confidence} label={`${data.confidence}% confidence`} />
      </div>
      <ul className="space-y-3">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-500 font-bold text-xs">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-sm leading-relaxed">{b.text}</p>
              {b.citation && (
                <div className="mt-1.5">
                  <CitationBadge doc={b.citation.split(',')[0]} page={b.citation.split('p.')[1]?.trim()} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SEVERITY_CONFIG = {
  High: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700 border-red-200', title: 'text-red-900', dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200', title: 'text-amber-900', dot: 'bg-amber-500' },
  Low: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600 border-slate-200', title: 'text-slate-800', dot: 'bg-slate-400' },
};

function RedFlagsPanel({ data, loading }) {
  const [filter, setFilter] = useState('All');
  if (loading) return <Skeleton lines={10} />;

  const filtered = filter === 'All' ? data : data.filter((f) => f.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'High', 'Medium', 'Low'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filter === s
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {s === 'All' ? `All (${data.length})` : `${s} (${data.filter((f) => f.severity === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((flag) => {
          const c = SEVERITY_CONFIG[flag.severity];
          return (
            <div key={flag.id} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <h4 className={`${c.title} font-semibold text-sm`}>{flag.title}</h4>
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${c.badge}`}>
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-2">{flag.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CitationBadge doc={flag.citation.split(',')[0]} page={flag.citation.split('p.')[1]?.trim()} />
                    {flag.contradicts && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        contradicts <CitationBadge doc={flag.contradicts.split(',')[0]} page={flag.contradicts.split('p.')[1]?.trim()} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PRIORITY_CONFIG = {
  Critical: { badge: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' },
  High: { badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  Medium: { badge: 'bg-blue-100 text-blue-700 border border-blue-200', dot: 'bg-blue-400' },
  Low: { badge: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

function MissingDataPanel({ data: initialData, loading }) {
  const [items, setItems] = useState(initialData);
  if (loading) return <Skeleton lines={12} />;

  const toggle = (id) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  const unchecked = items.filter((i) => !i.checked).length;

  return (
    <div className="space-y-4">
      <p className="text-slate-500 text-sm">
        <span className="font-semibold text-slate-700">{unchecked}</span> items outstanding
      </p>
      <div className="space-y-2">
        {items.map((item) => {
          const p = PRIORITY_CONFIG[item.priority];
          return (
            <label
              key={item.id}
              className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-colors ${
                item.checked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  item.checked ? 'bg-green-500 border-green-500' : 'border-slate-300'
                }`}
                onClick={() => toggle(item.id)}
              >
                {item.checked && <CheckCircle size={10} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.item}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${p.badge}`}>
                {item.priority}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Analysis page ---

const TABS = [
  { id: 'summary', label: 'Executive Summary', icon: FileText },
  { id: 'kpis', label: 'KPI Extraction', icon: TrendingUp },
  { id: 'market', label: 'Market & Competitive', icon: BarChart3 },
  { id: 'flags', label: 'Red Flags', icon: AlertTriangle, badge: (d) => d.redFlags.filter(f => f.severity === 'High').length },
  { id: 'missing', label: 'Missing Data', icon: ClipboardList, badge: (d) => d.missingData.filter(i => !i.checked).length },
];

export default function Analysis() {
  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setHasRun(false);
    await new Promise((r) => setTimeout(r, 3200));
    setLoading(false);
    setHasRun(true);
    setActiveTab('summary');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockAnalysis.executiveSummary.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readyCount = mockDocuments.filter((d) => d.status === 'Ready').length;

  return (
    <AppLayout
      title="Analysis"
      actions={
        hasRun && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 bg-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="flex items-center gap-1.5 bg-[#0F172A] text-slate-200 hover:bg-slate-800 px-3 py-2 rounded-lg text-sm transition-colors">
              <Download size={14} />
              Export PDF
            </button>
          </div>
        )
      }
    >
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Run panel */}
        <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-lg mb-1">Run Full Analysis</h2>
              <p className="text-slate-400 text-sm leading-snug">
                {readyCount} document{readyCount !== 1 ? 's' : ''} ready ·{' '}
                AI will extract KPIs, surface red flags, and generate a memo
              </p>
            </div>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20 flex-shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap size={16} />
                  {hasRun ? 'Re-run Analysis' : 'Run Analysis'}
                </>
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-5 space-y-2.5">
              {['Parsing documents…', 'Building knowledge index…', 'Extracting KPIs…', 'Detecting red flags…'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'border-blue-400 border-t-transparent animate-spin' : 'border-slate-600'
                  }`} />
                  <span className={`text-xs ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output panel */}
        {(hasRun || loading) && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-none">
              {TABS.map(({ id, label, icon: Icon, badge }) => {
                const badgeCount = badge ? badge(mockAnalysis) : null;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                    {badgeCount > 0 && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        id === 'flags' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'summary' && (
                <ExecutiveSummaryPanel data={mockAnalysis.executiveSummary} loading={loading} />
              )}
              {activeTab === 'kpis' && (
                <KPIPanel data={mockAnalysis.kpis} loading={loading} />
              )}
              {activeTab === 'market' && (
                <MarketPanel data={mockAnalysis.market} loading={loading} />
              )}
              {activeTab === 'flags' && (
                <RedFlagsPanel data={mockAnalysis.redFlags} loading={loading} />
              )}
              {activeTab === 'missing' && (
                <MissingDataPanel data={mockAnalysis.missingData} loading={loading} />
              )}
            </div>
          </div>
        )}

        {/* Pre-run empty state */}
        {!hasRun && !loading && (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <BarChart3 size={26} className="text-slate-300" />
            </div>
            <h3 className="text-slate-600 font-semibold text-base mb-2">No analysis yet</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Click "Run Analysis" above to generate your executive memo, KPIs, red flags, and more.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
