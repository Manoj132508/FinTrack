import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

// Counts up to `value` when scrolled into view.
export default function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: 1.6, bounce: 0 })
  const numRef = useRef(null)

  useEffect(() => {
    if (inView) mv.set(value)
  }, [inView, value, mv])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (numRef.current) {
        numRef.current.textContent = Math.round(latest).toLocaleString()
      }
    })
  }, [spring])

  return (
    <div className="stat" ref={ref}>
      <div className="stat__value">
        <span ref={numRef}>0</span>
        <span className="stat__suffix">{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
    </div>
  )
}
