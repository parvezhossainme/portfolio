import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "text-card-foreground cyber-chamfer cyber-edge relative flex flex-col gap-6 py-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-card [--chamfer-edge:var(--border)] hover:-translate-y-1 hover:[--chamfer-edge:var(--neon)] hover:cyber-glow-sm",
        terminal:
          "bg-background pt-12 [--chamfer-edge:var(--border)]",
        holographic:
          "bg-muted/30 backdrop-blur-sm [--chamfer-edge:color-mix(in_oklab,var(--neon)_35%,transparent)] cyber-glow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {variant === "terminal" && (
        <div className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 border-b border-border/60 bg-muted/40 px-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-chart-4/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
        </div>
      )}
      {variant === "holographic" && (
        <>
          <span className="pointer-events-none absolute left-3 top-3 size-3 border-l-2 border-t-2 border-primary/70" />
          <span className="pointer-events-none absolute right-3 top-3 size-3 border-r-2 border-t-2 border-primary/70" />
          <span className="pointer-events-none absolute bottom-3 left-3 size-3 border-b-2 border-l-2 border-primary/70" />
          <span className="pointer-events-none absolute bottom-3 right-3 size-3 border-b-2 border-r-2 border-primary/70" />
        </>
      )}
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-xl leading-tight font-bold tracking-wide sm:text-2xl",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
