import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './AnnouncementSlider.module.css'

export default function AnnouncementSlider({ items = [], interval = 4000 }) {
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [items.length, next, interval])

  if (!items.length) return null

  const current = items[active]

  return (
    <section className={styles.band}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
        >
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            {item.text && <p className={styles.text}>{item.text}</p>}
            {item.link && (
              <Link to={item.link} className={styles.link}>
                Detaylar &rarr;
              </Link>
            )}
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
