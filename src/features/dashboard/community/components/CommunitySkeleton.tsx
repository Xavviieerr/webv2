import { COMMUNITY_COLORS } from "../constants";

interface CommunitySkeletonProps {
  count?: number;
}

export function CommunitySkeleton({ count = 3 }: CommunitySkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-transparent animate-pulse"
          style={{ backgroundColor: COMMUNITY_COLORS.skeletonBg }}
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
              <div className="flex-1">
                <div className="h-3.5 w-24 rounded mb-1.5" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
                <div className="h-2.5 w-16 rounded" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
              </div>
            </div>
            <div className="h-4 w-3/4 rounded mb-2" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
            <div className="h-3 w-full rounded mb-1.5" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
            <div className="h-3 w-5/6 rounded mb-4" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
            <div className="flex items-center gap-4">
              <div className="h-3 w-12 rounded" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
              <div className="h-3 w-12 rounded" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
              <div className="h-3 w-20 rounded" style={{ backgroundColor: COMMUNITY_COLORS.cardBg }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
