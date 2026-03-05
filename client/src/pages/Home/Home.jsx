import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import ProductCard from '../../components/ProductCard/ProductCard'
import { products, categories, references, testimonials, faqItems } from '../../data/mockData'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Home.module.css'

export default function Home() {
  const revealRef = useScrollReveal()
  const [openFaq, setOpenFaq] = useState(null)
  const featured = products.filter((p) => p.isFeatured)

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>HITHLAIN Giyim — Kurumsal Tekstil Çözümleri</title>
        <meta name="description" content="Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri. Kurumsal giyim çözümlerinde güvenilir iş ortağınız." />
      </Helmet>
      {/* ═══ 1. HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <span className="section-label" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>HITHLAIN GİYİM</span>
            <h1 className={styles.heroTitle}>
              KURUMSAL<br />TEKSTİL<br />ÇÖZÜMLERİ
            </h1>
            <p className={styles.heroText}>
              Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.
            </p>
            <div className={styles.heroCta}>
              <Link to="/shop" className="btn btn-primary btn-lg">ÜRÜNLERİ KEŞFET</Link>
              <Link to="/corporate" className="btn btn-outline-white btn-lg">KURUMSAL ÇÖZÜMLER</Link>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <span className={styles.heroCardLabel}>B2B</span>
              <h3>Toptan Sipariş</h3>
              <p>50 adet ve üzeri kurumsal siparişlerde özel fiyat</p>
            </div>
            <div className={styles.heroCard}>
              <span className={styles.heroCardLabel}>B2C</span>
              <h3>Perakende</h3>
              <p>Tek parça siparişlerde hızlı teslimat</p>
            </div>
          </div>
        </div>
        <div className={styles.heroGhost}>TEKSTİL</div>
      </section>

      {/* ═══ 2. KATEGORİLER ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label="KATEGORİLER" title="NE ARIYORSUNUZ?" align="center" />
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
          <SectionHeader label="ÇOK SATANLAR" title="EN SEVİLEN ÜRÜNLER" />
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
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>TASARIM STÜDYOSU</span>
            <h2 className={styles.studioTitle}>KENDİN<br />TASARLA</h2>
            <p className={styles.studioText}>
              Kendi tasarımını yükle veya stüdyomuzda oluştur. Baskı bölgesini seç, ürünü özelleştir.
            </p>
            <Link to="/studio" className="btn btn-outline-white btn-lg">STÜDYOYA GİT</Link>
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

      {/* ═══ 5. KURUMSAL ÇÖZÜMLER ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label="KURUMSAL" title="İŞLETMENİZ İÇİN ÇÖZÜMLER" />
          <div className={`${styles.corpGrid} reveal`}>
            <div className={styles.corpCard}>
              <span className={styles.corpNum}>01</span>
              <h3>Baskı & Nakış</h3>
              <p>Logonuzu, tasarımınızı tişört, sweatshirt ve daha fazlasına uyguluyoruz. Serigrafi, dijital baskı ve nakış seçenekleri.</p>
              <Link to="/corporate" className={styles.corpLink}>Detaylı Bilgi →</Link>
            </div>
            <div className={styles.corpCard}>
              <span className={styles.corpNum}>02</span>
              <h3>Toptan Dikim</h3>
              <p>İstediğiniz model, kumaş ve renkte toptan üretim. Minimum 50 adet sipariş ile özel fiyat avantajı.</p>
              <Link to="/corporate" className={styles.corpLink}>Detaylı Bilgi →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. NEDEN BİZ + İSTATİSTİKLER ═══ */}
      <section className="section section-dark">
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={`reveal`}>
              <SectionHeader label="NEDEN BİZ" title="FARKINIZ BİZİZ" light />
              <ul className={styles.whyList}>
                <li><strong>Kaliteli Kumaş</strong> — Sadece A sınıfı, sertifikalı kumaşlar kullanıyoruz.</li>
                <li><strong>Hızlı Üretim</strong> — 500 adete kadar siparişleri 5 iş gününde teslim ediyoruz.</li>
                <li><strong>Profesyonel Baskı</strong> — Serigrafi, dijital ve nakış, her teknikte uzman ekip.</li>
                <li><strong>Uygun Fiyat</strong> — Aracısız, fabrikadan direkt toptan fiyat avantajı.</li>
              </ul>
            </div>
            <div className={`${styles.statsGrid} reveal rd2`}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>50K+</span>
                <span className={styles.statLabel}>Üretilen Parça</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>200+</span>
                <span className={styles.statLabel}>Kurumsal Müşteri</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>15+</span>
                <span className={styles.statLabel}>Yıllık Deneyim</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>%98</span>
                <span className={styles.statLabel}>Memnuniyet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. REFERANSLAR ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label="REFERANSLAR" title="BİZE GÜVENEN MARKALAR" align="center" />
          <div className={`${styles.refGrid} reveal`}>
            {references.map((ref) => (
              <div key={ref.id} className={styles.refCard}>
                <span className={styles.refName}>{ref.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. HAKKIMIZDA ═══ */}
      <section className="section section-off">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutImage} reveal`}>
              <div className={styles.aboutPlaceholder}>
                <span style={{ fontSize: '3rem', opacity: 0.3 }}>📸</span>
              </div>
            </div>
            <div className={`reveal rd2`}>
              <SectionHeader label="HAKKIMIZDA" title="İKİ KARDEŞİN HİKAYESİ" />
              <p className={styles.aboutText}>
                Antalya'da küçük bir atölyede başlayan yolculuğumuz, bugün yüzlerce kurumsal müşteriye
                hizmet veren bir markaya dönüştü. Kalite ve müşteri memnuniyeti odaklı yaklaşımımızla
                sektörde güvenilir bir isim olduk.
              </p>
              <p className={styles.aboutText}>
                Her bir ürünümüzde aynı özveri ve titizliği gösteriyoruz. Amacımız sadece giysi üretmek
                değil, markanızı en iyi şekilde temsil edecek çözümler sunmak.
              </p>
              <Link to="/about" className="btn btn-secondary">DAHA FAZLA</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9. MÜŞTERİ YORUMLARI ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label="YORUMLAR" title="MÜŞTERİLERİMİZ NE DİYOR?" align="center" />
          <div className={`${styles.reviewGrid} reveal`}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.reviewCard}>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>"{t.text}"</p>
                <div className={styles.reviewAuthor}>
                  <strong>{t.name}</strong>
                  <span>{t.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10. SSS ÖZETİ ═══ */}
      <section className="section section-off">
        <div className="container">
          <SectionHeader label="SSS" title="SIK SORULAN SORULAR" align="center" />
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
              <SectionHeader label="İLETİŞİM" title="BİZE ULAŞIN" />
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <h4>Adres</h4>
                  <p>Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA</p>
                </div>
                <div className={styles.contactItem}>
                  <h4>E-posta</h4>
                  <p>hithlaingiyim@gmail.com</p>
                </div>
                <div className={styles.contactItem}>
                  <h4>Telefon</h4>
                  <p>0543 686 19 94</p>
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
          <SectionHeader label="INSTAGRAM" title="@HITHLAİNGİYİM" align="center" />
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
