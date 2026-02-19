import type { Transition, Variants } from "framer-motion"

export const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const REVEAL_DURATION = 0.6

export const DEFAULT_VIEWPORT = {
  once: true,
  amount: 0.2,
} as const

export function createRevealVariants(y = 20): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  }
}

export function createRevealTransition(delay = 0): Transition {
  return {
    duration: REVEAL_DURATION,
    ease: REVEAL_EASE,
    delay,
  }
}

export function createStaggerContainerVariants(
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }
}
