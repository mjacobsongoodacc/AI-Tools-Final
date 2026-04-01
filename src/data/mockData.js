export const mockDocuments = [
  {
    id: 'doc_1',
    name: 'Series_A_Pitch_Deck.pdf',
    type: 'PDF',
    size: '4.2 MB',
    uploadedAt: '2024-03-12T09:14:00Z',
    status: 'Ready',
    pages: 34,
  },
  {
    id: 'doc_2',
    name: 'Financial_Projections_2024.xlsx',
    type: 'XLSX',
    size: '1.8 MB',
    uploadedAt: '2024-03-12T09:18:00Z',
    status: 'Ready',
    pages: null,
  },
  {
    id: 'doc_3',
    name: 'Cap_Table_v3.xlsx',
    type: 'XLSX',
    size: '0.6 MB',
    uploadedAt: '2024-03-13T14:22:00Z',
    status: 'Ready',
    pages: null,
  },
  {
    id: 'doc_4',
    name: 'Technical_Architecture_Overview.docx',
    type: 'DOCX',
    size: '2.1 MB',
    uploadedAt: '2024-03-14T11:05:00Z',
    status: 'Ready',
    pages: 18,
  },
  {
    id: 'doc_5',
    name: 'Customer_Reference_Letters.pdf',
    type: 'PDF',
    size: '0.9 MB',
    uploadedAt: '2024-03-15T08:47:00Z',
    status: 'Processing',
    pages: 8,
  },
];

export const mockActivity = [
  { id: 1, type: 'upload', message: 'Customer_Reference_Letters.pdf uploaded', time: '2 hours ago', icon: 'upload' },
  { id: 2, type: 'analysis', message: 'Full analysis completed for Series A package', time: '5 hours ago', icon: 'zap' },
  { id: 3, type: 'upload', message: 'Technical_Architecture_Overview.docx uploaded', time: '1 day ago', icon: 'upload' },
  { id: 4, type: 'export', message: 'Executive Summary exported as PDF', time: '1 day ago', icon: 'download' },
  { id: 5, type: 'upload', message: 'Cap_Table_v3.xlsx uploaded', time: '2 days ago', icon: 'upload' },
  { id: 6, type: 'analysis', message: 'KPI extraction completed — 12 metrics found', time: '2 days ago', icon: 'zap' },
  { id: 7, type: 'upload', message: 'Financial_Projections_2024.xlsx uploaded', time: '3 days ago', icon: 'upload' },
  { id: 8, type: 'upload', message: 'Series_A_Pitch_Deck.pdf uploaded', time: '3 days ago', icon: 'upload' },
];

export const mockAnalysis = {
  runAt: '2024-03-15T10:30:00Z',
  duration: '42 seconds',
  documentsAnalyzed: 4,

  executiveSummary: {
    confidence: 87,
    content: `Nexus AI is a B2B SaaS platform providing automated supply-chain risk intelligence to mid-market manufacturers. The company was incorporated in Delaware in 2021 and is headquartered in Austin, TX. As of the date of this review, Nexus AI has raised $2.3M in pre-seed funding from notable angels including former Palantir executives.

The company's core product ingests supplier data feeds, news, and regulatory filings to produce real-time risk scores and alerts. The technical moat appears moderate — the proprietary risk-scoring model is trained on 18 months of labeled incident data, though the underlying NLP stack relies on standard transformer architectures. Customer concentration is a concern: the top three customers represent approximately 67% of ARR.

Revenue grew from $180K ARR in Q1 2023 to $1.4M ARR in Q4 2023, representing ~678% year-over-year growth. The company is requesting $8M in Series A financing to fund a 12-person GTM expansion and accelerate model development. Burn rate is approximately $210K/month with a stated 14-month runway at current cash.

Overall, Nexus AI presents a compelling growth narrative with real customer traction but warrants careful scrutiny of customer concentration, competitive differentiation, and the technical claims surrounding proprietary data advantages.`,
    citations: [
      { doc: 'Doc 1', page: 3 },
      { doc: 'Doc 1', page: 7 },
      { doc: 'Doc 2', page: 1 },
      { doc: 'Doc 4', page: 2 },
    ],
  },

  kpis: [
    { id: 1, metric: 'Annual Recurring Revenue (ARR)', value: '$1.4M', source: 'Doc 2, p.1', confidence: 'high', confidenceScore: 94 },
    { id: 2, metric: 'ARR Growth YoY', value: '678%', source: 'Doc 2, p.1', confidence: 'high', confidenceScore: 91 },
    { id: 3, metric: 'Monthly Burn Rate', value: '$210K', source: 'Doc 1, p.28', confidence: 'medium', confidenceScore: 74 },
    { id: 4, metric: 'Runway (months)', value: '14 months', source: 'Doc 1, p.28', confidence: 'medium', confidenceScore: 70 },
    { id: 5, metric: 'Gross Margin', value: '71%', source: 'Doc 2, p.4', confidence: 'high', confidenceScore: 88 },
    { id: 6, metric: 'Customer Count', value: '23 paying', source: 'Doc 1, p.12', confidence: 'high', confidenceScore: 95 },
    { id: 7, metric: 'Average Contract Value (ACV)', value: '$60.9K', source: 'Doc 2, p.3', confidence: 'medium', confidenceScore: 72 },
    { id: 8, metric: 'Net Revenue Retention (NRR)', value: '118%', source: 'Doc 2, p.6', confidence: 'medium', confidenceScore: 66 },
    { id: 9, metric: 'Customer Acquisition Cost (CAC)', value: '$12.4K', source: 'Doc 2, p.7', confidence: 'low', confidenceScore: 48 },
    { id: 10, metric: 'LTV:CAC Ratio', value: '4.9x', source: 'Doc 2, p.7', confidence: 'low', confidenceScore: 44 },
    { id: 11, metric: 'Headcount', value: '18 FTE', source: 'Doc 1, p.31', confidence: 'high', confidenceScore: 97 },
    { id: 12, metric: 'Funding Raised to Date', value: '$2.3M', source: 'Doc 1, p.5', confidence: 'high', confidenceScore: 99 },
  ],

  market: {
    confidence: 72,
    bullets: [
      { text: 'Total Addressable Market (TAM) estimated at $18.4B globally for supply-chain risk management software by 2027, per Gartner (cited in pitch deck but unverified independently).', citation: 'Doc 1, p.8' },
      { text: 'Primary competitors include Resilinc, Everstream Analytics, and riskmethods — all VC-backed with 3–7 year head starts. No direct discussion of competitive win/loss rates found in materials.', citation: 'Doc 4, p.6' },
      { text: 'Nexus AI positions against incumbents on price (claimed 60% lower TCO) and ease of integration (no-code connector library with 40+ ERP plugins).', citation: 'Doc 1, p.14' },
      { text: 'Customer base skews toward discrete manufacturing (automotive, electronics) — limited penetration in process industries (pharma, chemicals) despite mention of roadmap intent.', citation: 'Doc 1, p.15' },
      { text: 'Go-to-market motion is predominantly outbound sales-led; no PLG or channel-partner strategy described. Sales cycle averages 4.2 months per the deck.', citation: 'Doc 1, p.22' },
      { text: 'Macro tailwinds are real: post-COVID supply-chain disruptions have elevated board-level attention to supplier risk, and upcoming EU supply-chain due-diligence regulations create compliance-driven demand.', citation: 'Doc 4, p.2' },
      { text: 'International expansion listed as a "Phase 3" priority (post-Series B) — no near-term international revenue anticipated.', citation: 'Doc 1, p.29' },
    ],
  },

  redFlags: [
    {
      id: 1,
      severity: 'High',
      title: 'Customer Concentration Risk',
      description: 'Top 3 customers represent 67% of ARR. Loss of any single top-tier customer would materially impact revenue. No churn or renewal data provided for existing accounts.',
      citation: 'Doc 2, p.5',
      contradicts: null,
    },
    {
      id: 2,
      severity: 'High',
      title: 'Financial Projection Assumptions Unclear',
      description: 'Revenue projections in the financial model show 3x growth in Year 2 based on "pipeline conversion at 35%" — but no pipeline data, historical conversion rates, or rep productivity benchmarks are provided to support this assumption.',
      citation: 'Doc 2, p.9',
      contradicts: 'Doc 1, p.22',
    },
    {
      id: 3,
      severity: 'Medium',
      title: 'Technical Differentiation May Be Overstated',
      description: 'Architecture overview describes "proprietary ML models" but the actual stack (fine-tuned BERT + LightGBM) is standard and replicable. The claimed 18-month data advantage narrows quickly as competitors ingest similar public datasets.',
      citation: 'Doc 4, p.8',
      contradicts: 'Doc 1, p.11',
    },
    {
      id: 4,
      severity: 'Medium',
      title: 'Burn Rate Discrepancy',
      description: 'Pitch deck states $210K/month burn, but bottom-up financial model implies $247K/month in Q4 2024 after planned hires. The 14-month runway claim appears to use the lower figure.',
      citation: 'Doc 2, p.11',
      contradicts: 'Doc 1, p.28',
    },
    {
      id: 5,
      severity: 'Medium',
      title: 'Key Person Dependency',
      description: 'The CTO is listed as the sole architect and primary ML researcher. No succession plan, vesting cliff details, or backup technical leadership is described in any of the provided documents.',
      citation: 'Doc 1, p.31',
      contradicts: null,
    },
    {
      id: 6,
      severity: 'Low',
      title: 'TAM Estimate Uses Single Source',
      description: 'The $18.4B TAM figure cites only one Gartner report from 2022. No bottom-up TAM build or cross-referenced analyst data provided.',
      citation: 'Doc 1, p.8',
      contradicts: null,
    },
    {
      id: 7,
      severity: 'Low',
      title: 'NRR Figure Lacks Methodology',
      description: 'Net Revenue Retention of 118% is stated but no cohort analysis or calculation methodology is provided. With only 23 customers, individual upsells can significantly skew this metric.',
      citation: 'Doc 2, p.6',
      contradicts: null,
    },
  ],

  missingData: [
    { id: 1, item: 'Cap table with fully diluted share count and option pool breakdown', priority: 'Critical', checked: false },
    { id: 2, item: 'Audited or reviewed financial statements (at minimum bank statements for last 12 months)', priority: 'Critical', checked: false },
    { id: 3, item: 'Customer churn data — logo churn and revenue churn by cohort', priority: 'High', checked: false },
    { id: 4, item: 'Reference-able customer contacts (at least 3)', priority: 'High', checked: false },
    { id: 5, item: 'Signed customer contracts or LOIs confirming ARR figures', priority: 'High', checked: false },
    { id: 6, item: 'Competitive win/loss rate data', priority: 'High', checked: false },
    { id: 7, item: 'Detailed headcount plan with titles, compensation, and start dates', priority: 'Medium', checked: true },
    { id: 8, item: 'IP assignment agreements for founders', priority: 'Medium', checked: false },
    { id: 9, item: 'Data privacy and security compliance documentation (SOC 2, GDPR)', priority: 'Medium', checked: false },
    { id: 10, item: 'Board composition and governance documents', priority: 'Medium', checked: true },
    { id: 11, item: 'Prior investor rights agreements and side letters', priority: 'Low', checked: true },
    { id: 12, item: 'LinkedIn profiles / backgrounds for all C-suite members', priority: 'Low', checked: true },
  ],
};

export const mockWorkspace = {
  name: 'Nexus AI — Series A Review',
  plan: 'Professional',
  createdAt: '2024-03-12T09:00:00Z',
  retentionDays: 90,
  analysesRun: 7,
  lastActivity: '2024-03-15T10:30:00Z',
  health: 92,
};
