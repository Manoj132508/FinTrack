import { profile, stats } from '../data/content'
import SectionHeading from './SectionHeading'
import StatCounter from './StatCounter'
import { Reveal } from './Reveal'

export default function About() {
  return (
    <section className="section" id="about">
      <SectionHeading index="01" kicker="About" title="Turning ideas into shipped software" />

      <div className="about">
        <Reveal className="about__lead" direction="up">
          <p>{profile.summary}</p>
          <p className="about__muted">
            I care about clean, modular code, measurable performance wins, and interfaces that
            feel effortless — whether that&apos;s a production CMS site, a role-based dashboard,
            or a retrieval-augmented AI assistant grounded in real documents.
          </p>
        </Reveal>

        <div className="about__stats">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
