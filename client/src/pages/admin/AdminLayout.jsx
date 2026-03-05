import { Outlet, NavLink, Link, Navigate } from 'react-router-dom'
import useAdminStore from '../../stores/adminStore'
import styles from './AdminLayout.module.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Ürünler', icon: '👕' },
  { to: '/admin/stock', label: 'Stok Takibi', icon: '📦' },
  { to: '/admin/orders', label: 'Siparişler', icon: '📋' },
  { to: '/admin/studio-orders', label: 'Stüdyo Siparişleri', icon: '🎨' },
  { to: '/admin/references', label: 'Referanslar', icon: '🏢' },
  { to: '/admin/settings', label: 'Site Ayarları', icon: '⚙️' },
]

export default function AdminLayout() {
  const { token, logout } = useAdminStore()

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/admin" className={styles.logo}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logoImg} />
          <span className={styles.logoSub}>Admin</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link to="/home" className={styles.navItem}>
            ← Siteye Dön
          </Link>
          <button className={styles.logoutBtn} onClick={logout}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
