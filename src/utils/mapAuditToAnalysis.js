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

function detectRecommendation(text) {
  if (/\bPASS\b/.test(text)) return 'PASS';
  if (/\bFAIL\b/.test(text)) return 'FAIL';
  if (/\bWATCH\b/.test(text)) return 'WATCH';
  return 'WATCH';
}

export function mapAuditToAnalysis(raw) {
  let data;

  if (typeof raw === 'string') {
    // n8n returned a raw markdown memo string — normalise into structured shape
    data = {
      final_memo: raw,
      investment_recommendation: detectRecommendation(raw),
      overall_diligence_score: 5,
      audit_findings: [],
      additional_flags: [],
      confidence_scores: {},
      contradictions_found: [],
    };
  } else {
    // Already a structured JSON object — use fields with safe defaults
    data = {
      final_memo: raw.final_memo ?? '',
      investment_recommendation:
        raw.investment_recommendation ?? detectRecommendation(raw.final_memo ?? ''),
      overall_diligence_score: raw.overall_diligence_score ?? 5,
      audit_findings: Array.isArray(raw.audit_findings) ? raw.audit_findings : [],
      additional_flags: Array.isArray(raw.additional_flags) ? raw.additional_flags : [],
      confidence_scores: raw.confidence_scores ?? {},
      contradictions_found: Array.isArray(raw.contradictions_found)
        ? raw.contradictions_found
        : [],
    };
  }

  const score = data.overall_diligence_score;

  return {
    executiveSummary: {
      content: data.final_memo,
      confidence: score * 10,
      citations: [],
    },

    // KPI extraction comes from specialist agents — leave empty for now
    kpis: [],

    market: {
      // Market intelligence comes from specialist agents — leave empty for now
      bullets: [],
      confidence: score * 10,
    },

    redFlags: data.audit_findings.map((finding, index) => ({
      id: index,
      severity: finding.severity ?? 'Medium',
      title: finding.title ?? finding.name ?? `Finding ${index + 1}`,
      description: finding.description ?? finding.details ?? '',
      citation: '',
      contradicts: null,
    })),

    missingData: data.additional_flags.map((flag, index) => ({
      id: index,
      item: typeof flag === 'string' ? flag : (flag.label ?? flag.item ?? String(flag)),
      priority: 'High',
      checked: false,
    })),
  };
}
