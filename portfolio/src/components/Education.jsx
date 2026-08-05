import { education, certifications } from '../data/content'
import SectionHeading from './SectionHeading'
import { Stagger, StaggerItem } from './Reveal'

export default function Education() {
  return (
    <section className="section" id="education">
      <SectionHeading index="05" kicker="Background" title="Education & certifications" />

      <div className="edu">
        <Stagger className="edu__col">
          {education.map((e) => (
            <StaggerItem key={e.degree} className="edu-card">
              <div className="edu-card__year">{e.year}</div>
              <h3 className="edu-card__degree">{e.degree}</h3>
              <p className="edu-card__school">{e.school}</p>
              <p className="edu-card__detail">{e.detail}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="edu__col">
          {certifications.map((c) => (
            <StaggerItem key={c.title} className="edu-card edu-card--cert">
              <div className="edu-card__badge">Certified</div>
              <h3 className="edu-card__degree">{c.title}</h3>
              <p className="edu-card__school">{c.issuer}</p>
              <p className="edu-card__detail">{c.detail}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
