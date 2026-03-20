import { useEffect, useRef, useState } from 'react';

interface ScoreBarProps {
  label: string;
  score: number;
  summary?: string;
  previousScore?: number;
}

export function ScoreBar({ label, score, summary, previousScore }: ScoreBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initial entrance animation via IntersectionObserver (runs once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasInitialized.current) {
          hasInitialized.current = true;
          setWidth(score);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []); // runs once on mount

  // After initial animation, update bar width directly when score changes
  useEffect(() => {
    if (!hasInitialized.current) return;
    setWidth(score);
  }, [score]);

  const barColor =
    score >= 75 ? '#3B6D11' :
    score >= 50 ? '#0F6E56' :
    score >= 30 ? '#BA7517' : '#D85A30';

  const delta = previousScore !== undefined ? score - previousScore : null;

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1C1C1A]">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== null && delta > 0 && (
            <span className="text-xs font-semibold text-[#3B6D11] bg-green-50 px-1.5 py-0.5 rounded-full">
              +{delta}
            </span>
          )}
          <span className="text-sm font-bold" style={{ color: barColor }}>{score}</span>
        </div>
      </div>
      <div className="h-2.5 bg-[#E2DED6] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: barColor }}
        />
      </div>
      {summary && (
        <p className="text-xs text-[#6B6A65] leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
