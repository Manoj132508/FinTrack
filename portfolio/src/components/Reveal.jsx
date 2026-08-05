import { motion } from 'framer-motion'

// Scroll-triggered reveal. Animates once when it enters the viewport.
const variants = {
  hidden: (d) => ({
    opacity: 0,
    y: d === 'up' ? 28 : 0,
    x: d === 'left' ? 28 : d === 'right' ? -28 : 0,
    filter: 'blur(6px)',
  }),
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Reveal({ children, direction = 'up', delay = 0, className, as = 'div' }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      custom={direction}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}

// Container that staggers its Reveal/motion children.
export function Stagger({ children, className, amount = 0.2, gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  )
}

// A child item to place inside <Stagger>.
export function StaggerItem({ children, className, direction = 'up', as = 'div' }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag className={className} custom={direction} variants={variants}>
      {children}
    </MotionTag>
  )
}
