interface AgeStateFieldProps {
  age: number;
  state: string;
  onChange: (age: number, state: string) => void;
}

export function AgeStateField({ age, state, onChange }: AgeStateFieldProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#1C1C1A] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Let's start with the basics
        </h2>
        <p className="text-[#6B6A65] text-sm">
          This helps us find programs you're age-eligible for right now.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wide" htmlFor="age">
            Your age
          </label>
          <input
            id="age"
            type="number"
            min={14}
            max={30}
            value={age || ''}
            onChange={e => onChange(parseInt(e.target.value) || 0, state)}
            placeholder="e.g. 20"
            className="w-full px-3 py-2.5 rounded-xl border border-[#E2DED6] bg-white
                       text-[#1C1C1A] text-base
                       focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent
                       placeholder:text-[#6B6A65]/50
                       min-h-[44px] transition-shadow"
          />
        </div>

        <div className="flex-[2]">
          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wide" htmlFor="state">
            State
          </label>
          <select
            id="state"
            value={state}
            onChange={e => onChange(age, e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#E2DED6] bg-white
                       text-[#1C1C1A] text-base
                       focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent
                       min-h-[44px] transition-shadow appearance-none cursor-pointer"
          >
            <option value="">Select state</option>
            <option value="Arizona">Arizona</option>
            <option value="Other">Other state</option>
          </select>
        </div>
      </div>

      {age > 0 && age >= 22 && (
        <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-orange-500 flex-shrink-0 mt-0.5">⚠</span>
          <p className="text-xs text-[#D85A30] font-medium">
            Age 22+: The Tuition Waiver requires your first disbursement before age 23. Apply as soon as possible.
          </p>
        </div>
      )}

      {state === 'Other' && (
        <p className="text-xs text-[#6B6A65] bg-[#F5F3EE] rounded-xl px-4 py-3">
          Path Forward is currently focused on Arizona programs. The assessment will show federal programs available everywhere.
        </p>
      )}
    </div>
  );
}
