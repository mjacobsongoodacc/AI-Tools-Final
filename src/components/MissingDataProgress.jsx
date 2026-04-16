import { useState } from 'react';
import { CheckCircledIcon } from '@radix-ui/react-icons';

const PRI_STYLE = {
  High: { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/35' },
  Medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/35' },
  Low: { bg: 'bg-white/5', text: 'text-white/50', border: 'border-white/15' },
};
const PRI_ORDER = ['High', 'Medium', 'Low'];

export default function MissingDataProgress({ missingData }) {
  const [localChecked, setLocalChecked] = useState({});

  if (!missingData || missingData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-bone-40">
        <CheckCircledIcon width={28} height={28} className="text-green-400" />
        <p className="text-sm">All required data present.</p>
      </div>
    );
  }

  const isChecked = (item) => localChecked[item.id] ?? item.checked;
  const checkedCount = missingData.filter((m) => isChecked(m)).length;
  const total = missingData.length;
  const pct = Math.round((checkedCount / total) * 100);

  const R = 32;
  const circ = 2 * Math.PI * R;
  const dash = circ - (pct / 100) * circ;

  const sorted = [...missingData].sort(
    (a, b) => PRI_ORDER.indexOf(a.priority) - PRI_ORDER.indexOf(b.priority)
  );

  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(250,250,250,0.10)" strokeWidth="8" />
          <circle
            cx="40" cy="40" r={R} fill="none"
            stroke="#EF4444" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill="#FAFAFA" fontFamily="DM Mono, monospace">
            {pct}%
          </text>
        </svg>
        <p className="text-bone-40 text-xs text-center">{checkedCount}/{total} resolved</p>
      </div>

      <div className="flex-1 min-w-0 max-h-52 overflow-y-auto space-y-1.5 pr-1">
        {sorted.map((item) => {
          const checked = isChecked(item);
          const p = PRI_STYLE[item.priority] ?? PRI_STYLE.Medium;
          return (
            <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group">
              <div
                onClick={() => setLocalChecked((prev) => ({ ...prev, [item.id]: !checked }))}
                className={`mt-0.5 w-4 h-4 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  checked ? 'bg-accent border-accent' : 'border-bone-25 group-hover:border-accent'
                }`}
              >
                {checked && <CheckCircledIcon width={9} height={9} className="text-white" />}
              </div>
              <span className={`text-xs leading-relaxed flex-1 ${checked ? 'text-bone-40 line-through' : 'text-bone-70'}`}>
                {item.item}
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm border flex-shrink-0 mt-0.5 ${p.bg} ${p.text} ${p.border}`}>
                {item.priority}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
