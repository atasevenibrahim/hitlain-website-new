import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../utils/api'
import { defaultCategories } from '../../../data/mockData'
import useSiteContent from '../../../hooks/useSiteContent'
import { formatPrice } from '../../../utils/formatters'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const STATUS_MAP = {
  active: { label: 'Aktif', cls: 'badgeActive' },
  draft: { label: 'Taslak', cls: 'badgeDraft' },
  archived: { label: 'Arşiv', cls: 'badgeArchived' },
}

export default function Products() {
  const { getJSON } = useSiteContent()
  const categories = getJSON('categories.list', defaultCategories)
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } })
      .then((res) => {
        setProductList(res.data.products || res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || p.category === catFilter
    return matchSearch && matchCat
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/products/${id}`)
      setProductList((prev) => prev.filter((p) => p.id !== id))
      useToastStore.getState().showToast('Ürün silindi', 'success')
    } catch {
      useToastStore.getState().showToast('Silme başarısız', 'error')
    }
  }

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Ürün Yönetimi</h1>
        </div>
        <TableSkeleton rows={6} cols={5} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Ürün Yönetimi</h1>
        <Link to="/admin/products/new" className="btn btn-primary btn-sm">
          + YENİ ÜRÜN EKLE
        </Link>
      </div>

      <div className={s.toolbar}>
        <input
          type="text"
          className={s.searchInput}
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={s.filterSelect}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const status = STATUS_MAP[p.status || 'active']
              const stock = p.stock || 0
              return (
                <tr key={p.id}>
                  <td>
                    <div className={s.thumbnail}>
                      {p.images?.[0] && p.images[0] !== '/placeholder-product.jpg'
                        ? <img src={p.images[0]} alt={p.name} />
                        : categories.find(c => c.id === p.category)?.image
                          ? <img src={categories.find(c => c.id === p.category).image} alt={p.name} style={{ objectFit: 'contain', padding: '4px' }} />
                          : '👕'}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    {stock}
                    {stock < 20 && (
                      <span className={`${s.badge} ${s.badgeLowStock}`} style={{ marginLeft: '0.4rem' }}>
                        Düşük
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`${s.badge} ${s[status.cls]}`}>{status.label}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        DÜZENLE
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        SİL
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--subtle)', padding: '2rem' }}>
                  Ürün bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
