const MONO = "'IBM Plex Mono', monospace";
const SANS = "'Inter', system-ui, sans-serif";

interface TabLoaderProps {
  message: string;
}

export function TabLoader({ message }: TabLoaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        minHeight: 320,
        textAlign: 'center',
      }}
    >
      {/* Mini 3D ring */}
      <div style={{ perspective: '600px' }}>
        <div className="loading-ring-mini-container" aria-hidden="true">
          <div className="loading-ring-mini" />
          <div className="loading-ring-mini" />
          <div className="loading-ring-mini" />
          <div className="loading-ring-mini" />
        </div>
      </div>

      {/* Loading message */}
      <p
        style={{
          marginTop: 28,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 14,
          color: '#5C6B63',
          textAlign: 'center',
        }}
      >
        {message}
      </p>

      {/* Time estimate */}
      <p
        style={{
          marginTop: 8,
          fontFamily: MONO,
          fontSize: 11,
          color: '#5C6B63',
          letterSpacing: '0.05em',
          opacity: 0.7,
          textAlign: 'center',
        }}
      >
        USUALLY TAKES 10–20 SECONDS
      </p>
    </div>
  );
}
