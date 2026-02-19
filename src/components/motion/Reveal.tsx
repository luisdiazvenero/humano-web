"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import {
  DEFAULT_VIEWPORT,
  createRevealTransition,
  createRevealVariants,
} from "@/components/motion/variants"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
  once?: boolean
  fromParent?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  amount = DEFAULT_VIEWPORT.amount,
  once = DEFAULT_VIEWPORT.once,
  fromParent = false,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const variants = createRevealVariants(y)
  const transition = createRevealTransition(delay)

  if (fromParent) {
    return (
      <motion.div className={cn(className)} variants={variants} transition={transition}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
