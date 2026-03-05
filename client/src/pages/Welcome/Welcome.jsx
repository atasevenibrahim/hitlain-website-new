import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import styles from './Welcome.module.css'

export default function Welcome() {
  const [hover, setHover] = useState(null)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>HITHLAIN Giyim — Kurumsal & Bireysel Tekstil Çözümleri</title>
        <meta name="description" content="HITHLAIN Giyim: Bireysel alışveriş ve kurumsal tekstil çözümleri. Toptan ve perakende iş giyim, baskı ve nakış hizmetleri." />
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
        <div className={styles.halfContent}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logo} />
          <span className={styles.tag}>B2C</span>
          <h2 className={styles.title}>BİREYSEL<br />ALIŞVERİŞ</h2>
          <p className={styles.desc}>
            Tişört, sweatshirt, mont ve daha fazlası.<br />
            Kendi tasarımını oluştur veya hazır ürünleri keşfet.
          </p>
          <span className={styles.cta}>
            MAĞAZAYA GİT <span className={styles.arrow}>→</span>
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
        <div className={styles.halfContent}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logo} />
          <span className={styles.tag}>B2B</span>
          <h2 className={styles.title}>KURUMSAL<br />ÇÖZÜMLER</h2>
          <p className={styles.desc}>
            Toptan sipariş, baskı & nakış, promosyon tekstili.<br />
            50 adet ve üzeri siparişlerde özel fiyat avantajı.
          </p>
          <span className={styles.cta}>
            TEKLİF AL <span className={styles.arrow}>→</span>
          </span>
        </div>
      </Link>

      {/* Orta çizgi */}
      <div className={styles.divider} />
    </div>
  )
}
