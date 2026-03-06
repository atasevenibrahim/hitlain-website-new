import { Helmet } from 'react-helmet-async'
import useSiteContent from '../../hooks/useSiteContent'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Contact.module.css'

export default function Contact() {
  const revealRef = useScrollReveal()
  const { get } = useSiteContent()

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>İletişim — {get('siteName', 'HITHLAIN Giyim')}</title>
        <meta name="description" content="HITHLAIN Giyim ile iletişime geçin. Adres, telefon, e-posta bilgileri." />
      </Helmet>
      <div className="container">
        <span className="section-label">{get('contact.subtitle', 'İLETİŞİM')}</span>
        <h1>{get('contact.title', 'Bize Ulaşın')}</h1>
        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <h4>Adres</h4>
              <p>{get('address', 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA')}</p>
            </div>
            <div className={styles.infoItem}>
              <h4>E-posta</h4>
              <p>{get('email', 'hithlaingiyim@gmail.com')}</p>
            </div>
            <div className={styles.infoItem}>
              <h4>Telefon</h4>
              <p>{get('phone', '0543 686 19 94')}</p>
            </div>
          </div>
          <form className={styles.form}>
            <input type="text" placeholder="Ad Soyad" required />
            <input type="email" placeholder="E-posta" required />
            <input type="text" placeholder="Konu" />
            <textarea placeholder="Mesajınız" rows={5} required />
            <button type="submit" className="btn btn-primary">GÖNDER</button>
          </form>
        </div>
      </div>
    </div>
  )
}
