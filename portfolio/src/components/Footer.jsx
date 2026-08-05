import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <a href="#top" className="footer__brand">
          Manoj<span>.dev</span>
        </a>
        <p className="footer__note">
          Designed & built with React, Framer Motion & Lenis · © {new Date().getFullYear()}{' '}
          {profile.name}
        </p>
        <div className="footer__links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}
