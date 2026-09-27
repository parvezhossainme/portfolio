import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "cyber-chamfer-sm cyber-edge [--chamfer-edge:var(--border)] flex field-sizing-content min-h-16 w-full bg-input px-3 py-2 text-base text-foreground outline-none transition-[color,background] selection:bg-primary/30 selection:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:[--chamfer-edge:var(--neon)] focus-visible:cyber-glow-sm",
        "aria-invalid:[--chamfer-edge:var(--destructive)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
