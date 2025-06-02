import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-pulse rounded-full bg-dp-muted', className)} {...props} />
  )
}

export { Skeleton }
