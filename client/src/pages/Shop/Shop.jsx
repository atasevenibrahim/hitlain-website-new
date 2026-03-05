import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories, colors as allColors, sizes as allSizes } from '../../data/mockData'
import api from '../../utils/api'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Shop.module.css'

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Önerilen' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'newest', label: 'En Yeni' },
]

const ITEMS_PER_PAGE = 6

function addBadge(p) {
  return { ...p, badge: p.isNew ? 'Yeni' : p.isFeatured ? 'Çok Satan' : p.stock < 10 ? 'Son Stok' : null }
}

export default function Shop() {
  const revealRef = useScrollReveal()
  const { category: urlCategory } = useParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/products', { params: { limit: 100 } })
      .then((res) => setProducts(res.data.products.map(addBadge)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const [selectedCategories, setSelectedCategories] = useState(
    urlCategory ? [urlCategory] : []
  )
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('recommended')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    )
  }

  const toggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    )
  }

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedSizes([])
    setPriceMin('')
    setPriceMax('')
  }

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      )
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      )
    }

    if (priceMin) {
      result = result.filter((p) => p.price >= Number(priceMin))
    }
    if (priceMax) {
      result = result.filter((p) => p.price <= Number(priceMax))
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return result
  }, [products, selectedCategories, selectedColors, selectedSizes, priceMin, priceMax, sort])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0 ||
    selectedSizes.length > 0 || priceMin || priceMax

  const pageTitle = urlCategory
    ? categories.find((c) => c.id === urlCategory)?.name || urlCategory.replace(/-/g, ' ')
    : 'Tüm Ürünler'

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>{pageTitle} — HITHLAIN Giyim</title>
        <meta name="description" content={`HITHLAIN Giyim ${pageTitle} kategorisinde kaliteli iş giyim ürünleri.`} />
      </Helmet>
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/home">Ana Sayfa</Link> <span>/</span> <span>{pageTitle}</span>
          </div>
          <h1 className={styles.pageTitle}>{pageTitle.toUpperCase()}</h1>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Filtre Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterHeader}>
              <h3 className={styles.filterTitle}>Filtreler</h3>
              {hasFilters && (
                <button className={styles.clearBtn} onClick={clearFilters}>
                  Temizle
                </button>
              )}
            </div>

            {/* Kategori */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Kategori</h4>
              {categories.map((cat) => (
                <label key={cat.id} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>

            {/* Fiyat */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Fiyat Aralığı</h4>
              <div className={styles.priceRange}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className={styles.priceInput}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className={styles.priceInput}
                />
              </div>
            </div>

            {/* Renk */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Renk</h4>
              <div className={styles.colorSwatches}>
                {allColors.map((c) => (
                  <button
                    key={c.hex}
                    className={`${styles.colorSwatch} ${
                      selectedColors.includes(c.name) ? styles.colorSelected : ''
                    }`}
                    style={{ background: c.hex }}
                    onClick={() => toggleColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Beden */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Beden</h4>
              <div className={styles.sizeCheckboxes}>
                {allSizes.map((s) => (
                  <label key={s} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(s)}
                      onChange={() => toggleSize(s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Ürün Grid */}
          <div className={styles.content}>
            <div className={styles.topBar}>
              <span className={styles.resultCount}>{filtered.length} ürün</span>
              <select
                className={styles.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className={styles.empty}>
                <p>Ürünler yükleniyor...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>Aramanızla eşleşen ürün bulunamadı.</p>
                <button className="btn btn-ghost" onClick={clearFilters}>
                  FİLTRELERİ TEMİZLE
                </button>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {visible.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {hasMore && (
                  <div className={styles.loadMore}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    >
                      DAHA FAZLA YÜKLE
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
