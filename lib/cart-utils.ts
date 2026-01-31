/**
 * Triggers a cart animation from a button to the cart icon
 * @param buttonElement The button that was clicked
 */
export function triggerCartAnimation(buttonElement: HTMLElement | null) {
  if (typeof window === "undefined" || !buttonElement) return;

  const buttonRect = buttonElement.getBoundingClientRect();
  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top + buttonRect.height / 2;

  // Get cart icon position from global function
  const getCartPosition = (window as any).__getCartIconPosition;
  const cartPosition = getCartPosition ? getCartPosition() : { x: window.innerWidth - 50, y: 50 };

  // Trigger animation via global function
  const triggerAnimation = (window as any).__triggerCartAnimation;
  if (triggerAnimation) {
    triggerAnimation(startX, startY, cartPosition.x, cartPosition.y);
  }
}
