import { Helmet } from 'react-helmet-async'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Contact.module.css'

export default function Contact() {
  const revealRef = useScrollReveal()

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>İletişim — HITHLAIN Giyim</title>
        <meta name="description" content="HITHLAIN Giyim ile iletişime geçin. Adres, telefon, e-posta bilgileri." />
      </Helmet>
      <div className="container">
        <span className="section-label">İLETİŞİM</span>
        <h1>Bize Ulaşın</h1>
        <div className={styles.grid}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <h4>Adres</h4>
              <p>Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA</p>
            </div>
            <div className={styles.infoItem}>
              <h4>E-posta</h4>
              <p>hithlaingiyim@gmail.com</p>
            </div>
            <div className={styles.infoItem}>
              <h4>Telefon</h4>
              <p>0543 686 19 94</p>
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
