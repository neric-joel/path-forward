
import { useSearchParams } from 'react-router-dom';
import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
} from '../../lib/types';
import { TabBar, type TabId } from './TabBar';
import { OverviewTab } from './OverviewTab';
import { FinancialAidTab } from './FinancialAidTab';
import { SchoolsTab } from './SchoolsTab';
import { ActionPlanTab } from './ActionPlanTab';
import { RoadmapTab } from './RoadmapTab';

interface DashboardViewProps {
  intakeData: IntakeFormData;
  overviewResult: OverviewResult | null;
  financialResult: FinancialAidResult | null;
  schoolResult: SchoolMatchResult | null;
  actionResult: ActionPlanResult | null;
  roadmapResult: RoadmapResult | null;
  isDemo: boolean;
  onOverviewLoaded: (r: OverviewResult) => void;
  onFinancialLoaded: (r: FinancialAidResult) => void;
  onSchoolsLoaded: (r: SchoolMatchResult) => void;
  onActionPlanLoaded: (r: ActionPlanResult) => void;
  onRoadmapLoaded: (r: RoadmapResult) => void;
  onStartOver: () => void;
}

export function DashboardView({
  intakeData,
  overviewResult,
  financialResult,
  schoolResult,
  actionResult,
  roadmapResult,
  isDemo,
  onOverviewLoaded,
  onFinancialLoaded,
  onSchoolsLoaded,
  onActionPlanLoaded,
  onRoadmapLoaded,
  onStartOver,
}: DashboardViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabId) || 'overview';

  const handleTabChange = (tab: TabId) => {
    setSearchParams({ tab });
  };

  const generated: Partial<Record<TabId, boolean>> = {
    overview: overviewResult !== null,
    financial: financialResult !== null,
    schools: schoolResult !== null,
    action: actionResult !== null,
    roadmap: roadmapResult !== null,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2DED6] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Vazhi <span className="text-[#0F6E56]">வழி</span>
            </p>
            <p className="text-xs text-[#6B6A65]">Your college readiness plan</p>
          </div>
          <button
            onClick={onStartOver}
            className="text-xs text-[#6B6A65] hover:text-[#1C1C1A] transition-colors px-2 py-1.5 min-h-[36px]"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Banners */}
      {isDemo && (
        <div className="bg-[#BA7517] text-white text-xs text-center py-2 px-4 font-medium">
          Demo Mode — This is sample data. Complete the intake form to get your real plan.
        </div>
      )}
      <div className="bg-[#0F6E56] text-white text-xs text-center py-1.5 px-4">
        🔒 Your data stays in your browser. Nothing is stored or shared.
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} generated={generated} />

      {/* Tab content */}
      <main>
        {activeTab === 'overview' && (
          <OverviewTab
            intakeData={intakeData}
            result={overviewResult}
            onLoaded={onOverviewLoaded}
          />
        )}
        {activeTab === 'financial' && (
          <FinancialAidTab
            intakeData={intakeData}
            result={financialResult}
            onLoaded={onFinancialLoaded}
          />
        )}
        {activeTab === 'schools' && (
          <SchoolsTab
            intakeData={intakeData}
            result={schoolResult}
            onLoaded={onSchoolsLoaded}
          />
        )}
        {activeTab === 'action' && (
          <ActionPlanTab
            intakeData={intakeData}
            result={actionResult}
            overviewResult={overviewResult}
            onLoaded={onActionPlanLoaded}
          />
        )}
        {activeTab === 'roadmap' && (
          <RoadmapTab
            intakeData={intakeData}
            result={roadmapResult}
            schoolResult={schoolResult}
            onLoaded={onRoadmapLoaded}
          />
        )}
      </main>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center space-y-1">
        <p className="text-xs text-[#6B6A65]">
          This plan is a navigation guide, not legal or financial advice.
          Always verify eligibility directly with the programs listed.
        </p>
        <p className="text-xs text-[#6B6A65]">Built for foster youth in Arizona · Vazhi வழி</p>
      </div>
    </div>
  );
}
