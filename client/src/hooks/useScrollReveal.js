import { useEffect, useRef } from 'react'

export default function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    const revealElements = el.querySelectorAll('.reveal')
    revealElements.forEach((revealEl) => observer.observe(revealEl))

    return () => observer.disconnect()
  }, [threshold])

  return ref
}
