'use client'

import { motion } from 'motion/react'

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="bg-grid absolute inset-0 mask-fade-y opacity-60" />
      <motion.div
        className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 size-[30rem] rounded-full bg-accent/15 blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-[oklch(0.6_0.2_260)]/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
