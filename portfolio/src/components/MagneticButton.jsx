import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Button/link that is gently pulled toward the cursor when hovered.
export default function MagneticButton({
  children,
  href,
  className = '',
  strength = 0.35,
  ...rest
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 15 })
  const sy = useSpring(y, { stiffness: 250, damping: 15 })

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  const Tag = href ? motion.a : motion.button
  return (
    <Tag
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
