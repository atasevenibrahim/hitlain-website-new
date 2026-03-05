const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

// GET /api/references — public (active only)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query
    const where = all === 'true' ? {} : { isActive: true }
    const references = await prisma.reference.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    res.json(references)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// POST /api/references — admin
router.post('/', auth, async (req, res) => {
  try {
    const { clientName, sector, description, logoUrl, quantity, isActive } = req.body
    if (!clientName) return res.status(400).json({ error: 'Firma adı gerekli' })

    const reference = await prisma.reference.create({
      data: {
        clientName,
        sector,
        description,
        logoUrl,
        quantity: quantity ? Number(quantity) : null,
        isActive: isActive !== false,
      },
    })
    res.status(201).json(reference)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/references/:id — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const { clientName, sector, description, logoUrl, quantity, isActive } = req.body
    const data = {}
    if (clientName !== undefined) data.clientName = clientName
    if (sector !== undefined) data.sector = sector
    if (description !== undefined) data.description = description
    if (logoUrl !== undefined) data.logoUrl = logoUrl
    if (quantity !== undefined) data.quantity = quantity ? Number(quantity) : null
    if (isActive !== undefined) data.isActive = isActive

    const reference = await prisma.reference.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(reference)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// DELETE /api/references/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.reference.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
