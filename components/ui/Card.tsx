import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./Button";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border border-white/10 bg-black/40 text-card-foreground shadow-sm backdrop-blur-sm",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

export { Card };
