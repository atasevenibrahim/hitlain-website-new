import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { formatPrice, formatDate } from '../../../utils/formatters'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'shipped', label: 'Kargoda' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal' },
]

const STATUS_BADGE = {
  pending: { label: 'Bekliyor', cls: 'badgePending' },
  preparing: { label: 'Hazırlanıyor', cls: 'badgePreparing' },
  shipped: { label: 'Kargoda', cls: 'badgeShipped' },
  completed: { label: 'Tamamlandı', cls: 'badgeCompleted' },
  cancelled: { label: 'İptal', cls: 'badgeCancelled' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [detailOrder, setDetailOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    api.get('/orders').then((res) => {
      setOrders(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter)

  const openDetail = (order) => {
    setDetailOrder(order)
    setNewStatus(order.status)
  }

  const updateStatus = async () => {
    try {
      await api.put(`/orders/${detailOrder.id}/status`, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o.id === detailOrder.id ? { ...o, status: newStatus } : o))
      )
      setDetailOrder(null)
      useToastStore.getState().showToast('Sipariş durumu güncellendi', 'success')
    } catch {
      useToastStore.getState().showToast('Güncelleme başarısız', 'error')
    }
  }

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}><h1 className={s.pageTitle}>Sipariş Yönetimi</h1></div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Sipariş Yönetimi</h1>
      </div>

      <div className={s.tabs}>
        {[
          { key: 'all', label: 'Tümü' },
          ...STATUS_OPTIONS,
        ].map((t) => {
          const key = t.value || t.key
          const count = key === 'all' ? orders.length : orders.filter((o) => o.status === key).length
          return (
            <button
              key={key}
              className={`${s.tab} ${filter === key ? s.tabActive : ''}`}
              onClick={() => setFilter(key)}
            >
              {t.label} ({count})
            </button>
          )
        })}
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Müşteri</th>
              <th>Ürünler</th>
              <th>Toplam</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const badge = STATUS_BADGE[order.status]
              return (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
                    {order.items.map((item, i) => (
                      <div key={i}>{item.productName} x{item.quantity}</div>
                    ))}
                  </td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <span className={`${s.badge} ${s[badge.cls]}`}>{badge.label}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openDetail(order)}
                    >
                      DETAY
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className={s.modalOverlay} onClick={() => setDetailOrder(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>Sipariş #{detailOrder.id}</h3>
              <button className={s.modalClose} onClick={() => setDetailOrder(null)}>✕</button>
            </div>
            <div className={s.modalBody}>
              <div className={s.formSectionTitle}>Müşteri Bilgileri</div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Ad Soyad</span>
                <span className={s.infoValue}>{detailOrder.customerName}</span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>E-posta</span>
                <span className={s.infoValue}>{detailOrder.email}</span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Telefon</span>
                <span className={s.infoValue}>{detailOrder.phone}</span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Adres</span>
                <span className={s.infoValue}>{detailOrder.address}, {detailOrder.district}/{detailOrder.city}</span>
              </div>
              {detailOrder.note && (
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Not</span>
                  <span className={s.infoValue}>{detailOrder.note}</span>
                </div>
              )}

              <div className={s.formSectionTitle} style={{ marginTop: '1.2rem' }}>Ürünler</div>
              {detailOrder.items.map((item, i) => (
                <div key={i} className={s.infoRow}>
                  <span className={s.infoLabel}>
                    {item.productName} · {item.color} · {item.size}
                  </span>
                  <span className={s.infoValue}>
                    x{item.quantity} · {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className={s.infoRow} style={{ fontWeight: 700 }}>
                <span>Kargo</span>
                <span>{detailOrder.shippingFee === 0 ? 'Ücretsiz' : formatPrice(detailOrder.shippingFee)}</span>
              </div>
              <div className={s.infoRow} style={{ fontWeight: 700 }}>
                <span>Toplam</span>
                <span>{formatPrice(detailOrder.total + detailOrder.shippingFee)}</span>
              </div>

              <div className={s.formSectionTitle} style={{ marginTop: '1.2rem' }}>Durum Güncelle</div>
              <select
                className={s.formSelect}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ width: '100%' }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-secondary btn-sm" onClick={() => setDetailOrder(null)}>
                KAPAT
              </button>
              <button className="btn btn-primary btn-sm" onClick={updateStatus}>
                GÜNCELLE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
