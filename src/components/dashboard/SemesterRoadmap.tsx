import type { SemesterRoadmap as SemesterRoadmapType, RoadmapPhase, RoadmapTask } from '../../lib/types';

interface SemesterRoadmapProps {
  roadmap: SemesterRoadmapType;
}

// Each phase type has its own visual identity
const PHASE_CONFIG: Record<RoadmapPhase['phase_type'], {
  icon: string;
  bgClass: string;
  ringClass: string;
  headerBg: string;
  accentColor: string;
  label: string;
}> = {
  preparation: {
    icon: '🧭',
    bgClass: 'bg-[#BA7517]',
    ringClass: 'ring-[#BA7517]/20',
    headerBg: 'bg-[#BA7517]/8',
    accentColor: '#BA7517',
    label: 'Preparation',
  },
  active_semester: {
    icon: '📖',
    bgClass: 'bg-[#0F6E56]',
    ringClass: 'ring-[#0F6E56]/20',
    headerBg: 'bg-[#0F6E56]/8',
    accentColor: '#0F6E56',
    label: 'Active Semester',
  },
  summer: {
    icon: '☀️',
    bgClass: 'bg-sky-500',
    ringClass: 'ring-sky-500/20',
    headerBg: 'bg-sky-50',
    accentColor: '#0EA5E9',
    label: 'Summer',
  },
  graduation: {
    icon: '🎓',
    bgClass: 'bg-[#CA8A04]',
    ringClass: 'ring-[#CA8A04]/20',
    headerBg: 'bg-amber-50',
    accentColor: '#CA8A04',
    label: 'Graduation',
  },
};

const CATEGORY_STYLES: Record<RoadmapTask['category'], { label: string; color: string }> = {
  financial:      { label: 'Financial',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  academic:       { label: 'Academic',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  housing:        { label: 'Housing',    color: 'bg-orange-50 text-orange-700 border-orange-200' },
  administrative: { label: 'Admin',      color: 'bg-purple-50 text-purple-700 border-purple-200' },
  support:        { label: 'Support',    color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function TaskRow({ task }: { task: RoadmapTask }) {
  const cat = CATEGORY_STYLES[task.category];
  const hasDeadline = Boolean(task.deadline);

  return (
    <div className={`px-5 py-4 border-b border-[#F0EDE8] last:border-b-0 transition-colors
      ${hasDeadline ? 'border-l-[3px] border-l-[#BA7517] pl-[17px]' : ''}`}>

      <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
        <p className="text-[15px] font-semibold text-[#1A2A22] leading-snug flex-1">{task.task}</p>
        <span className={`shrink-0 text-[13px] font-semibold px-2.5 py-1 rounded-full border ${cat.color}`}>
          {cat.label}
        </span>
      </div>

      <p className="text-[13px] text-[#5C6B63] leading-relaxed mb-2">{task.why}</p>

      <div className="flex flex-wrap items-center gap-3">
        {task.deadline && (
          <span className="text-[13px] text-[#BA7517] font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {task.deadline}
          </span>
        )}
        <span className="text-[13px] text-[#5C6B63] flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {task.estimated_time}
        </span>
        <span className="text-[13px] text-[#0F6E56] font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {task.help_from}
        </span>
      </div>

      {task.depends_on && task.depends_on.length > 0 && (
        <p className="text-[13px] text-[#5C6B63] mt-2 flex items-center gap-1">
          <span className="text-[#E2DED6]">→</span>
          <span className="italic">After: {task.depends_on.join(', ')}</span>
        </p>
      )}
    </div>
  );
}

function PhaseCard({ phase, index, isLast }: { phase: RoadmapPhase; index: number; isLast: boolean }) {
  const cfg = PHASE_CONFIG[phase.phase_type];

  return (
    <div className="relative flex gap-5">
      {/* Timeline spine — milestone dot + dashed line */}
      <div className="flex flex-col items-center shrink-0 w-12">
        {/* Milestone circle */}
        <div className={`w-12 h-12 rounded-full ${cfg.bgClass} flex items-center justify-center
                         shadow-md ring-4 ring-white ${cfg.ringClass} relative z-10 flex-shrink-0`}>
          <span className="text-xl" role="img" aria-label={cfg.label}>{cfg.icon}</span>
        </div>
        {/* Dashed connecting path */}
        {!isLast && (
          <div className="flex-1 mt-2 mb-0" style={{ minHeight: '32px' }}>
            <div className="w-0 mx-auto border-l-2 border-dashed border-[#E2DED6] h-full" />
          </div>
        )}
      </div>

      {/* Phase content */}
      <div className="flex-1 pb-10">
        {/* Phase header card */}
        <div className={`rounded-2xl border border-[#E2DED6] overflow-hidden shadow-sm mb-0`}>
          <div className={`${cfg.headerBg} px-5 py-4 border-b border-[#E2DED6]`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-widest mb-0.5"
                   style={{ color: cfg.accentColor }}>
                  {cfg.label} · Phase {index + 1}
                </p>
                <h3 className="text-lg font-bold text-[#1A2A22] leading-snug"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {phase.name}
                </h3>
              </div>

              {/* Cost chip — prominent */}
              {phase.semester_cost_estimate !== null && (
                <div className="shrink-0 bg-white border border-[#E2DED6] rounded-xl px-4 py-2 text-center shadow-sm">
                  <p className="text-[13px] text-[#5C6B63] font-medium">Est. cost</p>
                  <p className="text-lg font-bold text-[#1A2A22]">{fmt(phase.semester_cost_estimate)}</p>
                </div>
              )}
            </div>

            {/* Funding applied — reassuring green */}
            {phase.funding_applied && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#0F6E56] flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[13px] text-[#0F6E56] font-semibold">{phase.funding_applied}</p>
              </div>
            )}
          </div>

          {/* Tasks */}
          {phase.tasks.length > 0 && (
            <div className="bg-white divide-y divide-[#F0EDE8]">
              {phase.tasks.map((task, i) => (
                <TaskRow key={i} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SemesterRoadmap({ roadmap }: SemesterRoadmapProps) {
  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

  return (
    <section>
      {/* School + semesters header */}
      <div className="bg-[#0F6E56] text-white rounded-2xl px-6 py-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[13px] font-semibold text-white/70 uppercase tracking-widest mb-0.5">
            Your Path to Graduation
          </p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {roadmap.based_on_school}
          </h2>
          <p className="text-[13px] text-white/80 mt-0.5">Starting {roadmap.recommended_start}</p>
        </div>
        <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
          <p className="text-3xl font-bold">{roadmap.total_semesters_to_degree}</p>
          <p className="text-[13px] text-white/80">semesters to degree</p>
        </div>
      </div>

      {/* Phase legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {Object.entries(PHASE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="text-base">{cfg.icon}</span>
            <span className="text-[13px] text-[#5C6B63] font-medium">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Path timeline */}
      <div>
        {roadmap.phases.map((phase, index) => (
          <PhaseCard
            key={index}
            phase={phase}
            index={index}
            isLast={index === roadmap.phases.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
