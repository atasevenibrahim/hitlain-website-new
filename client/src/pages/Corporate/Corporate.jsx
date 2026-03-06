import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import BannerSlider from '../../components/BannerSlider/BannerSlider'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { references } from '../../data/mockData'
import useSiteContent from '../../hooks/useSiteContent'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Corporate.module.css'

const defaultServices = [
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

const defaultWhyUs = [
  { title: 'Kaliteli Kumaş', desc: 'Sadece A sınıfı, sertifikalı kumaşlar kullanıyoruz.' },
  { title: 'Hızlı Üretim', desc: '500 adete kadar siparişleri 5 iş gününde teslim ediyoruz.' },
  { title: 'Profesyonel Baskı', desc: 'Serigrafi, dijital ve nakış, her teknikte uzman ekip.' },
  { title: 'Uygun Fiyat', desc: 'Aracısız, fabrikadan direkt toptan fiyat avantajı.' },
]

export default function Corporate() {
  const revealRef = useScrollReveal()
  const { get, getJSON } = useSiteContent()

  const services = getJSON('corporate.services', defaultServices)
  const whyUs = getJSON('whyus.items', defaultWhyUs)

  const stats = [
    { num: get('stats.1.num', '50K+'), label: get('stats.1.label', 'Üretilen Parça') },
    { num: get('stats.2.num', '200+'), label: get('stats.2.label', 'Kurumsal Müşteri') },
    { num: get('stats.3.num', '15+'), label: get('stats.3.label', 'Yıllık Deneyim') },
    { num: get('stats.4.num', '%98'), label: get('stats.4.label', 'Memnuniyet') },
  ]

  const handleWhatsApp = () => {
    const text = 'Merhaba, kurumsal sipariş hakkında bilgi almak istiyorum.'
    const whatsapp = get('whatsapp', '905436861994')
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <div ref={revealRef}>
      <Helmet>
        <title>Kurumsal Çözümler — {get('siteName', 'HITHLAIN Giyim')}</title>
        <meta name="description" content="Firmalarınız için toptan iş giyim, promosyon tekstili, baskı ve nakış hizmetleri." />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <BannerSlider banners={getJSON('corporate.hero.banners', [])} />
        {getJSON('corporate.hero.banners', []).filter(b => b.imageUrl).length > 0 && <div className={styles.heroOverlay} />}
        <div className="container">
          <div className={styles.heroContent}>
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>{get('corporate.hero.label', 'KURUMSAL ÇÖZÜMLER')}</span>
            <h1 className={styles.heroTitle}>
              {get('corporate.hero.title', 'İŞLETMENİZ İÇİN\nTEKSTİL ÇÖZÜMLERİ').split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            <p className={styles.heroText}>
              {get('corporate.hero.desc', 'Toptan iş giyim, promosyon tekstili, baskı ve nakış hizmetleri. 50 adet ve üzeri siparişlerde özel fiyat avantajı ile markanızı en iyi şekilde temsil edin.')}
            </p>
            <div className={styles.heroCta}>
              <button className="btn btn-primary btn-lg" onClick={handleWhatsApp}>{get('corporate.hero.cta1', 'TEKLİF AL')}</button>
              <Link to="/contact" className="btn btn-outline-white btn-lg">{get('corporate.hero.cta2', 'İLETİŞİME GEÇ')}</Link>
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
            {services.map((svc, i) => (
              <div key={i} className={styles.serviceCard}>
                <span className={styles.serviceNum}>{svc.num || String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.serviceTitle}>{svc.title}</h3>
                <p className={styles.serviceDesc}>{svc.desc}</p>
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
              <SectionHeader label={get('whyus.label', 'NEDEN BİZ')} title={get('whyus.title', 'FARKINIZ BİZİZ')} light />
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
              {stats.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statNum}>{stat.num}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
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
              <SectionHeader label={get('corporate.quote.label', 'TEKLİF')} title={get('corporate.quote.title', 'BİZE ULAŞIN')} />
              <p className={styles.contactText}>
                {get('corporate.quote.desc', 'Kurumsal siparişleriniz için teklif almak, numune talep etmek veya detaylı bilgi edinmek için formu doldurun ya da WhatsApp üzerinden bize ulaşın.')}
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
