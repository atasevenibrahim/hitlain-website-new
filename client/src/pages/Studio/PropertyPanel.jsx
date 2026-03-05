import { useState, useEffect } from 'react'
import useStudioStore from '../../stores/studioStore'
import styles from './Studio.module.css'

export default function PropertyPanel() {
  const { canvas } = useStudioStore()
  const [obj, setObj] = useState(null)
  const [props, setProps] = useState({ left: 0, top: 0, width: 0, height: 0, angle: 0, opacity: 100 })

  useEffect(() => {
    if (!canvas) return

    const updateSelection = () => {
      const active = canvas.getActiveObject()
      setObj(active || null)
      if (active) {
        setProps({
          left: Math.round(active.left || 0),
          top: Math.round(active.top || 0),
          width: Math.round((active.width || 0) * (active.scaleX || 1)),
          height: Math.round((active.height || 0) * (active.scaleY || 1)),
          angle: Math.round(active.angle || 0),
          opacity: Math.round((active.opacity || 1) * 100),
        })
      }
    }

    canvas.on('selection:created', updateSelection)
    canvas.on('selection:updated', updateSelection)
    canvas.on('selection:cleared', () => { setObj(null) })
    canvas.on('object:modified', updateSelection)
    canvas.on('object:scaling', updateSelection)
    canvas.on('object:moving', updateSelection)
    canvas.on('object:rotating', updateSelection)

    return () => {
      canvas.off('selection:created', updateSelection)
      canvas.off('selection:updated', updateSelection)
      canvas.off('selection:cleared')
      canvas.off('object:modified', updateSelection)
      canvas.off('object:scaling', updateSelection)
      canvas.off('object:moving', updateSelection)
      canvas.off('object:rotating', updateSelection)
    }
  }, [canvas])

  const updateProp = (key, value) => {
    if (!obj || !canvas) return
    const num = Number(value)
    if (isNaN(num)) return

    setProps((p) => ({ ...p, [key]: num }))

    switch (key) {
      case 'left':
        obj.set('left', num)
        break
      case 'top':
        obj.set('top', num)
        break
      case 'width':
        obj.set('scaleX', num / (obj.width || 1))
        break
      case 'height':
        obj.set('scaleY', num / (obj.height || 1))
        break
      case 'angle':
        obj.set('angle', num)
        break
      case 'opacity':
        obj.set('opacity', num / 100)
        break
    }
    canvas.renderAll()
  }

  if (!obj) {
    return (
      <div className={styles.propPanel}>
        <h3 className={styles.panelTitle}>Özellikler</h3>
        <div className={styles.propEmpty}>
          <p>Düzenlemek için canvas üzerinde bir nesne seçin</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.propPanel}>
      <h3 className={styles.panelTitle}>Özellikler</h3>

      {/* Position */}
      <div className={styles.propGroup}>
        <h4 className={styles.propLabel}>Pozisyon</h4>
        <div className={styles.propRow}>
          <label>X</label>
          <input
            type="number"
            value={props.left}
            onChange={(e) => updateProp('left', e.target.value)}
            className={styles.propInput}
          />
          <label>Y</label>
          <input
            type="number"
            value={props.top}
            onChange={(e) => updateProp('top', e.target.value)}
            className={styles.propInput}
          />
        </div>
      </div>

      {/* Size */}
      <div className={styles.propGroup}>
        <h4 className={styles.propLabel}>Boyut</h4>
        <div className={styles.propRow}>
          <label>G</label>
          <input
            type="number"
            value={props.width}
            onChange={(e) => updateProp('width', e.target.value)}
            className={styles.propInput}
          />
          <label>Y</label>
          <input
            type="number"
            value={props.height}
            onChange={(e) => updateProp('height', e.target.value)}
            className={styles.propInput}
          />
        </div>
      </div>

      {/* Rotation */}
      <div className={styles.propGroup}>
        <h4 className={styles.propLabel}>Döndür</h4>
        <div className={styles.propRow}>
          <input
            type="range"
            min="0"
            max="360"
            value={props.angle}
            onChange={(e) => updateProp('angle', e.target.value)}
            className={styles.propSlider}
          />
          <span className={styles.propValue}>{props.angle}°</span>
        </div>
      </div>

      {/* Opacity */}
      <div className={styles.propGroup}>
        <h4 className={styles.propLabel}>Opaklık</h4>
        <div className={styles.propRow}>
          <input
            type="range"
            min="0"
            max="100"
            value={props.opacity}
            onChange={(e) => updateProp('opacity', e.target.value)}
            className={styles.propSlider}
          />
          <span className={styles.propValue}>{props.opacity}%</span>
        </div>
      </div>

      {/* Text-specific */}
      {obj.type === 'i-text' && (
        <div className={styles.propGroup}>
          <h4 className={styles.propLabel}>Yazı</h4>
          <div className={styles.propRow}>
            <label>Renk</label>
            <input
              type="color"
              value={obj.fill || '#000000'}
              onChange={(e) => {
                obj.set('fill', e.target.value)
                canvas.renderAll()
              }}
              className={styles.toolColor}
            />
          </div>
        </div>
      )}

      {/* Shape-specific */}
      {(obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') && (
        <div className={styles.propGroup}>
          <h4 className={styles.propLabel}>Şekil</h4>
          <div className={styles.propRow}>
            <label>Dolgu</label>
            <input
              type="color"
              value={obj.fill || '#000000'}
              onChange={(e) => {
                obj.set('fill', e.target.value)
                canvas.renderAll()
              }}
              className={styles.toolColor}
            />
          </div>
          <div className={styles.propRow}>
            <label>Çizgi</label>
            <input
              type="color"
              value={obj.stroke || '#000000'}
              onChange={(e) => {
                obj.set('stroke', e.target.value)
                canvas.renderAll()
              }}
              className={styles.toolColor}
            />
          </div>
        </div>
      )}
    </div>
  )
}
