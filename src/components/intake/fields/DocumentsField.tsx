interface DocumentsFieldProps {
  selected: string[];
  onChange: (docs: string[]) => void;
}

const DOCUMENTS = [
  {
    id: 'state_id',
    label: 'State ID or Driver\'s License',
    sub: 'Arizona MVD — needed for almost everything',
    critical: true,
  },
  {
    id: 'social_security_card',
    label: 'Social Security Card',
    sub: 'Free replacement at ssa.gov if lost',
    critical: true,
  },
  {
    id: 'birth_certificate',
    label: 'Birth Certificate',
    sub: 'Arizona Vital Records, ~$20',
    critical: false,
  },
  {
    id: 'high_school_diploma_or_ged',
    label: 'High School Diploma or GED',
    sub: 'GED available at ged.com if needed',
    critical: false,
  },
  {
    id: 'school_transcripts',
    label: 'School Transcripts',
    sub: 'Gaps from school changes are expected — not a barrier',
    critical: false,
  },
  {
    id: 'proof_of_foster_care',
    label: 'Proof of Foster Care',
    sub: 'DCS letter, court records, or caseworker contact — unlocks ETV',
    critical: true,
  },
];

export function DocumentsField({ selected, onChange }: DocumentsFieldProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter(d => d !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Which documents do you have?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          Check everything you currently have access to. Missing documents isn't a problem — we'll show you how to get them.
        </p>
      </div>

      <div className="space-y-3">
        {DOCUMENTS.map(doc => {
          const checked = selected.includes(doc.id);
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => toggle(doc.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]
                ${checked
                  ? 'border-[#0F6E56] bg-[#0F6E56]/5'
                  : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center
                  transition-all duration-150
                  ${checked ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-[#E2DED6] bg-white'}`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[#1C1C1A] text-sm">{doc.label}</p>
                    {doc.critical && (
                      <span className="text-xs font-medium text-[#0F6E56] bg-[#0F6E56]/10 px-1.5 py-0.5 rounded">
                        Key document
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B6A65] text-xs mt-0.5">{doc.sub}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#6B6A65] bg-[#F5F3EE] rounded-lg px-4 py-3">
        Don't have everything — that's okay. We'll show you exactly how to get each document.
      </p>
    </div>
  );
}
