import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import BannerSlider from '../../components/BannerSlider/BannerSlider'
import useSiteContent from '../../hooks/useSiteContent'
import styles from './Welcome.module.css'

export default function Welcome() {
  const [hover, setHover] = useState(null)
  const { get, getJSON } = useSiteContent()

  const logoUrl = get('logoUrl', '/hithlain-logo.png') || '/hithlain-logo.png'
  const b2cBanners = getJSON('welcome.b2c.banners', [])
  const b2bBanners = getJSON('welcome.b2b.banners', [])

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{get('siteName', 'HITHLAIN Giyim')} — Kurumsal & Bireysel Tekstil Çözümleri</title>
        <meta name="description" content="HITHLAIN Giyim: Bireysel alışveriş ve kurumsal tekstil çözümleri." />
      </Helmet>

      {/* Sol — Bireysel / B2C */}
      <Link
        to="/home"
        className={`${styles.half} ${styles.halfLeft} ${
          hover === 'left' ? styles.halfExpand : hover === 'right' ? styles.halfShrink : ''
        }`}
        onMouseEnter={() => setHover('left')}
        onMouseLeave={() => setHover(null)}
      >
        <BannerSlider banners={b2cBanners} />
        <div className={styles.overlay} />
        <div className={styles.ghostText}>B2C</div>
        <div className={styles.halfContent}>
          <img src={logoUrl} alt="HITHLAIN" className={styles.logo} />
          <span className={styles.tag}>B2C</span>
          <h2 className={styles.title}>
            {get('welcome.b2c.title', 'BİREYSEL\nALIŞVERİŞ').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <p className={styles.desc}>
            {get('welcome.b2c.desc', 'Tişört, sweatshirt, mont ve daha fazlası.\nKendi tasarımını oluştur veya hazır ürünleri keşfet.').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <span className={styles.cta}>
            {get('welcome.b2c.cta', 'MAĞAZAYA GİT')} <span className={styles.arrow}>→</span>
          </span>
        </div>
      </Link>

      {/* Sağ — Kurumsal / B2B */}
      <Link
        to="/corporate"
        className={`${styles.half} ${styles.halfRight} ${
          hover === 'right' ? styles.halfExpand : hover === 'left' ? styles.halfShrink : ''
        }`}
        onMouseEnter={() => setHover('right')}
        onMouseLeave={() => setHover(null)}
      >
        <BannerSlider banners={b2bBanners} />
        <div className={styles.overlay} />
        <div className={styles.ghostText}>B2B</div>
        <div className={styles.halfContent}>
          <img src={logoUrl} alt="HITHLAIN" className={styles.logo} />
          <span className={styles.tag}>B2B</span>
          <h2 className={styles.title}>
            {get('welcome.b2b.title', 'KURUMSAL\nÇÖZÜMLER').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <p className={styles.desc}>
            {get('welcome.b2b.desc', 'Toptan sipariş, baskı & nakış, promosyon tekstili.\n50 adet ve üzeri siparişlerde özel fiyat avantajı.').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <span className={styles.cta}>
            {get('welcome.b2b.cta', 'TEKLİF AL')} <span className={styles.arrow}>→</span>
          </span>
        </div>
      </Link>

      {/* Orta çizgi */}
      <div className={styles.divider} />
    </div>
  )
}
