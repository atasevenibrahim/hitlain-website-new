import styles from './SectionHeader.module.css'

export default function SectionHeader({ label, title, subtitle, align = 'left', light = false }) {
  return (
    <div className={`${styles.header} ${styles[align]} ${light ? styles.light : ''}`}>
      {label && <span className="section-label">{label}</span>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
