import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import useToastStore from '../../../stores/toastStore'
import s from '../admin.module.css'

const defaultSettings = {
  siteName: '',
  whatsapp: '',
  metaDescription: '',
  instagram: '',
  email: '',
  phone: '',
  address: '',
  freeShippingLimit: 1500,
  standardShipping: 79,
  fastShipping: 149,
  marqueeItems: [],
  trustBarItems: [
    { icon: '✓', text: '' },
    { icon: '⬡', text: '' },
    { icon: '→', text: '' },
    { icon: '◎', text: '' },
  ],
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/settings').then((res) => {
      setSettings({ ...defaultSettings, ...res.data })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    try {
      await api.put('/settings', settings)
      useToastStore.getState().showToast('Ayarlar kaydedildi', 'success')
    } catch {
      useToastStore.getState().showToast('Kaydetme başarısız', 'error')
    }
  }

  if (loading) return <div className={s.pageHeader}><h1 className={s.pageTitle}>Yükleniyor...</h1></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Site Ayarları</h1>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          KAYDET
        </button>
      </div>

      {/* General */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Genel Bilgiler</div>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Site Adı</label>
            <input
              type="text"
              className={s.formInput}
              value={settings.siteName}
              onChange={(e) => update('siteName', e.target.value)}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>WhatsApp Numarası</label>
            <input
              type="text"
              className={s.formInput}
              value={settings.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
            />
          </div>
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <label className={s.formLabel}>Meta Açıklama</label>
            <textarea
              className={s.formTextarea}
              value={settings.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Instagram</label>
            <input
              type="text"
              className={s.formInput}
              value={settings.instagram}
              onChange={(e) => update('instagram', e.target.value)}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>E-posta</label>
            <input
              type="email"
              className={s.formInput}
              value={settings.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Telefon</label>
            <input
              type="text"
              className={s.formInput}
              value={settings.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <label className={s.formLabel}>Adres</label>
            <textarea
              className={s.formTextarea}
              value={settings.address}
              onChange={(e) => update('address', e.target.value)}
              style={{ minHeight: 60 }}
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Kargo Ayarları</div>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Ücretsiz Kargo Limiti (₺)</label>
            <input
              type="number"
              className={s.formInput}
              value={settings.freeShippingLimit}
              onChange={(e) => update('freeShippingLimit', Number(e.target.value))}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Standart Kargo Ücreti (₺)</label>
            <input
              type="number"
              className={s.formInput}
              value={settings.standardShipping}
              onChange={(e) => update('standardShipping', Number(e.target.value))}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Hızlı Kargo Ücreti (₺)</label>
            <input
              type="number"
              className={s.formInput}
              value={settings.fastShipping}
              onChange={(e) => update('fastShipping', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Marquee (Kayan Metin)</div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>Her satır bir öğe</label>
          <textarea
            className={s.formTextarea}
            value={settings.marqueeItems.join('\n')}
            onChange={(e) => update('marqueeItems', e.target.value.split('\n'))}
            style={{ minHeight: 100 }}
          />
        </div>
      </div>

      {/* Trust Bar */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Trust Bar (Güven Çubuğu)</div>
        {settings.trustBarItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              className={s.formInput}
              value={item.icon}
              onChange={(e) => {
                const newItems = [...settings.trustBarItems]
                newItems[i] = { ...newItems[i], icon: e.target.value }
                update('trustBarItems', newItems)
              }}
              style={{ width: 50 }}
              placeholder="İkon"
            />
            <input
              type="text"
              className={s.formInput}
              value={item.text}
              onChange={(e) => {
                const newItems = [...settings.trustBarItems]
                newItems[i] = { ...newItems[i], text: e.target.value }
                update('trustBarItems', newItems)
              }}
              style={{ flex: 1 }}
              placeholder="Metin"
            />
          </div>
        ))}
      </div>

      <div className={s.formActions}>
        <button className="btn btn-primary" onClick={handleSave}>
          KAYDET
        </button>
      </div>
    </div>
  )
}
