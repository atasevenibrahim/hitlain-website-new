import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.icon}>!</div>
            <h2 className={styles.title}>Bir Hata Oluştu</h2>
            <p className={styles.text}>
              Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            <button className="btn btn-primary" onClick={this.handleRetry}>
              YENİDEN DENE
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
