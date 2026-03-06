import { Helmet } from 'react-helmet-async'
import useSiteContent from '../../hooks/useSiteContent'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function About() {
  const revealRef = useScrollReveal()
  const { get } = useSiteContent()

  return (
    <div className="container" style={{ padding: '4rem 2rem', minHeight: '60vh' }} ref={revealRef}>
      <Helmet>
        <title>Hakkımızda — {get('siteName', 'HITHLAIN Giyim')}</title>
        <meta name="description" content="Hithlain Giyim, Antalya merkezli kurumsal tekstil ve iş giyim markası." />
      </Helmet>
      <div className="reveal">
        <span className="section-label">{get('about.subtitle', 'HAKKIMIZDA')}</span>
        <h1>{get('about.title', 'İki Kardeşin Hikayesi')}</h1>
        <p style={{ color: 'var(--mid)', marginTop: '1rem', maxWidth: '600px', lineHeight: '1.7' }}>
          {get('about.text', 'Hithlain Giyim, Antalya merkezli olarak kurumsal tekstil ve iş giyim alanında hizmet vermektedir. Kaliteli kumaş, özenli işçilik ve müşteri memnuniyeti odaklı yaklaşımımızla sektörde güvenilir bir marka haline geldik.')}
        </p>
      </div>
    </div>
  )
}
