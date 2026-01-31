"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export interface BubbleAnimation {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface CartBubbleAnimationProps {
  animation: BubbleAnimation;
  onComplete: (id: string) => void;
}

export function CartBubbleAnimation({ animation, onComplete }: CartBubbleAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(animation.id);
    }, 1000);

    return () => clearTimeout(timer);
  }, [animation.id, onComplete]);

  if (!isVisible) return null;

  const deltaX = animation.endX - animation.startX;
  const deltaY = animation.endY - animation.startY;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${animation.startX}px`,
        top: `${animation.startY}px`,
        animation: "bubble-float 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "--delta-x": `${deltaX}px`,
        "--delta-y": `${deltaY}px`,
      } as React.CSSProperties}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-foreground/20 rounded-full blur-xl animate-pulse-slow" />
        
        {/* Bubble */}
        <div className="relative bg-foreground text-background rounded-full p-3 shadow-2xl animate-scale-bounce">
          <ShoppingBag className="w-5 h-5" strokeWidth={2} />
        </div>

        {/* Particle effects */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-particle-1" />
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent/70 rounded-full animate-particle-2" />
        <div className="absolute top-1/2 -right-2 w-1 h-1 bg-accent/50 rounded-full animate-particle-3" />
      </div>

      <style jsx>{`
        @keyframes bubble-float {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--delta-x), var(--delta-y)) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes scale-bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes particle-1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(20px, -20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particle-2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-15px, 15px) scale(0);
            opacity: 0;
          }
        }

        @keyframes particle-3 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(25px, -10px) scale(0);
            opacity: 0;
          }
        }

        .animate-scale-bounce {
          animation: scale-bounce 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 1s ease-out;
        }

        .animate-particle-1 {
          animation: particle-1 0.8s ease-out forwards;
        }

        .animate-particle-2 {
          animation: particle-2 0.9s ease-out forwards;
        }

        .animate-particle-3 {
          animation: particle-3 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
