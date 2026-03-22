import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult, RoadmapResult, RoadmapPreferences } from '../../lib/types';
import { fetchRoadmap } from '../../lib/claude';
import { SemesterRoadmap } from './SemesterRoadmap';
import { TabLoader } from '../shared/TabLoader';
import { TabQuestionScreen } from './TabQuestionScreen';
import type { TabQuestion } from './TabQuestions';

interface RoadmapTabProps {
  intakeData: IntakeFormData;
  result: RoadmapResult | null;
  schoolResult: SchoolMatchResult | null;
  onLoaded: (r: RoadmapResult) => void;
}

const FIT_LABEL_STYLES: Record<string, { border: string; bg: string; color: string }> = {
  'Strong match': { border: 'rgba(15,110,86,0.2)', bg: 'rgba(15,110,86,0.08)', color: '#0F6E56' },
  'Good match':   { border: 'rgba(186,117,23,0.2)', bg: 'rgba(186,117,23,0.08)', color: '#BA7517' },
  'Worth exploring': { border: 'rgba(107,106,101,0.2)', bg: 'rgba(107,106,101,0.08)', color: '#5C6B63' },
};

const ROADMAP_QUESTIONS: TabQuestion[] = [
  {
    id: 'attendance',
    label: 'Are you planning to attend full-time or part-time?',
    type: 'radio',
    options: [
      { value: 'full_time', label: 'Full-time' },
      { value: 'part_time', label: 'Part-time' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'housing_preference',
    label: 'Where will you live?',
    type: 'radio',
    options: [
      { value: 'on_campus', label: 'On campus' },
      { value: 'off_campus', label: 'Off campus nearby' },
      { value: 'staying', label: 'Staying where I am' },
      { value: 'not_sure', label: 'Not sure' },
    ],
  },
];

const DISPLAY = "'Space Grotesk', sans-serif";
const SANS = "'Inter', system-ui, sans-serif";

export function RoadmapTab({ intakeData, result, schoolResult, onLoaded }: RoadmapTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const effectiveSchoolId = selectedSchoolId ?? schoolResult?.school_matches?.[0]?.id ?? null;

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildPrefs = (): RoadmapPreferences => ({
    attendance: (answers.attendance as RoadmapPreferences['attendance']) || undefined,
    housing_preference: (answers.housing_preference as RoadmapPreferences['housing_preference']) || undefined,
  });

  const handleGenerate = () => {
    if (!effectiveSchoolId) return;
    setIsLoading(true);
    setIsError(false);
    fetchRoadmap(intakeData, effectiveSchoolId, buildPrefs())
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <TabLoader message="Creating your roadmap..." />;

  // Gate: no school matches yet
  if (!schoolResult) {
    return (
      <div style={{ maxWidth: 480, margin: '48px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: '#1A2A22', marginBottom: 8 }}>
          Your Semester Roadmap
        </p>
        <p style={{ fontFamily: SANS, fontSize: 14, color: '#5C6B63', marginBottom: 24 }}>
          Generate your School Matches first — the roadmap is built around your chosen school.
        </p>
        <button
          disabled
          style={{
            background: '#E2DED6', color: '#6B6A65', border: 'none',
            borderRadius: 10, padding: '14px 24px', fontSize: 15,
            fontWeight: 600, cursor: 'not-allowed', width: '100%',
          }}
        >
          Map My Semesters →
        </button>
      </div>
    );
  }

  // Show generated roadmap
  if (result) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-5">
        <button
          onClick={() => onLoaded(null as unknown as RoadmapResult)}
          style={{
            fontFamily: SANS, fontSize: 13, color: '#0F6E56', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: 24, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          ← Try a different school
        </button>
        <SemesterRoadmap roadmap={result.semester_roadmap} />
      </div>
    );
  }

  const selectedSchool = schoolResult.school_matches.find(s => s.id === effectiveSchoolId)
    ?? schoolResult.school_matches[0];

  // School picker as children passed into TabQuestionScreen
  const schoolPicker = (
    <div>
      <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: '#1A2A22', marginBottom: 10 }}>
        Choose Your School
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {schoolResult.school_matches.map(school => {
          const isSelected = school.id === effectiveSchoolId;
          const fitStyle = FIT_LABEL_STYLES[school.fit_label] ?? FIT_LABEL_STYLES['Worth exploring'];
          return (
            <button
              key={school.id}
              type="button"
              onClick={() => setSelectedSchoolId(school.id)}
              style={{
                textAlign: 'left',
                borderRadius: 16,
                border: `2px solid ${isSelected ? '#0F6E56' : '#E2DED6'}`,
                background: isSelected ? 'rgba(15,110,86,0.05)' : '#ffffff',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#0F6E56' : '#E2DED6'}`,
                  background: isSelected ? '#0F6E56' : 'transparent',
                  flexShrink: 0, marginTop: 2,
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 600, fontFamily: SANS,
                  padding: '2px 8px', borderRadius: 9999,
                  border: `1px solid ${fitStyle.border}`,
                  background: fitStyle.bg,
                  color: fitStyle.color,
                }}>
                  {school.fit_label}
                </span>
              </div>
              <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: '#1A2A22', margin: 0, lineHeight: 1.3 }}>
                {school.name}
              </p>
              <p style={{ fontFamily: SANS, fontSize: 12, color: '#5C6B63', margin: '2px 0 0' }}>
                {school.type === 'community_college' ? 'Community College' : 'University'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <TabQuestionScreen
      title="Your Semester Roadmap"
      ctaLabel={`Build My Roadmap for ${selectedSchool?.name ?? 'this school'} →`}
      onGenerate={handleGenerate}
      questions={ROADMAP_QUESTIONS}
      answers={answers}
      onChange={handleAnswerChange}
      isError={isError}
      onRetry={handleGenerate}
      disabled={!effectiveSchoolId}
    >
      {schoolPicker}
    </TabQuestionScreen>
  );
}
