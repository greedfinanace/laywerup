import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center border border-[#4D4D4D] px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wider",
    {
        variants: {
            variant: {
                default:
                    "bg-transparent border-[#990000] text-[#990000] hover:bg-[#990000] hover:text-[#E0E0E0]",
                secondary:
                    "bg-[#262626] border-[#4D4D4D] text-[#E0E0E0] hover:bg-[#4D4D4D]",
                destructive:
                    "bg-transparent border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-[#E0E0E0]",
                success:
                    "bg-transparent border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-[#E0E0E0]",
                warning:
                    "bg-transparent border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#E0E0E0]",
                outline: "border-[#4D4D4D] text-[#E0E0E0] hover:bg-[#262626]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
