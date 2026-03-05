const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const products = [
  {
    name: 'Basic Bisiklet Yaka Tişört',
    slug: 'basic-bisiklet-yaka-tisort',
    category: 'tisort',
    price: 249,
    description: 'Günlük kullanım ve kurumsal siparişler için ideal, %100 pamuklu bisiklet yaka tişört.',
    fabric: '%100 Pamuk, 190gr/m² Penye',
    care: "30°C'de yıkayınız. Ters çevirip ütüleyiniz.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: true,
    isNew: false,
    colors: [
      { name: 'Beyaz', hex: '#ffffff' },
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Lacivert', hex: '#1b2a4a' },
      { name: 'Gri', hex: '#6b6b6b' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Polo Yaka İş Tişörtü',
    slug: 'polo-yaka-is-tisortu',
    category: 'tisort',
    price: 329,
    description: 'Profesyonel görünüm için polo yaka iş tişörtü. Nakış ve baskıya uygun.',
    fabric: '%100 Pamuk Lakost, 220gr/m²',
    care: "30°C'de yıkayınız. Asılarak kurutunuz.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: true,
    isNew: true,
    colors: [
      { name: 'Beyaz', hex: '#ffffff' },
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Lacivert', hex: '#1b2a4a' },
      { name: 'Kırmızı', hex: '#b91c1c' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Oversize Baskılı Tişört',
    slug: 'oversize-baskili-tisort',
    category: 'tisort',
    price: 289,
    description: 'Trend oversize kalıp, ön ve arka baskıya uygun geniş alan.',
    fabric: '%100 Pamuk, 200gr/m² Süprem',
    care: "30°C'de yıkayınız. Ters çevirip kurutunuz.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: true,
    isNew: false,
    colors: [
      { name: 'Beyaz', hex: '#ffffff' },
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Gri', hex: '#6b6b6b' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Kapüşonlu Sweatshirt',
    slug: 'kapusonlu-sweatshirt',
    category: 'sweatshirt',
    price: 449,
    description: 'Soğuk havalarda konforlu, kapüşonlu sweatshirt.',
    fabric: '%80 Pamuk, %20 Polyester, 320gr/m² 3 İplik',
    care: "30°C'de yıkayınız. Düşük ısıda kurutunuz.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: false,
    isNew: true,
    colors: [
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Gri', hex: '#6b6b6b' },
      { name: 'Lacivert', hex: '#1b2a4a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Sıfır Yaka Sweatshirt',
    slug: 'sifir-yaka-sweatshirt',
    category: 'sweatshirt',
    price: 399,
    description: 'Minimal tasarımlı sıfır yaka sweatshirt.',
    fabric: '%80 Pamuk, %20 Polyester, 300gr/m²',
    care: "30°C'de yıkayınız.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: false,
    isNew: false,
    colors: [
      { name: 'Beyaz', hex: '#ffffff' },
      { name: 'Siyah', hex: '#1a1a1a' },
    ],
    sizes: ['M', 'L', 'XL'],
  },
  {
    name: 'Softshell Mont',
    slug: 'softshell-mont',
    category: 'mont-ceket',
    price: 699,
    description: 'Su ve rüzgar geçirmez softshell mont.',
    fabric: '%100 Polyester Softshell, TPU Membran',
    care: 'Makine yıkamayınız. Nemli bezle siliniz.',
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: false,
    isNew: false,
    colors: [
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Lacivert', hex: '#1b2a4a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'İş Pantolonu',
    slug: 'is-pantolonu',
    category: 'pantolon',
    price: 379,
    description: 'Dayanıklı iş pantolonu. Çoklu cep tasarımı.',
    fabric: '%65 Polyester, %35 Pamuk, 245gr/m² Gabardin',
    care: "40°C'de yıkayınız.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: false,
    isNew: false,
    colors: [
      { name: 'Siyah', hex: '#1a1a1a' },
      { name: 'Lacivert', hex: '#1b2a4a' },
      { name: 'Gri', hex: '#6b6b6b' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Reflektörlü İkaz Yeleği',
    slug: 'reflektorlu-ikaz-yelegi',
    category: 'ikaz-yelegi',
    price: 129,
    description: 'CE sertifikalı, yüksek görünürlüklü ikaz yeleği.',
    fabric: '%100 Polyester Triko, Reflektör Bant',
    care: "30°C'de yıkayınız.",
    images: JSON.stringify(['/placeholder-product.jpg']),
    isFeatured: false,
    isNew: false,
    colors: [
      { name: 'Sarı', hex: '#eab308' },
      { name: 'Turuncu', hex: '#ea580c' },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
]

const references = [
  { clientName: 'S.', sector: 'İnşaat', quantity: 5000, isActive: true },
  { clientName: 'PAYDIN', sector: 'Gıda', quantity: 3000, isActive: true },
  { clientName: 'UMKE', sector: 'Acil Sağlık', quantity: 8000, isActive: true },
  { clientName: '@kadoil', sector: 'Petrol', quantity: 2500, isActive: true },
  { clientName: '112', sector: 'Sağlık', quantity: 10000, isActive: true },
]

const settings = [
  { key: 'siteName', value: 'HITHLAIN Giyim' },
  { key: 'metaDescription', value: 'Kurumsal giyim ve promosyon tekstil çözümleri' },
  { key: 'whatsapp', value: '905436861994' },
  { key: 'instagram', value: '@hithlaingiyim' },
  { key: 'email', value: 'hithlaingiyim@gmail.com' },
  { key: 'phone', value: '0543 686 19 94' },
  { key: 'address', value: 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA' },
  { key: 'freeShippingLimit', value: '1500' },
  { key: 'standardShipping', value: '79' },
  { key: 'fastShipping', value: '149' },
  { key: 'marqueeItems', value: JSON.stringify(['TOPTAN FİYAT AVANTAJI', 'ÜCRETSİZ KARGO 1500₺ ÜZERİ', 'HIZLI TESLİMAT', 'KURUMSAL ÇÖZÜMLER']) },
  { key: 'trustBarItems', value: JSON.stringify([
    { icon: '✓', text: 'Güvenli Alışveriş' },
    { icon: '⬡', text: '1500₺ Üzeri Kargo Bedava' },
    { icon: '→', text: 'Hızlı Teslimat' },
    { icon: '◎', text: 'Online Destek' },
  ]) },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.studioOrderItem.deleteMany()
  await prisma.studioOrder.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.reference.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.setting.deleteMany()

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: { email: 'admin@hithlain.com', password: hashedPassword },
  })
  console.log('Admin created: admin@hithlain.com / admin123')

  // Create products with variants
  const createdProducts = []
  for (const p of products) {
    const { colors, sizes, ...productData } = p
    const product = await prisma.product.create({ data: productData })
    createdProducts.push(product)

    const variantData = []
    for (const color of colors) {
      for (const size of sizes) {
        variantData.push({
          productId: product.id,
          size,
          color: color.name,
          colorHex: color.hex,
          stock: Math.floor(Math.random() * 25) + 5,
          minStock: 5,
        })
      }
    }
    await prisma.variant.createMany({ data: variantData })
  }
  console.log(`${products.length} products created with variants`)

  // Create references
  for (const ref of references) {
    await prisma.reference.create({ data: ref })
  }
  console.log(`${references.length} references created`)

  // Create settings
  for (const setting of settings) {
    await prisma.setting.create({ data: setting })
  }
  console.log(`${settings.length} settings created`)

  // Create sample orders (use actual product IDs)
  const sampleOrders = [
    {
      customerName: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '0532 111 22 33',
      address: 'Atatürk Cad. No:45',
      city: 'Antalya',
      district: 'Muratpaşa',
      total: 747,
      shippingFee: 0,
      status: 'pending',
      items: {
        create: [
          { productId: createdProducts[0].id, size: 'M', color: 'Beyaz', quantity: 3, price: 249 },
        ],
      },
    },
    {
      customerName: 'Fatma Demir',
      email: 'fatma@example.com',
      phone: '0544 222 33 44',
      address: 'Cumhuriyet Blv. No:12/3',
      city: 'İzmir',
      district: 'Konak',
      total: 658,
      shippingFee: 79,
      status: 'preparing',
      items: {
        create: [
          { productId: createdProducts[1].id, size: 'S', color: 'Lacivert', quantity: 2, price: 329 },
        ],
      },
    },
    {
      customerName: 'Mehmet Kara',
      email: 'mehmet@example.com',
      phone: '0555 333 44 55',
      address: 'İstiklal Mah. 2. Sok. No:7',
      city: 'İstanbul',
      district: 'Beyoğlu',
      total: 1398,
      shippingFee: 0,
      status: 'shipped',
      items: {
        create: [
          { productId: createdProducts[5].id, size: 'L', color: 'Siyah', quantity: 2, price: 699 },
        ],
      },
    },
    {
      customerName: 'Ayşe Çelik',
      email: 'ayse@example.com',
      phone: '0533 444 55 66',
      address: 'Kızılay Sok. No:3',
      city: 'Ankara',
      district: 'Çankaya',
      total: 898,
      shippingFee: 0,
      status: 'completed',
      items: {
        create: [
          { productId: createdProducts[3].id, size: 'M', color: 'Siyah', quantity: 2, price: 449 },
        ],
      },
    },
  ]

  for (const order of sampleOrders) {
    await prisma.order.create({ data: order })
  }
  console.log('4 sample orders created')

  // Create sample studio orders
  const studioOrders = [
    {
      customerName: 'Ali Özkan',
      email: 'ali@example.com',
      phone: '0542 555 66 77',
      designUrl: '/uploads/design-sample.png',
      printArea: 'front',
      printZone: 'center',
      status: 'pending',
      items: {
        create: [
          { productId: createdProducts[0].id, color: 'Beyaz', sizes: JSON.stringify({ S: 5, M: 10, L: 5 }), price: 249 },
        ],
      },
    },
    {
      customerName: 'Zeynep Arslan',
      email: 'zeynep@example.com',
      phone: '0535 666 77 88',
      designUrl: '/uploads/design-sample2.png',
      printArea: 'front',
      printZone: 'left-chest',
      status: 'approved',
      items: {
        create: [
          { productId: createdProducts[1].id, color: 'Lacivert', sizes: JSON.stringify({ M: 20, L: 15, XL: 10 }), price: 329 },
        ],
      },
    },
  ]

  for (const so of studioOrders) {
    await prisma.studioOrder.create({ data: so })
  }
  console.log('2 sample studio orders created')

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
