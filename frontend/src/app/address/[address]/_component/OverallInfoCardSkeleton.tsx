import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const OverallInfoCardSkeleton = () => {
  return (
    <Card className="overflow-hidden shadow-md mb-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-1 flex-1">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-x-2">
            <Skeleton className="h-6 w-28 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>

      <CardContent className="p-6 text-sm">
        <ul className="grid gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-4">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-24 h-4" />
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <Skeleton className="w-32 h-4" />
      </CardFooter>
    </Card>
  )
}

export default OverallInfoCardSkeleton
