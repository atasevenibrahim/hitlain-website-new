import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories } from '../../data/mockData'
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

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [openSection, setOpenSection] = useState('description')

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
          {/* Sol — Görsel Galeri */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <div className={styles.imagePlaceholder}>
                <span style={{ fontSize: '5rem', opacity: 0.2 }}>👕</span>
              </div>
            </div>

            <div className={styles.thumbnails}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.thumb}>
                  <div className={styles.thumbPlaceholder} />
                </div>
              ))}
            </div>

            <Link to="/studio" className={styles.studioBanner}>
              <span className={styles.studioBannerIcon}>✏</span>
              <div>
                <strong>Bu ürünü stüdyoda özelleştir</strong>
                <p>Kendi tasarımını ekle, baskı bölgesini seç</p>
              </div>
              <span className={styles.studioBannerArrow}>→</span>
            </Link>
          </div>

          {/* Sağ — Ürün Bilgisi */}
          <div className={styles.info}>
            <span className={styles.brand}>HITHLAIN</span>
            <h1 className={styles.title}>{product.name}</h1>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <span className={`${styles.stock} ${stockBadge.cls}`}>{stockBadge.text}</span>

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

            {/* CTA */}
            <button className="btn btn-primary btn-full btn-lg" onClick={handleAddToCart}>
              SEPETE EKLE
            </button>
            <button className="btn btn-secondary btn-full" onClick={handleStudioAdd} style={{ marginTop: '0.5rem' }}>
              TASARIMLA EKLE
            </button>

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
