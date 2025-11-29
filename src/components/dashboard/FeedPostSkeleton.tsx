import { Skeleton } from "@/components/ui/skeleton"

export function FeedPostSkeleton() {
  return (
    <article className="rounded-4xl border border-[#132852] bg-[#030c1d]/85 p-6 shadow-[0_20px_55px_rgba(2,8,27,0.85)] backdrop-blur">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="mt-4 flex gap-3">
        <Skeleton className="h-28 flex-1 rounded-2xl" />
        <Skeleton className="h-28 flex-1 rounded-2xl" />
        <Skeleton className="h-28 flex-1 rounded-2xl" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </article>
  )
}

