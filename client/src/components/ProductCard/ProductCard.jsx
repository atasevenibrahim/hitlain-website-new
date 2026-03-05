import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatters'
import useCartStore from '../../stores/cartStore'
import useToastStore from '../../stores/toastStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultColor = product.colors?.[0]?.name || 'Beyaz'
    const defaultSize = product.sizes?.[1] || product.sizes?.[0] || 'M'
    addItem(product, defaultSize, defaultColor, 1)
    openCart()
    useToastStore.getState().showToast('Sepete eklendi!', 'success')
  }

  const badgeClass = product.badge === 'Çok Satan'
    ? styles.badgeGreen
    : product.badge === 'Yeni'
      ? styles.badgeInk
      : product.badge === 'Son Stok'
        ? styles.badgeWarning
        : ''

  const maxSwatches = 4
  const visibleColors = product.colors?.slice(0, maxSwatches) || []
  const extraCount = (product.colors?.length || 0) - maxSwatches

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.placeholderIcon}>👕</span>
        </div>

        {product.badge && (
          <span className={`${styles.badge} ${badgeClass}`}>
            {product.badge}
          </span>
        )}

        <button className={styles.quickAdd} onClick={handleQuickAdd}>
          HIZLI EKLE
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.swatches}>
          {visibleColors.map((c) => (
            <span
              key={c.hex}
              className={styles.swatch}
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
          {extraCount > 0 && (
            <span className={styles.swatchMore}>+{extraCount}</span>
          )}
        </div>

        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>{formatPrice(product.price)}</span>
      </div>
    </Link>
  )
}
