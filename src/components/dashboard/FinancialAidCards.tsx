import type { MatchedProgram } from '../../lib/types';
import { AidCard } from './AidCard';

interface FinancialAidCardsProps {
  programs: MatchedProgram[];
}

export function FinancialAidCards({ programs }: FinancialAidCardsProps) {
  if (programs.length === 0) return null;

  // Calculate total potential funding
  const totalText = programs
    .filter(p => p.max_amount && !p.max_amount.toLowerCase().includes('full'))
    .map(p => {
      const match = p.max_amount.match(/\$?([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    })
    .reduce((a, b) => a + b, 0);

  const hasFullTuition = programs.some(p => p.max_amount.toLowerCase().includes('full'));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Your Matched Funding
        </h2>
        <p className="text-[#6B6A65] text-sm mt-1">
          {programs.length} program{programs.length !== 1 ? 's' : ''} matched to your situation
          {totalText > 0 && (
            <span className="text-[#3B6D11] font-semibold">
              {' '}· up to ${totalText.toLocaleString()}/year
              {hasFullTuition ? ' + full remaining tuition' : ''}
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {programs.map(program => (
          <div
            key={program.id}
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both' }}
          >
            <AidCard program={program} />
          </div>
        ))}
      </div>
    </section>
  );
}
