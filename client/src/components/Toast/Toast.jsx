import useToastStore from '../../stores/toastStore'
import styles from './Toast.module.css'

export default function Toast() {
  const { message, type, visible } = useToastStore()

  if (!visible) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  )
}
