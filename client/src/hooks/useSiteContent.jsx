import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const SiteContentContext = createContext({})

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        setContent(res.data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const get = (key, fallback = '') => {
    if (key in content) return content[key]
    return fallback
  }

  const getJSON = (key, fallback = []) => {
    const val = content[key]
    if (val === undefined || val === null) return fallback
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return fallback }
    }
    return val
  }

  const refresh = () => {
    api.get('/settings')
      .then((res) => setContent(res.data))
      .catch(() => {})
  }

  return (
    <SiteContentContext.Provider value={{ content, get, getJSON, loaded, refresh }}>
      {loaded ? children : null}
    </SiteContentContext.Provider>
  )
}

export default function useSiteContent() {
  return useContext(SiteContentContext)
}
