import { Reveal } from './Reveal'

// Consistent section header: small kicker + large title.
export default function SectionHeading({ index, kicker, title }) {
  return (
    <div className="section-head">
      <Reveal className="section-kicker">
        <span className="section-kicker__num">{index}</span>
        <span className="section-kicker__line" />
        {kicker}
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="section-title">{title}</h2>
      </Reveal>
    </div>
  )
}
