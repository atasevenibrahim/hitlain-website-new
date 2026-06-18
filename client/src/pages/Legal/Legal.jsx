import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import useSiteContent from '../../hooks/useSiteContent'
import styles from './Legal.module.css'

const META = {
  kvkk: 'KVKK Aydınlatma Metni',
  gizlilik: 'Gizlilik Politikası',
  'mesafeli-satis': 'Mesafeli Satış Sözleşmesi',
  'iptal-iade': 'İptal & İade Politikası',
}

function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className={styles.h3}>{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className={styles.h2}>{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className={styles.h1}>{line.slice(2)}</h1>)
    } else if (line.startsWith('- ')) {
      const listItems = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(<li key={i}>{lines[i].slice(2)}</li>)
        i++
      }
      elements.push(<ul key={`ul-${i}`} className={styles.list}>{listItems}</ul>)
      continue
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      // inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      const rendered = parts.map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j}>{part.slice(2, -2)}</strong>
          : part
      )
      elements.push(<p key={i} className={styles.para}>{rendered}</p>)
    }
    i++
  }

  return elements
}

export default function Legal({ slug }) {
  const { get } = useSiteContent()
  const title = META[slug]

  if (!title) return null

  const content = get(`legal.${slug}`, '')

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{title} — HITHLAIN Giyim</title>
      </Helmet>

      <section className="section">
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/">Ana Sayfa</Link>
            <span>›</span>
            <span>{title}</span>
          </div>

          <SectionHeader label="SÖZLEŞMELER" title={title} />

          <div className={styles.content}>
            {content
              ? renderMarkdown(content)
              : <p className={styles.para} style={{ color: 'var(--subtle)' }}>
                  Bu sayfa henüz düzenlenmemiştir. Admin panelinden içerik ekleyin.
                </p>
            }
          </div>
        </div>
      </section>
    </div>
  )
}
