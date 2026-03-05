const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

// GET /api/settings — public
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany()
    const obj = {}
    for (const s of settings) {
      try {
        obj[s.key] = JSON.parse(s.value)
      } catch {
        obj[s.key] = s.value
      }
    }
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/settings — admin
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body
    for (const [key, value] of Object.entries(updates)) {
      const strValue = typeof value === 'string' ? value : JSON.stringify(value)
      await prisma.setting.upsert({
        where: { key },
        update: { value: strValue },
        create: { key, value: strValue },
      })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
