import useSiteContent from '../../hooks/useSiteContent'
import styles from './MarqueeBanner.module.css'

const defaultItems = [
  'TOPTAN FİYAT AVANTAJI',
  'KURUMSAL ÇÖZÜMLER',
  'BASKI & NAKIŞ HİZMETİ',
  'ÜCRETSİZ KARGO (1500₺+)',
  'TASARIM STÜDYOSU',
  'HIZLI TESLİMAT',
]

export default function MarqueeBanner() {
  const { getJSON } = useSiteContent()
  const items = getJSON('marqueeItems', defaultItems)
  const content = items.map((item) => `${item} ◆ `).join('')
  const doubled = content + content

  return (
    <div className={styles.banner}>
      <div className={styles.track}>
        <span className={styles.text}>{doubled}</span>
      </div>
    </div>
  )
}
