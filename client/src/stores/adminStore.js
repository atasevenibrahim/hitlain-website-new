import { create } from 'zustand'
import api from '../utils/api'

const useAdminStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  token: localStorage.getItem('admin_token') || null,

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token })
      return true
    } catch {
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    set({ user: null, token: null })
  },

  isAuthenticated: () => !!get().token,
}))

export default useAdminStore
