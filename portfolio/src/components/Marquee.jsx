import { marqueeSkills } from '../data/content'

// Infinite horizontal marquee of core technologies. Duplicated once so the
// CSS translateX(-50%) loop is seamless.
export default function Marquee() {
  const items = [...marqueeSkills, ...marqueeSkills]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((s, i) => (
          <span className="marquee__item" key={i}>
            {s}
            <span className="marquee__dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
