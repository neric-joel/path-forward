import type { TabQuestion, QuestionOption } from './TabQuestions';

const DISPLAY = "'Space Grotesk', sans-serif";
const SANS = "'Inter', system-ui, sans-serif";

interface TabQuestionScreenProps {
  title: string;
  ctaLabel: string;
  onGenerate: () => void;
  questions: TabQuestion[];
  answers: Record<string, string | string[]>;
  onChange: (id: string, value: string | string[]) => void;
  isError?: boolean;
  onRetry?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  children?: React.ReactNode;
}

function PillButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 18px',
        borderRadius: 9999,
        border: `2px solid ${selected ? '#0F6E56' : '#E2DED6'}`,
        background: selected ? 'rgba(15,110,86,0.10)' : '#ffffff',
        color: selected ? '#0F6E56' : '#5C6B63',
        fontFamily: SANS,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s',
        minHeight: 40,
      }}
    >
      {selected && <span style={{ marginRight: 6, fontWeight: 700 }}>✓</span>}
      {label}
    </button>
  );
}

function QuestionBlock({
  question,
  answer,
  onChange,
}: {
  question: TabQuestion;
  answer: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}) {
  const options: QuestionOption[] = question.sensitive
    ? [...question.options, { value: 'rather_not_say', label: "I'd rather not say" }]
    : question.options;

  if (question.type === 'radio') {
    const current = (answer as string) ?? '';
    return (
      <div>
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: '#1A2A22', marginBottom: 10 }}>
          {question.label}
          {question.sensitive && (
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 12, color: '#6B6A65', marginLeft: 8 }}>
              (private — never shown in summaries)
            </span>
          )}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {options.map(opt => (
            <PillButton
              key={opt.value}
              label={opt.label}
              selected={current === opt.value}
              onClick={() => onChange(current === opt.value ? '' : opt.value)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'multiselect') {
    const current = (answer as string[]) ?? [];
    return (
      <div>
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: '#1A2A22', marginBottom: 10 }}>
          {question.label}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {options.map(opt => {
            const selected = current.includes(opt.value);
            return (
              <PillButton
                key={opt.value}
                label={opt.label}
                selected={selected}
                onClick={() => {
                  const next = selected
                    ? current.filter(v => v !== opt.value)
                    : [...current, opt.value];
                  onChange(next);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

export function TabQuestionScreen({
  title,
  ctaLabel,
  onGenerate,
  questions,
  answers,
  onChange,
  isError,
  onRetry,
  disabled,
  disabledReason,
  children,
}: TabQuestionScreenProps) {
  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '40px 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 22,
          color: '#1A2A22',
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {title}
      </h2>

      {/* Optional children (e.g. school picker) */}
      {children}

      {/* Questions */}
      {questions.length > 0 && (
        <div
          style={{
            background: '#F5F2EC',
            borderRadius: 16,
            border: '1px solid #E2DED6',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <p
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              color: '#6B6A65',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Optional — helps us personalize your results
          </p>
          {questions.map(q => (
            <QuestionBlock
              key={q.id}
              question={q}
              answer={answers[q.id]}
              onChange={value => onChange(q.id, value)}
            />
          ))}
        </div>
      )}

      {/* Generate button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={disabled ? undefined : onGenerate}
          disabled={!!disabled}
          style={{
            fontFamily: SANS,
            fontSize: 15,
            fontWeight: 600,
            color: disabled ? '#6B6A65' : '#ffffff',
            background: disabled ? '#E2DED6' : '#0F6E56',
            border: 'none',
            borderRadius: 10,
            padding: '14px 24px',
            minHeight: 52,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            width: '100%',
          }}
          onMouseEnter={e => {
            if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0a4f3e';
          }}
          onMouseLeave={e => {
            if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0F6E56';
          }}
        >
          {ctaLabel}
        </button>

        {disabled && disabledReason && (
          <p style={{ fontFamily: SANS, fontSize: 13, color: '#6B6A65', textAlign: 'center', margin: 0 }}>
            {disabledReason}
          </p>
        )}

        {questions.length > 0 && (
          <p style={{ fontFamily: SANS, fontSize: 12, color: '#6B6A65', textAlign: 'center', margin: 0 }}>
            All questions are optional. Skip any you'd prefer not to answer.
          </p>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div
          style={{
            background: '#FFF7ED',
            border: '1px solid #FDBA74',
            borderRadius: 12,
            padding: '12px 16px',
          }}
        >
          <p style={{ fontFamily: SANS, fontSize: 13, color: '#D85A30', margin: 0 }}>
            Something went wrong — showing demo data instead.{' '}
            <button
              onClick={onRetry}
              style={{ fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#D85A30' }}
            >
              Try again
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
