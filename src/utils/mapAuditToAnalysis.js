/**
 * mapAuditToAnalysis
 *
 * Converts the raw n8n webhook response into the shape expected by the
 * Analysis page (matching the mockAnalysis structure).
 *
 * The n8n "Respond to Webhook" node may return either:
 *   - A plain markdown string (the generated memo), or
 *   - A structured JSON object with known fields
 */

import { normalizeN8nWebhookResponse } from './normalizeN8nWebhookResponse';

/** Strip ```json ... ``` (anywhere in string) or parse whole string as JSON. */
function tryParseLooseJson(text) {
  if (typeof text !== 'string') return null;
  let t = text.trim();
  if (!t) return null;
  const fence = /```(?:json)?\s*([\s\S]*?)```/im.exec(t);
  if (fence) t = fence[1].trim();
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function pickNonEmptyString(v) {
  return typeof v === 'string' && v.trim() ? v : '';
}

/**
 * LangChain / OpenAI nodes often return `output` as an object or an array of
 * content parts, not a plain string.
 */
function agentFieldToText(val, depth = 0) {
  if (val == null || depth > 12) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    return val
      .map((x) => agentFieldToText(x, depth + 1))
      .filter(Boolean)
      .join('');
  }
  if (typeof val === 'object') {
    if (typeof val.text === 'string') return val.text;
    if (typeof val.content === 'string') return val.content;
    if (Array.isArray(val.content)) return agentFieldToText(val.content, depth + 1);
    if (val.type === 'text' && typeof val.text === 'string') return val.text;
    if (typeof val.message?.content === 'string') return val.message.content;
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '';
    }
  }
  return '';
}

function pickDeclaredAuditFields(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {
      final_memo: '',
      investment_recommendation: undefined,
      overall_diligence_score: undefined,
      audit_findings: undefined,
      additional_flags: undefined,
      confidence_scores: undefined,
      contradictions_found: undefined,
    };
  }
  const memo =
    obj.final_memo ??
    obj.finalMemo ??
    obj.memo ??
    obj.diligence_memo ??
    obj.executive_summary ??
    obj.executiveSummary ??
    obj.report ??
    obj.diligenceReport;
  return {
    final_memo:
      typeof memo === 'string'
        ? memo
        : memo != null && memo !== ''
        ? String(memo)
        : '',
    investment_recommendation: obj.investment_recommendation,
    overall_diligence_score: obj.overall_diligence_score,
    audit_findings: obj.audit_findings,
    additional_flags: obj.additional_flags,
    confidence_scores: obj.confidence_scores,
    contradictions_found: obj.contradictions_found,
  };
}

/**
 * Startup Diligence workflow: Audit Agent asks for final_memo in JSON, but n8n
 * LangChain agent nodes usually return the model reply in `output` / `text` /
 * `message.content` as a string (often JSON-in-a-string). Merge those shapes.
 */
function coerceAuditDataFromWebhook(raw) {
  const empty = () => ({
    final_memo: '',
    investment_recommendation: 'WATCH',
    overall_diligence_score: 5,
    audit_findings: [],
    additional_flags: [],
    confidence_scores: {},
    contradictions_found: [],
  });

  if (raw == null) return empty();

  if (typeof raw === 'string') {
    const parsed = tryParseLooseJson(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const picked = pickDeclaredAuditFields(parsed);
      const base = empty();
      return {
        ...base,
        ...picked,
        investment_recommendation:
          picked.investment_recommendation ??
          detectRecommendation(picked.final_memo || raw),
        overall_diligence_score: picked.overall_diligence_score ?? base.overall_diligence_score,
        audit_findings: Array.isArray(picked.audit_findings)
          ? picked.audit_findings
          : base.audit_findings,
        additional_flags: Array.isArray(picked.additional_flags)
          ? picked.additional_flags
          : base.additional_flags,
        confidence_scores:
          picked.confidence_scores && typeof picked.confidence_scores === 'object'
            ? picked.confidence_scores
            : base.confidence_scores,
        contradictions_found: Array.isArray(picked.contradictions_found)
          ? picked.contradictions_found
          : base.contradictions_found,
      };
    }
    return {
      ...empty(),
      final_memo: raw,
      investment_recommendation: detectRecommendation(raw),
    };
  }

  if (Array.isArray(raw)) {
    if (raw.length === 0) return empty();
    return coerceAuditDataFromWebhook(raw[0]);
  }

  if (typeof raw !== 'object') {
    return { ...empty(), final_memo: String(raw) };
  }

  const flat = pickDeclaredAuditFields(raw);
  if (flat.final_memo) {
    const base = empty();
    return {
      ...base,
      ...flat,
      investment_recommendation:
        flat.investment_recommendation ??
        detectRecommendation(flat.final_memo),
      overall_diligence_score: flat.overall_diligence_score ?? base.overall_diligence_score,
      audit_findings: Array.isArray(flat.audit_findings)
        ? flat.audit_findings
        : base.audit_findings,
      additional_flags: Array.isArray(flat.additional_flags)
        ? flat.additional_flags
        : base.additional_flags,
      confidence_scores:
        flat.confidence_scores && typeof flat.confidence_scores === 'object'
          ? flat.confidence_scores
          : base.confidence_scores,
      contradictions_found: Array.isArray(flat.contradictions_found)
        ? flat.contradictions_found
        : base.contradictions_found,
    };
  }

  const blob =
    pickNonEmptyString(raw.output) ||
    agentFieldToText(raw.output) ||
    pickNonEmptyString(raw.text) ||
    agentFieldToText(raw.text) ||
    pickNonEmptyString(raw.response) ||
    agentFieldToText(raw.response) ||
    pickNonEmptyString(raw.data) ||
    agentFieldToText(raw.data) ||
    pickNonEmptyString(raw.message?.content) ||
    agentFieldToText(raw.message) ||
    pickNonEmptyString(raw.choices?.[0]?.message?.content) ||
    '';

  if (blob.trim()) {
    const parsed = tryParseLooseJson(blob);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const fromParsed = pickDeclaredAuditFields(parsed);
      const base = empty();
      return {
        ...base,
        ...fromParsed,
        final_memo:
          fromParsed.final_memo ||
          (typeof parsed.summary === 'string' ? parsed.summary : '') ||
          blob,
        investment_recommendation:
          fromParsed.investment_recommendation ??
          detectRecommendation(fromParsed.final_memo || blob),
        overall_diligence_score:
          fromParsed.overall_diligence_score ?? base.overall_diligence_score,
        audit_findings: Array.isArray(fromParsed.audit_findings)
          ? fromParsed.audit_findings
          : Array.isArray(raw.audit_findings)
          ? raw.audit_findings
          : base.audit_findings,
        additional_flags: Array.isArray(fromParsed.additional_flags)
          ? fromParsed.additional_flags
          : Array.isArray(raw.additional_flags)
          ? raw.additional_flags
          : base.additional_flags,
        confidence_scores:
          fromParsed.confidence_scores && typeof fromParsed.confidence_scores === 'object'
            ? fromParsed.confidence_scores
            : base.confidence_scores,
        contradictions_found: Array.isArray(fromParsed.contradictions_found)
          ? fromParsed.contradictions_found
          : base.contradictions_found,
      };
    }
    return {
      ...empty(),
      final_memo: blob,
      investment_recommendation: detectRecommendation(blob),
      audit_findings: Array.isArray(raw.audit_findings) ? raw.audit_findings : [],
      additional_flags: Array.isArray(raw.additional_flags) ? raw.additional_flags : [],
    };
  }

  const base = empty();
  return {
    ...base,
    ...flat,
    audit_findings: Array.isArray(flat.audit_findings)
      ? flat.audit_findings
      : base.audit_findings,
    additional_flags: Array.isArray(flat.additional_flags)
      ? flat.additional_flags
      : base.additional_flags,
  };
}

function detectRecommendation(text) {
  if (/\bPASS\b/.test(text)) return 'PASS';
  if (/\bFAIL\b/.test(text)) return 'FAIL';
  if (/\bWATCH\b/.test(text)) return 'WATCH';
  return 'WATCH';
}

/** Walk the tree for long strings; parse JSON memos or use longest as memo. */
function extractAuditFromDeepStrings(root) {
  const strings = [];
  function walk(v, depth) {
    if (depth > 18 || v == null) return;
    if (typeof v === 'string') {
      if (v.trim().length > 20) strings.push(v);
      return;
    }
    if (typeof v !== 'object') return;
    if (Array.isArray(v)) {
      v.forEach((x) => walk(x, depth + 1));
      return;
    }
    Object.values(v).forEach((x) => walk(x, depth + 1));
  }
  walk(root, 0);
  strings.sort((a, b) => b.length - a.length);
  for (const s of strings) {
    const parsed = tryParseLooseJson(s);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const p = pickDeclaredAuditFields(parsed);
      if (p.final_memo?.trim()) {
        return {
          final_memo: p.final_memo,
          investment_recommendation:
            p.investment_recommendation ?? detectRecommendation(p.final_memo),
          overall_diligence_score: p.overall_diligence_score ?? 5,
          audit_findings: Array.isArray(p.audit_findings) ? p.audit_findings : [],
          additional_flags: Array.isArray(p.additional_flags) ? p.additional_flags : [],
          confidence_scores:
            p.confidence_scores && typeof p.confidence_scores === 'object'
              ? p.confidence_scores
              : {},
          contradictions_found: Array.isArray(p.contradictions_found)
            ? p.contradictions_found
            : [],
        };
      }
    }
  }
  if (strings[0]?.trim()) {
    const longest = strings[0];
    return {
      final_memo: longest,
      investment_recommendation: detectRecommendation(longest),
      overall_diligence_score: 5,
      audit_findings: [],
      additional_flags: [],
      confidence_scores: {},
      contradictions_found: [],
    };
  }
  return null;
}

/** Objects n8n often nests the real payload under (first hit wins for reads). */
function n8nSearchRoots(root) {
  const out = [];
  const seen = new Set();
  function add(x) {
    if (x == null || typeof x !== 'object' || Array.isArray(x)) return;
    if (seen.has(x)) return;
    seen.add(x);
    out.push(x);
  }
  add(root);
  if (root && typeof root === 'object' && !Array.isArray(root)) {
    for (const k of [
      'data',
      'result',
      'results',
      'output',
      'response',
      'payload',
      'body',
      'analysis',
      'report',
      'json',
      'item',
      'record',
    ]) {
      add(root[k]);
    }
  }
  return out;
}

function firstDefined(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null) {
      if (typeof v === 'string' && !v.trim()) continue;
      return v;
    }
  }
  return undefined;
}

function firstFiniteNumber(...vals) {
  for (const v of vals) {
    if (v === '' || v == null) continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

/** First non-empty array among candidates (or last array if all empty). */
function firstNonEmptyArray(...candidates) {
  let lastArr;
  for (const c of candidates) {
    if (!Array.isArray(c)) continue;
    lastArr = c;
    if (c.length > 0) return c;
  }
  return lastArr ?? [];
}

function pickAcross(roots, getter) {
  for (const o of roots) {
    const v = getter(o);
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && !v.trim()) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    return v;
  }
  return undefined;
}

function normalizeKPIsFromRaw(raw) {
  if (raw == null) return [];
  let rows = raw;
  if (!Array.isArray(rows)) {
    if (rows && typeof rows === 'object') {
      rows = Object.entries(rows).map(([metric, value]) => ({ metric, value: String(value) }));
    } else {
      return [];
    }
  }
  return rows.map((k, i) => ({
    id: i,
    metric: k.metric ?? k.name ?? k.label ?? k.key ?? k.title ?? `Metric ${i + 1}`,
    value: k.value != null ? String(k.value) : k.val != null ? String(k.val) : '—',
    confidence: k.confidence ?? 'medium',
    confidenceScore: (() => {
      const s = Number(k.confidenceScore ?? k.confidence_score ?? k.score ?? 50);
      return s <= 10 ? s * 10 : s;
    })(),
  }));
}

function normalizeKPIs(roots) {
  const raw = pickAcross(roots, (o) =>
    firstDefined(
      o.kpis,
      o.metrics,
      o.kpi_extraction,
      o.kpiExtraction,
      o.KPIs,
      o.extracted_kpis,
      o.extractedKpis,
      o.kpi_list,
      o.kpiList,
      o.kpi_data,
      o.kpiData,
      o.kpi_rows,
      o.kpiRows
    )
  );
  return normalizeKPIsFromRaw(raw ?? []);
}

function normalizeComparableRow(row, index) {
  if (row == null) return null;
  if (typeof row === 'string') {
    return { name: row, stage: '', metrics: {} };
  }
  if (typeof row !== 'object') return null;
  const name =
    row.name ??
    row.company ??
    row.companyName ??
    row.title ??
    row.label ??
    `Company ${index + 1}`;
  const stage = row.stage ?? row.round ?? row.funding ?? '';
  let metrics = row.metrics;
  if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
    const skip = new Set([
      'name',
      'company',
      'companyName',
      'title',
      'label',
      'stage',
      'round',
      'funding',
      'metrics',
      'id',
    ]);
    metrics = {};
    for (const [k, v] of Object.entries(row)) {
      if (skip.has(k)) continue;
      if (v != null && typeof v !== 'object') metrics[k] = v;
    }
  }
  return { name: String(name), stage: String(stage), metrics };
}

function normalizeComparablesList(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((row, i) => normalizeComparableRow(row, i)).filter(Boolean);
}

function mergeConfidenceObjects(roots, auditScores) {
  const merged = {};
  const apply = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    for (const [k, v] of Object.entries(obj)) {
      if (v == null || v === '') continue;
      const n = Number(v);
      if (!Number.isFinite(n)) continue;
      merged[k] = n <= 10 ? n * 10 : n;
    }
  };
  for (const o of roots) {
    apply(o.confidence_scores);
    apply(o.confidenceScores);
    apply(o.agent_confidence);
    apply(o.agentConfidence);
    apply(o.confidence);
  }
  apply(auditScores);
  return merged;
}

function buildMarketBlock(roots, score) {
  const nested = pickAcross(roots, (o) => o.market) ?? {};
  const nestedMap = typeof nested === 'object' && !Array.isArray(nested) ? nested : {};

  const comparablesRaw = firstNonEmptyArray(
    Array.isArray(nestedMap.comparables) ? nestedMap.comparables : [],
    pickAcross(roots, (o) => o.comparables ?? o.comparable_companies ?? o.comparableCompanies ?? o.comps)
  );

  const bullets = firstNonEmptyArray(
    Array.isArray(nestedMap.bullets) ? nestedMap.bullets : [],
    pickAcross(roots, (o) => o.market_bullets ?? o.marketBullets ?? o.market_summary_bullets)
  );

  const tam = firstFiniteNumber(
    nestedMap.tam,
    pickAcross(roots, (o) => o.tam ?? o.TAM ?? o.market_tam ?? o.marketTam)
  );
  const sam = firstFiniteNumber(
    nestedMap.sam,
    pickAcross(roots, (o) => o.sam ?? o.SAM ?? o.market_sam ?? o.marketSam)
  );
  const som = firstFiniteNumber(
    nestedMap.som,
    pickAcross(roots, (o) => o.som ?? o.SOM ?? o.market_som ?? o.marketSom)
  );

  const conf = firstFiniteNumber(
    nestedMap.confidence,
    pickAcross(roots, (o) => o.market_confidence ?? o.marketConfidence),
    score * 10
  );

  return {
    bullets: Array.isArray(bullets) ? bullets : [],
    confidence: conf,
    comparables: normalizeComparablesList(comparablesRaw),
    tam,
    sam,
    som,
  };
}

function buildFinancialsBlock(roots) {
  const nested = pickAcross(roots, (o) => o.financials) ?? {};
  const fin = typeof nested === 'object' && !Array.isArray(nested) ? nested : {};

  const arrHistory = firstNonEmptyArray(
    Array.isArray(fin.arrHistory) ? fin.arrHistory : [],
    Array.isArray(fin.arr_history) ? fin.arr_history : [],
    pickAcross(roots, (o) => o.arrHistory ?? o.arr_history ?? o.revenue_history ?? o.ARR_history ?? o.arr_series)
  );

  const burnHistory = firstNonEmptyArray(
    Array.isArray(fin.burnHistory) ? fin.burnHistory : [],
    Array.isArray(fin.burn_history) ? fin.burn_history : [],
    pickAcross(roots, (o) =>
      o.burnHistory ?? o.burn_history ?? o.monthly_burn ?? o.monthlyBurnSeries ?? o.cash_burn_series
    )
  );

  const runwayMonths = firstFiniteNumber(
    fin.runwayMonths,
    fin.runway_months,
    pickAcross(roots, (o) => o.runwayMonths ?? o.runway_months ?? o.runway ?? o.months_runway)
  );

  const unitEconomics =
    firstDefined(
      fin.unitEconomics,
      fin.unit_economics,
      pickAcross(roots, (o) => o.unitEconomics ?? o.unit_economics ?? o.unit_economics_summary)
    ) ?? null;

  return {
    arrHistory,
    burnHistory,
    runwayMonths,
    unitEconomics,
  };
}

function buildTractionTimeline(roots) {
  return firstNonEmptyArray(
    pickAcross(roots, (o) => o.tractionTimeline),
    pickAcross(roots, (o) => o.traction_timeline ?? o.traction ?? o.monthly_traction ?? o.growth_timeline)
  );
}

function buildCapTable(roots) {
  return firstNonEmptyArray(
    pickAcross(roots, (o) => o.capTable),
    pickAcross(roots, (o) => o.cap_table ?? o.captable ?? o.cap_table_summary)
  );
}

function buildTeam(roots) {
  const t = pickAcross(roots, (o) => o.team) ?? {};
  const teamObj = typeof t === 'object' && !Array.isArray(t) ? t : {};
  const founders = firstNonEmptyArray(
    Array.isArray(teamObj.founders) ? teamObj.founders : [],
    pickAcross(roots, (o) => o.founders ?? o.team_founders)
  );
  const keyPersonRisk =
    Boolean(teamObj.keyPersonRisk) ||
    Boolean(teamObj.key_person_risk) ||
    Boolean(pickAcross(roots, (o) => o.keyPersonRisk ?? o.key_person_risk));
  return { founders, keyPersonRisk };
}

function mergeAuditFindings(data, roots) {
  const fromAudit = Array.isArray(data.audit_findings) ? data.audit_findings : [];
  if (fromAudit.length > 0) return fromAudit;
  const rf = pickAcross(roots, (o) => o.red_flags ?? o.redFlags ?? o.audit_findings ?? o.auditFindings);
  if (Array.isArray(rf) && rf.length > 0) return rf;
  const cf = pickAcross(roots, (o) => o.contradictions_found ?? o.contradictionsFound);
  return Array.isArray(cf) ? cf : [];
}

function mergeAdditionalFlags(data, roots) {
  const fromAudit = Array.isArray(data.additional_flags) ? data.additional_flags : [];
  if (fromAudit.length > 0) return fromAudit;
  const af = pickAcross(roots, (o) => o.additional_flags ?? o.additionalFlags);
  if (Array.isArray(af) && af.length > 0) return af;
  const gaps = pickAcross(roots, (o) => o.missing_data ?? o.missingData ?? o.data_gaps ?? o.gaps);
  return Array.isArray(gaps) ? gaps : [];
}

export function mapAuditToAnalysis(raw) {
  const normalized = normalizeN8nWebhookResponse(raw);
  // #region agent log
  try{localStorage.setItem('dbg_b7feaf_normalized',JSON.stringify({ts:Date.now(),type:typeof normalized,isArray:Array.isArray(normalized),strValue:typeof normalized==='string'?normalized.slice(0,600):null,keys:typeof normalized==='object'&&normalized!==null&&!Array.isArray(normalized)?Object.keys(normalized).slice(0,20):null,containsExpr:typeof normalized==='string'&&/\{\{.*?\}\}/.test(normalized)}));}catch(e){}
  // #endregion
  let data = coerceAuditDataFromWebhook(normalized);
  // #region agent log
  try{localStorage.setItem('dbg_b7feaf_coerced',JSON.stringify({ts:Date.now(),memoPreview:data.final_memo?.slice(0,600),memoLen:data.final_memo?.length,rec:data.investment_recommendation,findings:data.audit_findings?.length,flags:data.additional_flags?.length,containsExpr:data.final_memo?/\{\{.*?\}\}/.test(data.final_memo):false}));}catch(e){}
  // #endregion

  if (!data.final_memo?.trim()) {
    const deep = extractAuditFromDeepStrings(normalized);
    if (deep) {
      data = {
        ...data,
        ...deep,
        audit_findings:
          data.audit_findings.length > 0 ? data.audit_findings : deep.audit_findings,
        additional_flags:
          data.additional_flags.length > 0 ? data.additional_flags : deep.additional_flags,
      };
    }
  }

  if (!data.final_memo?.trim() && normalized != null) {
    let dump = '';
    try {
      dump =
        typeof normalized === 'string'
          ? normalized
          : JSON.stringify(normalized, null, 2);
    } catch {
      dump = String(normalized);
    }
    if (dump.trim()) {
      data = {
        ...data,
        final_memo:
          `Could not map a diligence memo from this response. If your n8n “Respond to Webhook” body uses a custom shape, align field names with final_memo (or output/text). Raw JSON:\n\n${dump.slice(0, 120000)}`,
      };
    }
  }

  if (!data.final_memo?.trim()) {
    data = {
      ...data,
      final_memo:
        'No memo text was returned. In n8n, open the last execution: confirm “Audit Agent” produced output and “Respond to Webhook” is set to return that item (First Entry JSON / same data).',
    };
  }

  const score = data.overall_diligence_score;
  const roots = n8nSearchRoots(normalized);
  const findingsList = mergeAuditFindings(data, roots);
  const flagsList = mergeAdditionalFlags(data, roots);
  const marketBlock = buildMarketBlock(roots, score);
  const financialsBlock = buildFinancialsBlock(roots);
  const teamBlock = buildTeam(roots);

  return {
    executiveSummary: {
      content: data.final_memo,
      confidence: score * 10,
      citations: [],
    },

    kpis: normalizeKPIs(roots),

    market: marketBlock,

    financials: financialsBlock,

    team: teamBlock,

    capTable: buildCapTable(roots),

    tractionTimeline: buildTractionTimeline(roots),

    redFlags: findingsList
      .filter((f) => f != null && (typeof f === 'object' || typeof f === 'string'))
      .map((finding, index) => {
        if (typeof finding === 'string') {
          return {
            id: index,
            severity: 'Medium',
            title: finding,
            description: '',
            citation: '',
            contradicts: null,
          };
        }
        return {
          id: index,
          severity: finding.severity ?? 'Medium',
          title: finding.title ?? finding.name ?? finding.issue ?? `Finding ${index + 1}`,
          description: finding.description ?? finding.details ?? finding.detail ?? '',
          citation: '',
          contradicts: null,
        };
      }),

    missingData: flagsList.map((flag, index) => ({
      id: index,
      item: typeof flag === 'string' ? flag : (flag.label ?? flag.item ?? flag.message ?? String(flag)),
      priority: (flag && typeof flag === 'object' && flag.priority) || 'High',
      checked: false,
    })),

    recommendation: data.investment_recommendation ?? 'WATCH',
    diligenceScore: Number(data.overall_diligence_score ?? 5),
    confidenceScores: mergeConfidenceObjects(roots, data.confidence_scores),
  };
}
