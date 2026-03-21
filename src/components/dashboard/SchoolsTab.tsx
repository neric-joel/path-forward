import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult } from '../../lib/types';
import { fetchSchoolMatches } from '../../lib/claude';
import { SchoolMatches } from './SchoolMatches';
import { SectionIntro } from './SectionIntro';

interface SchoolsTabProps {
  intakeData: IntakeFormData;
  result: SchoolMatchResult | null;
  onLoaded: (r: SchoolMatchResult) => void;
}

export function SchoolsTab({ intakeData, result, onLoaded }: SchoolsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchSchoolMatches(intakeData)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (!result) {
    return (
      <SectionIntro
        icon="🏫"
        title="Your School Matches"
        description="Find the best-fit Arizona schools for your situation — with full cost breakdowns showing exactly how your grants and waivers stack."
        ctaLabel="Find My School Matches →"
        note="Uses AI to match you with Arizona schools based on your goal, location, and funding."
        isLoading={isLoading}
        isError={isError}
        onGenerate={handleGenerate}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SchoolMatches
        schools={result.school_matches}
        otherOptionsNote={result.other_options_note}
      />
    </div>
  );
}
