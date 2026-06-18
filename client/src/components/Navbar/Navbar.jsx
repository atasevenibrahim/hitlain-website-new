import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../stores/cartStore'
import useSiteContent from '../../hooks/useSiteContent'
import { defaultCategories } from '../../data/mockData'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { openCart, items } = useCartStore()
  const { get, getJSON } = useSiteContent()
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const categories = getJSON('categories.list', defaultCategories)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className={styles.navbar}>
      {/* ─── Main Bar ─── */}
      <div className={styles.mainBar}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <img
            src={get('logoUrl', '/hithlain-logo.png') || '/hithlain-logo.png'}
            alt="Hithlain"
            className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className={styles.logoText}>HITHLAIN</span>
        </Link>

        {/* Search Pill — desktop */}
        <form className={styles.searchPill} onSubmit={handleSearch}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Ürün, kategori veya beden ara"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>Ara</button>
        </form>

        {/* Right Icons */}
        <div className={styles.icons}>
          {/* Favoriler */}
          <button className={styles.iconBtn} aria-label="Favoriler">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>

          {/* Sepet */}
          <button className={styles.iconBtn} onClick={openCart} aria-label="Sepet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </button>

          {/* Giriş yap */}
          <Link to="/my-orders" className={styles.loginBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            Giriş yap
          </Link>

          {/* TASARLA & BASTIR */}
          <Link to="/studio" className={styles.studioBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            TASARLA &amp; BASTIR
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ─── Category Nav — desktop ─── */}
      <nav className={styles.catNav}>
        <div className={styles.catRow}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className={styles.catBtn}
            >
              {cat.name.toUpperCase()}
              <svg className={styles.catChevron} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ─── */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <Link to="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
            <img
              src={get('logoUrl', '/hithlain-logo.png') || '/hithlain-logo.png'}
              alt="Hithlain"
              className={styles.logoImg}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className={styles.logoText}>HITHLAIN</span>
          </Link>
          <button className={styles.menuBtn} onClick={() => setMobileOpen(false)} aria-label="Kapat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className={styles.mobileSearch}>
          <form className={styles.searchPill} onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Ürün ara..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Ara</button>
          </form>
        </div>

        {/* Mobile Category Links */}
        <div className={styles.mobileLinks}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/studio" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Tasarla &amp; Bastır
          </Link>
          <Link to="/my-orders" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Siparişlerim
          </Link>
          <button
            className={styles.mobileLink}
            onClick={() => { openCart(); setMobileOpen(false) }}
          >
            Sepetim {totalItems > 0 && `(${totalItems})`}
          </button>
        </div>
      </div>
    </nav>
  )
}
