import { Skeleton } from "@/components/ui/skeleton";

const ServiceDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Skeleton className="h-80 w-full rounded-xl mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <div className="flex space-x-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <div className="pt-4 border-t border-border">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailSkeleton;