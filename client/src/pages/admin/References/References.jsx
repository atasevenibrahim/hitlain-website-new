import { useState, useEffect, useRef } from 'react'
import api from '../../../utils/api'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const emptyForm = {
  name: '',
  sector: '',
  quantity: '',
  description: '',
  logoUrl: '',
  isActive: true,
}

export default function References() {
  const [refs, setRefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef(null)

  useEffect(() => {
    api.get('/references', { params: { all: true } }).then((res) => {
      setRefs(res.data.map((r) => ({
        id: r.id,
        name: r.clientName,
        sector: r.sector || '',
        quantity: r.quantity || 0,
        description: r.description || '',
        logoUrl: r.logoUrl || '',
        isActive: r.isActive,
      })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.name) {
      useToastStore.getState().showToast('Firma adı zorunlu', 'error')
      return
    }

    const payload = {
      clientName: form.name,
      sector: form.sector,
      quantity: Number(form.quantity) || null,
      description: form.description,
      logoUrl: form.logoUrl || null,
      isActive: form.isActive,
    }

    try {
      if (editId) {
        await api.put(`/references/${editId}`, payload)
        setRefs((prev) =>
          prev.map((r) => (r.id === editId ? { ...r, ...form, quantity: Number(form.quantity) || 0 } : r))
        )
        useToastStore.getState().showToast('Referans güncellendi', 'success')
      } else {
        const res = await api.post('/references', payload)
        const newRef = {
          id: res.data.id,
          name: res.data.clientName,
          sector: res.data.sector || '',
          quantity: res.data.quantity || 0,
          description: res.data.description || '',
          logoUrl: res.data.logoUrl || '',
          isActive: res.data.isActive,
        }
        setRefs((prev) => [...prev, newRef])
        useToastStore.getState().showToast('Referans eklendi', 'success')
      }
    } catch {
      useToastStore.getState().showToast('İşlem başarısız', 'error')
    }
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const handleEdit = (ref) => {
    setForm({
      name: ref.name,
      sector: ref.sector || '',
      quantity: ref.quantity || '',
      description: ref.description || '',
      logoUrl: ref.logoUrl || '',
      isActive: ref.isActive !== false,
    })
    setEditId(ref.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu referansı silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/references/${id}`)
      setRefs((prev) => prev.filter((r) => r.id !== id))
      useToastStore.getState().showToast('Referans silindi', 'success')
    } catch {
      useToastStore.getState().showToast('Silme başarısız', 'error')
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateForm('logoUrl', res.data.url)
      useToastStore.getState().showToast('Logo yuklendi', 'success')
    } catch {
      useToastStore.getState().showToast('Logo yuklenemedi', 'error')
    }
    setLogoUploading(false)
    e.target.value = ''
  }

  const cancelForm = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Referanslar</h1>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            + YENİ REFERANS
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={s.formSection}>
          <div className={s.formSectionTitle}>
            {editId ? 'Referans Düzenle' : 'Yeni Referans Ekle'}
          </div>
          <div className={s.formGrid}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Firma Adı *</label>
              <input
                type="text"
                className={s.formInput}
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Firma adı"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Sektör</label>
              <input
                type="text"
                className={s.formInput}
                value={form.sector}
                onChange={(e) => updateForm('sector', e.target.value)}
                placeholder="Sektör"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Üretim Adedi</label>
              <input
                type="number"
                className={s.formInput}
                value={form.quantity}
                onChange={(e) => updateForm('quantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Durum</label>
              <select
                className={s.formSelect}
                value={form.isActive ? 'active' : 'hidden'}
                onChange={(e) => updateForm('isActive', e.target.value === 'active')}
              >
                <option value="active">Aktif</option>
                <option value="hidden">Gizli</option>
              </select>
            </div>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <label className={s.formLabel}>Proje Açıklaması</label>
              <textarea
                className={s.formTextarea}
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Proje açıklaması"
              />
            </div>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <label className={s.formLabel}>Logo</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
              <div
                className={s.uploadArea}
                style={{ padding: '1rem' }}
                onClick={() => logoInputRef.current?.click()}
              >
                <div className={s.uploadText}>
                  {logoUploading ? 'Yükleniyor...' : 'Logo yüklemek için tıklayın'}
                </div>
              </div>
              {form.logoUrl && (
                <div className={s.logoPreview}>
                  <img src={form.logoUrl} alt="Logo" />
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => updateForm('logoUrl', '')}
                    style={{ padding: '0.2rem 0.5rem' }}
                  >
                    Kaldır
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={s.formActions}>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              {editId ? 'GÜNCELLE' : 'KAYDET'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={cancelForm}>
              İPTAL
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Firma</th>
              <th>Adet</th>
              <th>Sektör</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {refs.map((ref) => (
              <tr key={ref.id}>
                <td>
                  <div className={s.thumbnail}>
                    {ref.logoUrl ? <img src={ref.logoUrl} alt={ref.name} /> : '🏢'}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{ref.name}</td>
                <td>{ref.quantity ? ref.quantity.toLocaleString('tr-TR') : '—'}</td>
                <td>{ref.sector || '—'}</td>
                <td>
                  <span className={`${s.badge} ${ref.isActive ? s.badgeActive : s.badgeDraft}`}>
                    {ref.isActive ? 'Aktif' : 'Gizli'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(ref)}>
                      DÜZENLE
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ref.id)}>
                      SİL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
