import { Link } from 'react-router-dom'
import useSiteContent from '../../hooks/useSiteContent'
import { defaultCategories } from '../../data/mockData'
import styles from './Footer.module.css'

const corporateLinks = [
  { to: '/about', label: 'Hakkımızda' },
  { to: '/contact', label: 'İletişim' },
  { to: '/faq', label: 'Sık Sorulan Sorular' },
  { to: '/studio', label: 'Tasarım Stüdyosu' },
  { to: '/gizlilik', label: 'Gizlilik Politikası' },
  { to: '/mesafeli-satis', label: 'Mesafeli Satış Sözleşmesi' },
  { to: '/iptal-iade', label: 'İptal & İade' },
  { to: '/kvkk', label: 'KVKK' },
]

export default function Footer() {
  const { get, getJSON } = useSiteContent()
  const categories = getJSON('categories.list', defaultCategories)

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* 1 — Brand */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logoLink}>
            <img
              src={get('logoUrl', '/hithlain-logo.png') || '/hithlain-logo.png'}
              alt="HITHLAIN"
              className={styles.logoImg}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className={styles.logoText}>HITHLAIN</span>
          </Link>
          <p className={styles.brandDesc}>
            Özel tasarım baskılı giyim, tek adetten kurumsal toptan siparişe kadar hızlı üretim.
          </p>
          <a
            href={`https://instagram.com/${get('instagram', 'hithlaingiyim')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instaLink}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            @{get('instagram', 'hithlaingiyim')}
          </a>
        </div>

        {/* 2 — Kategoriler */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>KATEGORİLER</h4>
          <ul className={styles.linkList}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop/${cat.id}`} className={styles.link}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 — Kurumsal */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>KURUMSAL</h4>
          <ul className={styles.linkList}>
            {corporateLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={styles.link}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4 — İletişim */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>İLETİŞİM</h4>
          <ul className={styles.contactList}>
            <li>
              <span className={styles.contactLabel}>Adres</span>
              <span>{get('address', 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA')}</span>
            </li>
            <li>
              <span className={styles.contactLabel}>Telefon</span>
              <a href={`tel:${get('phone', '05436861994').replace(/\s/g, '')}`} className={styles.link}>
                {get('phone', '0543 686 19 94')}
              </a>
            </li>
            <li>
              <span className={styles.contactLabel}>E-posta</span>
              <a href={`mailto:${get('email', 'hithlaingiyim@gmail.com')}`} className={styles.link}>
                {get('email', 'hithlaingiyim@gmail.com')}
              </a>
            </li>
          </ul>
          <a
            href="https://wa.me/905436861994"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.4A12 12 0 0 0 3.5 20.5L2 22l1.5-5.5A12 12 0 1 0 20.5 3.4zM12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm5-7.1c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1l-.8 1c-.1.1-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.3 0-.4.2-.6l.5-.6c.1-.2.2-.3.2-.5s-.6-1.6-.8-2.1c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.9 2.9 4.6 4 .7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.3-.1-.2-.3-.3-.5-.4z" />
            </svg>
            WhatsApp&apos;tan Ulaş
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>{get('footerCopyright', '© 2026 Hithlain Giyim. Tüm hakları saklıdır.')}</span>
        <div className={styles.bottomLinks}>
          <Link to="/kvkk" className={styles.bottomLink}>KVKK</Link>
          <Link to="/gizlilik" className={styles.bottomLink}>Gizlilik</Link>
          <Link to="/mesafeli-satis" className={styles.bottomLink}>Mesafeli Satış</Link>
        </div>
      </div>
    </footer>
  )
}
