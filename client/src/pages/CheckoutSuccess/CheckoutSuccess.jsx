import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styles from './CheckoutSuccess.module.css'

export default function CheckoutSuccess() {
  const orderNumber = useMemo(
    () => `HIT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    []
  )

  const handleWhatsApp = () => {
    const text = `Merhaba, ${orderNumber} numaralı siparişimi takip etmek istiyorum.`
    window.open(
      `https://wa.me/905436861994?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <div className="container">
      <div className={styles.success}>
        <div className={styles.checkIcon}>✓</div>
        <h1 className={styles.title}>Siparişiniz Alındı!</h1>
        <div className={styles.orderNumber}>Sipariş No: #{orderNumber}</div>
        <p className={styles.message}>
          Sipariş onayı e-posta adresinize gönderildi. Siparişinizin durumunu
          WhatsApp üzerinden takip edebilirsiniz.
        </p>
        <div className={styles.actions}>
          <Link to="/shop" className="btn btn-primary">
            ALIŞVERİŞE DEVAM ET
          </Link>
          <button className="btn btn-wa" onClick={handleWhatsApp}>
            WHATSAPP İLE TAKİP ET
          </button>
        </div>
      </div>
    </div>
  )
}
