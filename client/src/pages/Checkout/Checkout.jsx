import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import useCartStore from '../../stores/cartStore'
import useToastStore from '../../stores/toastStore'
import { formatPrice } from '../../utils/formatters'
import styles from './Checkout.module.css'

const FREE_SHIPPING_LIMIT = 1500
const STANDARD_SHIPPING = 79
const FAST_SHIPPING = 149

const CITIES = [
  'Adana', 'Ankara', 'Antalya', 'Bursa', 'Denizli', 'Diyarbakır',
  'Eskişehir', 'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli',
  'Konya', 'Mersin', 'Muğla', 'Sakarya', 'Samsun', 'Trabzon',
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const totalPrice = useCartStore((s) => s.totalPrice)

  const [step, setStep] = useState(1)

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    shippingMethod: 'standard',
    note: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const isFreeShipping = totalPrice >= FREE_SHIPPING_LIMIT
  const shippingFee =
    form.shippingMethod === 'fast'
      ? FAST_SHIPPING
      : isFreeShipping
        ? 0
        : STANDARD_SHIPPING
  const grandTotal = totalPrice + shippingFee

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.phone || !form.city || !form.address) {
        useToastStore.getState().showToast('Lütfen tüm alanları doldurun', 'error')
        return
      }
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = () => {
    if (!form.cardNumber || !form.cardName || !form.cardExpiry || !form.cardCvv) {
      useToastStore.getState().showToast('Lütfen kart bilgilerini doldurun', 'error')
      return
    }
    clearCart()
    navigate('/checkout/success')
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.checkout}>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>
              Sepetiniz Boş
            </h2>
            <p style={{ color: 'var(--mid)', margin: '1rem 0 2rem' }}>
              Ödeme yapmak için sepetinize ürün ekleyin.
            </p>
            <Link to="/shop" className="btn btn-primary">
              ALIŞVERİŞE BAŞLA
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Helmet>
        <title>Ödeme — HITHLAIN Giyim</title>
      </Helmet>
      <div className={styles.checkout}>
        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                step >= 1 ? (step > 1 ? styles.stepCircleDone : styles.stepCircleActive) : ''
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`${styles.stepLabel} ${step >= 1 ? styles.stepLabelActive : ''}`}>
              Bilgiler
            </span>
          </div>

          <div className={`${styles.stepLine} ${step > 1 ? styles.stepLineDone : ''}`} />

          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                step >= 2 ? (step > 2 ? styles.stepCircleDone : styles.stepCircleActive) : ''
              }`}
            >
              {step > 2 ? '✓' : '2'}
            </div>
            <span className={`${styles.stepLabel} ${step >= 2 ? styles.stepLabelActive : ''}`}>
              Kargo
            </span>
          </div>

          <div className={`${styles.stepLine} ${step > 2 ? styles.stepLineDone : ''}`} />

          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${step >= 3 ? styles.stepCircleActive : ''}`}
            >
              3
            </div>
            <span className={`${styles.stepLabel} ${step >= 3 ? styles.stepLabelActive : ''}`}>
              Ödeme
            </span>
          </div>
        </div>

        <div className={styles.checkoutBody}>
          {/* Form Area */}
          <div className={styles.formSection}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <h2 className={styles.formTitle}>Kişisel Bilgiler</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ad Soyad</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>E-posta</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.formLabel}>Telefon</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>İl</label>
                    <select
                      className={styles.formSelect}
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                    >
                      <option value="">İl seçin</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>İlçe</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.district}
                      onChange={(e) => updateForm('district', e.target.value)}
                      placeholder="İlçe"
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.formLabel}>Adres</label>
                    <textarea
                      className={styles.formTextarea}
                      value={form.address}
                      onChange={(e) => updateForm('address', e.target.value)}
                      placeholder="Açık adres"
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Link to="/cart" className={styles.backBtn}>
                    ← Sepete Dön
                  </Link>
                  <button className="btn btn-primary" onClick={handleNext}>
                    DEVAM ET
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <>
                <h2 className={styles.formTitle}>Kargo Seçenekleri</h2>
                <div className={styles.shippingOptions}>
                  <div
                    className={`${styles.shippingCard} ${
                      form.shippingMethod === 'standard' ? styles.shippingCardActive : ''
                    }`}
                    onClick={() => updateForm('shippingMethod', 'standard')}
                  >
                    <div
                      className={`${styles.shippingRadio} ${
                        form.shippingMethod === 'standard' ? styles.shippingRadioActive : ''
                      }`}
                    />
                    <div className={styles.shippingInfo}>
                      <div className={styles.shippingName}>Standart Kargo</div>
                      <div className={styles.shippingDesc}>3-5 iş günü teslimat</div>
                    </div>
                    <div
                      className={`${styles.shippingPrice} ${
                        isFreeShipping ? styles.shippingFree : ''
                      }`}
                    >
                      {isFreeShipping ? 'Ücretsiz' : formatPrice(STANDARD_SHIPPING)}
                    </div>
                  </div>

                  <div
                    className={`${styles.shippingCard} ${
                      form.shippingMethod === 'fast' ? styles.shippingCardActive : ''
                    }`}
                    onClick={() => updateForm('shippingMethod', 'fast')}
                  >
                    <div
                      className={`${styles.shippingRadio} ${
                        form.shippingMethod === 'fast' ? styles.shippingRadioActive : ''
                      }`}
                    />
                    <div className={styles.shippingInfo}>
                      <div className={styles.shippingName}>Hızlı Kargo</div>
                      <div className={styles.shippingDesc}>1-2 iş günü teslimat</div>
                    </div>
                    <div className={styles.shippingPrice}>
                      {formatPrice(FAST_SHIPPING)}
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sipariş Notu (opsiyonel)</label>
                  <textarea
                    className={styles.formTextarea}
                    value={form.note}
                    onChange={(e) => updateForm('note', e.target.value)}
                    placeholder="Siparişinizle ilgili notunuz varsa yazabilirsiniz..."
                  />
                </div>

                <div className={styles.formActions}>
                  <button className={styles.backBtn} onClick={handleBack}>
                    ← Geri
                  </button>
                  <button className="btn btn-primary" onClick={handleNext}>
                    DEVAM ET
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <>
                <h2 className={styles.formTitle}>Ödeme Bilgileri</h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.formLabel}>Kart Numarası</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 16)
                          .replace(/(\d{4})/g, '$1 ')
                          .trim()
                        updateForm('cardNumber', val)
                      }}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label className={styles.formLabel}>Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.cardName}
                      onChange={(e) => updateForm('cardName', e.target.value)}
                      placeholder="AD SOYAD"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Son Kullanma</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
                        updateForm('cardExpiry', val)
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CVV</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={form.cardCvv}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3)
                        updateForm('cardCvv', val)
                      }}
                      placeholder="000"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.backBtn} onClick={handleBack}>
                    ← Geri
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                    SİPARİŞİ TAMAMLA
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mini Summary */}
          <div className={styles.miniSummary}>
            <h3 className={styles.miniTitle}>Sipariş Özeti</h3>

            <div className={styles.miniItems}>
              {items.map((item) => (
                <div key={item.key} className={styles.miniItem}>
                  <div className={styles.miniItemImage}>
                    {item.isStudio && item.designUrl ? (
                      <img src={item.designUrl} alt="Tasarım" />
                    ) : (
                      <div className={styles.miniPlaceholder}>👕</div>
                    )}
                  </div>
                  <div className={styles.miniItemInfo}>
                    <div className={styles.miniItemName}>{item.product.name}</div>
                    <div className={styles.miniItemVariant}>
                      {item.color} · {item.size} · x{item.qty}
                    </div>
                  </div>
                  <div className={styles.miniItemPrice}>
                    {formatPrice(item.product.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.miniDivider} />

            <div className={styles.miniRow}>
              <span>Ara Toplam</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.miniRow}>
              <span>Kargo</span>
              <span>{shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}</span>
            </div>

            <div className={styles.miniTotal}>
              <span className={styles.miniTotalLabel}>Toplam</span>
              <span className={styles.miniTotalPrice}>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
