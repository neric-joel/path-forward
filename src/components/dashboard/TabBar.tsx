export type TabId = 'overview' | 'financial' | 'schools' | 'action' | 'roadmap';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'overview',  label: 'Overview'     },
  { id: 'financial', label: 'Funding'       },
  { id: 'schools',   label: 'Schools'       },
  { id: 'action',    label: 'Action Plan'   },
  { id: 'roadmap',   label: 'Roadmap'       },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  generated: Partial<Record<TabId, boolean>>;
}

export function TabBar({ activeTab, onTabChange, generated }: TabBarProps) {
  return (
    <div className="bg-white border-b border-[#E2DED6] sticky top-[57px] z-10 overflow-x-auto">
      <div className="max-w-4xl mx-auto px-3 py-2 flex gap-1">
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          const isDone = generated[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              className={`
                relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                whitespace-nowrap rounded-lg transition-all min-h-[36px] flex-shrink-0
                ${isActive
                  ? 'bg-[#0F6E56] text-white shadow-sm'
                  : 'text-[#5C6B63] hover:bg-[#F5F2EC] hover:text-[#1A2A22]'
                }
              `}
            >
              {tab.label}
              {isDone && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B6D11] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
