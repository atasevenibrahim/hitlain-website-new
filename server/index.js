require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/variants', require('./routes/variants'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/studio-orders', require('./routes/studioOrders'))
app.use('/api/references', require('./routes/references'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/settings', require('./routes/settings'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Sunucu hatası' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HITHLAIN API running on http://localhost:${PORT}`)
  })
}

module.exports = app
