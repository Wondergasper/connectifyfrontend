import { Skeleton } from "@/components/ui/skeleton";

const ServiceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-32" />
          <div className="w-9" />
        </div>
      </div>

      {/* Provider Profile Skeleton */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Card Skeleton */}
      <div className="px-6 py-4">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="px-6 py-4 space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-md" />
          <Skeleton className="h-14 flex-[2] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailSkeleton;