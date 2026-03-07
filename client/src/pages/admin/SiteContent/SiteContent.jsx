import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import useSiteContent from '../../../hooks/useSiteContent'
import useToastStore from '../../../stores/toastStore'
import s from '../admin.module.css'
import styles from './SiteContent.module.css'

const tabs = [
  { id: 'categories', label: 'Kategoriler' },
  { id: 'welcome', label: 'Karsilama' },
  { id: 'home', label: 'Ana Sayfa' },
  { id: 'stats', label: 'İstatistikler' },
  { id: 'faq', label: 'SSS' },
  { id: 'testimonials', label: 'Yorumlar' },
  { id: 'corporate', label: 'Kurumsal' },
  { id: 'about', label: 'Hakkımızda' },
  { id: 'contact', label: 'İletişim' },
  { id: 'legal', label: 'Sözleşmeler' },
  { id: 'general', label: 'Genel' },
]

export default function SiteContent() {
  const [activeTab, setActiveTab] = useState('welcome')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { refresh } = useSiteContent()

  useEffect(() => {
    api.get('/settings').then((res) => {
      setData(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const get = (key) => {
    const val = data[key]
    if (val === undefined || val === null) return ''
    return val
  }

  const getArr = (key) => {
    const val = data[key]
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return [] }
    }
    return []
  }

  const set = (key, value) => setData((prev) => ({ ...prev, [key]: value }))

  const saveTab = async (keys) => {
    setSaving(true)
    try {
      const payload = {}
      for (const key of keys) {
        payload[key] = data[key] !== undefined ? data[key] : ''
      }
      await api.put('/settings', payload)
      refresh()
      useToastStore.getState().showToast('Kaydedildi', 'success')
    } catch {
      useToastStore.getState().showToast('Kaydetme hatasi', 'error')
    }
    setSaving(false)
  }

  if (loading) return <div className={s.pageHeader}><h1 className={s.pageTitle}>Yukleniyor...</h1></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Site Icerigi</h1>
      </div>

      <div className={s.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${s.tab} ${activeTab === tab.id ? s.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'categories' && <CategoriesTab getArr={getArr} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'welcome' && <WelcomeTab get={get} set={set} getArr={getArr} save={saveTab} saving={saving} />}
      {activeTab === 'home' && <HomeTab get={get} set={set} getArr={getArr} save={saveTab} saving={saving} />}
      {activeTab === 'stats' && <StatsTab get={get} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'faq' && <FaqTab getArr={getArr} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'testimonials' && <TestimonialsTab getArr={getArr} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'corporate' && <CorporateTab get={get} set={set} getArr={getArr} save={saveTab} saving={saving} />}
      {activeTab === 'about' && <AboutTab get={get} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'contact' && <ContactTab get={get} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'legal' && <LegalTab get={get} set={set} save={saveTab} saving={saving} />}
      {activeTab === 'general' && <GeneralTab get={get} set={set} save={saveTab} saving={saving} />}
    </div>
  )
}

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div className={s.formGroup}>
      <label className={s.formLabel}>{label}</label>
      {textarea ? (
        <textarea className={s.formTextarea} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type="text" className={s.formInput} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

function SaveBtn({ onClick, saving }) {
  return (
    <div className={s.formActions}>
      <button className="btn btn-primary" onClick={onClick} disabled={saving}>
        {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
      </button>
    </div>
  )
}

// ═══ SHARED BANNER EDITOR ═══
function renderBannerSection(key, label, getArr, set, uploading, setUploading) {
  const banners = getArr(key)

  const updateBanner = (index, field, value) => {
    const newBanners = [...banners]
    newBanners[index] = { ...newBanners[index], [field]: value }
    set(key, newBanners)
  }

  const addBanner = () => {
    set(key, [...banners, { imageUrl: '', title: '', subtitle: '' }])
  }

  const removeBanner = (index) => {
    set(key, banners.filter((_, i) => i !== index))
  }

  const handleUpload = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(`${key}-${index}`)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData)
      const newBanners = [...banners]
      newBanners[index] = { ...newBanners[index], imageUrl: res.data.url }
      set(key, newBanners)
    } catch {
      useToastStore.getState().showToast('Gorsel yuklenemedi', 'error')
    }
    setUploading(null)
  }

  return (
    <div className={s.formSection}>
      <div className={s.formSectionTitle}>{label}</div>
      {banners.map((banner, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <span className={styles.listItemNum}>{i + 1}</span>
            <button className={styles.removeBtn} onClick={() => removeBanner(i)}>Sil</button>
          </div>
          <div className={styles.bannerRow}>
            {banner.imageUrl ? (
              <img src={banner.imageUrl} alt="" className={styles.bannerThumb} />
            ) : (
              <div className={styles.bannerThumbEmpty}>Gorsel Yok</div>
            )}
            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
              {uploading === `${key}-${i}` ? 'Yukleniyor...' : 'Gorsel Sec'}
              <input type="file" accept="image/*" onChange={(e) => handleUpload(i, e)} hidden />
            </label>
          </div>
          <div className={s.formGrid}>
            <Field label="Baslik" value={banner.title} onChange={(v) => updateBanner(i, 'title', v)} placeholder="BAHAR KOLEKSİYONU" />
            <Field label="Alt Yazi" value={banner.subtitle} onChange={(v) => updateBanner(i, 'subtitle', v)} placeholder="Yeni sezon ürünleri" />
          </div>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addBanner} style={{ marginTop: '0.5rem' }}>
        + Banner Ekle
      </button>
    </div>
  )
}

// ═══ HERO SLIDE EDITOR ═══
function renderHeroSlideEditor(key, label, getArr, set, uploading, setUploading) {
  const slides = getArr(key)

  const updateSlide = (index, field, value) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    set(key, newSlides)
  }

  const addSlide = () => {
    set(key, [...slides, { imageUrl: '', title: '', subtitle: '', cta1Text: '', cta1Link: '', cta2Text: '', cta2Link: '' }])
  }

  const removeSlide = (index) => {
    set(key, slides.filter((_, i) => i !== index))
  }

  const handleUpload = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(`${key}-${index}`)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData)
      const newSlides = [...slides]
      newSlides[index] = { ...newSlides[index], imageUrl: res.data.url }
      set(key, newSlides)
    } catch {
      useToastStore.getState().showToast('Gorsel yuklenemedi', 'error')
    }
    setUploading(null)
  }

  return (
    <div className={s.formSection}>
      <div className={s.formSectionTitle}>{label}</div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: '1rem' }}>
        Slide yoksa varsayilan icerik gosterilir. En az 1 slide ekleyin.
      </p>
      {slides.map((slide, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <span className={styles.listItemNum}>Slide {i + 1}</span>
            <button className={styles.removeBtn} onClick={() => removeSlide(i)}>Sil</button>
          </div>
          <div className={styles.bannerRow}>
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" className={styles.bannerThumb} />
            ) : (
              <div className={styles.bannerThumbEmpty}>Gorsel Yok</div>
            )}
            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
              {uploading === `${key}-${i}` ? 'Yukleniyor...' : 'Gorsel Sec'}
              <input type="file" accept="image/*" onChange={(e) => handleUpload(i, e)} hidden />
            </label>
          </div>
          <div className={s.formGrid}>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <Field label="Baslik" value={slide.title} onChange={(v) => updateSlide(i, 'title', v)} placeholder="BAHAR KOLEKSİYONU" />
            </div>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <Field label="Aciklama" value={slide.subtitle} onChange={(v) => updateSlide(i, 'subtitle', v)} textarea placeholder="Yeni sezon urunleri kesfet" />
            </div>
            <Field label="Buton 1 Metin" value={slide.cta1Text} onChange={(v) => updateSlide(i, 'cta1Text', v)} placeholder="HEMEN İNCELE" />
            <Field label="Buton 1 Link" value={slide.cta1Link} onChange={(v) => updateSlide(i, 'cta1Link', v)} placeholder="/shop" />
            <Field label="Buton 2 Metin" value={slide.cta2Text} onChange={(v) => updateSlide(i, 'cta2Text', v)} placeholder="KURUMSAL ÇÖZÜMLER" />
            <Field label="Buton 2 Link" value={slide.cta2Link} onChange={(v) => updateSlide(i, 'cta2Link', v)} placeholder="/corporate" />
          </div>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addSlide} style={{ marginTop: '0.5rem' }}>
        + Slide Ekle
      </button>
    </div>
  )
}

// ═══ KATEGORİLER ═══
function CategoriesTab({ getArr, set, save, saving }) {
  const items = getArr('categories.list')

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    set('categories.list', newItems)
  }

  const addItem = () => {
    set('categories.list', [...items, { id: '', name: '', emoji: '' }])
  }

  const removeItem = (index) => {
    set('categories.list', items.filter((_, i) => i !== index))
  }

  const moveItem = (index, dir) => {
    const newItems = [...items]
    const target = index + dir
    if (target < 0 || target >= newItems.length) return
    ;[newItems[index], newItems[target]] = [newItems[target], newItems[index]]
    set('categories.list', newItems)
  }

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Kategoriler</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: '1rem' }}>
          Navbar, footer, ana sayfa ve magaza filtresinde gorunen kategoriler. Slug alani URL'de kullanilir (orn: "tisort", "mont-ceket").
        </p>
        {items.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemNum}>{i + 1}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={styles.removeBtn} onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
                <button className={styles.removeBtn} onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}>↓</button>
                <button className={styles.removeBtn} onClick={() => removeItem(i)}>Sil</button>
              </div>
            </div>
            <div className={s.formGrid}>
              <Field label="Slug (URL)" value={item.id} onChange={(v) => updateItem(i, 'id', v)} placeholder="tisort" />
              <Field label="Gorunen Ad" value={item.name} onChange={(v) => updateItem(i, 'name', v)} placeholder="Tişört" />
              <Field label="Emoji" value={item.emoji} onChange={(v) => updateItem(i, 'emoji', v)} placeholder="👕" />
            </div>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: '0.5rem' }}>
          + Kategori Ekle
        </button>
      </div>
      <SaveBtn onClick={() => save(['categories.list'])} saving={saving} />
    </>
  )
}

// ═══ ANA SAYFA ═══
function HomeTab({ get, set, getArr, save, saving }) {
  const [uploading, setUploading] = useState(null)
  const keys = [
    'home.hero.slides',
    'categories.label', 'categories.title',
    'bestsellers.label', 'bestsellers.title',
    'studio.label', 'studio.title', 'studio.description', 'studio.cta',
    'aboutHome.label', 'aboutHome.title', 'aboutHome.text1', 'aboutHome.text2',
    'faqHome.label', 'faqHome.title',
    'contactHome.label', 'contactHome.title',
    'instagram.label', 'instagram.title',
  ]

  return (
    <>
      {/* Hero Slides */}
      {renderHeroSlideEditor('home.hero.slides', 'Hero Slider', getArr, set, uploading, setUploading)}

      {/* Section Headers */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Bolum Basliklari</div>
        <div className={s.formGrid}>
          <Field label="Kategoriler Etiket" value={get('categories.label')} onChange={(v) => set('categories.label', v)} placeholder="KATEGORİLER" />
          <Field label="Kategoriler Baslik" value={get('categories.title')} onChange={(v) => set('categories.title', v)} placeholder="NE ARIYORSUNUZ?" />
          <Field label="Cok Satanlar Etiket" value={get('bestsellers.label')} onChange={(v) => set('bestsellers.label', v)} placeholder="ÇOK SATANLAR" />
          <Field label="Cok Satanlar Baslik" value={get('bestsellers.title')} onChange={(v) => set('bestsellers.title', v)} placeholder="EN SEVİLEN ÜRÜNLER" />
        </div>
      </div>

      {/* Studio Section */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Tasarim Studyosu Bolumu</div>
        <div className={s.formGrid}>
          <Field label="Etiket" value={get('studio.label')} onChange={(v) => set('studio.label', v)} placeholder="TASARIM STÜDYOSU" />
          <Field label="Baslik" value={get('studio.title')} onChange={(v) => set('studio.title', v)} placeholder="KENDİN TASARLA" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Aciklama" value={get('studio.description')} onChange={(v) => set('studio.description', v)} textarea placeholder="Kendi tasarımını yükle..." />
          </div>
          <Field label="CTA Buton" value={get('studio.cta')} onChange={(v) => set('studio.cta', v)} placeholder="STÜDYOYA GİT" />
        </div>
      </div>

      {/* About Home */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Hakkimizda Ozet</div>
        <div className={s.formGrid}>
          <Field label="Etiket" value={get('aboutHome.label')} onChange={(v) => set('aboutHome.label', v)} placeholder="HAKKIMIZDA" />
          <Field label="Baslik" value={get('aboutHome.title')} onChange={(v) => set('aboutHome.title', v)} placeholder="İKİ KARDEŞİN HİKAYESİ" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Paragraf 1" value={get('aboutHome.text1')} onChange={(v) => set('aboutHome.text1', v)} textarea />
          </div>
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Paragraf 2" value={get('aboutHome.text2')} onChange={(v) => set('aboutHome.text2', v)} textarea />
          </div>
        </div>
      </div>

      {/* Remaining section headers */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Diger Bolum Basliklari</div>
        <div className={s.formGrid}>
          <Field label="SSS Etiket" value={get('faqHome.label')} onChange={(v) => set('faqHome.label', v)} placeholder="SSS" />
          <Field label="SSS Baslik" value={get('faqHome.title')} onChange={(v) => set('faqHome.title', v)} placeholder="SIK SORULAN SORULAR" />
          <Field label="İletisim Etiket" value={get('contactHome.label')} onChange={(v) => set('contactHome.label', v)} placeholder="İLETİŞİM" />
          <Field label="İletisim Baslik" value={get('contactHome.title')} onChange={(v) => set('contactHome.title', v)} placeholder="BİZE ULAŞIN" />
          <Field label="Instagram Etiket" value={get('instagram.label')} onChange={(v) => set('instagram.label', v)} placeholder="INSTAGRAM" />
          <Field label="Instagram Baslik" value={get('instagram.title')} onChange={(v) => set('instagram.title', v)} placeholder="@HITHLAİNGİYİM" />
        </div>
      </div>

      <SaveBtn onClick={() => saveTab(keys)} saving={saving} />
    </>
  )
}

// ═══ İSTATİSTİKLER ═══
function StatsTab({ get, set, save, saving }) {
  const keys = [
    'stats.1.num', 'stats.1.label',
    'stats.2.num', 'stats.2.label',
    'stats.3.num', 'stats.3.label',
    'stats.4.num', 'stats.4.label',
  ]

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Istatistikler (4 adet)</div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={s.formGrid} style={{ marginBottom: '1rem' }}>
            <Field label={`${i}. Sayi`} value={get(`stats.${i}.num`)} onChange={(v) => set(`stats.${i}.num`, v)} placeholder="50K+" />
            <Field label={`${i}. Etiket`} value={get(`stats.${i}.label`)} onChange={(v) => set(`stats.${i}.label`, v)} placeholder="Üretilen Parça" />
          </div>
        ))}
      </div>
      <SaveBtn onClick={() => saveTab(keys)} saving={saving} />
    </>
  )
}

// ═══ SSS ═══
function FaqTab({ getArr, set, save, saving }) {
  const items = getArr('faq.items')

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    set('faq.items', newItems)
  }

  const addItem = () => {
    set('faq.items', [...items, { question: '', answer: '' }])
  }

  const removeItem = (index) => {
    set('faq.items', items.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Sik Sorulan Sorular</div>
        {items.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemNum}>{i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeItem(i)}>Sil</button>
            </div>
            <Field label="Soru" value={item.question} onChange={(v) => updateItem(i, 'question', v)} />
            <Field label="Cevap" value={item.answer} onChange={(v) => updateItem(i, 'answer', v)} textarea />
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: '0.5rem' }}>
          + Soru Ekle
        </button>
      </div>
      <SaveBtn onClick={() => save(['faq.items'])} saving={saving} />
    </>
  )
}

// ═══ MÜŞTERİ YORUMLARI ═══
function TestimonialsTab({ getArr, set, save, saving }) {
  const items = getArr('testimonials')

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    set('testimonials', newItems)
  }

  const addItem = () => {
    set('testimonials', [...items, { name: '', company: '', text: '', rating: 5 }])
  }

  const removeItem = (index) => {
    set('testimonials', items.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Musteri Yorumlari</div>
        {items.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemNum}>{i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeItem(i)}>Sil</button>
            </div>
            <div className={s.formGrid}>
              <Field label="Ad Soyad" value={item.name} onChange={(v) => updateItem(i, 'name', v)} />
              <Field label="Firma" value={item.company} onChange={(v) => updateItem(i, 'company', v)} />
            </div>
            <Field label="Yorum" value={item.text} onChange={(v) => updateItem(i, 'text', v)} textarea />
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: '0.5rem' }}>
          + Yorum Ekle
        </button>
      </div>
      <SaveBtn onClick={() => save(['testimonials'])} saving={saving} />
    </>
  )
}

// ═══ KURUMSAL ═══
function CorporateTab({ get, set, getArr, save, saving }) {
  const [uploading, setUploading] = useState(null)
  const keys = [
    'corporate.hero.banners',
    'corporate.hero.label', 'corporate.hero.title', 'corporate.hero.desc',
    'corporate.hero.cta1', 'corporate.hero.cta2',
    'corporate.services',
    'corporate.quote.label', 'corporate.quote.title', 'corporate.quote.desc',
  ]

  const services = getArr('corporate.services')

  const updateService = (index, field, value) => {
    const newItems = [...services]
    newItems[index] = { ...newItems[index], [field]: value }
    set('corporate.services', newItems)
  }

  const addService = () => {
    const num = String(services.length + 1).padStart(2, '0')
    set('corporate.services', [...services, { num, title: '', desc: '' }])
  }

  const removeService = (index) => {
    set('corporate.services', services.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Kurumsal Hero</div>
        <div className={s.formGrid}>
          <Field label="Etiket" value={get('corporate.hero.label')} onChange={(v) => set('corporate.hero.label', v)} placeholder="KURUMSAL ÇÖZÜMLER" />
          <Field label="Baslik" value={get('corporate.hero.title')} onChange={(v) => set('corporate.hero.title', v)} placeholder="İŞLETMENİZ İÇİN TEKSTİL ÇÖZÜMLERİ" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Aciklama" value={get('corporate.hero.desc')} onChange={(v) => set('corporate.hero.desc', v)} textarea />
          </div>
          <Field label="CTA Buton 1" value={get('corporate.hero.cta1')} onChange={(v) => set('corporate.hero.cta1', v)} placeholder="TEKLİF AL" />
          <Field label="CTA Buton 2" value={get('corporate.hero.cta2')} onChange={(v) => set('corporate.hero.cta2', v)} placeholder="İLETİŞİME GEÇ" />
        </div>
      </div>

      {/* Hero Banners */}
      {renderBannerSection('corporate.hero.banners', 'Hero Bannerlari', getArr, set, uploading, setUploading)}

      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Hizmetler</div>
        {services.map((svc, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemNum}>{svc.num || String(i + 1).padStart(2, '0')}</span>
              <button className={styles.removeBtn} onClick={() => removeService(i)}>Sil</button>
            </div>
            <Field label="Baslik" value={svc.title} onChange={(v) => updateService(i, 'title', v)} />
            <Field label="Aciklama" value={svc.desc} onChange={(v) => updateService(i, 'desc', v)} textarea />
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addService} style={{ marginTop: '0.5rem' }}>
          + Hizmet Ekle
        </button>
      </div>

      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Teklif Bolumu</div>
        <div className={s.formGrid}>
          <Field label="Etiket" value={get('corporate.quote.label')} onChange={(v) => set('corporate.quote.label', v)} placeholder="TEKLİF" />
          <Field label="Baslik" value={get('corporate.quote.title')} onChange={(v) => set('corporate.quote.title', v)} placeholder="BİZE ULAŞIN" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Aciklama" value={get('corporate.quote.desc')} onChange={(v) => set('corporate.quote.desc', v)} textarea />
          </div>
        </div>
      </div>

      <SaveBtn onClick={() => saveTab(keys)} saving={saving} />
    </>
  )
}

// ═══ HAKKIMIZDA ═══
function AboutTab({ get, set, save, saving }) {
  const keys = ['about.title', 'about.subtitle', 'about.text']

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Hakkimizda Sayfasi</div>
        <div className={s.formGrid}>
          <Field label="Baslik" value={get('about.title')} onChange={(v) => set('about.title', v)} placeholder="İki Kardeşin Hikayesi" />
          <Field label="Alt Baslik" value={get('about.subtitle')} onChange={(v) => set('about.subtitle', v)} placeholder="HAKKIMIZDA" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Icerik" value={get('about.text')} onChange={(v) => set('about.text', v)} textarea placeholder="Hithlain Giyim, Antalya merkezli..." />
          </div>
        </div>
      </div>
      <SaveBtn onClick={() => saveTab(keys)} saving={saving} />
    </>
  )
}

// ═══ İLETİŞİM ═══
function ContactTab({ get, set, save, saving }) {
  const keys = ['contact.title', 'contact.subtitle']

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Iletisim Sayfasi</div>
        <div className={s.formGrid}>
          <Field label="Baslik" value={get('contact.title')} onChange={(v) => set('contact.title', v)} placeholder="Bize Ulaşın" />
          <Field label="Etiket" value={get('contact.subtitle')} onChange={(v) => set('contact.subtitle', v)} placeholder="İLETİŞİM" />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: '1rem' }}>
          Adres, telefon, e-posta bilgileri Site Ayarlari sayfasindan duzenlenir.
        </p>
      </div>
      <SaveBtn onClick={() => saveTab(keys)} saving={saving} />
    </>
  )
}

// ═══ SÖZLEŞMELER ═══
function LegalTab({ get, set, save, saving }) {
  const keys = [
    'legal.privacy.title', 'legal.privacy.content',
    'legal.terms.title', 'legal.terms.content',
    'legal.returnPolicy.title', 'legal.returnPolicy.content',
    'legal.kvkk.title', 'legal.kvkk.content',
  ]

  const sections = [
    { key: 'legal.privacy', label: 'Gizlilik Politikasi', defaultTitle: 'Gizlilik Politikası' },
    { key: 'legal.terms', label: 'Kullanim Kosullari', defaultTitle: 'Kullanım Koşulları' },
    { key: 'legal.returnPolicy', label: 'Iade Politikasi', defaultTitle: 'İade Politikası' },
    { key: 'legal.kvkk', label: 'KVKK Aydinlatma Metni', defaultTitle: 'KVKK Aydınlatma Metni' },
  ]

  return (
    <>
      {sections.map((sec) => (
        <div key={sec.key} className={s.formSection}>
          <div className={s.formSectionTitle}>{sec.label}</div>
          <div className={s.formGrid}>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <Field label="Sayfa Basligi" value={get(`${sec.key}.title`)} onChange={(v) => set(`${sec.key}.title`, v)} placeholder={sec.defaultTitle} />
            </div>
            <div className={`${s.formGroup} ${s.formGroupFull}`}>
              <label className={s.formLabel}>Icerik</label>
              <textarea
                className={s.formTextarea}
                value={get(`${sec.key}.content`) || ''}
                onChange={(e) => set(`${sec.key}.content`, e.target.value)}
                placeholder="Sayfa icerigini buraya yazin. Paragraflar arasinda bos satir birakin."
                rows={10}
              />
            </div>
          </div>
        </div>
      ))}
      <SaveBtn onClick={() => save(keys)} saving={saving} />
    </>
  )
}

// ═══ GENEL ═══
function GeneralTab({ get, set, save, saving }) {
  const keys = ['logoText', 'logoUrl', 'footerCopyright']
  const [uploading, setUploading] = useState(false)

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData)
      set('logoUrl', res.data.url)
      useToastStore.getState().showToast('Logo yuklendi', 'success')
    } catch {
      useToastStore.getState().showToast('Logo yuklenemedi', 'error')
    }
    setUploading(false)
  }

  return (
    <>
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Site Logosu</div>
        <div className={styles.logoUploadArea}>
          <img
            src={get('logoUrl') || '/hithlain-logo.png'}
            alt="Logo"
            className={styles.logoPreviewImg}
          />
          <div className={styles.logoUploadActions}>
            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
              {uploading ? 'Yukleniyor...' : 'Logo Degistir'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} hidden disabled={uploading} />
            </label>
            {get('logoUrl') && (
              <button className="btn btn-ghost btn-sm" onClick={() => set('logoUrl', '')}>
                Varsayilana Don
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Genel Icerikler</div>
        <div className={s.formGrid}>
          <Field label="Logo Metni" value={get('logoText')} onChange={(v) => set('logoText', v)} placeholder="HITHLAIN" />
          <Field label="Footer Telif Hakki" value={get('footerCopyright')} onChange={(v) => set('footerCopyright', v)} placeholder="© 2026 Hithlain Giyim. Tüm hakları saklıdır." />
        </div>
      </div>
      <SaveBtn onClick={() => save(keys)} saving={saving} />
    </>
  )
}

// ═══ KARSILAMA EKRANI ═══
function WelcomeTab({ get, set, getArr, save, saving }) {
  const [uploading, setUploading] = useState(null)
  const keys = [
    'welcome.b2c.title', 'welcome.b2c.desc', 'welcome.b2c.cta', 'welcome.b2c.banners',
    'welcome.b2b.title', 'welcome.b2b.desc', 'welcome.b2b.cta', 'welcome.b2b.banners',
  ]

  const handleBannerUpload = async (side, index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(`${side}-${index}`)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload', formData)
      const banners = [...getArr(`welcome.${side}.banners`)]
      banners[index] = { ...banners[index], imageUrl: res.data.url }
      set(`welcome.${side}.banners`, banners)
    } catch {
      useToastStore.getState().showToast('Gorsel yuklenemedi', 'error')
    }
    setUploading(null)
  }

  const renderBannerEditor = (side, label) => {
    const banners = getArr(`welcome.${side}.banners`)

    const updateBanner = (index, field, value) => {
      const newBanners = [...banners]
      newBanners[index] = { ...newBanners[index], [field]: value }
      set(`welcome.${side}.banners`, newBanners)
    }

    const addBanner = () => {
      set(`welcome.${side}.banners`, [...banners, { imageUrl: '', title: '', subtitle: '' }])
    }

    const removeBanner = (index) => {
      set(`welcome.${side}.banners`, banners.filter((_, i) => i !== index))
    }

    return (
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>{label} — Bannerlar</div>
        {banners.map((banner, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemNum}>{i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeBanner(i)}>Sil</button>
            </div>
            <div className={styles.bannerRow}>
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt="" className={styles.bannerThumb} />
              ) : (
                <div className={styles.bannerThumbEmpty}>Gorsel Yok</div>
              )}
              <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                {uploading === `${side}-${i}` ? 'Yukleniyor...' : 'Gorsel Sec'}
                <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(side, i, e)} hidden />
              </label>
            </div>
            <div className={s.formGrid}>
              <Field label="Baslik" value={banner.title} onChange={(v) => updateBanner(i, 'title', v)} placeholder="BAHAR KOLEKSİYONU" />
              <Field label="Alt Yazi" value={banner.subtitle} onChange={(v) => updateBanner(i, 'subtitle', v)} placeholder="Yeni sezon ürünleri" />
            </div>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addBanner} style={{ marginTop: '0.5rem' }}>
          + Banner Ekle
        </button>
      </div>
    )
  }

  return (
    <>
      {/* B2C Text */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Bireysel (B2C) — Yazilar</div>
        <div className={s.formGrid}>
          <Field label="Baslik" value={get('welcome.b2c.title')} onChange={(v) => set('welcome.b2c.title', v)} placeholder="BİREYSEL ALIŞVERİŞ" />
          <Field label="CTA Buton" value={get('welcome.b2c.cta')} onChange={(v) => set('welcome.b2c.cta', v)} placeholder="MAĞAZAYA GİT" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Aciklama" value={get('welcome.b2c.desc')} onChange={(v) => set('welcome.b2c.desc', v)} textarea placeholder="Tişört, sweatshirt, mont ve daha fazlası..." />
          </div>
        </div>
      </div>

      {renderBannerEditor('b2c', 'Bireysel (B2C)')}

      {/* B2B Text */}
      <div className={s.formSection}>
        <div className={s.formSectionTitle}>Kurumsal (B2B) — Yazilar</div>
        <div className={s.formGrid}>
          <Field label="Baslik" value={get('welcome.b2b.title')} onChange={(v) => set('welcome.b2b.title', v)} placeholder="KURUMSAL ÇÖZÜMLER" />
          <Field label="CTA Buton" value={get('welcome.b2b.cta')} onChange={(v) => set('welcome.b2b.cta', v)} placeholder="TEKLİF AL" />
          <div className={`${s.formGroup} ${s.formGroupFull}`}>
            <Field label="Aciklama" value={get('welcome.b2b.desc')} onChange={(v) => set('welcome.b2b.desc', v)} textarea placeholder="Toptan sipariş, baskı & nakış..." />
          </div>
        </div>
      </div>

      {renderBannerEditor('b2b', 'Kurumsal (B2B)')}

      <SaveBtn onClick={() => save(keys)} saving={saving} />
    </>
  )
}

// ═══ NEDEN BİZ EDITOR ═══
function WhyUsEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : []

  const updateItem = (index, field, value) => {
    const newItems = [...list]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  const addItem = () => onChange([...list, { title: '', desc: '' }])
  const removeItem = (index) => onChange(list.filter((_, i) => i !== index))

  return (
    <div style={{ marginTop: '1rem' }}>
      {list.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHeader}>
            <span className={styles.listItemNum}>{i + 1}</span>
            <button className={styles.removeBtn} onClick={() => removeItem(i)}>Sil</button>
          </div>
          <div className={s.formGrid}>
            <Field label="Baslik" value={item.title} onChange={(v) => updateItem(i, 'title', v)} />
            <Field label="Aciklama" value={item.desc} onChange={(v) => updateItem(i, 'desc', v)} />
          </div>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: '0.5rem' }}>
        + Madde Ekle
      </button>
    </div>
  )
}
