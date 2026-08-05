import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/content'
import MagneticButton from './MagneticButton'
import Marquee from './Marquee'

// Word-by-word entrance for the headline.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const word = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

function RoleRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="hero__rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 18, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -18, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="hero__badge-dot" />
          Available for opportunities · {profile.location}
        </motion.div>

        <motion.h1 className="hero__title" variants={container} initial="hidden" animate="show">
          {['Full', 'Stack', 'Developer', '&'].map((w, i) => (
            <span className="hero__word-wrap" key={i}>
              <motion.span className="hero__word" variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
          <br />
          <span className="hero__word-wrap">
            <motion.span className="hero__word hero__word--grad" variants={word}>
              AI&nbsp;Engineer
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          className="hero__subrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <span className="hero__im">I&apos;m Manoj —</span>
          <RoleRotator />
        </motion.div>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <MagneticButton href="#projects" className="btn btn--primary">
            View my work <span aria-hidden="true">→</span>
          </MagneticButton>
          <MagneticButton href="#contact" className="btn btn--ghost">
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.div
          className="hero__socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7 }}
        >
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        aria-label="Scroll to about"
      >
        <span className="hero__scroll-mouse">
          <span className="hero__scroll-wheel" />
        </span>
        Scroll
      </motion.a>

      <div className="hero__marquee">
        <Marquee />
      </div>
    </section>
  )
}
