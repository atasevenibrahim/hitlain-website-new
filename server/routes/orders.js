const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

// POST /api/orders — public (create order)
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, district, total, shippingFee, note, items } = req.body

    if (!customerName || !email || !phone || !address || !city || !district || !items?.length) {
      return res.status(400).json({ error: 'Eksik bilgi' })
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        city,
        district,
        total: Number(total),
        shippingFee: Number(shippingFee) || 0,
        note,
        items: {
          create: items.map((item) => ({
            productId: Number(item.productId),
            size: item.size,
            color: item.color,
            quantity: Number(item.quantity),
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

// GET /api/orders — admin
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query
    const where = status && status !== 'all' ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// GET /api/orders/:id — admin
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: { include: { product: true } } },
    })
    if (!order) return res.status(404).json({ error: 'Sipariş bulunamadı' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/orders/:id/status — admin
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
