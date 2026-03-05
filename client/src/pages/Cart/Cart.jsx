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
    <div className="container">
      <Helmet>
        <title>Sepet — HITHLAIN Giyim</title>
      </Helmet>
      <div className={styles.cart}>
        <div className={styles.cartHeader}>
          <h1 className={styles.cartTitle}>
            Sepetim
            <span className={styles.cartCount}>({totalItems} ürün)</span>
          </h1>
          <Link to="/shop" className={styles.continueShopping}>
            ← Alışverişe Devam Et
          </Link>
        </div>

        <div className={styles.cartBody}>
          {/* Item List */}
          <div className={styles.itemList}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.isStudio && item.designUrl ? (
                    <img src={item.designUrl} alt="Tasarım" />
                  ) : (
                    <div className={styles.placeholder}>👕</div>
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.product.name}</div>
                  <div className={styles.itemVariant}>
                    {item.color} · {item.size}
                  </div>
                  {item.isStudio && (
                    <span className={styles.studioBadge}>
                      ✏ ÖZEL TASARIM
                    </span>
                  )}
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

                <div className={styles.itemPrice}>
                  {formatPrice(item.product.price * item.qty)}
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.key)}
                  title="Kaldır"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Sipariş Özeti</h3>

            <div className={styles.summaryRow}>
              <span>Ara Toplam</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Kargo</span>
              <span>{shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}</span>
            </div>

            {totalPrice < FREE_SHIPPING_LIMIT && (
              <div className={styles.shippingInfo}>
                {formatPrice(FREE_SHIPPING_LIMIT - totalPrice)} daha ekleyin,
                kargo bedava!
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

            <Link to="/checkout" className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}>
              ÖDEMEYE GEÇ
            </Link>

            <button
              className={`btn btn-wa ${styles.waBtn}`}
              onClick={handleWhatsApp}
            >
              WHATSAPP İLE SİPARİŞ VER
            </button>

            <div className={styles.secureBadge}>
              🔒 Güvenli Ödeme · SSL Korumalı
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
