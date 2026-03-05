import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatPrice, formatDate } from '../../utils/formatters'
import useToastStore from '../../stores/toastStore'
import styles from './MyOrders.module.css'

const STATUS_MAP = {
  pending: { label: 'Bekliyor', cls: 'statusPending' },
  preparing: { label: 'Hazırlanıyor', cls: 'statusPreparing' },
  shipped: { label: 'Kargoda', cls: 'statusShipped' },
  delivered: { label: 'Tamamlandı', cls: 'statusDelivered' },
  cancelled: { label: 'İptal', cls: 'statusCancelled' },
}

const STATUS_STEPS = ['pending', 'preparing', 'shipped', 'delivered']

export default function MyOrders() {
  const [tab, setTab] = useState('orderNo')
  const [phone, setPhone] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!phone.trim()) {
      useToastStore.getState().showToast('Telefon numarası gerekli', 'error')
      return
    }

    setLoading(true)
    setExpandedId(null)
    try {
      const body = { phone: phone.trim() }
      if (tab === 'orderNo' && orderNo.trim()) {
        const id = orderNo.trim().replace(/^HIT-/i, '')
        body.orderId = Number(id)
      }
      const res = await api.post('/orders/lookup', body)
      setOrders(res.data)
      if (res.data.length === 1) setExpandedId(res.data[0].id)
    } catch {
      useToastStore.getState().showToast('Arama sırasında bir hata oluştu', 'error')
    }
    setLoading(false)
  }

  const handleWhatsApp = (orderNumber) => {
    const text = `Merhaba, ${orderNumber} numaralı siparişimi takip etmek istiyorum.`
    window.open(
      `https://wa.me/905436861994?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <div className="container">
      <Helmet>
        <title>Sipariş Takibi — HITHLAIN Giyim</title>
      </Helmet>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>SİPARİŞ TAKİBİ</h1>
        <p className={styles.pageDesc}>
          Sipariş durumunuzu takip etmek için bilgilerinizi girin.
        </p>

        {/* Search Form */}
        <div className={styles.searchCard}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'orderNo' ? styles.tabActive : ''}`}
              onClick={() => setTab('orderNo')}
            >
              Sipariş No ile Ara
            </button>
            <button
              className={`${styles.tab} ${tab === 'phone' ? styles.tabActive : ''}`}
              onClick={() => setTab('phone')}
            >
              Telefon ile Ara
            </button>
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            {tab === 'orderNo' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sipariş Numarası</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="HIT-123"
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Telefon Numarası</label>
              <input
                type="tel"
                className={styles.formInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XX XXX XX XX"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'ARANIYOR...' : 'SİPARİŞ ARA'}
            </button>
          </form>
        </div>

        {/* Results */}
        {orders !== null && (
          <div className={styles.results}>
            {orders.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>?</div>
                <h2 className={styles.emptyTitle}>Sipariş Bulunamadı</h2>
                <p className={styles.emptyDesc}>
                  Girdiğiniz bilgilere ait bir sipariş bulamadık.
                  Bilgilerinizi kontrol edip tekrar deneyin veya WhatsApp
                  üzerinden bize ulaşın.
                </p>
                <button
                  className="btn btn-wa"
                  onClick={() => handleWhatsApp('bilinmeyen')}
                >
                  WHATSAPP İLE İLETİŞİM
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.resultsTitle}>
                  {orders.length} sipariş bulundu
                </h2>
                <div className={styles.orderList}>
                  {orders.map((order) => {
                    const orderNumber = `HIT-${order.id}`
                    const status = STATUS_MAP[order.status] || STATUS_MAP.pending
                    const isExpanded = expandedId === order.id
                    const currentStep = STATUS_STEPS.indexOf(order.status)

                    return (
                      <div key={order.id} className={styles.orderCard}>
                        {/* Order Header */}
                        <div
                          className={styles.orderHeader}
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        >
                          <div className={styles.orderHeaderLeft}>
                            <span className={styles.orderNumber}>#{orderNumber}</span>
                            <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className={styles.orderHeaderRight}>
                            <span className={`${styles.statusBadge} ${styles[status.cls]}`}>
                              {status.label}
                            </span>
                            <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                            <span className={styles.expandIcon}>{isExpanded ? '−' : '+'}</span>
                          </div>
                        </div>

                        {/* Order Detail (expanded) */}
                        {isExpanded && (
                          <div className={styles.orderDetail}>
                            {/* Status Timeline */}
                            {order.status !== 'cancelled' && (
                              <div className={styles.timeline}>
                                {STATUS_STEPS.map((step, i) => {
                                  const stepInfo = STATUS_MAP[step]
                                  const isDone = i <= currentStep
                                  return (
                                    <div
                                      key={step}
                                      className={`${styles.timelineStep} ${isDone ? styles.timelineStepDone : ''}`}
                                    >
                                      <div className={styles.timelineDot} />
                                      <span className={styles.timelineLabel}>{stepInfo.label}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* Items */}
                            <div className={styles.detailSection}>
                              <h4 className={styles.detailTitle}>Ürünler</h4>
                              <div className={styles.itemList}>
                                {order.items.map((item) => (
                                  <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                      {item.product?.images?.[0] && item.product.images[0] !== '/placeholder-product.jpg' ? (
                                        <img src={item.product.images[0]} alt={item.product?.name} />
                                      ) : (
                                        <div className={styles.itemPlaceholder}>T</div>
                                      )}
                                    </div>
                                    <div className={styles.itemInfo}>
                                      <div className={styles.itemName}>
                                        {item.product?.name || 'Ürün'}
                                      </div>
                                      <div className={styles.itemVariant}>
                                        {item.color} · {item.size} · x{item.quantity}
                                      </div>
                                    </div>
                                    <div className={styles.itemPrice}>
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div className={styles.detailSection}>
                              <h4 className={styles.detailTitle}>Teslimat Bilgileri</h4>
                              <div className={styles.deliveryInfo}>
                                <p>{order.city}, {order.district}</p>
                                <p>{order.address}</p>
                              </div>
                            </div>

                            {/* Summary */}
                            <div className={styles.detailSummary}>
                              <div className={styles.summaryRow}>
                                <span>Ara Toplam</span>
                                <span>{formatPrice(order.total - order.shippingFee)}</span>
                              </div>
                              <div className={styles.summaryRow}>
                                <span>Kargo</span>
                                <span>{order.shippingFee === 0 ? 'Ücretsiz' : formatPrice(order.shippingFee)}</span>
                              </div>
                              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Toplam</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>

                            {/* WhatsApp */}
                            <button
                              className="btn btn-wa"
                              onClick={() => handleWhatsApp(orderNumber)}
                              style={{ width: '100%', marginTop: '1rem' }}
                            >
                              WHATSAPP İLE TAKİP ET
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className={styles.infoBox}>
          <p>
            Sipariş numaranızı sipariş onay sayfasında ve e-postanızda
            bulabilirsiniz. Herhangi bir sorunuz varsa{' '}
            <Link to="/contact">iletişim</Link> sayfamızdan bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
