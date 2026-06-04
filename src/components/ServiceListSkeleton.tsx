import { Skeleton } from "@/components/ui/skeleton";

const ServiceListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-4 w-full">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="w-full p-4 rounded-2xl bg-card border border-border shadow-soft"
        >
          <div className="flex gap-4">
            {/* Avatar Skeleton */}
            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceListSkeleton;