"use client";

import { useState, useCallback } from "react";
import { CartBubbleAnimation, type BubbleAnimation } from "./cart-bubble-animation";

export function CartAnimationContainer() {
  const [animations, setAnimations] = useState<BubbleAnimation[]>([]);

  const handleAnimationComplete = useCallback((id: string) => {
    setAnimations((prev) => prev.filter((anim) => anim.id !== id));
  }, []);

  // Expose method to trigger animation globally
  if (typeof window !== "undefined") {
    (window as any).__triggerCartAnimation = (startX: number, startY: number, endX: number, endY: number) => {
      const newAnimation: BubbleAnimation = {
        id: `${Date.now()}-${Math.random()}`,
        startX,
        startY,
        endX,
        endY,
      };
      setAnimations((prev) => [...prev, newAnimation]);
    };
  }

  return (
    <>
      {animations.map((animation) => (
        <CartBubbleAnimation
          key={animation.id}
          animation={animation}
          onComplete={handleAnimationComplete}
        />
      ))}
    </>
  );
}
