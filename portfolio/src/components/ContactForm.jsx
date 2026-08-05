import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/content'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const empty = { name: '', email: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!EMAIL_RE.test(form.email)) return 'Please enter a valid email address.'
    if (form.message.trim().length < 10) return 'Message should be at least 10 characters.'
    return null
  }

  // Opens the visitor's email client pre-addressed to Manoj. Used when no
  // form service is configured, so the form is always functional.
  function mailtoFallback() {
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setStatus('success')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      setStatus('error')
      return
    }
    setError('')
    setStatus('sending')

    try {
      if (profile.web3formsKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: profile.web3formsKey, ...form }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Submission failed.')
        setStatus('success')
        setForm(empty)
      } else if (profile.formspreeEndpoint) {
        const res = await fetch(profile.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Submission failed. Please email me directly.')
        setStatus('success')
        setForm(empty)
      } else {
        // No service configured — fall back to the visitor's email client.
        mailtoFallback()
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="cform" onSubmit={handleSubmit} noValidate>
      <div className="cform__row">
        <label className="cfield">
          <span className="cfield__label">Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="cfield">
          <span className="cfield__label">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="cfield">
        <span className="cfield__label">Message</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell me about the role or project…"
        />
      </label>

      <AnimatePresence mode="wait">
        {status === 'error' && error && (
          <motion.p
            className="cform__msg cform__msg--error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            key="err"
          >
            {error}
          </motion.p>
        )}
        {status === 'success' && (
          <motion.p
            className="cform__msg cform__msg--ok"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            key="ok"
          >
            Thanks! Your message is on its way — I&apos;ll get back to you soon.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        className="btn btn--primary cform__submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
