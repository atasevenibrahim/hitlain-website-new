import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import HeroSlider from '../../components/HeroSlider/HeroSlider'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import ProductCard from '../../components/ProductCard/ProductCard'
import { categories } from '../../data/mockData'
import useSiteContent from '../../hooks/useSiteContent'
import api from '../../utils/api'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Home.module.css'

export default function Home() {
  const revealRef = useScrollReveal()
  const [openFaq, setOpenFaq] = useState(null)
  const [featured, setFeatured] = useState([])
  const { get, getJSON } = useSiteContent()

  const faqItems = getJSON('faq.items', [
    { question: 'Minimum sipariş adedi kaçtır?', answer: 'Toptan siparişlerde minimum sipariş adedi 50 adettir. Perakende satışlarda minimum adet bulunmamaktadır.' },
    { question: 'Baskı ve nakış fiyatları ürün fiyatına dahil midir?', answer: 'Hayır, baskı ve nakış işlemleri ayrıca ücretlendirilir. Tasarım stüdyomuzda tasarımınızı oluşturup fiyat bilgisini görebilirsiniz.' },
    { question: 'Kargo süresi ne kadardır?', answer: 'Standart kargo ile 3-5 iş günü, hızlı kargo ile 1-2 iş günü içinde teslimat yapılmaktadır.' },
    { question: 'İade ve değişim politikanız nedir?', answer: 'Özel baskılı/nakışlı ürünlerde iade kabul edilmemektedir. Standart ürünlerde 14 gün içinde iade ve değişim yapılabilir.' },
  ])

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } })
      .then((res) => {
        const withBadge = res.data.products.map((p) => ({
          ...p,
          badge: p.isNew ? 'Yeni' : p.isFeatured ? 'Çok Satan' : p.stock < 10 ? 'Son Stok' : null,
        }))
        setFeatured(withBadge.filter((p) => p.isFeatured).slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>{get('siteName', 'HITHLAIN Giyim')} — Kurumsal Tekstil Çözümleri</title>
        <meta name="description" content={get('metaDescription', 'Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.')} />
      </Helmet>
      {/* ═══ 1. HERO ═══ */}
      <HeroSlider slides={getJSON('home.hero.slides', [])} />

      {/* ═══ 2. KATEGORİLER ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label={get('categories.label', 'KATEGORİLER')} title={get('categories.title', 'NE ARIYORSUNUZ?')} align="center" />
          <div className={`${styles.catGrid} reveal`}>
            {categories.slice(0, 5).map((cat) => (
              <Link key={cat.id} to={`/shop/${cat.id}`} className={styles.catCard}>
                <div className={styles.catContent}>
                  <span className={styles.catEmoji}>{cat.emoji}</span>
                  <h3 className={styles.catName}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. ÇOK SATANLAR ═══ */}
      <section className="section section-off">
        <div className="container">
          <SectionHeader label={get('bestsellers.label', 'ÇOK SATANLAR')} title={get('bestsellers.title', 'EN SEVİLEN ÜRÜNLER')} />
          <div className={`${styles.productGrid} reveal`}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className={styles.centerCta}>
            <Link to="/shop" className="btn btn-secondary">TÜM ÜRÜNLERİ GÖR</Link>
          </div>
        </div>
      </section>

      {/* ═══ 4. KENDİN TASARLA ═══ */}
      <section className={styles.studioSection}>
        <div className={styles.studioGrid}>
          <div className={styles.studioLeft}>
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>{get('studio.label', 'TASARIM STÜDYOSU')}</span>
            <h2 className={styles.studioTitle}>{get('studio.title', 'KENDİN\nTASARLA').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}</h2>
            <p className={styles.studioText}>
              {get('studio.description', 'Kendi tasarımını yükle veya stüdyomuzda oluştur. Baskı bölgesini seç, ürünü özelleştir.')}
            </p>
            <Link to="/studio" className="btn btn-outline-white btn-lg">{get('studio.cta', 'STÜDYOYA GİT')}</Link>
          </div>
          <div className={styles.studioRight}>
            <div className={styles.studioCanvas}>
              <div className={styles.studioMockup}>
                <span style={{ fontSize: '4rem' }}>👕</span>
                <div className={styles.studioOverlay}>
                  <span>Tasarımın Burada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. HAKKIMIZDA ═══ */}
      <section className="section section-off">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutImage} reveal`}>
              <div className={styles.aboutPlaceholder}>
                <span style={{ fontSize: '3rem', opacity: 0.3 }}>📸</span>
              </div>
            </div>
            <div className={`reveal rd2`}>
              <SectionHeader label={get('aboutHome.label', 'HAKKIMIZDA')} title={get('aboutHome.title', 'İKİ KARDEŞİN HİKAYESİ')} />
              <p className={styles.aboutText}>
                {get('aboutHome.text1', 'Antalya\'da küçük bir atölyede başlayan yolculuğumuz, bugün yüzlerce kurumsal müşteriye hizmet veren bir markaya dönüştü. Kalite ve müşteri memnuniyeti odaklı yaklaşımımızla sektörde güvenilir bir isim olduk.')}
              </p>
              <p className={styles.aboutText}>
                {get('aboutHome.text2', 'Her bir ürünümüzde aynı özveri ve titizliği gösteriyoruz. Amacımız sadece giysi üretmek değil, markanızı en iyi şekilde temsil edecek çözümler sunmak.')}
              </p>
              <Link to="/about" className="btn btn-secondary">DAHA FAZLA</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. SSS ÖZETİ ═══ */}
      <section className="section section-off">
        <div className="container">
          <SectionHeader label={get('faqHome.label', 'SSS')} title={get('faqHome.title', 'SIK SORULAN SORULAR')} align="center" />
          <div className={`${styles.faqList} reveal`}>
            {faqItems.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className={styles.faqArrow}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}><p>{item.answer}</p></div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.centerCta}>
            <Link to="/faq" className="btn btn-ghost">TÜMÜNÜ GÖR</Link>
          </div>
        </div>
      </section>

      {/* ═══ 11. İLETİŞİM ÖZETİ ═══ */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            <div className="reveal">
              <SectionHeader label={get('contactHome.label', 'İLETİŞİM')} title={get('contactHome.title', 'BİZE ULAŞIN')} />
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <h4>Adres</h4>
                  <p>{get('address', 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA')}</p>
                </div>
                <div className={styles.contactItem}>
                  <h4>E-posta</h4>
                  <p>{get('email', 'hithlaingiyim@gmail.com')}</p>
                </div>
                <div className={styles.contactItem}>
                  <h4>Telefon</h4>
                  <p>{get('phone', '0543 686 19 94')}</p>
                </div>
              </div>
            </div>
            <form className={`${styles.contactForm} reveal rd2`} onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Ad Soyad" required />
              <input type="email" placeholder="E-posta" required />
              <textarea placeholder="Mesajınız" rows={4} required />
              <button type="submit" className="btn btn-primary">GÖNDER</button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ 12. INSTAGRAM ═══ */}
      <section className={styles.instaSection}>
        <div className="container">
          <SectionHeader label={get('instagram.label', 'INSTAGRAM')} title={get('instagram.title', '@HITHLAİNGİYİM')} align="center" />
          <div className={`${styles.instaGrid} reveal`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.instaItem}>
                <span style={{ fontSize: '1.5rem', opacity: 0.2 }}>📷</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
