const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

// POST /api/studio-orders — public
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, designUrl, printArea, printZone, items } = req.body

    if (!customerName || !email || !phone || !designUrl || !items?.length) {
      return res.status(400).json({ error: 'Eksik bilgi' })
    }

    const order = await prisma.studioOrder.create({
      data: {
        customerName,
        email,
        phone,
        designUrl,
        printArea,
        printZone,
        items: {
          create: items.map((item) => ({
            productId: Number(item.productId),
            color: item.color,
            sizes: JSON.stringify(item.sizes),
            price: Number(item.price),
          })),
        },
      },
      include: { items: true },
    })

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// GET /api/studio-orders — admin
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.studioOrder.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Parse sizes JSON
    const parsed = orders.map((o) => ({
      ...o,
      items: o.items.map((item) => ({
        ...item,
        sizes: JSON.parse(item.sizes),
      })),
    }))

    res.json(parsed)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/studio-orders/:id/status — admin
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await prisma.studioOrder.update({
      where: { id: Number(req.params.id) },
      data: { status },
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
