/**
 * TabQuestions — compact contextual question form shown inside a tab
 * before the user clicks "Generate". All questions are optional.
 *
 * Sensitive fields (housing_situation, income_status) are marked with
 * sensitive: true — they receive an "I'd rather not say" option automatically
 * and their values are never echoed in visible UI (Safeguards 7 & 8).
 */

export interface QuestionOption {
  value: string;
  label: string;
}

export interface TabQuestion {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'radio';
  options: QuestionOption[];
  sensitive?: boolean; // adds "I'd rather not say" and marks as privacy-protected
  placeholder?: string;
}

interface TabQuestionsProps {
  questions: TabQuestion[];
  answers: Record<string, string | string[]>;
  onChange: (id: string, value: string | string[]) => void;
}

export function TabQuestions({ questions, answers, onChange }: TabQuestionsProps) {
  return (
    <div className="bg-[#F5F3EE] rounded-2xl border border-[#E2DED6] px-5 py-4 space-y-4 mb-4">
      <p className="text-[13px] font-semibold text-[#6B6A65] uppercase tracking-wide">
        Optional — helps us personalize your results
      </p>

      {questions.map(q => {
        const optionsWithSensitive: QuestionOption[] = q.sensitive
          ? [...q.options, { value: 'rather_not_say', label: "I'd rather not say" }]
          : q.options;

        return (
          <div key={q.id}>
            <label className="block text-[15px] font-semibold text-[#1C1C1A] mb-2">
              {q.label}
              {q.sensitive && (
                <span className="ml-2 text-[12px] font-normal text-[#6B6A65]">
                  (private — never shown in summaries)
                </span>
              )}
            </label>

            {q.type === 'select' && (
              <select
                value={(answers[q.id] as string) ?? ''}
                onChange={e => onChange(q.id, e.target.value)}
                className="w-full max-w-sm text-[15px] text-[#1C1C1A] bg-white border border-[#E2DED6]
                           rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0F6E56]
                           transition-colors appearance-none"
              >
                <option value="">{q.placeholder ?? 'Select one (optional)'}</option>
                {optionsWithSensitive.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {q.type === 'radio' && (
              <div className="flex flex-wrap gap-2">
                {optionsWithSensitive.map(opt => {
                  const selected = (answers[q.id] as string) === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChange(q.id, selected ? '' : opt.value)}
                      className={`px-4 py-2 rounded-xl text-[14px] font-medium border-2 transition-all min-h-[44px]
                        ${selected
                          ? 'border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]'
                          : 'border-[#E2DED6] bg-white text-[#6B6A65] hover:border-[#0F6E56]/40'
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'multiselect' && (
              <div className="flex flex-wrap gap-2">
                {optionsWithSensitive.map(opt => {
                  const current = (answers[q.id] as string[]) ?? [];
                  const selected = current.includes(opt.value);
                  const toggle = () => {
                    const next = selected
                      ? current.filter(v => v !== opt.value)
                      : [...current, opt.value];
                    onChange(q.id, next);
                  };
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={toggle}
                      className={`px-4 py-2 rounded-xl text-[14px] font-medium border-2 transition-all min-h-[44px]
                        ${selected
                          ? 'border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]'
                          : 'border-[#E2DED6] bg-white text-[#6B6A65] hover:border-[#0F6E56]/40'
                        }`}
                    >
                      {selected && <span className="mr-1.5">✓</span>}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
