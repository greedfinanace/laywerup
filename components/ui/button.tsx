import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest border border-[#4D4D4D]",
    {
        variants: {
            variant: {
                default: "bg-transparent text-[#990000] border-[#990000] hover:bg-[#990000] hover:text-[#E0E0E0] transition-colors duration-200",
                destructive:
                    "bg-transparent text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444] hover:text-[#E0E0E0]",
                outline:
                    "border-[#4D4D4D] bg-transparent hover:bg-[#262626] hover:text-[#E0E0E0]",
                secondary:
                    "bg-[#262626] text-[#E0E0E0] border-[#4D4D4D] hover:bg-[#4D4D4D]",
                ghost: "border-transparent hover:bg-[#262626] hover:text-[#E0E0E0]",
                link: "text-[#990000] underline-offset-4 hover:underline border-transparent",
            },
            size: {
                default: "h-12 px-8 py-3",
                sm: "h-10 px-6 py-2",
                lg: "h-14 px-12 py-4",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
