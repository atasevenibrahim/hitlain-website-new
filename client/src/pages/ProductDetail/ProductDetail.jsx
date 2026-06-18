import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { defaultCategories } from '../../data/mockData'
import useSiteContent from '../../hooks/useSiteContent'
import { formatPrice } from '../../utils/formatters'
import api from '../../utils/api'
import useCartStore from '../../stores/cartStore'
import useToastStore from '../../stores/toastStore'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './ProductDetail.module.css'

function addBadge(p) {
  return { ...p, badge: p.isNew ? 'Yeni' : p.isFeatured ? 'Çok Satan' : p.stock < 10 ? 'Son Stok' : null }
}

export default function ProductDetail() {
  const revealRef = useScrollReveal()
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJSON } = useSiteContent()
  const categories = getJSON('categories.list', defaultCategories)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [openSection, setOpenSection] = useState('description')
  const [activeImage, setActiveImage] = useState(0)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    setLoading(true)
    setSelectedColor('')
    setSelectedSize('')
    setQty(1)
    api.get(`/products/${id}`)
      .then((res) => {
        const p = addBadge(res.data)
        setProduct(p)
        setSelectedColor(p.colors?.[0]?.name || '')
        return api.get('/products', { params: { category: p.category, limit: 5 } })
      })
      .then((res) => {
        setRelated(res.data.products.filter((p) => p.id !== Number(id)).slice(0, 4).map(addBadge))
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', minHeight: '60vh', textAlign: 'center' }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Ürün bulunamadı</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          MAĞAZAYA DÖN
        </Link>
      </div>
    )
  }

  const realImages = (product.images || []).filter((img) => img && img !== '/placeholder-product.jpg')
  const category = categories.find((c) => c.id === product.category)

  const handleAddToCart = () => {
    if (!selectedSize) {
      useToastStore.getState().showToast('Lütfen bir beden seçin', 'error')
      return
    }
    addItem(product, selectedSize, selectedColor, qty)
    openCart()
    useToastStore.getState().showToast('Sepete eklendi!', 'success')
  }

  const handleStudioAdd = () => {
    navigate('/studio')
  }

  const stockBadge = product.stock > 20
    ? { text: 'Stokta', cls: styles.stockIn }
    : product.stock > 0
      ? { text: 'Son Stok', cls: styles.stockLow }
      : { text: 'Tükendi', cls: styles.stockOut }

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>{product.name} — HITHLAIN Giyim</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/home">Ana Sayfa</Link>
          <span>/</span>
          <Link to={`/shop/${product.category}`}>{category?.name || product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className={styles.layout}>
          {/* Sol — Görsel Galeri (dikey thumbnail + büyük görsel) */}
          <div className={styles.gallery}>
            {realImages.length > 1 && (
              <div className={styles.thumbColumn}>
                {realImages.map((img, i) => (
                  <div
                    key={i}
                    className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
            <div className={styles.mainImage}>
              {realImages.length > 0 ? (
                <img src={realImages[activeImage]} alt={product.name} />
              ) : category?.image ? (
                <img src={category.image} alt={product.name} className={styles.fallbackImg} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#c3ccbd" strokeWidth="1">
                    <path d="M20.4 5.6 16 4l-1.3 1.3a3.8 3.8 0 0 1-5.4 0L8 4 3.6 5.6a1 1 0 0 0-.6 1.2L4.4 11l2.6-.6V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9.6l2.6.6 1.4-4.2a1 1 0 0 0-.6-1.2z" />
                  </svg>
                </div>
              )}
              <Link to="/studio" className={styles.studioBannerOverlay}>
                <span>✏ Özelleştir</span>
              </Link>
            </div>
          </div>

          {/* Sağ — Ürün Bilgisi */}
          <div className={styles.info}>
            <span className={styles.brand}>HITHLAIN</span>
            <h1 className={styles.title}>{product.name}</h1>

            {/* Stars */}
            <div className={styles.starsRow}>
              <span className={styles.starsVal}>★★★★★</span>
              <span className={styles.starsCount}>4.8 · 124 değerlendirme</span>
            </div>

            {/* Price */}
            <div className={styles.priceBlock}>
              {product.oldPrice && product.oldPrice > product.price ? (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.discountBadge}>
                      %{Math.round((1 - product.price / product.oldPrice) * 100)} İNDİRİM
                    </span>
                    <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
                  </div>
                  <span className={styles.price}>{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className={styles.price}>{formatPrice(product.price)}</span>
              )}
              <span className={`${styles.stock} ${stockBadge.cls}`}>{stockBadge.text}</span>
            </div>

            <div className={styles.divider} />

            {/* Renk Seçimi */}
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Renk: <strong>{selectedColor}</strong></label>
              <div className={styles.colorSwatches}>
                {product.colors.map((c) => (
                  <button
                    key={c.hex}
                    className={`${styles.colorSwatch} ${selectedColor === c.name ? styles.colorActive : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Beden Seçimi */}
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>
                Beden: <strong>{selectedSize || '—'}</strong>
              </label>
              <div className={styles.sizeOptions}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className={styles.sizeGuide}>Beden Rehberi</button>
            </div>

            <div className={styles.divider} />

            {/* Adet */}
            <div className={styles.qtyRow}>
              <label className={styles.optionLabel}>Adet</label>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.actions}>
              <button className={styles.addToCart} onClick={handleAddToCart}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                SEPETE EKLE
              </button>
              <button className={styles.buyNow} onClick={handleAddToCart}>
                HEMEN AL
              </button>
            </div>

            <div className={styles.divider} />

            {/* Collapsible */}
            <div className={styles.collapsible}>
              <button
                className={styles.collapseBtn}
                onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
              >
                <span>Ürün Açıklaması</span>
                <span>{openSection === 'description' ? '−' : '+'}</span>
              </button>
              {openSection === 'description' && (
                <div className={styles.collapseContent}>
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            <div className={styles.collapsible}>
              <button
                className={styles.collapseBtn}
                onClick={() => setOpenSection(openSection === 'fabric' ? '' : 'fabric')}
              >
                <span>Kumaş & Bakım</span>
                <span>{openSection === 'fabric' ? '−' : '+'}</span>
              </button>
              {openSection === 'fabric' && (
                <div className={styles.collapseContent}>
                  <p><strong>Kumaş:</strong> {product.fabric}</p>
                  <p><strong>Bakım:</strong> {product.care}</p>
                </div>
              )}
            </div>

            <div className={styles.collapsible}>
              <button
                className={styles.collapseBtn}
                onClick={() => setOpenSection(openSection === 'shipping' ? '' : 'shipping')}
              >
                <span>Kargo & İade</span>
                <span>{openSection === 'shipping' ? '−' : '+'}</span>
              </button>
              {openSection === 'shipping' && (
                <div className={styles.collapseContent}>
                  <p>1500₺ üzeri siparişlerde kargo ücretsizdir. Standart teslimat 3-5 iş günüdür.</p>
                  <p>Özel baskılı ürünlerde iade kabul edilmemektedir. Standart ürünlerde 14 gün içinde iade yapılabilir.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* İlgili Ürünler */}
        {related.length > 0 && (
          <div className={`${styles.related} reveal`}>
            <h2 className={styles.relatedTitle}>BU ÜRÜNÜ BEĞENENLERİN İLGİLENDİĞİ</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
