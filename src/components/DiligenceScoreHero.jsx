import { useEffect, useState } from 'react';
import DiligenceScoreGauge from './DiligenceScoreGauge';

const REC_STYLES = {
  PASS: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/35', dot: 'bg-green-500' },
  WATCH: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/35', dot: 'bg-amber-500' },
  FAIL: { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/35', dot: 'bg-accent' },
};

export default function DiligenceScoreHero({ companyName, recommendation, diligenceScore }) {
  const [displayScore, setDisplayScore] = useState(0);
  const rec = REC_STYLES[recommendation] ?? REC_STYLES.WATCH;

  useEffect(() => {
    const target = diligenceScore;
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(+(eased * target).toFixed(1));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [diligenceScore]);

  return (
    <div className="bg-black border border-bone-15 rounded-sm px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="flex-1 min-w-0">
        <p className="text-bone-40 text-xs font-medium uppercase tracking-widest mb-1">Company Under Review</p>
        <h2 className="text-white font-bold text-2xl truncate">{companyName || 'Unknown Company'}</h2>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 flex-wrap sm:flex-nowrap justify-center sm:justify-end">
        <div className="text-center">
          <p className="text-bone-40 text-xs mb-1">Recommendation</p>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${rec.bg} ${rec.text} ${rec.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${rec.dot}`} />
            {recommendation ?? 'WATCH'}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-bone-40 text-xs">Diligence Score</p>
          <DiligenceScoreGauge displayScore={displayScore} diligenceScore={diligenceScore} />
        </div>
      </div>
    </div>
  );
}
