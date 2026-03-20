export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header skeleton */}
        <div className="text-center space-y-3">
          <div className="skeleton h-8 w-48 rounded-lg mx-auto" />
          <div className="skeleton h-5 w-72 rounded-lg mx-auto" />
        </div>

        {/* Score rings row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm">
              <div className="skeleton w-24 h-24 rounded-full" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          ))}
        </div>

        {/* Aid cards */}
        <div className="space-y-3">
          <div className="skeleton h-6 w-40 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex justify-between">
                <div className="skeleton h-5 w-48 rounded" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>

        {/* Action steps */}
        <div className="space-y-3">
          <div className="skeleton h-6 w-32 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="skeleton h-5 w-56 rounded" />
              </div>
              <div className="skeleton h-4 w-full rounded" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
