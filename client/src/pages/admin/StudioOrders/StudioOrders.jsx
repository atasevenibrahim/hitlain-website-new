import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { formatPrice, formatDate } from '../../../utils/formatters'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const STATUS_BADGE = {
  pending: { label: 'Bekliyor', cls: 'badgePending' },
  approved: { label: 'Onaylandı', cls: 'badgeApproved' },
  production: { label: 'Üretimde', cls: 'badgeProduction' },
  completed: { label: 'Tamamlandı', cls: 'badgeCompleted' },
}

const ZONE_LABELS = {
  center: 'Orta',
  'left-chest': 'Sol Göğüs',
  'right-chest': 'Sağ Göğüs',
  back: 'Sırt',
}

export default function StudioOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    api.get('/studio-orders').then((res) => {
      setOrders(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const totalQty = (order) =>
    order.items.reduce(
      (sum, item) => sum + Object.values(item.sizes).reduce((a, q) => a + q, 0),
      0
    )

  const totalPrice = (order) =>
    order.items.reduce(
      (sum, item) =>
        sum + item.price * Object.values(item.sizes).reduce((a, q) => a + q, 0),
      0
    )

  const approveOrder = async (id) => {
    try {
      await api.put(`/studio-orders/${id}/status`, { status: 'approved' })
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'approved' } : o))
      )
      useToastStore.getState().showToast('Sipariş onaylandı', 'success')
    } catch {
      useToastStore.getState().showToast('Onaylama başarısız', 'error')
    }
  }

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}><h1 className={s.pageTitle}>Stüdyo Siparişleri</h1></div>
        <TableSkeleton rows={4} cols={6} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Stüdyo Siparişleri</h1>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Müşteri</th>
              <th>Ürünler</th>
              <th>Tasarım</th>
              <th>Baskı</th>
              <th>Adet</th>
              <th>Toplam</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const badge = STATUS_BADGE[order.status] || STATUS_BADGE.pending
              return (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
                    {order.items.map((item, i) => (
                      <div key={i}>{(item.product?.name || item.productName)}</div>
                    ))}
                  </td>
                  <td>
                    <div
                      className={s.thumbnail}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setLightbox(order)}
                      title="Büyüt"
                    >
                      {order.designUrl ? (
                        <img src={order.designUrl} alt="Tasarım" />
                      ) : (
                        '🎨'
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>
                    {order.printArea === 'front' ? 'Ön' : 'Arka'} · {ZONE_LABELS[order.printZone] || order.printZone}
                  </td>
                  <td>{totalQty(order)}</td>
                  <td>{formatPrice(totalPrice(order))}</td>
                  <td>
                    <span className={`${s.badge} ${s[badge.cls]}`}>{badge.label}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexDirection: 'column' }}>
                      {order.status === 'pending' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => approveOrder(order.id)}
                        >
                          ONAYLA
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setLightbox(order)}
                      >
                        GÖRÜNTÜLE
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className={s.modalOverlay} onClick={() => setLightbox(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>Tasarım Önizleme — #{lightbox.id}</h3>
              <button className={s.modalClose} onClick={() => setLightbox(null)}>✕</button>
            </div>
            <div className={s.modalBody}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: 'var(--off)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                }}
              >
                {lightbox.designUrl ? (
                  <img
                    src={lightbox.designUrl}
                    alt="Tasarım"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--subtle)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎨</div>
                    <div>Tasarım önizlemesi mevcut değil</div>
                  </div>
                )}
              </div>

              <div className={s.infoRow}>
                <span className={s.infoLabel}>Müşteri</span>
                <span className={s.infoValue}>{lightbox.customerName}</span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Baskı Bölgesi</span>
                <span className={s.infoValue}>
                  {lightbox.printArea === 'front' ? 'Ön' : 'Arka'} — {ZONE_LABELS[lightbox.printZone] || lightbox.printZone}
                </span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Toplam Adet</span>
                <span className={s.infoValue}>{totalQty(lightbox)}</span>
              </div>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>Toplam Fiyat</span>
                <span className={s.infoValue}>{formatPrice(totalPrice(lightbox))}</span>
              </div>

              <div className={s.formSectionTitle} style={{ marginTop: '1rem' }}>Ürünler</div>
              {lightbox.items.map((item, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{(item.product?.name || item.productName)} — {item.color}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
                    {Object.entries(item.sizes).map(([size, qty]) => `${size}: ${qty}`).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-ghost btn-sm" onClick={() => setLightbox(null)}>
                KAPAT
              </button>
              {lightbox.designUrl && (
                <a
                  href={lightbox.designUrl}
                  download={`tasarim-${lightbox.id}.png`}
                  className="btn btn-secondary btn-sm"
                >
                  PNG İNDİR
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
