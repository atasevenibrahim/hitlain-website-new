import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { references } from '../../data/mockData'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Corporate.module.css'

const services = [
  {
    num: '01',
    title: 'Baskı & Nakış',
    desc: 'Serigrafi, dijital baskı, transfer baskı ve nakış seçenekleriyle logonuzu, tasarımınızı ürünlere uyguluyoruz. Yüksek kaliteli baskı teknolojileri ile dayanıklı ve canlı sonuçlar.',
  },
  {
    num: '02',
    title: 'Toptan Dikim',
    desc: 'İstediğiniz model, kumaş ve renkte toptan üretim. Minimum 50 adet sipariş ile özel fiyat avantajı. Tişört, sweatshirt, mont, pantolon, önlük ve ikaz yeleği.',
  },
  {
    num: '03',
    title: 'Promosyon Tekstili',
    desc: 'Etkinlikler, fuarlar ve kampanyalar için promosyon ürünleri. Özel tasarım, hızlı üretim ve uygun fiyat garantisi.',
  },
]

const stats = [
  { num: '50K+', label: 'Üretilen Parça' },
  { num: '200+', label: 'Kurumsal Müşteri' },
  { num: '15+', label: 'Yıllık Deneyim' },
  { num: '%98', label: 'Memnuniyet' },
]

const whyUs = [
  { title: 'Kaliteli Kumaş', desc: 'Sadece A sınıfı, sertifikalı kumaşlar kullanıyoruz.' },
  { title: 'Hızlı Üretim', desc: '500 adete kadar siparişleri 5 iş gününde teslim ediyoruz.' },
  { title: 'Profesyonel Baskı', desc: 'Serigrafi, dijital ve nakış, her teknikte uzman ekip.' },
  { title: 'Uygun Fiyat', desc: 'Aracısız, fabrikadan direkt toptan fiyat avantajı.' },
]

export default function Corporate() {
  const revealRef = useScrollReveal()

  const handleWhatsApp = () => {
    const text = 'Merhaba, kurumsal sipariş hakkında bilgi almak istiyorum.'
    window.open(
      `https://wa.me/905436861994?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <div ref={revealRef}>
      <Helmet>
        <title>Kurumsal Çözümler — HITHLAIN Giyim</title>
        <meta name="description" content="Firmalarınız için toptan iş giyim, promosyon tekstili, baskı ve nakış hizmetleri." />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>KURUMSAL ÇÖZÜMLER</span>
            <h1 className={styles.heroTitle}>
              İŞLETMENİZ İÇİN<br />TEKSTİL ÇÖZÜMLERİ
            </h1>
            <p className={styles.heroText}>
              Toptan iş giyim, promosyon tekstili, baskı ve nakış hizmetleri. 50 adet ve üzeri
              siparişlerde özel fiyat avantajı ile markanızı en iyi şekilde temsil edin.
            </p>
            <div className={styles.heroCta}>
              <button className="btn btn-primary btn-lg" onClick={handleWhatsApp}>TEKLİF AL</button>
              <Link to="/contact" className="btn btn-outline-white btn-lg">İLETİŞİME GEÇ</Link>
            </div>
          </div>
        </div>
        <div className={styles.heroGhost}>KURUMSAL</div>
      </section>

      {/* ═══ HİZMETLER ═══ */}
      <section className="section">
        <div className="container">
          <SectionHeader label="HİZMETLER" title="NE SUNUYORUZ?" align="center" />
          <div className={`${styles.servicesGrid} reveal`}>
            {services.map((s) => (
              <div key={s.num} className={styles.serviceCard}>
                <span className={styles.serviceNum}>{s.num}</span>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEDEN BİZ ═══ */}
      <section className="section section-dark">
        <div className="container">
          <div className={styles.whyGrid}>
            <div className="reveal">
              <SectionHeader label="NEDEN BİZ" title="FARKINIZ BİZİZ" light />
              <div className={styles.whyList}>
                {whyUs.map((item, i) => (
                  <div key={i} className={styles.whyItem}>
                    <strong>{item.title}</strong>
                    <span> — {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.statsGrid} reveal rd2`}>
              {stats.map((s, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REFERANSLAR ═══ */}
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

      {/* ═══ TEKLİF FORMU ═══ */}
      <section className="section section-off">
        <div className="container">
          <div className={styles.contactGrid}>
            <div className="reveal">
              <SectionHeader label="TEKLİF" title="BİZE ULAŞIN" />
              <p className={styles.contactText}>
                Kurumsal siparişleriniz için teklif almak, numune talep etmek veya detaylı bilgi
                edinmek için formu doldurun ya da WhatsApp üzerinden bize ulaşın.
              </p>
              <button className="btn btn-wa" onClick={handleWhatsApp} style={{ marginTop: '1.5rem' }}>
                WHATSAPP İLE İLETİŞİM
              </button>
            </div>
            <form className={`${styles.contactForm} reveal rd2`} onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Firma Adı" required />
              <input type="text" placeholder="Yetkili Ad Soyad" required />
              <input type="email" placeholder="E-posta" required />
              <input type="tel" placeholder="Telefon" required />
              <textarea placeholder="Sipariş detayları (ürün, adet, baskı tercihi vb.)" rows={4} required />
              <button type="submit" className="btn btn-primary">TEKLİF İSTE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
