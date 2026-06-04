import { Skeleton } from "@/components/ui/skeleton";

const BookingListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4 w-full">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-3xl p-5 shadow-soft border border-border"
        >
          <div className="flex gap-4 mb-5">
            {/* User Icon Skeleton */}
            <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Skeleton className="flex-1 h-11 rounded-xl" />
            <Skeleton className="flex-1 h-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingListSkeleton;
