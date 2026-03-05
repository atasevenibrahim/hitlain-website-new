import useStudioStore from '../../stores/studioStore'
import useCartStore from '../../stores/cartStore'
import useToastStore from '../../stores/toastStore'
import { products } from '../../data/mockData'
import { formatPrice } from '../../utils/formatters'
import styles from './Studio.module.css'

export default function BottomPanel() {
  const {
    product: selectedProduct,
    color: selectedColor,
    sizes,
    setProduct,
    setColor,
    setSizeQty,
    exportDesign,
  } = useStudioStore()

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const studioProducts = products.filter((p) =>
    ['tisort', 'sweatshirt'].includes(p.category)
  )

  const totalQty = Object.values(sizes).reduce((sum, q) => sum + q, 0)
  const totalPrice = selectedProduct ? totalQty * selectedProduct.price : 0

  const handleAddToCart = () => {
    if (!selectedProduct) {
      useToastStore.getState().showToast('Lütfen bir ürün seçin', 'error')
      return
    }
    if (!selectedColor) {
      useToastStore.getState().showToast('Lütfen bir renk seçin', 'error')
      return
    }
    if (totalQty === 0) {
      useToastStore.getState().showToast('Lütfen en az bir beden ve adet seçin', 'error')
      return
    }

    const designUrl = exportDesign()

    Object.entries(sizes).forEach(([size, qty]) => {
      if (qty > 0) {
        addItem(selectedProduct, size, selectedColor, qty, true, designUrl)
      }
    })

    openCart()
    useToastStore.getState().showToast('Tasarım sepete eklendi!', 'success')
  }

  return (
    <div className={styles.bottomPanel}>
      {/* Adım 1: Ürün Seç */}
      <div className={styles.bottomStep}>
        <h4 className={styles.bottomStepTitle}>1. Ürün Seç</h4>
        <div className={styles.productScroll}>
          {studioProducts.map((p) => (
            <button
              key={p.id}
              className={`${styles.productMini} ${
                selectedProduct?.id === p.id ? styles.productMiniActive : ''
              }`}
              onClick={() => {
                setProduct(p)
                if (p.colors.length > 0 && !selectedColor) {
                  setColor(p.colors[0].name)
                }
              }}
            >
              <span className={styles.productMiniIcon}>👕</span>
              <span className={styles.productMiniName}>{p.name}</span>
              <span className={styles.productMiniPrice}>{formatPrice(p.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adım 2: Renk Seç */}
      {selectedProduct && (
        <div className={styles.bottomStep}>
          <h4 className={styles.bottomStepTitle}>2. Renk Seç</h4>
          <div className={styles.colorOptions}>
            {selectedProduct.colors.map((c) => (
              <button
                key={c.hex}
                className={`${styles.colorOption} ${
                  selectedColor === c.name ? styles.colorOptionActive : ''
                }`}
                onClick={() => setColor(c.name)}
                title={c.name}
              >
                <span
                  className={styles.colorDot}
                  style={{ background: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Adım 3: Beden & Adet */}
      {selectedProduct && selectedColor && (
        <div className={styles.bottomStep}>
          <h4 className={styles.bottomStepTitle}>3. Beden & Adet</h4>
          <div className={styles.sizeInputs}>
            {selectedProduct.sizes.map((s) => (
              <div key={s} className={styles.sizeInput}>
                <label>{s}</label>
                <input
                  type="number"
                  min="0"
                  value={sizes[s] || 0}
                  onChange={(e) => setSizeQty(s, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
            <span>Toplam: {totalQty} adet</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </div>
      )}

      {/* Adım 4: Sepete Ekle */}
      <div className={styles.bottomStep}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAddToCart}
          disabled={!selectedProduct || totalQty === 0}
          style={{ opacity: (!selectedProduct || totalQty === 0) ? 0.5 : 1 }}
        >
          SEPETE EKLE
        </button>
      </div>
    </div>
  )
}
