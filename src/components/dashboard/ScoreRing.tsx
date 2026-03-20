import { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({
  score,
  label,
  color = '#0F6E56',
  size = 96,
  strokeWidth = 8,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  // Trigger ring arc animation when the element enters the viewport (runs once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []); // runs once on mount

  const scoreColor =
    score >= 75 ? '#3B6D11' :
    score >= 50 ? '#0F6E56' :
    score >= 30 ? '#BA7517' : '#D85A30';

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#E2DED6" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none" style={{ color: scoreColor }}>
            {score}
          </span>
          <span className="text-[10px] text-[#6B6A65] font-medium">/100</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#1C1C1A] text-center leading-tight max-w-[80px]">{label}</p>
    </div>
  );
}
