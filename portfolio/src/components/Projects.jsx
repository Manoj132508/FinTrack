import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { projects } from '../data/content'
import SectionHeading from './SectionHeading'
import TiltCard from './TiltCard'
import { Reveal } from './Reveal'

const FILTERS = ['All', 'AI', 'Full-Stack']

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const shown = projects.filter((p) => filter === 'All' || p.category === filter)

  return (
    <section className="section" id="projects">
      <SectionHeading index="04" kicker="Selected work" title="Projects" />

      <Reveal className="filter">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter__btn ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {filter === f && <motion.span layoutId="filter-pill" className="filter__pill" />}
            <span className="filter__label">{f}</span>
          </button>
        ))}
      </Reveal>

      <LayoutGroup>
        <motion.div layout className="projects">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <motion.div
                layout
                key={p.title}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard className="project" max={7}>
                  <div className="project__head">
                    <span className="project__icon">{p.icon}</span>
                    <span className={`project__cat project__cat--${p.category === 'AI' ? 'ai' : 'fs'}`}>
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="project__title">{p.title}</h3>
                  <p className="project__desc">{p.description}</p>
                  <ul className="project__stack">
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </section>
  )
}
