const express = require('express')
const { Router } = express
const https = require('https')
const crypto = require('crypto')
const qs = require('querystring')
const prisma = require('../lib/prisma')

const router = Router()

const {
  PAYTR_MERCHANT_ID,
  PAYTR_MERCHANT_KEY,
  PAYTR_MERCHANT_SALT,
} = process.env

// POST /api/payment/init — initialize PayTR iFrame token
router.post('/init', async (req, res) => {
  try {
    if (!PAYTR_MERCHANT_ID || !PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
      return res.status(503).json({ error: 'Odeme sistemi henuz yapilandirilmamis' })
    }

    const { orderId } = req.body
    if (!orderId) {
      return res.status(400).json({ error: 'Siparis ID gerekli' })
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      return res.status(404).json({ error: 'Siparis bulunamadi' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Bu siparis zaten odendi' })
    }

    const userIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1'

    // Build basket: [[name, price_in_kurus, quantity], ...]
    const basket = order.items.map((item) => [
      item.product.name.substring(0, 100),
      String(Math.round(item.price * item.quantity * 100)),
      String(item.quantity),
    ])
    const userBasket = Buffer.from(JSON.stringify(basket)).toString('base64')

    const merchantOid = `hithlain-${order.id}-${Date.now()}`
    const paymentAmountKurus = String(Math.round(order.total * 100))
    const currency = 'TL'
    const testMode = process.env.NODE_ENV !== 'production' ? '1' : '0'
    const noInstallment = '0'
    const maxInstallment = '0'
    const lang = 'tr'

    // HMAC-SHA256 token
    const hashStr = `${PAYTR_MERCHANT_ID}${userIp}${merchantOid}${order.email}${paymentAmountKurus}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`
    const paytrToken = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT)
      .update(hashStr)
      .digest('base64')

    const postData = qs.stringify({
      merchant_id: PAYTR_MERCHANT_ID,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: order.email,
      payment_amount: paymentAmountKurus,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: testMode === '1' ? 1 : 0,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: order.customerName,
      user_address: `${order.address}, ${order.district}, ${order.city}`,
      user_phone: order.phone,
      merchant_ok_url: `${process.env.FRONTEND_URL}/checkout/success?order=${order.id}`,
      merchant_fail_url: `${process.env.FRONTEND_URL}/checkout?payment_failed=1`,
      timeout_limit: '30',
      currency,
      test_mode: testMode,
      lang,
    })

    // Store merchantOid on the order for webhook lookup
    await prisma.order.update({
      where: { id: order.id },
      data: { paytrOrderId: merchantOid },
    })

    // Call PayTR API to get iFrame token
    await new Promise((resolve, reject) => {
      const request = https.request(
        {
          hostname: 'www.paytr.com',
          port: 443,
          path: '/odeme/api/get-token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (response) => {
          let data = ''
          response.on('data', (chunk) => { data += chunk })
          response.on('end', () => {
            try {
              const result = JSON.parse(data)
              if (result.status === 'success') {
                res.json({ token: result.token })
              } else {
                reject(new Error(result.reason || 'PayTR token alinamadi'))
              }
              resolve()
            } catch {
              reject(new Error('PayTR yaniti isle nemedi'))
            }
          })
        }
      )
      request.on('error', reject)
      request.write(postData)
      request.end()
    })
  } catch (err) {
    console.error('PayTR init error:', err.message)
    res.status(500).json({ error: 'Odeme baslatılamadi' })
  }
})

// POST /api/payment/notify — PayTR webhook (called by PayTR servers)
router.post('/notify', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const {
      merchant_oid,
      status,
      total_amount,
      hash,
    } = req.body

    if (!merchant_oid || !status || !total_amount || !hash) {
      return res.status(400).send('PAYTR_ERROR: Missing params')
    }

    // Verify HMAC-SHA256 signature
    const expectedHash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT)
      .update(merchant_oid + PAYTR_MERCHANT_SALT + status + total_amount)
      .digest('base64')

    if (expectedHash !== hash) {
      console.error('PayTR webhook: hash mismatch')
      return res.status(400).send('PAYTR_ERROR: Invalid hash')
    }

    const order = await prisma.order.findFirst({
      where: { paytrOrderId: merchant_oid },
    })

    if (!order) {
      return res.status(404).send('PAYTR_ERROR: Order not found')
    }

    if (status === 'success') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          status: 'processing',
          paidAt: new Date(),
        },
      })
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'failed' },
      })
    }

    res.send('OK')
  } catch (err) {
    console.error('PayTR notify error:', err)
    res.status(500).send('PAYTR_ERROR: Server error')
  }
})

module.exports = router
