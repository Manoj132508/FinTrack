import { skillGroups } from '../data/content'
import SectionHeading from './SectionHeading'
import { Stagger, StaggerItem } from './Reveal'
import TiltCard from './TiltCard'

export default function Skills() {
  return (
    <section className="section" id="skills">
      <SectionHeading index="02" kicker="Toolkit" title="Skills & technologies" />

      <Stagger className="skills" amount={0.15} gap={0.06}>
        {skillGroups.map((group) => (
          <StaggerItem key={group.title}>
            <TiltCard className={`skill-card skill-card--${group.accent}`} max={6}>
              <h3 className="skill-card__title">
                <span className="skill-card__bullet" />
                {group.title}
              </h3>
              <ul className="skill-card__list">
                {group.skills.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
