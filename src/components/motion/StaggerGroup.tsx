"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import {
  DEFAULT_VIEWPORT,
  createStaggerContainerVariants,
} from "@/components/motion/variants"

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  amount?: number
  once?: boolean
  staggerChildren?: number
  delayChildren?: number
}

export function StaggerGroup({
  children,
  className,
  amount = DEFAULT_VIEWPORT.amount,
  once = DEFAULT_VIEWPORT.once,
  staggerChildren = 0.08,
  delayChildren = 0.05,
}: StaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={createStaggerContainerVariants(staggerChildren, delayChildren)}
    >
      {children}
    </motion.div>
  )
}
