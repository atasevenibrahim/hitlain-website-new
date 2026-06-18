const { Router } = require('express')
const { body, param, validationResult } = require('express-validator')
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth')

const router = Router()

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg })
  }
  next()
}

// GET /api/studio-templates — public
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.studioTemplate.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    res.json(templates)
  } catch {
    res.status(500).json({ error: 'Sunucu hatasi' })
  }
})

// GET /api/studio-templates/all — admin (includes inactive)
router.get('/all', auth, async (req, res) => {
  try {
    const templates = await prisma.studioTemplate.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    res.json(templates)
  } catch {
    res.status(500).json({ error: 'Sunucu hatasi' })
  }
})

// POST /api/studio-templates — admin
router.post(
  '/',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Sablon adi gerekli').isLength({ max: 100 }).withMessage('Sablon adi 100 karakterden uzun olamaz'),
    body('category').trim().notEmpty().withMessage('Kategori gerekli').isLength({ max: 50 }),
    body('canvasJson').notEmpty().withMessage('Canvas verisi gerekli'),
    body('previewUrl').optional().isURL().withMessage('Gecersiz onizleme URL'),
    body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sira gecersiz'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, category, canvasJson, previewUrl, sortOrder, isActive } = req.body
      const template = await prisma.studioTemplate.create({
        data: {
          name,
          category,
          canvasJson,
          previewUrl: previewUrl || '',
          sortOrder: Number(sortOrder) || 0,
          isActive: isActive !== false,
        },
      })
      res.status(201).json(template)
    } catch {
      res.status(500).json({ error: 'Sunucu hatasi' })
    }
  }
)

// PUT /api/studio-templates/:id — admin
router.put(
  '/:id',
  auth,
  [
    param('id').isInt().withMessage('Gecersiz ID'),
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('category').optional().trim().notEmpty().isLength({ max: 50 }),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, category, canvasJson, previewUrl, sortOrder, isActive } = req.body
      const template = await prisma.studioTemplate.update({
        where: { id: Number(req.params.id) },
        data: {
          ...(name !== undefined && { name }),
          ...(category !== undefined && { category }),
          ...(canvasJson !== undefined && { canvasJson }),
          ...(previewUrl !== undefined && { previewUrl }),
          ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
          ...(isActive !== undefined && { isActive }),
        },
      })
      res.json(template)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Sablon bulunamadi' })
      res.status(500).json({ error: 'Sunucu hatasi' })
    }
  }
)

// DELETE /api/studio-templates/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.studioTemplate.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Sablon bulunamadi' })
    res.status(500).json({ error: 'Sunucu hatasi' })
  }
})

module.exports = router
