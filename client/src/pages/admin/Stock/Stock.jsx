import { useState, useEffect, useMemo } from 'react'
import api from '../../../utils/api'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

export default function Stock() {
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } }).then((res) => {
      const products = res.data.products || res.data
      const allVariants = []
      products.forEach((p) => {
        if (p.variants) {
          p.variants.forEach((v) => {
            allVariants.push({ ...v, productName: p.name })
          })
        }
      })
      setVariants(allVariants)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return variants.filter((v) => {
      const matchSearch = v.productName.toLowerCase().includes(search.toLowerCase())
      if (filter === 'low') return matchSearch && v.stock > 0 && v.stock <= v.minStock
      if (filter === 'out') return matchSearch && v.stock === 0
      return matchSearch
    })
  }, [variants, filter, search])

  const updateStock = async (id, newStock) => {
    const stockVal = Math.max(0, Number(newStock) || 0)
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, stock: stockVal } : v))
    )
    try {
      await api.put(`/variants/${id}/stock`, { stock: stockVal })
    } catch {
      useToastStore.getState().showToast('Stok güncellenemedi', 'error')
    }
  }

  const getStockStatus = (v) => {
    if (v.stock === 0) return { label: 'Tükendi', cls: s.badgeOutOfStock }
    if (v.stock <= v.minStock) return { label: 'Düşük', cls: s.badgeLowStock }
    return { label: 'Yeterli', cls: s.badgeInStock }
  }

  const getBarColor = (v) => {
    if (v.stock === 0) return 'var(--error)'
    if (v.stock <= v.minStock) return 'var(--warning)'
    return 'var(--green)'
  }

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}><h1 className={s.pageTitle}>Stok Takibi</h1></div>
        <TableSkeleton rows={8} cols={6} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Stok Takibi</h1>
      </div>

      <div className={s.tabs}>
        {[
          { key: 'all', label: `Tümü (${variants.length})` },
          { key: 'low', label: `Düşük Stok (${variants.filter((v) => v.stock > 0 && v.stock <= v.minStock).length})` },
          { key: 'out', label: `Tükendi (${variants.filter((v) => v.stock === 0).length})` },
        ].map((t) => (
          <button
            key={t.key}
            className={`${s.tab} ${filter === t.key ? s.tabActive : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.toolbar}>
        <input
          type="text"
          className={s.searchInput}
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Renk</th>
              <th>Beden</th>
              <th>Stok</th>
              <th>Min</th>
              <th>Durum</th>
              <th>Güncelle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const status = getStockStatus(v)
              return (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.78rem' }}>{v.productName}</td>
                  <td>
                    <span className={s.colorSwatch} style={{ background: v.colorHex }} />
                    <span style={{ marginLeft: '0.4rem', fontSize: '0.78rem' }}>{v.color}</span>
                  </td>
                  <td>{v.size}</td>
                  <td>
                    {v.stock}
                    <div className={s.stockBar}>
                      <div
                        className={s.stockFill}
                        style={{
                          width: `${Math.min(100, (v.stock / 20) * 100)}%`,
                          background: getBarColor(v),
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ color: 'var(--subtle)' }}>{v.minStock}</td>
                  <td><span className={`${s.badge} ${status.cls}`}>{status.label}</span></td>
                  <td>
                    <input
                      type="number"
                      className={s.stockInput}
                      value={v.stock}
                      onChange={(e) => updateStock(v.id, e.target.value)}
                      min="0"
                    />
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--subtle)', padding: '2rem' }}>
                  Sonuç bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
