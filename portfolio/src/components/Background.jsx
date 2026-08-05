import { motion } from 'framer-motion'

// Ambient background: two slowly drifting aurora blobs over a faint grid.
// Purely decorative and pointer-events: none so it never blocks interaction.
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__grid" />
      <motion.div
        className="bg__blob bg__blob--violet"
        animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg__blob bg__blob--cyan"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="bg__noise" />
    </div>
  )
}
