import { Link } from 'react-router-dom'
import useSiteContent from '../../hooks/useSiteContent'
import styles from './Footer.module.css'

const categoryLinks = [
  { to: '/shop/tisort', label: 'Tişört' },
  { to: '/shop/sweatshirt', label: 'Sweatshirt' },
  { to: '/shop/mont-ceket', label: 'Mont ve Ceket' },
  { to: '/shop/pantolon', label: 'Pantolon' },
  { to: '/shop/onluk', label: 'Önlük' },
  { to: '/shop/ikaz-yelegi', label: 'İkaz Yeleği' },
]

const pageLinks = [
  { to: '/about', label: 'Hakkımızda' },
  { to: '/contact', label: 'İletişim' },
  { to: '/faq', label: 'SSS' },
  { to: '/corporate', label: 'Kurumsal' },
  { to: '/studio', label: 'Tasarım Stüdyosu' },
]

const legalLinks = [
  { to: '/privacy', label: 'Gizlilik Politikası' },
  { to: '/terms', label: 'Kullanım Koşulları' },
  { to: '/return-policy', label: 'İade Politikası' },
  { to: '/kvkk', label: 'KVKK Aydınlatma Metni' },
]

export default function Footer() {
  const { get } = useSiteContent()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Categories */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Kategoriler</h4>
            <ul className={styles.linkList}>
              {categoryLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Sayfalar</h4>
            <ul className={styles.linkList}>
              {pageLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Sözleşmeler</h4>
            <ul className={styles.linkList}>
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.logoBottom}>
            <img src={get('logoUrl', '/hithlain-logo.png') || '/hithlain-logo.png'} alt="HITHLAIN" className={styles.logoBottomImg} />
          </span>
          <p className={styles.copyright}>
            {get('footerCopyright', '© 2026 Hithlain Giyim. Tüm hakları saklıdır.')}
          </p>
        </div>
      </div>
    </footer>
  )
}
