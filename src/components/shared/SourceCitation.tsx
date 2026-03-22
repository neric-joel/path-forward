interface SourceCitationProps {
  url: string;
  label?: string;
  verifyWith?: string;
}

export function SourceCitation({ url, label, verifyWith }: SourceCitationProps) {
  const displayLabel = label ?? new URL(url).hostname.replace('www.', '');

  return (
    <div className="flex flex-col gap-0.5">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[#5C6B63] hover:text-[#1A2A22] underline underline-offset-2"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {displayLabel}
      </a>
      {verifyWith && (
        <p className="text-xs text-[#5C6B63]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Verify: {verifyWith}</p>
      )}
    </div>
  );
}
