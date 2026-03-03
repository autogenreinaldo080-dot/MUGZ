"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const indicatorRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(-${100 - (value || 0)}%)`
    }
  }, [value])

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
