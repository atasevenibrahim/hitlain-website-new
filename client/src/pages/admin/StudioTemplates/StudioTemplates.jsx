import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import useToastStore from '../../../stores/toastStore'
import { TableSkeleton } from '../../../components/Skeleton/Skeleton'
import s from '../admin.module.css'

const CATEGORIES = ['Minimal', 'Metin', 'Geometrik', 'Diğer']

const emptyForm = {
  name: '',
  category: 'Minimal',
  canvasJson: '{"version":"5.3.0","objects":[]}',
  previewUrl: '',
  sortOrder: 0,
  isActive: true,
}

export default function StudioTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const res = await api.get('/studio-templates/all')
      setTemplates(res.data)
    } catch {
      showToast('Şablonlar yüklenemedi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setForm(emptyForm)
    setEditId(null)
    setFormOpen(true)
  }

  const openEdit = (t) => {
    setForm({
      name: t.name,
      category: t.category,
      canvasJson: t.canvasJson,
      previewUrl: t.previewUrl || '',
      sortOrder: t.sortOrder,
      isActive: t.isActive,
    })
    setEditId(t.id)
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) return
    try {
      await api.delete(`/studio-templates/${id}`)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
      showToast('Şablon silindi', 'success')
    } catch {
      showToast('Silme başarısız', 'error')
    }
  }

  const toggleActive = async (t) => {
    try {
      await api.put(`/studio-templates/${t.id}`, { isActive: !t.isActive })
      setTemplates((prev) =>
        prev.map((item) => item.id === t.id ? { ...item, isActive: !t.isActive } : item)
      )
    } catch {
      showToast('Güncelleme başarısız', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return showToast('Şablon adı gerekli', 'error')
    if (!form.canvasJson.trim()) return showToast('Canvas verisi gerekli', 'error')

    try {
      JSON.parse(form.canvasJson)
    } catch {
      return showToast('Canvas JSON formatı geçersiz', 'error')
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        canvasJson: form.canvasJson,
        previewUrl: form.previewUrl.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      }

      if (editId) {
        const res = await api.put(`/studio-templates/${editId}`, payload)
        setTemplates((prev) => prev.map((t) => t.id === editId ? res.data : t))
        showToast('Şablon güncellendi', 'success')
      } else {
        const res = await api.post('/studio-templates', payload)
        setTemplates((prev) => [res.data, ...prev])
        showToast('Şablon eklendi', 'success')
      }
      setFormOpen(false)
    } catch (err) {
      showToast(err.response?.data?.error || 'Kayıt başarısız', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className={s.pageHeader}><h1 className={s.pageTitle}>Stüdyo Şablonları</h1></div>
        <TableSkeleton rows={4} cols={5} />
      </div>
    )
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Stüdyo Şablonları</h1>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          + YENİ ŞABLON
        </button>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Önizleme</th>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Sıra</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className={s.thumbnail}>
                    {t.previewUrl ? (
                      <img src={t.previewUrl} alt={t.name} />
                    ) : (
                      <span style={{ fontSize: '1.4rem' }}>🖼️</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{t.name}</td>
                <td>
                  <span className={`${s.badge} ${s.badgeNeutral}`}>{t.category}</span>
                </td>
                <td style={{ color: 'var(--subtle)' }}>{t.sortOrder}</td>
                <td>
                  <button
                    className={`${s.badge} ${t.isActive ? s.badgeCompleted : s.badgeCancelled}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    onClick={() => toggleActive(t)}
                    title="Durumu değiştirmek için tıkla"
                  >
                    {t.isActive ? 'Aktif' : 'Gizli'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>
                      DÜZENLE
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      SİL
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--subtle)', padding: '2rem' }}>
                  Henüz şablon yok. Yeni şablon ekleyin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className={s.modalOverlay} onClick={() => setFormOpen(false)}>
          <div
            className={s.modal}
            style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>{editId ? 'Şablon Düzenle' : 'Yeni Şablon'}</h3>
              <button className={s.modalClose} onClick={() => setFormOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={s.modalBody}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Şablon Adı *</label>
                  <input
                    className={s.formInput}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Örn: Sol Göğüs Logo"
                    maxLength={100}
                  />
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Kategori</label>
                  <select
                    className={s.formSelect}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Önizleme Görseli URL</label>
                  <input
                    className={s.formInput}
                    value={form.previewUrl}
                    onChange={(e) => setForm((f) => ({ ...f, previewUrl: e.target.value }))}
                    placeholder="https://... veya /uploads/..."
                    type="url"
                  />
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Sıra</label>
                  <input
                    className={s.formInput}
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  />
                </div>

                <div className={s.formGroup}>
                  <label className={s.formLabel}>Canvas JSON (Fabric.js) *</label>
                  <textarea
                    className={s.formInput}
                    style={{ fontFamily: 'monospace', fontSize: '0.72rem', minHeight: 160 }}
                    value={form.canvasJson}
                    onChange={(e) => setForm((f) => ({ ...f, canvasJson: e.target.value }))}
                    placeholder='{"version":"5.3.0","objects":[]}'
                  />
                  <span className={s.formHint}>Fabric.js canvas.toJSON() çıktısını buraya yapıştırın</span>
                </div>

                <div className={s.formGroup}>
                  <label className={s.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    />
                    Aktif (stüdyoda görünür)
                  </label>
                </div>
              </div>
              <div className={s.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFormOpen(false)}
                >
                  İPTAL
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
