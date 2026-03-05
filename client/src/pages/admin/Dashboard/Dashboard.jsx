import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../utils/api'
import { formatPrice, formatDate } from '../../../utils/formatters'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const STATUS_LABELS = {
  pending: 'Bekliyor',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  approved: 'Onaylandı',
  production: 'Üretimde',
}

function Badge({ status }) {
  const cls = {
    pending: s.badgePending,
    preparing: s.badgePreparing,
    shipped: s.badgeShipped,
    completed: s.badgeCompleted,
    cancelled: s.badgeCancelled,
    approved: s.badgeApproved,
    production: s.badgeProduction,
  }
  return (
    <span className={`${s.badge} ${cls[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [studioOrders, setStudioOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/orders'),
      api.get('/studio-orders'),
    ]).then(([prodRes, ordRes, studioRes]) => {
      setProducts(prodRes.data.products || prodRes.data)
      setOrders(ordRes.data)
      setStudioOrders(studioRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeOrders = orders.filter((o) =>
    ['pending', 'preparing', 'shipped'].includes(o.status)
  )
  const monthRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  const lowStockProducts = products.filter((p) => (p.stock || 0) < 50)

  const totalStudioQty = (order) =>
    order.items.reduce(
      (sum, item) => {
        const sizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes
        return sum + Object.values(sizes).reduce((a, q) => a + q, 0)
      },
      0
    )

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Dashboard</h1>
        </div>
        <TableSkeleton rows={4} cols={4} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className={s.statGrid}>
        <div className={s.statCard}>
          <span className={s.statIcon}>👕</span>
          <div className={s.statLabel}>Toplam Ürün</div>
          <div className={s.statValue}>{products.length}</div>
        </div>
        <div className={s.statCard}>
          <span className={s.statIcon}>📋</span>
          <div className={s.statLabel}>Aktif Sipariş</div>
          <div className={s.statValue}>{activeOrders.length}</div>
        </div>
        <div className={s.statCard}>
          <span className={s.statIcon}>💰</span>
          <div className={s.statLabel}>Bu Ay Ciro</div>
          <div className={s.statValue}>{formatPrice(monthRevenue)}</div>
        </div>
        <div className={s.statCard}>
          <span className={s.statIcon}>⚠️</span>
          <div className={s.statLabel}>Düşük Stok</div>
          <div className={s.statValue}>{lowStockProducts.length}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={s.quickActions}>
        <Link to="/admin/products/new" className="btn btn-primary btn-sm">
          + ÜRÜN EKLE
        </Link>
        <Link to="/admin/stock" className="btn btn-secondary btn-sm">
          STOK GÜNCELLE
        </Link>
      </div>

      {/* Recent Orders */}
      <div className={s.tableWrap}>
        <div className={s.tableTitle}>Son Siparişler</div>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Müşteri</th>
              <th>Toplam</th>
              <th>Tarih</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName}</td>
                <td>{formatPrice(order.total)}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td><Badge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Studio Orders */}
      <div className={s.tableWrap}>
        <div className={s.tableTitle}>Son Stüdyo Siparişleri</div>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Müşteri</th>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {studioOrders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.items[0]?.product?.name || order.items[0]?.productName || '—'}</td>
                <td>{totalStudioQty(order)}</td>
                <td><Badge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className={s.tableWrap}>
          <div className={s.tableTitle}>Düşük Stok Uyarıları</div>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    {p.stock}
                    <div className={s.stockBar}>
                      <div
                        className={s.stockFill}
                        style={{
                          width: `${Math.min(100, ((p.stock || 0) / 50) * 100)}%`,
                          background: (p.stock || 0) < 20 ? 'var(--error)' : 'var(--warning)',
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={`${s.badge} ${(p.stock || 0) < 20 ? s.badgeOutOfStock : s.badgeLowStock}`}>
                      {(p.stock || 0) < 20 ? 'Kritik' : 'Düşük'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
