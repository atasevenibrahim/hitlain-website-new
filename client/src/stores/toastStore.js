import { create } from 'zustand'

const useToastStore = create((set) => ({
  message: '',
  type: 'default',
  visible: false,

  showToast: (message, type = 'default') => {
    set({ message, type, visible: true })
    setTimeout(() => {
      set({ visible: false })
    }, 2600)
  },

  hideToast: () => set({ visible: false }),
}))

export default useToastStore
