interface ConfidenceBadgeProps {
  level: 'eligible' | 'likely_eligible' | 'verify' | 'certain' | 'high';
  reason?: string;
}

const CONFIG = {
  eligible:        { label: 'Confirmed eligible',         color: '#0F6E56', bg: 'rgba(15,110,86,0.08)',  border: 'rgba(15,110,86,0.2)'  },
  certain:         { label: 'Confirmed eligible',         color: '#0F6E56', bg: 'rgba(15,110,86,0.08)',  border: 'rgba(15,110,86,0.2)'  },
  likely_eligible: { label: 'Very likely eligible',       color: '#BA7517', bg: 'rgba(186,117,23,0.08)', border: 'rgba(186,117,23,0.2)' },
  high:            { label: 'Very likely eligible',       color: '#BA7517', bg: 'rgba(186,117,23,0.08)', border: 'rgba(186,117,23,0.2)' },
  verify:          { label: 'Check with your caseworker', color: '#D85A30', bg: 'rgba(216,90,48,0.08)',  border: 'rgba(216,90,48,0.2)'  },
} as const;

export function ConfidenceBadge({ level, reason }: ConfidenceBadgeProps) {
  const cfg = CONFIG[level] ?? CONFIG.verify;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "'IBM Plex Mono', monospace",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
      title={reason}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}
