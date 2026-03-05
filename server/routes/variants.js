const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

// GET /api/variants/product/:id
router.get('/product/:id', async (req, res) => {
  try {
    const variants = await prisma.variant.findMany({
      where: { productId: Number(req.params.id) },
      orderBy: [{ color: 'asc' }, { size: 'asc' }],
    })
    res.json(variants)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/variants/:id/stock — admin
router.put('/:id/stock', auth, async (req, res) => {
  try {
    const { stock } = req.body
    const variant = await prisma.variant.update({
      where: { id: Number(req.params.id) },
      data: { stock: Math.max(0, Number(stock) || 0) },
    })
    res.json(variant)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
