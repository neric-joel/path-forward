export type TabId = 'overview' | 'financial' | 'schools' | 'action' | 'roadmap';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview',  label: 'Overview',     icon: '◎' },
  { id: 'financial', label: 'Funding',       icon: '$' },
  { id: 'schools',   label: 'Schools',       icon: '⌂' },
  { id: 'action',    label: 'Action Plan',   icon: '✓' },
  { id: 'roadmap',   label: 'Roadmap',       icon: '→' },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  generated: Partial<Record<TabId, boolean>>;
}

export function TabBar({ activeTab, onTabChange, generated }: TabBarProps) {
  return (
    <div className="bg-white border-b border-[#E2DED6] sticky top-[57px] z-10 overflow-x-auto">
      <div className="max-w-4xl mx-auto px-2 flex gap-0">
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          const isDone = generated[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-1.5 px-3 py-3 text-[13px] font-semibold
                whitespace-nowrap transition-colors min-h-[44px] flex-shrink-0
                ${isActive
                  ? 'text-[#0F6E56] border-b-2 border-[#0F6E56]'
                  : 'text-[#6B6A65] border-b-2 border-transparent hover:text-[#1C1C1A]'
                }
              `}
            >
              <span className={`text-[12px] ${isActive ? 'text-[#0F6E56]' : 'text-[#6B6A65]'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {isDone && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B6D11] ml-0.5 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
