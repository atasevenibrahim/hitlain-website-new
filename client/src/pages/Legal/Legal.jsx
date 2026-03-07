import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import useSiteContent from '../../hooks/useSiteContent'
import styles from './Legal.module.css'

const pages = {
  privacy: {
    key: 'legal.privacy',
    defaultTitle: 'Gizlilik Politikası',
    defaultContent: 'Bu sayfa henüz düzenlenmemiştir. Lütfen admin panelinden içerik ekleyin.',
  },
  terms: {
    key: 'legal.terms',
    defaultTitle: 'Kullanım Koşulları',
    defaultContent: 'Bu sayfa henüz düzenlenmemiştir. Lütfen admin panelinden içerik ekleyin.',
  },
  returnPolicy: {
    key: 'legal.returnPolicy',
    defaultTitle: 'İade Politikası',
    defaultContent: 'Bu sayfa henüz düzenlenmemiştir. Lütfen admin panelinden içerik ekleyin.',
  },
  kvkk: {
    key: 'legal.kvkk',
    defaultTitle: 'KVKK Aydınlatma Metni',
    defaultContent: 'Bu sayfa henüz düzenlenmemiştir. Lütfen admin panelinden içerik ekleyin.',
  },
}

export default function Legal({ slug }) {
  const { get } = useSiteContent()
  const page = pages[slug]

  if (!page) return null

  const title = get(`${page.key}.title`, page.defaultTitle)
  const content = get(`${page.key}.content`, page.defaultContent)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{title} — HITHLAIN Giyim</title>
      </Helmet>

      <section className="section">
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/home">Ana Sayfa</Link>
            <span>›</span>
            <span>{title}</span>
          </div>

          <SectionHeader label="SÖZLEŞMELER" title={title} />

          <div className={styles.content}>
            {content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
