import { useNavigate } from 'react-router-dom';
import { IntakeForm } from '../components/intake/IntakeForm';
import type { IntakeFormData } from '../lib/types';

interface IntakePageProps {
  onComplete: (data: IntakeFormData) => void;
}

export default function Intake({ onComplete }: IntakePageProps) {
  const navigate = useNavigate();

  const handleComplete = (data: IntakeFormData) => {
    onComplete(data);
    navigate('/dashboard');
  };

  return <IntakeForm onComplete={handleComplete} />;
}
