import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { navLinks, profile } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <motion.header
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__brand-mark">M</span>
          <span className="nav__brand-text">Manoj<span>.dev</span></span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav__link ${active === l.id ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a className="nav__cv nav__cv--mobile" href={profile.cv} download>
            Download CV
          </a>
        </nav>

        <div className="nav__actions">
          <a className="nav__cv" href={profile.cv} download>
            Download CV
          </a>
          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <motion.div className="nav__progress" style={{ scaleX: progress }} />
    </motion.header>
  )
}
