import { useNavigate } from 'react-router-dom';
import { IntakeForm } from '../components/intake/IntakeForm';
import type { AssessmentResult } from '../lib/types';

interface IntakePageProps {
  onComplete: (result: AssessmentResult) => void;
}

export default function Intake({ onComplete }: IntakePageProps) {
  const navigate = useNavigate();

  const handleComplete = (result: AssessmentResult) => {
    onComplete(result);
    navigate('/dashboard');
  };

  return <IntakeForm onComplete={handleComplete} />;
}
