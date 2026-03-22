import { useState } from 'react';
import type { IntakeFormData, FinancialAidResult } from '../../lib/types';
import { fetchFinancialAid } from '../../lib/claude';
import { FinancialAidCards } from './FinancialAidCards';
import { TabLoader } from '../shared/TabLoader';
import { TabQuestionScreen } from './TabQuestionScreen';
import type { TabQuestion } from './TabQuestions';

interface FinancialAidTabProps {
  intakeData: IntakeFormData;
  result: FinancialAidResult | null;
  onLoaded: (r: FinancialAidResult) => void;
}

const FUNDING_QUESTIONS: TabQuestion[] = [
  {
    id: 'funding_priority',
    label: 'What matters most to you?',
    type: 'multiselect',
    options: [
      { value: 'tuition', label: 'Tuition coverage' },
      { value: 'living', label: 'Living expenses' },
      { value: 'books', label: 'Books & supplies' },
      { value: 'housing', label: 'Housing' },
      { value: 'all', label: 'All of the above' },
    ],
  },
];

export function FinancialAidTab({ intakeData, result, onLoaded }: FinancialAidTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchFinancialAid(intakeData)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <TabLoader message="Matching financial aid programs..." />;

  if (!result) {
    return (
      <TabQuestionScreen
        title="Your Funding Match"
        ctaLabel="Generate My Funding Match →"
        onGenerate={handleGenerate}
        questions={FUNDING_QUESTIONS}
        answers={answers}
        onChange={handleAnswerChange}
        isError={isError}
        onRetry={handleGenerate}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <FinancialAidCards programs={result.matched_programs} />
    </div>
  );
}
