const { Router } = require('express')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const auth = require('../middleware/auth')

const router = Router()

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Desteklenmeyen dosya formatı'), false)
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
      return res.status(400).json({ error: 'Dosya yüklenemedi' })
    }
    const result = await uploadToCloudinary(req.file.buffer)
    res.json({ url: result.secure_url })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Yükleme hatası' })
  }
})

// POST /api/upload/multiple — admin, multiple files
router.post('/multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: 'Dosya yüklenemedi' })
    }
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer))
    )
    const urls = uploads.map((r) => r.secure_url)
    res.json({ urls })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Yükleme hatası' })
  }
})

module.exports = router
