import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult, SchoolPreferences } from '../../lib/types';
import { fetchSchoolMatches } from '../../lib/claude';
import { SchoolMatches } from './SchoolMatches';
import { TabLoader } from '../shared/TabLoader';
import { TabQuestionScreen } from './TabQuestionScreen';
import type { TabQuestion } from './TabQuestions';

interface SchoolsTabProps {
  intakeData: IntakeFormData;
  result: SchoolMatchResult | null;
  onLoaded: (r: SchoolMatchResult) => void;
}

const SCHOOL_QUESTIONS: TabQuestion[] = [
  {
    id: 'location',
    label: 'Where in Arizona are you located?',
    type: 'radio',
    options: [
      { value: 'phoenix_metro', label: 'Phoenix Metro' },
      { value: 'tucson', label: 'Tucson' },
      { value: 'flagstaff', label: 'Flagstaff' },
      { value: 'other', label: 'Other / Not sure' },
    ],
  },
  {
    id: 'priorities',
    label: "What's important in a school?",
    type: 'multiselect',
    options: [
      { value: 'low_cost', label: 'Low cost' },
      { value: 'online_options', label: 'Online classes' },
      { value: 'foster_support', label: 'Foster youth support' },
      { value: 'close_to_home', label: 'Close to home' },
      { value: 'campus_life', label: 'Campus life' },
    ],
  },
  {
    id: 'transportation',
    label: 'How will you get around?',
    type: 'radio',
    options: [
      { value: 'own_car', label: 'Own car' },
      { value: 'public_transit', label: 'Public transit' },
      { value: 'walking_biking', label: 'Walking/biking' },
      { value: 'fully_online', label: 'Fully online' },
    ],
  },
];

export function SchoolsTab({ intakeData, result, onLoaded }: SchoolsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildPrefs = (): SchoolPreferences => ({
    location: (answers.location as string) || undefined,
    priorities: (answers.priorities as string[])?.length ? (answers.priorities as string[]) : undefined,
    transportation: (answers.transportation as string) || undefined,
  });

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchSchoolMatches(intakeData, buildPrefs())
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <TabLoader message="Finding schools that fit..." />;

  if (!result) {
    return (
      <TabQuestionScreen
        title="Your School Matches"
        ctaLabel="Generate School Matches →"
        onGenerate={handleGenerate}
        questions={SCHOOL_QUESTIONS}
        answers={answers}
        onChange={handleAnswerChange}
        isError={isError}
        onRetry={handleGenerate}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <SchoolMatches
        schools={result.school_matches}
        otherOptionsNote={result.other_options_note}
      />
    </div>
  );
}
