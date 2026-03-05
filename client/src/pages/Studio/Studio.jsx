import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useStudioStore from '../../stores/studioStore'
import StudioCanvas from './StudioCanvas'
import ToolPanel from './ToolPanel'
import PropertyPanel from './PropertyPanel'
import BottomPanel from './BottomPanel'
import styles from './Studio.module.css'

export default function Studio() {
  const resetStudio = useStudioStore((s) => s.resetStudio)

  useEffect(() => {
    return () => resetStudio()
  }, [])

  return (
    <div className={styles.studio}>
      <Helmet>
        <title>Tasarım Stüdyosu — HITHLAIN Giyim</title>
        <meta name="description" content="HITHLAIN Tasarım Stüdyosu ile kendi giyim tasarımınızı oluşturun." />
      </Helmet>
      {/* Studio Navbar */}
      <div className={styles.studioNav}>
        <Link to="/home" className={styles.studioLogo}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logoImg} />
          <span className={styles.logoSub}>Stüdyo</span>
        </Link>
        <div className={styles.studioSteps}>
          <span className={styles.step}>1. Tasarla</span>
          <span className={styles.stepDivider}>→</span>
          <span className={styles.step}>2. Ürün Seç</span>
          <span className={styles.stepDivider}>→</span>
          <span className={styles.step}>3. Sepete Ekle</span>
        </div>
        <Link to="/home" className={styles.studioBack}>← Siteye Dön</Link>
      </div>

      {/* Main Layout */}
      <div className={styles.studioBody}>
        <ToolPanel />
        <StudioCanvas />
        <PropertyPanel />
      </div>

      {/* Bottom Panel */}
      <BottomPanel />
    </div>
  )
}
