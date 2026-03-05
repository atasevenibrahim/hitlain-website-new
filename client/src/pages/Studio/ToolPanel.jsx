import { useState, useRef } from 'react'
import { IText, Rect, Circle, Triangle, FabricImage } from 'fabric'
import useStudioStore from '../../stores/studioStore'
import styles from './Studio.module.css'

const FONTS = [
  'Arial',
  'Barlow Condensed',
  'Barlow',
  'DM Sans',
  'Georgia',
  'Impact',
  'Courier New',
  'Verdana',
  'Times New Roman',
  'Comic Sans MS',
]

export default function ToolPanel() {
  const { canvas, printArea, printZone, setPrintArea, setPrintZone, saveHistory } = useStudioStore()

  // Text state
  const [text, setText] = useState('Yazınız')
  const [font, setFont] = useState('Barlow')
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState('#1a1a1a')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  // Shape state
  const [shapeColor, setShapeColor] = useState('#2d6a4f')
  const [shapeStroke, setShapeStroke] = useState('#1a1a1a')

  // Accordion
  const [openGroup, setOpenGroup] = useState('upload')
  const fileRef = useRef(null)

  const toggleGroup = (name) => {
    setOpenGroup(openGroup === name ? '' : name)
  }

  // Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      FabricImage.fromURL(evt.target.result).then((img) => {
        img.scaleToWidth(200)
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !canvas) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      FabricImage.fromURL(evt.target.result).then((img) => {
        img.scaleToWidth(200)
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  // Text
  const handleAddText = () => {
    if (!canvas) return
    const itext = new IText(text, {
      fontFamily: font,
      fontSize: fontSize,
      fill: textColor,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      underline: underline,
      left: 150,
      top: 250,
    })
    canvas.add(itext)
    canvas.setActiveObject(itext)
    canvas.renderAll()
  }

  // Shapes
  const addRect = () => {
    if (!canvas) return
    const rect = new Rect({
      width: 100,
      height: 80,
      fill: shapeColor,
      stroke: shapeStroke,
      strokeWidth: 1,
      left: 180,
      top: 250,
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const addCircle = () => {
    if (!canvas) return
    const circle = new Circle({
      radius: 50,
      fill: shapeColor,
      stroke: shapeStroke,
      strokeWidth: 1,
      left: 200,
      top: 250,
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }

  const addTriangle = () => {
    if (!canvas) return
    const tri = new Triangle({
      width: 100,
      height: 100,
      fill: shapeColor,
      stroke: shapeStroke,
      strokeWidth: 1,
      left: 200,
      top: 250,
    })
    canvas.add(tri)
    canvas.setActiveObject(tri)
    canvas.renderAll()
  }

  return (
    <div className={styles.toolPanel}>
      <h3 className={styles.panelTitle}>Araçlar</h3>

      {/* ① Tasarım Yükle */}
      <div className={styles.toolGroup}>
        <button className={styles.groupHeader} onClick={() => toggleGroup('upload')}>
          <span>① Tasarım Yükle</span>
          <span>{openGroup === 'upload' ? '−' : '+'}</span>
        </button>
        {openGroup === 'upload' && (
          <div className={styles.groupContent}>
            <div
              className={styles.dropZone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <span className={styles.dropIcon}>📁</span>
              <p>Sürükle bırak veya tıkla</p>
              <small>PNG, JPG, SVG (max 10MB)</small>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      {/* ② Yazı Ekle */}
      <div className={styles.toolGroup}>
        <button className={styles.groupHeader} onClick={() => toggleGroup('text')}>
          <span>② Yazı Ekle</span>
          <span>{openGroup === 'text' ? '−' : '+'}</span>
        </button>
        {openGroup === 'text' && (
          <div className={styles.groupContent}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.toolInput}
              placeholder="Yazınız..."
            />
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className={styles.toolInput}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <div className={styles.toolRow}>
              <label className={styles.toolLabel}>Boyut</label>
              <input
                type="range"
                min="10"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className={styles.toolSlider}
              />
              <span className={styles.toolValue}>{fontSize}</span>
            </div>
            <div className={styles.toolRow}>
              <label className={styles.toolLabel}>Renk</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className={styles.toolColor}
              />
            </div>
            <div className={styles.toolRow}>
              <button
                className={`${styles.styleBtn} ${bold ? styles.styleBtnActive : ''}`}
                onClick={() => setBold(!bold)}
              >
                <strong>B</strong>
              </button>
              <button
                className={`${styles.styleBtn} ${italic ? styles.styleBtnActive : ''}`}
                onClick={() => setItalic(!italic)}
              >
                <em>I</em>
              </button>
              <button
                className={`${styles.styleBtn} ${underline ? styles.styleBtnActive : ''}`}
                onClick={() => setUnderline(!underline)}
              >
                <u>U</u>
              </button>
            </div>
            <button className="btn btn-primary btn-sm btn-full" onClick={handleAddText}>
              YAZI EKLE
            </button>
          </div>
        )}
      </div>

      {/* ③ Şekil Ekle */}
      <div className={styles.toolGroup}>
        <button className={styles.groupHeader} onClick={() => toggleGroup('shape')}>
          <span>③ Şekil Ekle</span>
          <span>{openGroup === 'shape' ? '−' : '+'}</span>
        </button>
        {openGroup === 'shape' && (
          <div className={styles.groupContent}>
            <div className={styles.shapeButtons}>
              <button className={styles.shapeBtn} onClick={addRect} title="Kare">▢</button>
              <button className={styles.shapeBtn} onClick={addCircle} title="Daire">○</button>
              <button className={styles.shapeBtn} onClick={addTriangle} title="Üçgen">△</button>
            </div>
            <div className={styles.toolRow}>
              <label className={styles.toolLabel}>Dolgu</label>
              <input
                type="color"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                className={styles.toolColor}
              />
            </div>
            <div className={styles.toolRow}>
              <label className={styles.toolLabel}>Çizgi</label>
              <input
                type="color"
                value={shapeStroke}
                onChange={(e) => setShapeStroke(e.target.value)}
                className={styles.toolColor}
              />
            </div>
          </div>
        )}
      </div>

      {/* ④ Baskı Bölgesi */}
      <div className={styles.toolGroup}>
        <button className={styles.groupHeader} onClick={() => toggleGroup('print')}>
          <span>④ Baskı Bölgesi</span>
          <span>{openGroup === 'print' ? '−' : '+'}</span>
        </button>
        {openGroup === 'print' && (
          <div className={styles.groupContent}>
            <div className={styles.toolRow}>
              <button
                className={`${styles.toggleBtn} ${printArea === 'front' ? styles.toggleActive : ''}`}
                onClick={() => setPrintArea('front')}
              >
                ÖN
              </button>
              <button
                className={`${styles.toggleBtn} ${printArea === 'back' ? styles.toggleActive : ''}`}
                onClick={() => setPrintArea('back')}
              >
                ARKA
              </button>
            </div>
            <div className={styles.zoneGrid}>
              {[
                { id: 'sol-gogus', label: 'Sol Göğüs' },
                { id: 'sag-gogus', label: 'Sağ Göğüs' },
                { id: 'center', label: 'Orta' },
                { id: 'sirt', label: 'Sırt' },
              ].map((z) => (
                <button
                  key={z.id}
                  className={`${styles.zoneBtn} ${printZone === z.id ? styles.zoneActive : ''}`}
                  onClick={() => setPrintZone(z.id)}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
