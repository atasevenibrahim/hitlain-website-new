import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroSlider.module.css'

const defaultSlide = {
  title: 'KURUMSAL\nTEKSTİL\nÇÖZÜMLERİ',
  subtitle: 'Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.',
  cta1Text: 'ÜRÜNLERİ KEŞFET',
  cta1Link: '/shop',
  cta2Text: 'KURUMSAL ÇÖZÜMLER',
  cta2Link: '/corporate',
}

export default function HeroSlider({ slides, interval = 6000 }) {
  const [active, setActive] = useState(0)
  const validSlides = slides.filter((s) => s.imageUrl)
  const showSlides = validSlides.length > 0

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % validSlides.length)
  }, [validSlides.length])

  useEffect(() => {
    if (validSlides.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [validSlides.length, next, interval])

  const current = showSlides ? validSlides[active] : defaultSlide

  return (
    <section className={styles.hero}>
      {/* Background slides */}
      {showSlides && validSlides.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
      ))}

      {/* Overlay */}
      {showSlides && <div className={styles.overlay} />}

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          {current.title && (
            <h1 className={styles.title}>
              {current.title.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
          )}
          {current.subtitle && (
            <p className={styles.subtitle}>{current.subtitle}</p>
          )}
          <div className={styles.ctas}>
            {current.cta1Text && current.cta1Link && (
              <Link to={current.cta1Link} className="btn btn-primary btn-lg">{current.cta1Text}</Link>
            )}
            {current.cta2Text && current.cta2Link && (
              <Link to={current.cta2Link} className="btn btn-outline-white btn-lg">{current.cta2Text}</Link>
            )}
          </div>
        </div>
      </div>

      {/* Ghost text */}
      <div className={styles.ghost}>TEKSTİL</div>

      {/* Dot navigation */}
      {validSlides.length > 1 && (
        <div className={styles.dots}>
          {validSlides.map((_, i) => (
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
