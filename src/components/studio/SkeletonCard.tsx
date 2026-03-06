export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto h-[750px] flex flex-col animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-white p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="h-8 bg-white/30 rounded w-3/4"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 bg-white/30 rounded w-16"></div>
            <div className="h-6 bg-white/30 rounded w-16"></div>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded w-1/2 mt-2"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

        {/* Skeleton drill items */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start p-4 rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}
