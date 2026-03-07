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

const overlayMap = { light: 0.25, medium: 0.45, heavy: 0.65 }

export default function HeroSlider({ slides = [], announcements = [], interval = 6000 }) {
  const [active, setActive] = useState(0)

  const heroSlides = slides.filter((s) => s.imageUrl).map((s) => ({ ...s, type: 'hero' }))
  const announcementSlides = announcements.map((a) => ({ ...a, type: 'announcement' }))

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

  const getAlignClass = (align) => {
    if (align === 'center') return styles.slideItemCenter
    if (align === 'right') return styles.slideItemRight
    return ''
  }

  return (
    <section className={styles.hero}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {allSlides.map((slide, i) => {
          const bgStyle = slide.gradient
            ? { background: slide.gradient }
            : slide.bgColor
              ? { background: slide.bgColor }
              : {}

          return (
            <div
              className={`${styles.slideItem} ${getAlignClass(slide.textAlign)}`}
              style={bgStyle}
              key={i}
            >
              {slide.type === 'hero' ? (
                <>
                  {slide.imageUrl && (
                    <>
                      <div
                        className={styles.slideBg}
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                      />
                      <div
                        className={styles.overlay}
                        style={{ background: `rgba(0,0,0,${overlayMap[slide.overlayOpacity] || 0.45})` }}
                      />
                    </>
                  )}
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
                  <div className={styles.ghost}>{slide.ghostText || 'TEKSTİL'}</div>
                </>
              ) : (
                <div className={styles.announcementWrap}>
                  {slide.icon && (
                    <div className={styles.announcementIcon}>{slide.icon}</div>
                  )}
                  <div className={styles.decorLine} />
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
          )
        })}
      </div>

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
