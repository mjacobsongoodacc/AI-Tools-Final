import { useState } from 'react';
import {
  User,
  Building2,
  Shield,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle,
  Database,
  Clock,
  FileText,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { mockWorkspace, mockDocuments } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

function ConfirmDialog({ title, message, confirmLabel, confirmClass, onConfirm, onCancel, requireTyped }) {
  const [typed, setTyped] = useState('');
  const isReady = requireTyped ? typed === requireTyped : true;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={14} className="text-red-500" />
            </div>
            <h2 className="text-slate-900 font-semibold text-base">{title}</h2>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{message}</p>
          {requireTyped && (
            <div>
              <p className="text-slate-500 text-xs mb-2">
                Type <span className="font-mono font-semibold text-slate-700">"{requireTyped}"</span> to confirm
              </p>
              <input
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={requireTyped}
                className="w-full border border-slate-200 focus:border-red-400 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:ring-2 focus:ring-red-400/20"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onCancel} className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl text-sm hover:bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => isReady && onConfirm()}
            disabled={!isReady}
            className={`flex-1 font-semibold py-2.5 rounded-xl text-sm transition-colors ${confirmClass} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <Icon size={16} className="text-slate-500" />
        <h3 className="text-slate-800 font-semibold text-sm">{title}</h3>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function Field({ label, value, editable }) {
  const [val, setVal] = useState(value);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        {editing ? (
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border border-blue-300 focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            autoFocus
          />
        ) : (
          <p className="text-slate-800 text-sm font-medium">{val}</p>
        )}
      </div>
      {editable && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-4">
          {saved && <CheckCircle size={14} className="text-green-500" />}
          {editing ? (
            <button onClick={save} className="text-blue-500 hover:text-blue-600 text-xs font-medium">Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-slate-600 text-xs font-medium">Edit</button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteDoc, setShowDeleteDoc] = useState(false);
  const [showDeleteWorkspace, setShowDeleteWorkspace] = useState(false);
  const [deleteDocTarget, setDeleteDocTarget] = useState(mockDocuments[0]?.name || '');

  const handleDeleteWorkspace = () => {
    logout();
    navigate('/');
  };

  const retentionDate = new Date(
    new Date(mockWorkspace.createdAt).getTime() + mockWorkspace.retentionDays * 24 * 3600 * 1000
  ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Workspace */}
        <Section title="Workspace" icon={Building2}>
          <Field label="Workspace name" value={mockWorkspace.name} editable />
          <Field label="Plan" value={mockWorkspace.plan} />
          <Field label="Created" value={new Date(mockWorkspace.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
        </Section>

        {/* User info */}
        <Section title="Account" icon={User}>
          <Field label="Full name" value={user?.name || 'Analyst'} editable />
          <Field label="Email address" value={user?.email || ''} />
          <Field label="Role" value={user?.role || 'Analyst'} />
          <div className="pt-2">
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors">
              Change password →
            </button>
          </div>
        </Section>

        {/* Data retention */}
        <Section title="Data & Retention" icon={Shield}>
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700 text-sm font-semibold mb-0.5">Retention policy</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Documents and analysis outputs are retained for <strong>{mockWorkspace.retentionDays} days</strong> from upload.
                    All data is automatically purged after this period. Scheduled purge date: <strong>{retentionDate}</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Database size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700 text-sm font-semibold mb-0.5">Storage & privacy</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). Your documents are never used to train AI models.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700 text-sm font-semibold mb-0.5">Access logs</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    All document access and analysis runs are logged. Logs are available for 90 days and exportable on request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Danger zone */}
        <div className="bg-white border border-red-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-100 bg-red-50/50">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-red-800 font-semibold text-sm">Danger Zone</h3>
          </div>
          <div className="px-5 py-5 space-y-4">
            {/* Delete document */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-slate-800 text-sm font-semibold mb-0.5">Delete a document</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Permanently remove a document and its associated analysis data.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteDoc(true)}
                className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-3.5 py-2 rounded-xl transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {/* Delete workspace */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-slate-800 text-sm font-semibold mb-0.5">Delete workspace</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Permanently delete this workspace, all documents, and all analysis data. This action is irreversible.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteWorkspace(true)}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteDoc && (
        <ConfirmDialog
          title="Delete document"
          message={`This will permanently delete "${deleteDocTarget}" and all associated analysis data. This cannot be undone.`}
          confirmLabel="Delete document"
          confirmClass="bg-red-500 hover:bg-red-600 text-white"
          onConfirm={() => setShowDeleteDoc(false)}
          onCancel={() => setShowDeleteDoc(false)}
        />
      )}

      {showDeleteWorkspace && (
        <ConfirmDialog
          title="Delete workspace"
          message="This will permanently delete your entire workspace including all documents, analysis history, and settings. This action is completely irreversible."
          confirmLabel="Delete workspace"
          confirmClass="bg-red-500 hover:bg-red-600 text-white"
          requireTyped="delete workspace"
          onConfirm={handleDeleteWorkspace}
          onCancel={() => setShowDeleteWorkspace(false)}
        />
      )}
    </AppLayout>
  );
}
