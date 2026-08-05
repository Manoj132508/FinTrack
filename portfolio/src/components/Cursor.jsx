import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A soft light that follows the pointer for a premium, tactile feel.
// Only rendered on fine pointers (mouse), never on touch devices.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return undefined
    setEnabled(true)

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      className="cursor-glow"
      style={{ left: sx, top: sy }}
      aria-hidden="true"
    />
  )
}
