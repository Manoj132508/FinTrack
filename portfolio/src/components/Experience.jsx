import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience } from '../data/content'
import SectionHeading from './SectionHeading'
import { Reveal } from './Reveal'

export default function Experience() {
  const ref = useRef(null)
  // Grow the timeline spine as the section scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section className="section" id="experience">
      <SectionHeading index="03" kicker="Journey" title="Experience" />

      <div className="timeline" ref={ref}>
        <div className="timeline__spine">
          <motion.div className="timeline__spine-fill" style={{ scaleY }} />
        </div>

        {experience.map((job, i) => (
          <Reveal className="tl-item" key={job.company + i} direction="up" delay={i * 0.05}>
            <span className="tl-item__node" />
            <div className="tl-item__card">
              <div className="tl-item__top">
                <span className="tl-item__period">{job.period}</span>
                <span className={`tl-item__kind tl-item__kind--${job.kind.toLowerCase()}`}>
                  {job.kind}
                </span>
              </div>
              <h3 className="tl-item__role">{job.role}</h3>
              <p className="tl-item__company">{job.company}</p>
              <ul className="tl-item__points">
                {job.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
