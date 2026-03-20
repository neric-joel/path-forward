interface ConfidenceBadgeProps {
  level: 'eligible' | 'likely_eligible' | 'verify' | 'certain' | 'high';
  reason?: string;
}

const CONFIG = {
  eligible:       { label: 'Eligible',        bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  certain:        { label: 'Certain',          bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  likely_eligible:{ label: 'Likely Eligible',  bg: 'bg-teal-100',   text: 'text-teal-800',   dot: 'bg-teal-500'   },
  high:           { label: 'High Confidence',  bg: 'bg-teal-100',   text: 'text-teal-800',   dot: 'bg-teal-500'   },
  verify:         { label: 'Verify',           bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
} as const;

export function ConfidenceBadge({ level, reason }: ConfidenceBadgeProps) {
  const cfg = CONFIG[level] ?? CONFIG.verify;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      title={reason}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
