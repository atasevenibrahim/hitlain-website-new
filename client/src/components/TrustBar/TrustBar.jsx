import styles from './TrustBar.module.css'

const items = [
  { icon: '✓', text: 'Güvenli Alışveriş' },
  { icon: '⬡', text: '1500₺ Üzeri Kargo Bedava' },
  { icon: '→', text: 'Hızlı Teslimat' },
  { icon: '◎', text: 'Online Destek' },
]

export default function TrustBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
