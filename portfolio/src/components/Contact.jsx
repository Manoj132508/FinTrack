import { profile } from '../data/content'
import SectionHeading from './SectionHeading'
import { Reveal } from './Reveal'
import MagneticButton from './MagneticButton'
import ContactForm from './ContactForm'

const cards = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: '✉️' },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, icon: '📞' },
  { label: 'Location', value: profile.location, href: null, icon: '📍' },
]

export default function Contact() {
  return (
    <section className="section section--contact" id="contact">
      <SectionHeading index="06" kicker="Contact" title="Let's build something" />

      <div className="contact">
        <Reveal className="contact__intro" direction="right">
          <p className="contact__lead">
            I&apos;m open to full-stack and AI engineering roles and freelance work. Have a
            project or an opening in mind? Drop me a message.
          </p>

          <div className="contact__cards">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="contact-card__icon">{c.icon}</span>
                  <span className="contact-card__label">{c.label}</span>
                  <span className="contact-card__value">{c.value}</span>
                </>
              )
              return c.href ? (
                <a className="contact-card" href={c.href} key={c.label}>
                  {inner}
                </a>
              ) : (
                <div className="contact-card" key={c.label}>
                  {inner}
                </div>
              )
            })}
          </div>

          <div className="contact__actions">
            <MagneticButton href={profile.cv} className="btn btn--ghost" download>
              Download CV
            </MagneticButton>
            <div className="contact__socials">
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="contact__form-wrap" direction="left" delay={0.05}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
