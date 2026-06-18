import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useCartStore from '../../stores/cartStore'
import { formatPrice } from '../../utils/formatters'
import styles from './Cart.module.css'

const FREE_SHIPPING_LIMIT = 1500
const STANDARD_SHIPPING = 79

export default function Cart() {
  const { items, removeItem, updateQty } = useCartStore()
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0))
  const totalPrice = useCartStore((s) => s.items.reduce((sum, i) => sum + i.product.price * i.qty, 0))

  const shippingFee = totalPrice >= FREE_SHIPPING_LIMIT ? 0 : STANDARD_SHIPPING
  const grandTotal = totalPrice + shippingFee

  const handleWhatsApp = () => {
    const lines = items.map(
      (item) =>
        `- ${item.product.name} (${item.color}, ${item.size}) x${item.qty}`
    )
    const text = `Merhaba, sipariş vermek istiyorum:\n${lines.join('\n')}\nToplam: ${formatPrice(grandTotal)}`
    window.open(
      `https://wa.me/905436861994?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.cart}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Sepetiniz Boş</h2>
            <p className={styles.emptyText}>
              Henüz sepetinize ürün eklemediniz.
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
    <div className={styles.page}>
      <Helmet>
        <title>Sepet — HITHLAIN Giyim</title>
      </Helmet>

      {/* Green Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>SEPETİM</h1>
          <p className={styles.pageMeta}>{totalItems} ürün · Toplam {formatPrice(grandTotal)}</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Item List */}
        <div className={styles.itemList}>
          <div className={styles.listHeader}>
            <Link to="/shop" className={styles.continueShopping}>
              ← Alışverişe Devam Et
            </Link>
          </div>
          {items.map((item) => (
            <div key={item.key} className={styles.cartItem}>
              <div className={styles.cartItemImage}>
                {item.product.images?.[0] && item.product.images[0] !== '/placeholder-product.jpg' ? (
                  <img src={item.product.images[0]} alt={item.product.name} />
                ) : item.isStudio && item.designUrl ? (
                  <img src={item.designUrl} alt="Tasarım" />
                ) : (
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#c3ccbd" strokeWidth="1">
                    <path d="M20.4 5.6 16 4l-1.3 1.3a3.8 3.8 0 0 1-5.4 0L8 4 3.6 5.6a1 1 0 0 0-.6 1.2L4.4 11l2.6-.6V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9.6l2.6.6 1.4-4.2a1 1 0 0 0-.6-1.2z" />
                  </svg>
                )}
              </div>

              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.product.name}</div>
                <div className={styles.itemVariant}>{item.color} · {item.size}</div>
                {item.isStudio && (
                  <span className={styles.studioBadge}>✏ ÖZEL TASARIM</span>
                )}
                <div className={styles.itemUnitPrice}>{formatPrice(item.product.price)} / adet</div>
              </div>

              <div className={styles.qtyControl}>
                <button
                  onClick={() => updateQty(item.key, item.qty - 1)}
                  disabled={item.qty <= 1}
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)}>
                  +
                </button>
              </div>

              <div className={styles.itemPrice}>{formatPrice(item.product.price * item.qty)}</div>

              <button
                className={styles.removeBtn}
                onClick={() => removeItem(item.key)}
                aria-label="Kaldır"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3 className={styles.summaryTitle}>Sipariş Özeti</h3>

          <div className={styles.summaryRow}>
            <span>Ara Toplam</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Kargo</span>
            <span className={shippingFee === 0 ? styles.freeShipping : ''}>{shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}</span>
          </div>

          {totalPrice < FREE_SHIPPING_LIMIT && (
            <div className={styles.shippingInfo}>
              {formatPrice(FREE_SHIPPING_LIMIT - totalPrice)} daha ekleyin, kargo bedava!
            </div>
          )}

          <div className={styles.divider} />

          <div className={styles.discountRow}>
            <input
              type="text"
              placeholder="İndirim kodu"
              className={styles.discountInput}
            />
            <button className={styles.discountBtn}>UYGULA</button>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Toplam</span>
            <span className={styles.totalPrice}>{formatPrice(grandTotal)}</span>
          </div>

          <Link to="/checkout" className={styles.checkoutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
            ÖDEMEYE GEÇ
          </Link>

          <button className={styles.waBtn} onClick={handleWhatsApp}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.4A12 12 0 0 0 3.5 20.5L2 22l1.5-5.5A12 12 0 1 0 20.5 3.4zM12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm5-7.1c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1l-.8 1c-.1.1-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.3 0-.4.2-.6l.5-.6c.1-.2.2-.3.2-.5s-.6-1.6-.8-2.1c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.9 2.9 4.6 4 .7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.3-.1-.2-.3-.3-.5-.4z" />
            </svg>
            WHATSAPP İLE SİPARİŞ VER
          </button>

          <div className={styles.secureBadge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Güvenli Ödeme · SSL Korumalı
          </div>
        </div>
      </div>
    </div>
  )
}
