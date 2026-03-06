const { Router } = require('express')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

function turkishSlug(str) {
  return str
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/products — public, with filters
router.get('/', async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 20, search } = req.query
    const where = {}

    if (category) where.category = category
    if (search) where.name = { contains: search, mode: 'insensitive' }

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    else if (sort === 'price-desc') orderBy = { price: 'desc' }
    else if (sort === 'newest') orderBy = { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { variants: true },
      }),
      prisma.product.count({ where }),
    ])

    // Parse images JSON string
    const parsed = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      colors: [...new Map(p.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()],
      sizes: [...new Set(p.variants.map((v) => v.size))],
      stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    }))

    res.json({ products: parsed, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { variants: true },
    })
    if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' })

    res.json({
      ...product,
      images: JSON.parse(product.images),
      colors: [...new Map(product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()],
      sizes: [...new Set(product.variants.map((v) => v.size))],
      stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
    })
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// POST /api/products — admin
router.post('/', auth, async (req, res) => {
  try {
    const { name, slug, category, price, description, fabric, care, images, colors, sizes, isFeatured, isNew, status } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || turkishSlug(name),
        category,
        price: Number(price),
        description,
        fabric,
        care,
        images: JSON.stringify(images || []),
        isFeatured: !!isFeatured,
        isNew: !!isNew,
        status: status || 'active',
      },
    })

    // Create variants
    if (colors && sizes) {
      const variantData = []
      for (const color of colors) {
        for (const size of sizes) {
          variantData.push({
            productId: product.id,
            size,
            color: color.name,
            colorHex: color.hex,
            stock: 0,
            minStock: 5,
          })
        }
      }
      await prisma.variant.createMany({ data: variantData })
    }

    const created = await prisma.product.findUnique({
      where: { id: product.id },
      include: { variants: true },
    })
    res.status(201).json(created)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Bu slug zaten kullanılıyor' })
    }
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// PUT /api/products/:id — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, price, description, fabric, care, images, isFeatured, isNew, status } = req.body

    const data = {}
    if (name !== undefined) data.name = name
    if (category !== undefined) data.category = category
    if (price !== undefined) data.price = Number(price)
    if (description !== undefined) data.description = description
    if (fabric !== undefined) data.fabric = fabric
    if (care !== undefined) data.care = care
    if (images !== undefined) data.images = JSON.stringify(images)
    if (isFeatured !== undefined) data.isFeatured = isFeatured
    if (isNew !== undefined) data.isNew = isNew
    if (status !== undefined) data.status = status

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
      include: { variants: true },
    })

    // Update variants if colors and sizes are provided
    const { colors, sizes } = req.body
    if (colors && sizes) {
      await prisma.variant.deleteMany({ where: { productId: Number(req.params.id) } })
      const variantData = []
      for (const color of colors) {
        for (const size of sizes) {
          variantData.push({
            productId: Number(req.params.id),
            size,
            color: color.name,
            colorHex: color.hex,
            stock: 0,
            minStock: 5,
          })
        }
      }
      await prisma.variant.createMany({ data: variantData })

      const updated = await prisma.product.findUnique({
        where: { id: Number(req.params.id) },
        include: { variants: true },
      })
      return res.json(updated)
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// DELETE /api/products/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

module.exports = router
