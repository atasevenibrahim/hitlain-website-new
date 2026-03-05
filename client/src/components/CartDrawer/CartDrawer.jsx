import { Link } from 'react-router-dom'
import useCartStore from '../../stores/cartStore'
import { formatPrice } from '../../utils/formatters'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore()
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Sepet
            {totalItems > 0 && (
              <span className={styles.count}>({totalItems})</span>
            )}
          </h3>
          <button className={styles.closeBtn} onClick={closeCart}>
            ✕
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className={styles.emptyText}>Sepetiniz boş</p>
            <Link to="/shop" className="btn btn-primary" onClick={closeCart}>
              ALIŞVERİŞE BAŞLA
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.key} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.isStudio && item.designUrl ? (
                      <img src={item.designUrl} alt="Tasarım" />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <p className={styles.itemVariant}>
                      {item.color} · {item.size}
                    </p>
                    <div className={styles.itemBottom}>
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
                      <span className={styles.itemPrice}>
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.key)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Toplam</span>
                <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
              </div>
              <Link
                to="/cart"
                className="btn btn-primary btn-full"
                onClick={closeCart}
              >
                ÖDEMEYE GEÇ
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
