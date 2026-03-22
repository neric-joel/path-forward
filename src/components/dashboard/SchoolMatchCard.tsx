import type { SchoolMatch } from '../../lib/types';

interface SchoolMatchCardProps {
  school: SchoolMatch;
  rank: number;
}

const FIT_LABEL_STYLES: Record<SchoolMatch['fit_label'], string> = {
  'Strong match': 'bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20',
  'Good match': 'bg-[#BA7517]/10 text-[#BA7517] border-[#BA7517]/20',
  'Worth exploring': 'bg-[#6B6A65]/10 text-[#5C6B63] border-[#6B6A65]/20',
};

const CATEGORY_ICONS: Record<string, string> = {
  financial: '💰',
  academic: '📚',
  housing: '🏠',
  administrative: '📋',
  support: '🤝',
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function CostRow({ label, value, isNegative = false, isBold = false, isGreen = false }: {
  label: string;
  value: number;
  isNegative?: boolean;
  isBold?: boolean;
  isGreen?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${isBold ? 'border-t border-[#E2DED6] mt-1 pt-2.5' : ''}`}>
      <span className={`text-[14px] ${isBold ? 'font-semibold text-[#1A2A22]' : 'text-[#5C6B63]'}`}>{label}</span>
      <span className={`text-[14px] font-medium tabular-nums ${
        isGreen ? 'text-[#0F6E56]' : isBold ? 'text-[#1A2A22] font-bold' : 'text-[#1A2A22]'
      }`}>
        {isNegative && value > 0 ? `−${fmt(value).slice(1)}` : fmt(value)}
      </span>
    </div>
  );
}

export function SchoolMatchCard({ school, rank }: SchoolMatchCardProps) {
  const { cost_breakdown: cb, foster_support: fs, housing_options: ho } = school;

  return (
    <div className="bg-white rounded-2xl border border-[#E2DED6] shadow-sm overflow-hidden
                    hover:shadow-md transition-shadow duration-200">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#F0EDE8]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#E2DED6]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {String(rank).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-[#1A2A22] font-bold text-xl leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {school.name}
              </h3>
              <p className="text-[13px] text-[#5C6B63] mt-0.5 capitalize">
                {school.type === 'community_college' ? 'Community College' : 'University'}
              </p>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${FIT_LABEL_STYLES[school.fit_label]}`}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {school.fit_label}
          </span>
        </div>

        {/* Why this school */}
        <p className="text-[15px] text-[#5C6B63] leading-relaxed italic border-l-2 border-[#0F6E56]/30 pl-3">
          {school.why_this_school}
        </p>

        {/* Fit reasons */}
        <ul className="mt-3 space-y-1.5">
          {school.fit_reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px] text-[#5C6B63]">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#0F6E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Cost Breakdown */}
      <div className="px-6 py-4 border-b border-[#F0EDE8]">
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#5C6B63] mb-3">
          Cost Breakdown — Annual
        </h4>
        <div className="space-y-0">
          <CostRow label="Tuition (in-state, full-time)" value={cb.annual_tuition} />
          <CostRow label="Pell Grant (confirmed)" value={cb.pell_grant_applied} isNegative isGreen />
          <CostRow label="AZ Tuition Waiver" value={cb.annual_tuition - cb.pell_grant_applied} isNegative isGreen />
          <div className="border-t border-dashed border-[#E2DED6] my-1.5" />
          <CostRow label="Tuition remaining" value={cb.tuition_after_waiver} />
          <CostRow label="Mandatory fees (est.)" value={cb.mandatory_fees} />
          <CostRow label="Books & supplies (est.)" value={cb.books_supplies} />
          <CostRow label="Housing (est.)" value={cb.housing_estimate} />
          <CostRow label="Transportation (est.)" value={cb.transportation} />
          <CostRow label="Personal (est.)" value={cb.personal} />
          <CostRow label="Total cost of attendance" value={cb.total_cost_of_attendance} isBold />
          {cb.etv_applied > 0 && (
            <CostRow label="ETV Grant (confirmed)" value={cb.etv_applied} isNegative isGreen />
          )}
          {cb.other_scholarships > 0 && (
            <CostRow label="Other scholarships" value={cb.other_scholarships} isNegative isGreen />
          )}
          <div className="border-t-2 border-[#1C1C1A] mt-2 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-[#1A2A22]">Est. out-of-pocket</span>
              <span className={`text-xl font-bold tabular-nums ${
                cb.estimated_out_of_pocket <= 0 ? 'text-[#0F6E56]' : 'text-[#1A2A22]'
              }`}>
                {cb.estimated_out_of_pocket <= 0 ? '$0 — fully covered' : fmt(cb.estimated_out_of_pocket)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-[#5C6B63] mt-3 italic">{cb.cost_note}</p>
      </div>

      {/* Foster Support */}
      <div className="px-6 py-4 border-b border-[#F0EDE8]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#5C6B63]">
            Foster Support
          </h4>
          {fs.has_champion && (
            <span className="text-xs bg-[#0F6E56]/10 text-[#0F6E56] font-semibold px-2 py-0.5 rounded-full">
              Campus Champion ✓
            </span>
          )}
        </div>
        <p className="text-[15px] font-semibold text-[#1A2A22] mb-2">{fs.program_name}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {fs.services.slice(0, 6).map((svc, i) => (
            <span key={i} className="text-[13px] bg-[#F5F2EC] text-[#4A4A45] px-2.5 py-1 rounded-full border border-[#E2DED6]">
              {svc}
            </span>
          ))}
          {fs.services.length > 6 && (
            <span className="text-[13px] text-[#5C6B63] px-1 py-0.5">+{fs.services.length - 6} more</span>
          )}
        </div>
        <a href={fs.program_url} target="_blank" rel="noopener noreferrer"
          className="text-[13px] text-[#0F6E56] font-semibold hover:underline flex items-center gap-1">
          {fs.contact}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Housing */}
      <div className="px-6 py-4">
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#5C6B63] mb-2">
          Housing
        </h4>
        <div className="flex items-start gap-4 flex-wrap">
          {ho.on_campus_available && ho.on_campus_cost && (
            <div className="bg-[#F5F2EC] rounded-xl px-4 py-2.5 text-center">
              <p className="text-[13px] text-[#5C6B63]">On-campus / yr</p>
              <p className="text-lg font-bold text-[#1A2A22]">{fmt(ho.on_campus_cost)}</p>
            </div>
          )}
          <div className="bg-[#F5F2EC] rounded-xl px-4 py-2.5 text-center">
            <p className="text-[13px] text-[#5C6B63]">Nearby rent / mo</p>
            <p className="text-lg font-bold text-[#1A2A22]">{fmt(ho.avg_nearby_rent)}</p>
          </div>
        </div>
        <p className="text-[13px] text-[#5C6B63] mt-2 italic">{ho.housing_note}</p>

        {/* Source links */}
        {school.source_urls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {school.source_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="text-[13px] text-[#0F6E56] hover:underline flex items-center gap-0.5">
                Official page {i + 1}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { CATEGORY_ICONS };
