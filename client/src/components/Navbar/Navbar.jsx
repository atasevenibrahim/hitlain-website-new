import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useCartStore from '../../stores/cartStore'
import styles from './Navbar.module.css'

const navLinks = [
  { to: '/shop/tisort', label: 'TİŞÖRT' },
  { to: '/shop/sweatshirt', label: 'SWEATSHIRT' },
  { to: '/shop/mont-ceket', label: 'MONT VE CEKET' },
  { to: '/shop/pantolon', label: 'PANTOLON' },
  { to: '/shop/onluk', label: 'ÖNLÜK' },
  { to: '/shop/ikaz-yelegi', label: 'İKAZ YELEĞİ' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { openCart, items } = useCartStore()
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logoImg} />
        </Link>

        {/* Desktop Nav Links */}
        <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${
                location.pathname === link.to ? styles.active : ''
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className={styles.icons}>
          {/* Search */}
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Ara"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Studio */}
          <Link to="/studio" className={styles.iconBtn} aria-label="Tasarım Stüdyosu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>

          {/* Cart */}
          <button className={styles.iconBtn} onClick={openCart} aria-label="Sepet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </button>

          {/* Account */}
          <Link to="/admin" className={styles.iconBtn} aria-label="Hesap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            <span className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className={styles.searchBar}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Ürün ara..."
              className={styles.searchInput}
              autoFocus
            />
            <button
              className={styles.searchClose}
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
