import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "cyber-chamfer-sm cyber-edge [--chamfer-edge:transparent] inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] whitespace-nowrap transition-[color,background,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-primary text-primary-foreground [a&]:hover:brightness-110",
        secondary:
          "border-0 bg-secondary text-secondary-foreground [a&]:hover:brightness-110",
        destructive:
          "border-0 bg-destructive text-background [a&]:hover:brightness-110",
        outline:
          "[--chamfer-edge:color-mix(in_oklab,var(--neon)_45%,transparent)] bg-transparent text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
