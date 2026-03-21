import { useNavigate } from 'react-router-dom';
import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
} from '../lib/types';
import { DashboardView } from '../components/dashboard/DashboardView';

interface DashboardPageProps {
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

export default function Dashboard(props: DashboardPageProps) {
  const navigate = useNavigate();

  const handleStartOver = () => {
    props.onStartOver();
    navigate('/');
  };

  return <DashboardView {...props} onStartOver={handleStartOver} />;
}
