import { useEffect, useRef } from 'react'
import styles from './Checkout.module.css'

export default function PayTRFrame({ token, onClose }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    function handleMessage(e) {
      if (e.origin !== 'https://www.paytr.com') return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data.status === 'success') {
          // PayTR webhook will update order; redirect to success
          onClose('success')
        } else if (data.status === 'failed') {
          onClose('failed')
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose])

  return (
    <div className={styles.paytrOverlay} onClick={() => onClose('cancel')}>
      <div className={styles.paytrModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.paytrHeader}>
          <span className={styles.paytrTitle}>Güvenli Ödeme</span>
          <button className={styles.paytrClose} onClick={() => onClose('cancel')}>✕</button>
        </div>
        <iframe
          ref={iframeRef}
          src={`https://www.paytr.com/odeme/guvenli/${token}`}
          className={styles.paytrIframe}
          title="PayTR Güvenli Ödeme"
          allowFullScreen
          allow="payment"
        />
      </div>
    </div>
  )
}
