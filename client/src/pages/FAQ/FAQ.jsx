import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { faqItems } from '../../data/mockData'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './FAQ.module.css'

export default function FAQ() {
  const revealRef = useScrollReveal()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className={styles.page} ref={revealRef}>
      <Helmet>
        <title>Sıkça Sorulan Sorular — HITHLAIN Giyim</title>
        <meta name="description" content="HITHLAIN Giyim hakkında sıkça sorulan sorular ve cevapları." />
      </Helmet>
      <div className="container">
        <span className="section-label">SSS</span>
        <h1>Sıkça Sorulan Sorular</h1>
        <div className={styles.list}>
          {faqItems.map((item, i) => (
            <div key={i} className={styles.item}>
              <button
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.question}</span>
                <span className={styles.arrow}>{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
