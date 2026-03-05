import { create } from 'zustand'

const useStudioStore = create((set, get) => ({
  canvas: null,
  product: null,
  color: null,
  sizes: {},
  printArea: 'front',
  printZone: 'center',
  history: [],
  historyIndex: -1,
  designDataURL: null,

  setCanvas: (canvas) => set({ canvas }),
  setProduct: (product) => set({ product }),
  setColor: (color) => set({ color }),

  setSizeQty: (size, qty) => {
    set((state) => ({
      sizes: { ...state.sizes, [size]: Math.max(0, qty) },
    }))
  },

  setPrintArea: (printArea) => set({ printArea }),
  setPrintZone: (printZone) => set({ printZone }),

  saveHistory: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas) return
    const json = canvas.toJSON()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(json)
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  undo: async () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex <= 0) return
    const newIndex = historyIndex - 1
    await canvas.loadFromJSON(history[newIndex])
    canvas.renderAll()
    set({ historyIndex: newIndex })
  },

  redo: async () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    await canvas.loadFromJSON(history[newIndex])
    canvas.renderAll()
    set({ historyIndex: newIndex })
  },

  exportDesign: () => {
    const { canvas } = get()
    if (!canvas) return null
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 })
    set({ designDataURL: dataURL })
    return dataURL
  },

  resetStudio: () =>
    set({
      canvas: null,
      product: null,
      color: null,
      sizes: {},
      printArea: 'front',
      printZone: 'center',
      history: [],
      historyIndex: -1,
      designDataURL: null,
    }),
}))

export default useStudioStore
