import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import useSiteContent from '../../hooks/useSiteContent'
import useScrollReveal from '../../hooks/useScrollReveal'
import api from '../../utils/api'
import styles from './Home.module.css'

const defaultCategoryBanners = [
  { id: 'tisort', name: 'TİŞÖRT', count: '48 MODEL', gradient: 'linear-gradient(160deg,#234f3a,#12301f)' },
  { id: 'sweatshirt', name: 'SWEATSHIRT & HOODIE', count: 'KOLEKSİYON', gradient: 'linear-gradient(160deg,#2c5a43,#1c4634)' },
  { id: 'polo', name: 'POLO YAKA', count: 'KOLEKSİYON', gradient: 'linear-gradient(160deg,#b07e22,#8a5f14)' },
  { id: 'is-kiyafeti', name: 'İŞ KIYAFETLERİ', count: 'KOLEKSİYON', gradient: 'linear-gradient(160deg,#3a5c2e,#21381a)' },
  { id: 'sapka', name: 'ŞAPKA & AKSESUAR', count: 'KOLEKSİYON', gradient: 'linear-gradient(160deg,#1f4636,#0f2a1f)' },
  { id: 'kurumsal', name: 'KURUMSAL', count: 'TOPTAN', gradient: 'linear-gradient(160deg,#101f18,#06120c)', badge: 'Kurumsal çözümler' },
]

const defaultFeatures = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.3a2 2 0 0 0-.6-1.4L18 9h-4v8h2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
    title: 'AYNI GÜN KARGO',
    desc: 'Stoktaki ürünler aynı gün kargoda, hızlıca kapına ulaşır.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 6v6l4 2" /></svg>,
    title: '48 SAATTE ÜRETİM',
    desc: 'Özel baskı ve nakış siparişleri 48 saat içinde hazır edilir.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'KALİTE GARANTİSİ',
    desc: '%100 penye pamuk, kalıcı baskı ve yüksek kalite nakış.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    title: 'CANLI DESTEK',
    desc: 'Tasarım ve sipariş sürecinde WhatsApp ile anlık destek.',
  },
]

const defaultFaq = [
  { q: 'Minimum sipariş adedi kaçtır?', a: 'Bireysel siparişlerde minimum adet yoktur, tek adet üretim yapıyoruz. Kurumsal baskı/nakış siparişlerinde tasarıma göre minimum 10 adetten başlar.' },
  { q: 'Baskı ve nakış fiyatları ürün fiyatına dahil midir?', a: 'Standart tek renk baskı çoğu üründe fiyata dahildir. Çok renkli baskı, özel nakış ve büyük ebatlı tasarımlar adet ve teknik bazında ayrıca fiyatlandırılır.' },
  { q: 'Kargo süresi ne kadardır?', a: 'Stoktaki ürünler aynı gün kargoya verilir. Baskılı/nakışlı özel üretimler tasarım onayından sonra 2-4 iş günü içinde hazırlanıp gönderilir.' },
  { q: 'İade ve değişim politikanız nedir?', a: 'Standart ürünlerde 14 gün içinde iade ve beden değişimi yapılır. Kişiye özel baskılı/nakışlı üretimlerde hatalı üretim dışında iade alınmaz.' },
  { q: 'Hangi baskı teknikleri kullanılıyor?', a: 'DTG dijital baskı, serigrafi, transfer baskı ve makine nakışı tekniklerini kullanıyoruz. Kumaş ve adet sayısına göre en uygun tekniği biz öneriyoruz.' },
]

export default function Home() {
  const revealRef = useScrollReveal()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [instaFeed, setInstaFeed] = useState([])
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const { get, getJSON } = useSiteContent()

  const faqItems = getJSON('faq.items', defaultFaq)

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } })
      .then((res) => {
        const products = res.data.products || []
        setFeatured(products.filter((p) => p.isFeatured).slice(0, 5))
        setTrending(products.filter((p) => p.isNew).slice(0, 5))
      })
      .catch(() => {})

    api.get('/instagram/feed')
      .then((res) => setInstaFeed(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
      .catch(() => {})
  }, [])

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>{get('siteName', 'HITHLAIN Giyim')} — Özel Tasarım Baskılı Giyim</title>
        <meta name="description" content={get('metaDescription', 'Tişört, sweatshirt, polo ve iş kıyafetlerinde dilediğin baskı ve nakışı uygula. Tek adetten kurumsal toptan siparişe kadar.')} />
      </Helmet>

      {/* ═══ 1. HERO ═══ */}
      <section className={styles.heroSection}>
        <div className={styles.heroCard}>
          {get('home.hero.image') && (
            <img src={get('home.hero.image')} alt="" className={styles.heroPhoto} />
          )}
          <div className={styles.heroBg} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>SEZON İNDİRİMİ · %40&apos;A VARAN</span>
            <h1 className={styles.heroH1}>
              ÖZEL TASARIM<br />
              <span className={styles.heroAccent}>BASKILI GİYİM</span>
            </h1>
            <p className={styles.heroDesc}>
              Tişört, sweatshirt, polo ve iş kıyafetlerinde dilediğin baskı ve nakışı uygula.
              Tek adetten kurumsal toptan siparişe kadar.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/shop" className={styles.heroCtaPrimary}>
                ÜRÜNLERİ KEŞFET
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link to="/contact" className={styles.heroCtaSecondary}>TEKLİF AL</Link>
            </div>
          </div>
          <div className={styles.heroIcon}>
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="rgba(231,196,107,.55)" strokeWidth="1">
              <path d="M20.4 5.6 16 4l-1.3 1.3a3.8 3.8 0 0 1-5.4 0L8 4 3.6 5.6a1 1 0 0 0-.6 1.2L4.4 11l2.6-.6V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9.6l2.6.6 1.4-4.2a1 1 0 0 0-.6-1.2z" />
            </svg>
          </div>
          <div className={styles.heroDots}>
            <span className={styles.heroDotActive} />
            <span className={styles.heroDot} />
            <span className={styles.heroDot} />
          </div>
        </div>
      </section>

      {/* ═══ 2. ÇOK SATANLAR ═══ */}
      <section className={styles.productSection}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>ÇOK SATANLAR</h2>
            <p className={styles.sectionSub}>En çok tercih edilen modeller</p>
          </div>
          <Link to="/shop" className={styles.seeAll}>
            Tümünü Gör
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className={styles.hScroll}>
          {/* Studio Promo Card */}
          <div className={styles.studioPromo}>
            {get('home.studioPromo.image') && (
              <img src={get('home.studioPromo.image')} alt="" className={styles.studioPromoPhoto} />
            )}
            <span className={styles.studioPromoLabel}>HITHLAIN STÜDYO</span>
            <h3 className={styles.studioPromoTitle}>KENDİ TASARIMINI YÜKLE</h3>
            <p className={styles.studioPromoDesc}>Logonu gönder, 48 saatte üretelim.</p>
            <Link to="/studio" className={styles.studioPromoBtn}>Stüdyoya Git →</Link>
          </div>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ═══ 3. KATEGORİLERE GÖZ AT ═══ */}
      <section className={styles.productSection}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>KATEGORİLERE GÖZ AT</h2>
          <Link to="/shop" className={styles.seeAll}>
            Tümünü Gör
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className={styles.catPills}>
          {getJSON('categories.list', defaultCategoryBanners).slice(0, 5).map((cat) => (
            <button
              key={cat.id || cat.name}
              className={styles.catPill}
              onClick={() => navigate(`/shop/${cat.id || ''}`)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className={styles.catGrid3}>
          {getJSON('home.categoryBanners', defaultCategoryBanners).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className={styles.catCard3}
              style={cat.image
                ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6)), url(${cat.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: cat.gradient }}
            >
              {cat.badge && <span className={styles.catBadge}>{cat.badge}</span>}
              <h3 className={styles.catCard3Title}>{cat.name}</h3>
              <span className={styles.catCard3Count}>{cat.count}</span>
              <span className={styles.catCard3Link}>Keşfet ›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 4. FEATURES STRIP ═══ */}
      <section className={styles.featuresStrip}>
        <div className={styles.featuresGrid}>
          {defaultFeatures.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. TREND ÜRÜNLER ═══ */}
      <section className={styles.productSection}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>TREND ÜRÜNLER</h2>
            <p className={styles.sectionSub}>Şu anda popüler olan modeller</p>
          </div>
          <Link to="/shop" className={styles.seeAll}>
            Tümünü Gör
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className={styles.hScroll}>
          {(trending.length > 0 ? trending : featured).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ═══ 6. NEWSLETTER ═══ */}
      <section className={styles.productSection}>
        <div className={styles.newsletterCard}>
          <div className={styles.newsletterIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
          </div>
          <h2 className={styles.newsletterTitle}>ÖZEL FIRSATLARDAN İLK SEN HABERDAR OL!</h2>
          <p className={styles.newsletterDesc}>Yeni koleksiyonlar, kampanyalar ve baskı fırsatlarını kaçırma.</p>
          <form
            className={styles.newsletterForm}
            onSubmit={(e) => { e.preventDefault(); setNewsletterEmail('') }}
          >
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className={styles.newsletterInput}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterBtn}>ABONE OL</button>
          </form>
        </div>
      </section>

      {/* ═══ 7. SSS ═══ */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={styles.faqHeader}>
            <span className={styles.faqLabel}>
              <span className={styles.faqLine} />SSS
            </span>
            <h2 className={styles.faqTitle}>SIK SORULAN SORULAR</h2>
          </div>
          <div>
            {faqItems.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q || item.question}
                  <span className={styles.faqSign}>{openFaq === i ? '−' : '+'}</span>
                </button>
                <div
                  className={styles.faqBody}
                  style={{
                    maxHeight: openFaq === i ? '240px' : '0',
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p>{item.a || item.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.faqCta}>
            <Link to="/faq" className={styles.faqCtaBtn}>TÜMÜNÜ GÖR</Link>
          </div>
        </div>
      </section>

      {/* ═══ 8. INSTAGRAM ═══ */}
      {instaFeed.length > 0 && (
        <section className={styles.instaSection}>
          <div className={styles.productSection}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>@HITHLAİNGİYİM</h2>
              <a
                href="https://instagram.com/hithlaingiyim"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.seeAll}
              >
                Instagram'da Takip Et ›
              </a>
            </div>
            <div className={styles.instaGrid}>
              {instaFeed.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.instaItem}
                >
                  <img
                    src={post.media_url || post.thumbnail_url}
                    alt={post.caption?.slice(0, 60) || 'Instagram görseli'}
                    className={styles.instaImg}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 9. CONTACT ═══ */}
      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div>
            <span className={styles.contactLabel}>
              <span className={styles.contactLine} />İLETİŞİM
            </span>
            <h2 className={styles.contactTitle}>BİZE ULAŞIN</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactItemLabel}>ADRES</div>
                <div className={styles.contactItemVal}>{get('address', 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA')}</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactItemLabel}>E-POSTA</div>
                <div className={styles.contactItemVal}>{get('email', 'hithlaingiyim@gmail.com')}</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactItemLabel}>TELEFON</div>
                <div className={styles.contactItemVal}>{get('phone', '0543 686 19 94')}</div>
              </div>
            </div>
          </div>
          <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Ad Soyad" required />
            <input type="email" placeholder="E-posta" required />
            <textarea placeholder="Mesajınız" rows={5} required />
            <button type="submit" className={styles.contactBtn}>GÖNDER</button>
          </form>
        </div>
      </section>
    </div>
  )
}
