import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroSlider.module.css'

const defaultSlide = {
  type: 'hero',
  title: 'KURUMSAL\nTEKSTİL\nÇÖZÜMLERİ',
  subtitle: 'Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.',
  cta1Text: 'ÜRÜNLERİ KEŞFET',
  cta1Link: '/shop',
  cta2Text: 'KURUMSAL ÇÖZÜMLER',
  cta2Link: '/corporate',
}

export default function HeroSlider({ slides = [], announcements = [], interval = 6000 }) {
  const [active, setActive] = useState(0)

  // Build unified slide list
  const heroSlides = slides.filter((s) => s.imageUrl).map((s) => ({ ...s, type: 'hero' }))
  const announcementSlides = announcements.map((a) => ({ ...a, type: 'announcement' }))

  // If no hero slides, use default + announcements; otherwise hero + announcements
  const allSlides = heroSlides.length > 0
    ? [...heroSlides, ...announcementSlides]
    : [defaultSlide, ...announcementSlides]

  const total = allSlides.length

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [total, next, interval])

  return (
    <section className={styles.hero}>
      {/* Sliding track */}
      <div
        className={styles.track}
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {allSlides.map((slide, i) => (
          <div className={styles.slideItem} key={i}>
            {slide.type === 'hero' ? (
              <>
                {/* Background image */}
                {slide.imageUrl && (
                  <>
                    <div
                      className={styles.slideBg}
                      style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    />
                    <div className={styles.overlay} />
                  </>
                )}
                {/* Hero content */}
                <div className={styles.container}>
                  <div className={styles.content}>
                    {slide.title && (
                      <h1 className={styles.title}>
                        {slide.title.split('\n').map((line, j) => (
                          <span key={j}>{line}<br /></span>
                        ))}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className={styles.subtitle}>{slide.subtitle}</p>
                    )}
                    <div className={styles.ctas}>
                      {slide.cta1Text && slide.cta1Link && (
                        <Link to={slide.cta1Link} className="btn btn-primary btn-lg">{slide.cta1Text}</Link>
                      )}
                      {slide.cta2Text && slide.cta2Link && (
                        <Link to={slide.cta2Link} className="btn btn-outline-white btn-lg">{slide.cta2Text}</Link>
                      )}
                    </div>
                  </div>
                </div>
                {/* Ghost text */}
                <div className={styles.ghost}>TEKSTİL</div>
              </>
            ) : (
              /* Announcement content */
              <div className={styles.announcementWrap}>
                <h2 className={styles.announcementTitle}>{slide.title}</h2>
                {slide.text && <p className={styles.announcementText}>{slide.text}</p>}
                {slide.link && (
                  <Link to={slide.link} className={styles.announcementLink}>
                    Detaylar &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      {total > 1 && (
        <div className={styles.dots}>
          {allSlides.map((_, i) => (
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
