import { useState, useRef, useCallback } from 'react';
import {
  UploadIcon,
  FileTextIcon,
  TableIcon,
  TrashIcon,
  CheckCircledIcon,
  InfoCircledIcon,
  ClockIcon,
  Cross2Icon,
  FilePlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import AppLayout from '../components/AppLayout';
import { useDocuments } from '../context/DocumentsContext';

const FILE_ICONS = {
  PDF: FileTextIcon,
  DOCX: FileTextIcon,
  XLSX: TableIcon,
};

const STATUS_CONFIG = {
  Ready: {
    label: 'Ready',
    className: 'bg-green-500/15 text-green-400 border border-green-500/35',
    icon: CheckCircledIcon,
  },
  Processing: {
    label: 'Processing',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/35',
    icon: ClockIcon,
  },
  Uploading: {
    label: 'Uploading…',
    className: 'bg-white/5 text-white border border-bone-15',
    icon: ReloadIcon,
  },
  Error: {
    label: 'Error',
    className: 'bg-accent/15 text-accent border border-accent/35',
    icon: InfoCircledIcon,
  },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function SortIcon({ column, sortBy, sortDir }) {
  if (sortBy !== column)
    return <ChevronUpIcon width={13} height={13} className="text-bone-25 opacity-0 group-hover:opacity-100" />;
  return sortDir === 'asc'
    ? <ChevronUpIcon width={13} height={13} className="text-accent" />
    : <ChevronDownIcon width={13} height={13} className="text-accent" />;
}

function ConfirmModal({ file, onConfirm, onCancel }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-ink-50 rounded-sm w-full max-w-md border border-bone-15 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bone-15">
          <h2 className="text-white font-semibold text-base">Confirm upload</h2>
          <button onClick={onCancel} className="p-1.5 text-bone-40 hover:text-white hover:bg-bone-5 rounded-sm transition-colors">
            <Cross2Icon width={16} height={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* File info */}
          <div className="flex items-center gap-3 bg-bone-5 border border-bone-15 rounded-sm px-4 py-3">
            <FileTextIcon width={18} height={18} className="text-accent flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{file.name}</p>
              <p className="text-bone-40 text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.name.split('.').pop().toUpperCase()}
              </p>
            </div>
          </div>

          {/* Consent checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-4 h-4 rounded-sm flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                checked ? 'bg-accent border-accent' : 'border-bone-25 group-hover:border-accent'
              }`}
              onClick={() => setChecked((v) => !v)}
            >
              {checked && <CheckCircledIcon width={10} height={10} className="text-white" />}
            </div>
            <span
              className="text-bone-70 text-sm leading-relaxed select-none"
              onClick={() => setChecked((v) => !v)}
            >
              I confirm these documents are authorized for analysis and I have the right to upload them to this platform.
            </span>
          </label>
        </div>

        <div className="flex gap-3 px-6 py-4 bg-bone-5 border-t border-bone-15">
          <button
            onClick={onCancel}
            className="flex-1 bg-black border border-bone-25 text-bone-70 hover:bg-ink-50 hover:text-white font-medium py-2.5 rounded-sm text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => checked && onConfirm()}
            disabled={!checked}
            className="flex-1 bg-accent hover:bg-accent-hover disabled:bg-accent/40 disabled:text-bone-25 text-white font-semibold py-2.5 rounded-sm text-sm transition-colors"
          >
            Upload document
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ doc, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-ink-50 rounded-sm w-full max-w-sm border border-bone-15 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bone-15">
          <h2 className="text-white font-semibold text-base">Delete document</h2>
          <button onClick={onCancel} className="p-1.5 text-bone-40 hover:text-white hover:bg-bone-5 rounded-sm">
            <Cross2Icon width={16} height={16} />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-bone-70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">"{doc.name}"</span>? This removes it from the workspace only — it cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 px-6 py-4 bg-bone-5 border-t border-bone-15">
          <button onClick={onCancel} className="flex-1 bg-black border border-bone-25 text-bone-70 hover:bg-ink-50 font-medium py-2.5 rounded-sm text-sm transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-2.5 rounded-sm text-sm transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Documents() {
  const { docs, uploadDocument, deleteDocument } = useDocuments();
  const [pendingFile, setPendingFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const sortedDocs = [...docs].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy];
    if (sortBy === 'uploadedAt') { av = new Date(av); bv = new Date(bv); }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const validateFile = (file) => {
    if (!file) return false;
    const ok = file.name.match(/\.(pdf|docx|xlsx)$/i);
    if (!ok) {
      alert('Only PDF, DOCX, and XLSX files are accepted.');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File must be under 50 MB.');
      return false;
    }
    return true;
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (validateFile(file)) setPendingFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const confirmUpload = async () => {
    const file = pendingFile;
    setPendingFile(null);
    setUploadError('');
    const result = await uploadDocument(file);
    if (!result.success && !result.skipped) {
      setUploadError(`Upload failed: ${result.error ?? `HTTP ${result.status}`}`);
    }
  };

  const columns = [
    { key: 'name', label: 'File name' },
    { key: 'uploadedAt', label: 'Uploaded' },
    { key: 'type', label: 'Type' },
    { key: 'size', label: 'Size' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <AppLayout title="Documents">
      <div className="max-w-5xl mx-auto space-y-5">

        {uploadError && (
          <div className="flex items-center gap-3 bg-accent/10 border border-accent/35 rounded-sm px-4 py-3">
            <InfoCircledIcon width={15} height={15} className="text-accent flex-shrink-0" />
            <p className="text-white text-sm flex-1">{uploadError}</p>
            <button onClick={() => setUploadError('')} className="text-accent hover:text-accent-hover">
              <Cross2Icon width={15} height={15} />
            </button>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-sm px-6 py-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-bone-15 bg-black hover:border-accent/50 hover:bg-bone-5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className={`w-12 h-12 mx-auto rounded-sm flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-accent/12' : 'bg-bone-5'}`}>
            <UploadIcon width={22} height={22} className={isDragging ? 'text-accent' : 'text-bone-40'} />
          </div>
          <p className="text-bone-70 font-semibold text-base mb-1">
            {isDragging ? 'Drop to upload' : 'Drop files here or click to browse'}
          </p>
          <p className="text-bone-40 text-sm">Accepts PDF, DOCX, XLSX — up to 50 MB each</p>
        </div>

        {/* Document library */}
        <div className="bg-black border border-bone-15 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-bone-15">
            <div className="flex items-center gap-2">
              <FileTextIcon width={16} height={16} className="text-bone-40" />
              <h3 className="text-white font-semibold text-sm">Document Library</h3>
              <span className="text-bone-40 text-xs bg-bone-5 px-2 py-0.5 rounded-full">{docs.length}</span>
            </div>
          </div>

          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 bg-bone-5 rounded-sm flex items-center justify-center mb-4">
                <FilePlusIcon width={26} height={26} className="text-bone-25" />
              </div>
              <h3 className="text-bone-70 font-semibold text-base mb-2">No documents yet</h3>
              <p className="text-bone-40 text-sm max-w-xs leading-relaxed">
                Upload your first document above to add it to your workspace.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2.5 rounded-sm transition-colors"
              >
                <UploadIcon width={15} height={15} />
                Upload first document
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 border-b border-bone-15">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="group text-left px-5 py-3 text-bone-40 font-medium text-xs cursor-pointer hover:text-bone-70 select-none whitespace-nowrap"
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="flex items-center gap-1.5">
                          {col.label}
                          <SortIcon column={col.key} sortBy={sortBy} sortDir={sortDir} />
                        </span>
                      </th>
                    ))}
                    <th className="px-5 py-3 text-bone-40 font-medium text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bone-10">
                  {sortedDocs.map((doc) => {
                    const Icon = FILE_ICONS[doc.type] || FileTextIcon;
                    const s = STATUS_CONFIG[doc.status] || STATUS_CONFIG.Processing;
                    const StatusIcon = s.icon;
                    const isSpinning = doc.status === 'Uploading';
                    return (
                      <tr key={doc.id} className="hover:bg-bone-5 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Icon width={15} height={15} className="text-bone-40 flex-shrink-0" />
                            <span className="text-white font-medium truncate max-w-[180px] sm:max-w-xs">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-bone-40 whitespace-nowrap">{formatDate(doc.uploadedAt)}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-bone-40 text-xs bg-bone-5 px-2 py-0.5 rounded-sm font-mono">{doc.type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-bone-40 whitespace-nowrap">{doc.size}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.className}`}>
                            <StatusIcon width={11} height={11} className={isSpinning ? 'animate-spin' : ''} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setDeleteTarget(doc)}
                            disabled={doc.status === 'Uploading'}
                            className="p-1.5 text-bone-25 hover:text-accent hover:bg-accent/10 rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <TrashIcon width={14} height={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pendingFile && (
        <ConfirmModal
          file={pendingFile}
          onConfirm={confirmUpload}
          onCancel={() => setPendingFile(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          doc={deleteTarget}
          onConfirm={() => { deleteDocument(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AppLayout>
  );
}
