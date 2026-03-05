import { useRef, useEffect, useState } from 'react'
import { Canvas as FabricCanvas } from 'fabric'
import useStudioStore from '../../stores/studioStore'
import styles from './Studio.module.css'

export default function StudioCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const { canvas, setCanvas, saveHistory, undo, redo, printArea, color } = useStudioStore()
  const [selectedObj, setSelectedObj] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const fc = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: 'transparent',
      selection: true,
    })

    setCanvas(fc)
    saveHistory()

    fc.on('object:modified', () => saveHistory())
    fc.on('object:added', () => saveHistory())
    fc.on('selection:created', (e) => setSelectedObj(e.selected?.[0] || null))
    fc.on('selection:updated', (e) => setSelectedObj(e.selected?.[0] || null))
    fc.on('selection:cleared', () => setSelectedObj(null))

    return () => {
      fc.dispose()
    }
  }, [])

  const handleCopy = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    active.clone().then((cloned) => {
      cloned.set({ left: cloned.left + 20, top: cloned.top + 20 })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }

  const handleDelete = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    canvas.remove(active)
    canvas.renderAll()
    saveHistory()
  }

  const handleBringForward = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    canvas.bringObjectForward(active)
    canvas.renderAll()
  }

  const handleSendBackward = () => {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    canvas.sendObjectBackwards(active)
    canvas.renderAll()
  }

  const mockupBg = color || '#e0e0e0'

  return (
    <div className={styles.canvasArea} ref={containerRef}>
      {/* Toolbar */}
      <div className={styles.canvasToolbar}>
        <button onClick={undo} title="Geri Al" className={styles.toolbarBtn}>↩</button>
        <button onClick={redo} title="İleri Al" className={styles.toolbarBtn}>↪</button>
        <div className={styles.toolbarDivider} />
        <button onClick={handleCopy} title="Kopyala" className={styles.toolbarBtn}>⧉</button>
        <button onClick={handleDelete} title="Sil" className={styles.toolbarBtn}>🗑</button>
        <div className={styles.toolbarDivider} />
        <button onClick={handleBringForward} title="Öne Getir" className={styles.toolbarBtn}>⇅↑</button>
        <button onClick={handleSendBackward} title="Arkaya Gönder" className={styles.toolbarBtn}>⇅↓</button>
      </div>

      {/* Canvas Wrapper */}
      <div className={styles.canvasWrapper}>
        {/* Mockup Background */}
        <div className={styles.mockupBg} style={{ backgroundColor: mockupBg }}>
          <span className={styles.mockupIcon}>👕</span>
          <span className={styles.mockupLabel}>{printArea === 'front' ? 'ÖN' : 'ARKA'}</span>
        </div>

        {/* Fabric Canvas */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}
