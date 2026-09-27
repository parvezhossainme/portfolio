import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button cyber-chamfer-sm cyber-edge inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium uppercase tracking-wider transition-all duration-150 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "[--chamfer-edge:var(--neon)] [--chamfer-edge-w:2px] bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:cyber-glow focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:cyber-glow",
        glitch:
          "[--chamfer-edge:var(--neon)] [--chamfer-edge-w:2px] bg-primary font-bold text-primary-foreground hover:brightness-110 hover:cyber-glow focus-visible:brightness-110 focus-visible:cyber-glow",
        secondary:
          "[--chamfer-edge:var(--neon-secondary)] [--chamfer-edge-w:2px] bg-transparent text-neon-secondary hover:bg-neon-secondary hover:text-background hover:cyber-glow-secondary focus-visible:bg-neon-secondary focus-visible:text-background focus-visible:cyber-glow-secondary",
        outline:
          "[--chamfer-edge:var(--border)] bg-transparent text-foreground hover:[--chamfer-edge:var(--neon)] hover:text-primary hover:cyber-glow-sm focus-visible:[--chamfer-edge:var(--neon)] focus-visible:text-primary focus-visible:cyber-glow-sm",
        ghost:
          "[--chamfer-edge:transparent] bg-transparent text-foreground hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary",
        destructive:
          "[--chamfer-edge:var(--destructive)] [--chamfer-edge-w:2px] bg-transparent text-destructive hover:bg-destructive hover:text-background focus-visible:bg-destructive focus-visible:text-background",
        link: "[--chamfer-edge:transparent] bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 px-6 text-base has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
