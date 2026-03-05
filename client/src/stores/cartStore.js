import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, size, color, qty = 1, isStudio = false, designUrl = null) => {
    const key = isStudio
      ? `studio-${product.id}-${color}-${Date.now()}`
      : `${product.id}-${size}-${color}`

    set((state) => {
      const existing = state.items.find((item) => item.key === key)
      if (existing && !isStudio) {
        return {
          items: state.items.map((item) =>
            item.key === key ? { ...item, qty: item.qty + qty } : item
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { key, product, size, color, qty, isStudio, designUrl },
        ],
      }
    })
  },

  removeItem: (key) => {
    set((state) => ({
      items: state.items.filter((item) => item.key !== key),
    }))
  },

  updateQty: (key, qty) => {
    if (qty < 1) return
    set((state) => ({
      items: state.items.map((item) =>
        item.key === key ? { ...item, qty } : item
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

}))

export default useCartStore
