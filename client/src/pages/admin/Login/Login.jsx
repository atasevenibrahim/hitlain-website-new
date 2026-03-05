import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminStore from '../../../stores/adminStore'
import styles from './Login.module.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdminStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const success = await login(email, password)
    if (success) {
      navigate('/admin')
    } else {
      setError('E-posta veya şifre hatalı.')
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.logo}>
          <img src="/hithlain-logo.png" alt="HITHLAIN" className={styles.logoImg} />
          <span className={styles.logoSub}>Admin Panel</span>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary btn-full">
          GİRİŞ YAP
        </button>
      </form>
    </div>
  )
}
