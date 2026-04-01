import { Link } from 'react-router-dom';
import {
  FileText,
  BarChart3,
  Clock,
  ShieldCheck,
  Upload,
  Zap,
  Download,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { mockDocuments, mockActivity, mockWorkspace } from '../data/mockData';

const readyDocs = mockDocuments.filter((d) => d.status === 'Ready').length;

const overviewCards = [
  {
    label: 'Documents Uploaded',
    value: mockDocuments.length,
    sub: `${readyDocs} ready · ${mockDocuments.length - readyDocs} processing`,
    icon: FileText,
    color: 'blue',
    to: '/documents',
  },
  {
    label: 'Analyses Run',
    value: mockWorkspace.analysesRun,
    sub: 'Last run 5 hours ago',
    icon: BarChart3,
    color: 'purple',
    to: '/analysis',
  },
  {
    label: 'Last Activity',
    value: '2h ago',
    sub: 'Document uploaded',
    icon: Clock,
    color: 'amber',
    to: '/documents',
  },
  {
    label: 'Workspace Health',
    value: `${mockWorkspace.health}%`,
    sub: 'All systems operational',
    icon: ShieldCheck,
    color: 'green',
    to: '/settings',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', value: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400', value: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', value: 'text-amber-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400', value: 'text-green-400' },
};

const activityIconMap = {
  upload: Upload,
  zap: Zap,
  download: Download,
};

const activityColorMap = {
  upload: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  analysis: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  export: 'text-green-400 bg-green-500/10 border-green-500/20',
};

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-slate-900 font-bold text-xl sm:text-2xl tracking-tight">
              Good morning, {firstName}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {mockWorkspace.name}
            </p>
          </div>
          <Link
            to="/analysis"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Zap size={15} />
            Run Analysis
          </Link>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {overviewCards.map(({ label, value, sub, icon: Icon, color, to }) => {
            const c = colorMap[color];
            return (
              <Link
                key={label}
                to={to}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                  <Icon size={17} className={c.icon} />
                </div>
                <p className={`text-2xl font-bold ${c.value} mb-0.5`}>{value}</p>
                <p className="text-slate-700 text-sm font-medium leading-tight">{label}</p>
                <p className="text-slate-400 text-xs mt-1 leading-tight">{sub}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Activity feed */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-slate-500" />
                <h3 className="text-slate-800 font-semibold text-sm">Recent Activity</h3>
              </div>
              <Link
                to="/documents"
                className="text-blue-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {mockActivity.map((item) => {
                const Icon = activityIconMap[item.icon] || Zap;
                const colorClass = activityColorMap[item.type] || activityColorMap.analysis;
                return (
                  <div key={item.id} className="flex items-start gap-3.5 px-5 py-3.5">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-sm leading-snug">{item.message}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions + workspace info */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="bg-white border border-slate-200 rounded-2xl">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-slate-800 font-semibold text-sm">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-1.5">
                <Link
                  to="/documents"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Upload size={13} className="text-blue-500" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">Upload document</span>
                  <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" />
                </Link>
                <Link
                  to="/analysis"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Zap size={13} className="text-purple-500" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">Run analysis</span>
                  <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" />
                </Link>
                <Link
                  to="/analysis"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Download size={13} className="text-green-500" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">Export report</span>
                  <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Workspace info */}
            <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-blue-400" />
                <h3 className="text-slate-200 font-semibold text-sm">Workspace</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Plan</span>
                  <span className="text-slate-300 text-xs font-medium bg-blue-500/15 border border-blue-500/20 rounded-full px-2 py-0.5">{mockWorkspace.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Documents</span>
                  <span className="text-slate-300 text-xs font-medium">{mockDocuments.length} / 50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Analyses</span>
                  <span className="text-slate-300 text-xs font-medium">{mockWorkspace.analysesRun} / unlimited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Retention</span>
                  <span className="text-slate-300 text-xs font-medium">{mockWorkspace.retentionDays} days</span>
                </div>
              </div>

              {/* Health bar */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-500 text-xs">Health</span>
                  <span className="text-green-400 text-xs font-semibold">{mockWorkspace.health}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${mockWorkspace.health}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
