import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col bg-card opacity-0 animate-fade-in-up">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary/50 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-secondary/30 rounded animate-pulse" />
        <div className="h-6 w-1/3 bg-secondary/30 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <div className="h-8 bg-secondary/30 rounded animate-pulse w-1/3 mx-auto mb-4" />
          <div className="h-12 bg-secondary/30 rounded animate-pulse w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomerReviewsSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="bg-secondary/20 rounded-lg p-12 animate-pulse">
          <div className="h-40 bg-secondary/30 rounded mb-8" />
          <div className="flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-secondary/30 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomizerSkeleton() {
  return (
    <div className="py-24 px-6 space-y-6">
      <div className="h-8 bg-secondary/30 rounded animate-pulse w-1/2" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-secondary/30 rounded animate-pulse w-1/4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-10 w-20 bg-secondary/30 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background space-y-12 animate-pulse">
      <div className="h-96 bg-secondary/20" />
      <div className="px-6 max-w-7xl mx-auto space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-secondary/30 rounded w-1/3" />
            <div className="h-4 bg-secondary/20 rounded w-full" />
            <div className="h-4 bg-secondary/20 rounded w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("bg-secondary/30 rounded animate-pulse", className)}
        />
      ))}
    </>
  );
}
