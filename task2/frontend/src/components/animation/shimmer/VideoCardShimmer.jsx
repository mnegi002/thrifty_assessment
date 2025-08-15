export default function VideoCardShimmer() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Thumbnail shimmer */}
      <div className="relative w-full h-48 bg-gray-300 animate-pulse" />

      {/* Content shimmer */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>

        {/* Subtitle */}
        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-5/6"></div>
        </div>

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-24"></div>
      </div>
    </div>
  );
}
