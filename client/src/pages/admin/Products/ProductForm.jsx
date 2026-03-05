import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../utils/api'
import { categories, sizes as allSizes } from '../../../data/mockData'
import useToastStore from '../../../stores/toastStore'
import s from '../admin.module.css'

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    fabric: '',
    care: '',
    colors: [{ name: '', hex: '#000000' }],
    sizes: [],
    status: 'active',
    isFeatured: false,
    isNew: false,
  })
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data
        setForm({
          name: p.name || '',
          category: p.category || '',
          price: p.price || '',
          description: p.description || '',
          fabric: p.fabric || '',
          care: p.care || '',
          colors: p.colors?.length ? p.colors : [{ name: '', hex: '#000000' }],
          sizes: p.sizes || [],
          status: p.status || 'active',
          isFeatured: p.isFeatured || false,
          isNew: p.isNew || false,
        })
        setLoading(false)
      }).catch(() => {
        useToastStore.getState().showToast('Ürün yüklenemedi', 'error')
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const addColor = () => {
    update('colors', [...form.colors, { name: '', hex: '#000000' }])
  }

  const removeColor = (index) => {
    update('colors', form.colors.filter((_, i) => i !== index))
  }

  const updateColor = (index, field, value) => {
    const newColors = [...form.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    update('colors', newColors)
  }

  const toggleSize = (size) => {
    update(
      'sizes',
      form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size]
    )
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) {
      useToastStore.getState().showToast('Lütfen zorunlu alanları doldurun', 'error')
      return
    }

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      fabric: form.fabric,
      care: form.care,
      colors: form.colors.filter((c) => c.name),
      sizes: form.sizes,
      status: form.status,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
    }

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload)
        useToastStore.getState().showToast('Ürün güncellendi', 'success')
      } else {
        await api.post('/products', payload)
        useToastStore.getState().showToast('Ürün eklendi', 'success')
      }
      navigate('/admin/products')
    } catch {
      useToastStore.getState().showToast('İşlem başarısız', 'error')
    }
  }

  if (loading) return <div className={s.pageHeader}><h1 className={s.pageTitle}>Yükleniyor...</h1></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>{isEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h1>
      </div>

      <div className={s.twoCol}>
        {/* Left Column */}
        <div>
          <div className={s.formSection}>
            <div className={s.formSectionTitle}>Ürün Bilgileri</div>
            <div className={s.formGrid}>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.formLabel}>Ürün Adı *</label>
                <input
                  type="text"
                  className={s.formInput}
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ürün adı"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Kategori *</label>
                <select
                  className={s.formSelect}
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  <option value="">Seçin</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Fiyat (₺) *</label>
                <input
                  type="number"
                  className={s.formInput}
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.formLabel}>Açıklama</label>
                <textarea
                  className={s.formTextarea}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Ürün açıklaması"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Kumaş Detayı</label>
                <input
                  type="text"
                  className={s.formInput}
                  value={form.fabric}
                  onChange={(e) => update('fabric', e.target.value)}
                  placeholder="%100 Pamuk, 190gr/m²"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Bakım Talimatları</label>
                <input
                  type="text"
                  className={s.formInput}
                  value={form.care}
                  onChange={(e) => update('care', e.target.value)}
                  placeholder="30°C'de yıkayınız"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Image Upload */}
          <div className={s.formSection}>
            <div className={s.formSectionTitle}>Görseller</div>
            <div className={s.uploadArea}>
              <div className={s.uploadIcon}>📷</div>
              <div className={s.uploadText}>
                Görselleri sürükleyip bırakın veya tıklayıp seçin
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className={s.formSection}>
            <div className={s.formSectionTitle}>Renkler</div>
            {form.colors.map((color, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(i, 'hex', e.target.value)}
                  style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 2, cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  className={s.formInput}
                  value={color.name}
                  onChange={(e) => updateColor(i, 'name', e.target.value)}
                  placeholder="Renk adı"
                  style={{ flex: 1 }}
                />
                {form.colors.length > 1 && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeColor(i)}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addColor} style={{ marginTop: '0.3rem' }}>
              + RENK EKLE
            </button>
          </div>

          {/* Sizes */}
          <div className={s.formSection}>
            <div className={s.formSectionTitle}>Bedenler</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {allSizes.map((size) => (
                <div key={size} className={s.checkRow}>
                  <input
                    type="checkbox"
                    id={`size-${size}`}
                    checked={form.sizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  <label htmlFor={`size-${size}`}>{size}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Flags */}
          <div className={s.formSection}>
            <div className={s.formSectionTitle}>Durum</div>
            <div className={s.formGroup} style={{ marginBottom: '0.8rem' }}>
              <label className={s.formLabel}>Ürün Durumu</label>
              <select
                className={s.formSelect}
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              >
                <option value="active">Aktif</option>
                <option value="draft">Taslak</option>
                <option value="archived">Arşiv</option>
              </select>
            </div>
            <div className={s.checkRow}>
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => update('isFeatured', e.target.checked)}
              />
              <label htmlFor="isFeatured">Öne Çıkar</label>
            </div>
            <div className={s.checkRow}>
              <input
                type="checkbox"
                id="isNew"
                checked={form.isNew}
                onChange={(e) => update('isNew', e.target.checked)}
              />
              <label htmlFor="isNew">Yeni Ürün</label>
            </div>
          </div>
        </div>
      </div>

      <div className={s.formActions}>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {isEdit ? 'GÜNCELLE' : 'KAYDET'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/products')}>
          İPTAL
        </button>
      </div>
    </div>
  )
}
