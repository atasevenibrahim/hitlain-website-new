import { useState, useEffect, useCallback } from 'react'
import styles from './BannerSlider.module.css'

export default function BannerSlider({ banners, interval = 5000 }) {
  const [active, setActive] = useState(0)
  const validBanners = banners.filter((b) => b.imageUrl)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % validBanners.length)
  }, [validBanners.length])

  useEffect(() => {
    if (validBanners.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [validBanners.length, next, interval])

  if (validBanners.length === 0) return null

  return (
    <>
      {validBanners.map((banner, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        />
      ))}
      {validBanners[active] && (validBanners[active].title || validBanners[active].subtitle) && (
        <div className={styles.text}>
          {validBanners[active].title && <span className={styles.title}>{validBanners[active].title}</span>}
          {validBanners[active].subtitle && <span className={styles.subtitle}>{validBanners[active].subtitle}</span>}
        </div>
      )}
      {validBanners.length > 1 && (
        <div className={styles.dots}>
          {validBanners.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={(e) => { e.preventDefault(); setActive(i) }}
            />
          ))}
        </div>
      )}
    </>
  )
}
