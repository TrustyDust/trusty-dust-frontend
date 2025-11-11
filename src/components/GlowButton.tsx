import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "neon-pink" | "neon-cyan" | "outline-pink" | "outline-cyan";
  glowIntensity?: "low" | "medium" | "high";
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "neon-pink", glowIntensity = "medium", children, ...props }, ref) => {
    const baseClasses = "px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      "neon-pink": "bg-neon-pink text-primary-foreground hover-glow-pink border-2 border-neon-pink",
      "neon-cyan": "bg-neon-cyan text-secondary-foreground hover-glow-cyan border-2 border-neon-cyan",
      "outline-pink": "bg-transparent text-neon-pink border-2 border-neon-pink hover:bg-neon-pink/10 hover-glow-pink",
      "outline-cyan": "bg-transparent text-neon-cyan border-2 border-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export default GlowButton;
