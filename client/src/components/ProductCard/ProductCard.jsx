import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../stores/cartStore'
import useToastStore from '../../stores/toastStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, gridMode }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultColor = product.colors?.[0]?.name || 'Beyaz'
    const defaultSize = product.sizes?.[1] || product.sizes?.[0] || 'M'
    addItem(product, defaultSize, defaultColor, 1)
    openCart()
    useToastStore.getState().showToast('Sepete eklendi!', 'success')
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    navigate(`/product/${product.id}`)
  }

  const reviewCount = product.reviews || Math.floor(Math.random() * 50) + 3

  return (
    <div className={`${styles.card}${gridMode ? ` ${styles.cardGrid}` : ''}`} onClick={handleCardClick} role="link" tabIndex={0}>
      {/* Image Area */}
      <div className={styles.imageArea}>
        {discount && (
          <span className={styles.discountBadge}>%{discount}</span>
        )}
        <button
          className={styles.wishlistBtn}
          onClick={(e) => e.stopPropagation()}
          aria-label="Favorilere ekle"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        {product.images?.[0] && product.images[0] !== '/placeholder-product.jpg' ? (
          <img src={product.images[0]} alt={product.name} className={styles.productImg} />
        ) : (
          <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#c3ccbd" strokeWidth="1">
            <path d="M20.4 5.6 16 4l-1.3 1.3a3.8 3.8 0 0 1-5.4 0L8 4 3.6 5.6a1 1 0 0 0-.6 1.2L4.4 11l2.6-.6V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9.6l2.6.6 1.4-4.2a1 1 0 0 0-.6-1.2z" />
          </svg>
        )}
      </div>

      {/* Card Body */}
      <div className={styles.body}>
        <span className={styles.brand}>{product.brand || 'HITHLAIN'}</span>
        <h3 className={styles.name}>{product.name}</h3>

        {/* Stars */}
        <div className={styles.stars}>
          <span className={styles.starsVal}>★★★★★</span>
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>

        {/* Price */}
        {discount ? (
          <>
            <div className={styles.priceRow}>
              <span className={styles.savingsBadge}>Kazancınız %{discount}</span>
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            </div>
            <div className={styles.price}>{formatPrice(product.price)}</div>
            <span className={styles.special}>Hithlain&apos;e Özel!</span>
          </>
        ) : (
          <div className={styles.price}>{formatPrice(product.price)}</div>
        )}

        {/* Add to Cart */}
        <button className={styles.addBtn} onClick={handleAddToCart}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Sepete Ekle
        </button>
      </div>
    </div>
  )
}
