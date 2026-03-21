interface SectionIntroProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  note?: string;
  isLoading: boolean;
  isError: boolean;
  onGenerate: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function SectionIntro({
  icon,
  title,
  description,
  ctaLabel,
  note,
  isLoading,
  isError,
  onGenerate,
  disabled = false,
  disabledReason,
}: SectionIntroProps) {
  return (
    <div className="max-w-lg mx-auto mt-8 mb-4">
      <div className="bg-white rounded-2xl border border-[#E2DED6] shadow-sm px-6 py-8 text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h2
          className="text-2xl font-semibold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {title}
        </h2>
        <p className="text-[15px] text-[#6B6A65] mb-6 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>

        {disabled && disabledReason ? (
          <div className="bg-[#F5F3EE] rounded-xl px-4 py-3 mb-4 text-[13px] text-[#6B6A65]">
            {disabledReason}
          </div>
        ) : (
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className={`
              w-full max-w-xs mx-auto flex items-center justify-center gap-2
              py-3.5 rounded-xl font-semibold text-base transition-all min-h-[48px]
              ${isLoading
                ? 'bg-[#E2DED6] text-[#6B6A65] cursor-not-allowed'
                : 'bg-[#0F6E56] hover:bg-[#0a4f3e] text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              ctaLabel
            )}
          </button>
        )}

        {isError && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
            <p className="text-[13px] text-[#D85A30]">
              Something went wrong — showing demo data instead.{' '}
              <button
                onClick={onGenerate}
                className="underline font-semibold hover:text-[#BA7517]"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        {note && !isLoading && !disabled && (
          <p className="mt-4 text-[13px] text-[#6B6A65]/70">{note}</p>
        )}
      </div>
    </div>
  );
}
