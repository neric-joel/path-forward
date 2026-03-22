interface DocumentsFieldProps {
  selected: string[];
  onChange: (docs: string[]) => void;
}

const DOCUMENTS = [
  { id: 'state_id',                   label: 'State ID / Driver\'s License', critical: true },
  { id: 'social_security_card',       label: 'Social Security Card',          critical: true },
  { id: 'birth_certificate',          label: 'Birth Certificate',             critical: false },
  { id: 'high_school_diploma_or_ged', label: 'Diploma or GED',               critical: false },
  { id: 'school_transcripts',         label: 'School Transcripts',            critical: false },
  { id: 'proof_of_foster_care',       label: 'Proof of Foster Care',          critical: true },
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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Which documents do you have?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          Check all you have. Missing docs is okay — we'll show you how to get them.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {DOCUMENTS.map(doc => {
          const checked = selected.includes(doc.id);
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => toggle(doc.id)}
              className={`text-left px-3.5 py-3 rounded-xl border-2 transition-all duration-150 min-h-[60px]
                ${checked
                  ? 'border-[#0F6E56] bg-[#0F6E56]/5'
                  : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                  ${checked ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-[#E2DED6] bg-white'}`}>
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1C1C1A] text-sm leading-snug">{doc.label}</p>
                  {doc.critical && (
                    <span className="inline-block text-[10px] font-medium text-[#0F6E56] bg-[#0F6E56]/10 px-1.5 py-0.5 rounded mt-0.5">
                      Key doc
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#6B6A65] bg-[#F5F3EE] rounded-xl px-4 py-3">
        Don't have everything — that's okay. We'll show you exactly how to get each document.
      </p>
    </div>
  );
}
