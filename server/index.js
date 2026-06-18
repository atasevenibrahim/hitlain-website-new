require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Security headers
app.use(helmet())

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('CORS politikasi: bu kaynaga izin verilmiyor'))
  },
  credentials: true,
}))

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Static uploads (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Cok fazla istek, lutfen daha sonra tekrar deneyin' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Cok fazla giris denemesi, 15 dakika sonra tekrar deneyin' },
})

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Cok fazla odeme istegi' },
})

// Apply general rate limit to all API routes
app.use('/api/', generalLimiter)

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/variants', require('./routes/variants'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/studio-orders', require('./routes/studioOrders'))
app.use('/api/studio-templates', require('./routes/studioTemplates'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/payment', paymentLimiter, require('./routes/payment'))
app.use('/api/instagram', require('./routes/instagram'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('/api/*splat', (req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadi' })
})

// Error handler — never expose stack trace
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || 500
  res.status(status).json({ error: status === 500 ? 'Sunucu hatasi' : err.message })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HITHLAIN API running on http://localhost:${PORT}`)
  })
}

module.exports = app
