import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult, RoadmapResult } from '../../lib/types';
import { fetchRoadmap } from '../../lib/claude';
import { SemesterRoadmap } from './SemesterRoadmap';
import { SectionIntro } from './SectionIntro';

interface RoadmapTabProps {
  intakeData: IntakeFormData;
  result: RoadmapResult | null;
  schoolResult: SchoolMatchResult | null;
  onLoaded: (r: RoadmapResult) => void;
}

export function RoadmapTab({ intakeData, result, schoolResult, onLoaded }: RoadmapTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const topSchoolId = schoolResult?.school_matches?.[0]?.id ?? '';

  const handleGenerate = () => {
    if (!topSchoolId) return;
    setIsLoading(true);
    setIsError(false);
    fetchRoadmap(intakeData, topSchoolId)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (!result) {
    // Gate: need school matches first
    if (!schoolResult) {
      return (
        <SectionIntro
          icon="🗓️"
          title="Your Semester Roadmap"
          description="See your full path to graduation — semester by semester, with tasks, costs, and funding mapped out for each phase."
          ctaLabel="Map My Semesters →"
          isLoading={false}
          isError={false}
          onGenerate={() => {}}
          disabled
          disabledReason="Generate your School Matches first — the roadmap is built around your top-matched school."
        />
      );
    }

    return (
      <SectionIntro
        icon="🗓️"
        title="Your Semester Roadmap"
        description={`See your full path to graduation at ${schoolResult.school_matches[0]?.name ?? 'your matched school'} — semester by semester, with tasks, costs, and funding mapped out.`}
        ctaLabel="Map My Semesters →"
        note="Uses AI to build a phased plan based on your top school match."
        isLoading={isLoading}
        isError={isError}
        onGenerate={handleGenerate}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SemesterRoadmap roadmap={result.semester_roadmap} />
    </div>
  );
}
