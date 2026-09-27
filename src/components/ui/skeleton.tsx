import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("cyber-chamfer-sm animate-pulse bg-accent/60", className)}
      {...props}
    />
  )
}

export { Skeleton }
