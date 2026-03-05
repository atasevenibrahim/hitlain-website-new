const { Router } = require('express')
const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gerekli' })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: admin.id, email: admin.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
