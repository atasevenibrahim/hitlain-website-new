const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')

const router = Router()

const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

let cloudinary
if (useCloudinary) {
  cloudinary = require('cloudinary').v2
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: uploadsDir,
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
          .replace(/[^a-zA-Z0-9-_]/g, '')
          .substring(0, 40)
        cb(null, `${Date.now()}-${name}${ext}`)
      },
    })

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Desteklenmeyen dosya formati'), false)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

function uploadToCloudinary(buffer, folder = 'hithlain') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

// POST /api/upload — admin, single file
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yuklenemedi' })
    }
    if (useCloudinary) {
      const result = await uploadToCloudinary(req.file.buffer)
      return res.json({ url: result.secure_url })
    }
    res.json({ url: `/uploads/${req.file.filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Yukleme hatasi' })
  }
})

// POST /api/upload/multiple — admin, multiple files (max 10)
router.post('/multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: 'Dosya yuklenemedi' })
    }
    if (useCloudinary) {
      const uploads = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer))
      )
      return res.json({ urls: uploads.map((r) => r.secure_url) })
    }
    res.json({ urls: req.files.map((f) => `/uploads/${f.filename}`) })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Yukleme hatasi' })
  }
})

module.exports = router
