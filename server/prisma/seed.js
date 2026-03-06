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
  // Genel
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
  // Hero
  { key: 'hero.label', value: 'HITHLAIN GİYİM' },
  { key: 'hero.title', value: 'KURUMSAL\nTEKSTİL\nÇÖZÜMLERİ' },
  { key: 'hero.description', value: 'Toptan ve perakende iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.' },
  { key: 'hero.cta1', value: 'ÜRÜNLERİ KEŞFET' },
  { key: 'hero.cta2', value: 'KURUMSAL ÇÖZÜMLER' },
  { key: 'hero.b2b.title', value: 'Toptan Sipariş' },
  { key: 'hero.b2b.desc', value: '50 adet ve üzeri kurumsal siparişlerde özel fiyat' },
  { key: 'hero.b2c.title', value: 'Perakende' },
  { key: 'hero.b2c.desc', value: 'Tek parça siparişlerde hızlı teslimat' },
  // Section Headers
  { key: 'categories.label', value: 'KATEGORİLER' },
  { key: 'categories.title', value: 'NE ARIYORSUNUZ?' },
  { key: 'bestsellers.label', value: 'ÇOK SATANLAR' },
  { key: 'bestsellers.title', value: 'EN SEVİLEN ÜRÜNLER' },
  // Studio
  { key: 'studio.label', value: 'TASARIM STÜDYOSU' },
  { key: 'studio.title', value: 'KENDİN\nTASARLA' },
  { key: 'studio.description', value: 'Kendi tasarımını yükle veya stüdyomuzda oluştur. Baskı bölgesini seç, ürünü özelleştir.' },
  { key: 'studio.cta', value: 'STÜDYOYA GİT' },
  // Corporate cards on Home
  { key: 'corp.label', value: 'KURUMSAL' },
  { key: 'corp.title', value: 'İŞLETMENİZ İÇİN ÇÖZÜMLER' },
  { key: 'corp.card1.title', value: 'Baskı & Nakış' },
  { key: 'corp.card1.desc', value: 'Logonuzu, tasarımınızı tişört, sweatshirt ve daha fazlasına uyguluyoruz. Serigrafi, dijital baskı ve nakış seçenekleri.' },
  { key: 'corp.card2.title', value: 'Toptan Dikim' },
  { key: 'corp.card2.desc', value: 'İstediğiniz model, kumaş ve renkte toptan üretim. Minimum 50 adet sipariş ile özel fiyat avantajı.' },
  // Why Us
  { key: 'whyus.label', value: 'NEDEN BİZ' },
  { key: 'whyus.title', value: 'FARKINIZ BİZİZ' },
  { key: 'whyus.items', value: JSON.stringify([
    { title: 'Kaliteli Kumaş', desc: 'Sadece A sınıfı, sertifikalı kumaşlar kullanıyoruz.' },
    { title: 'Hızlı Üretim', desc: '500 adete kadar siparişleri 5 iş gününde teslim ediyoruz.' },
    { title: 'Profesyonel Baskı', desc: 'Serigrafi, dijital ve nakış, her teknikte uzman ekip.' },
    { title: 'Uygun Fiyat', desc: 'Aracısız, fabrikadan direkt toptan fiyat avantajı.' },
  ]) },
  // Stats
  { key: 'stats.1.num', value: '50K+' },
  { key: 'stats.1.label', value: 'Üretilen Parça' },
  { key: 'stats.2.num', value: '200+' },
  { key: 'stats.2.label', value: 'Kurumsal Müşteri' },
  { key: 'stats.3.num', value: '15+' },
  { key: 'stats.3.label', value: 'Yıllık Deneyim' },
  { key: 'stats.4.num', value: '%98' },
  { key: 'stats.4.label', value: 'Memnuniyet' },
  // About Home
  { key: 'aboutHome.label', value: 'HAKKIMIZDA' },
  { key: 'aboutHome.title', value: 'İKİ KARDEŞİN HİKAYESİ' },
  { key: 'aboutHome.text1', value: 'Antalya\'da küçük bir atölyede başlayan yolculuğumuz, bugün yüzlerce kurumsal müşteriye hizmet veren bir markaya dönüştü. Kalite ve müşteri memnuniyeti odaklı yaklaşımımızla sektörde güvenilir bir isim olduk.' },
  { key: 'aboutHome.text2', value: 'Her bir ürünümüzde aynı özveri ve titizliği gösteriyoruz. Amacımız sadece giysi üretmek değil, markanızı en iyi şekilde temsil edecek çözümler sunmak.' },
  // Section headers
  { key: 'reviews.label', value: 'YORUMLAR' },
  { key: 'reviews.title', value: 'MÜŞTERİLERİMİZ NE DİYOR?' },
  { key: 'faqHome.label', value: 'SSS' },
  { key: 'faqHome.title', value: 'SIK SORULAN SORULAR' },
  { key: 'contactHome.label', value: 'İLETİŞİM' },
  { key: 'contactHome.title', value: 'BİZE ULAŞIN' },
  { key: 'instagram.label', value: 'INSTAGRAM' },
  { key: 'instagram.title', value: '@HITHLAİNGİYİM' },
  // Testimonials
  { key: 'testimonials', value: JSON.stringify([
    { id: 1, name: 'Ahmet Yılmaz', company: 'PAYDIN Gıda', text: 'Toptan tişört siparişimizi zamanında ve kaliteli bir şekilde teslim ettiler.', rating: 5 },
    { id: 2, name: 'Fatma Demir', company: 'ABC İnşaat', text: 'İş kıyafetlerinde fiyat-performans oranı çok iyi.', rating: 5 },
    { id: 3, name: 'Mehmet Kaya', company: '112 Acil', text: 'Nakış işçiliği çok başarılı. Kesinlikle tavsiye ederim.', rating: 5 },
  ]) },
  // FAQ
  { key: 'faq.items', value: JSON.stringify([
    { question: 'Minimum sipariş adedi kaçtır?', answer: 'Toptan siparişlerde minimum sipariş adedi 50 adettir.' },
    { question: 'Baskı ve nakış fiyatları dahil midir?', answer: 'Hayır, baskı ve nakış işlemleri ayrıca ücretlendirilir.' },
    { question: 'Kargo süresi ne kadardır?', answer: 'Standart 3-5 iş günü, hızlı kargo 1-2 iş günü.' },
    { question: 'İade politikanız nedir?', answer: 'Baskılı ürünlerde iade yoktur. Standart ürünlerde 14 gün iade.' },
  ]) },
  // Corporate page
  { key: 'corporate.hero.label', value: 'KURUMSAL ÇÖZÜMLER' },
  { key: 'corporate.hero.title', value: 'İŞLETMENİZ İÇİN\nTEKSTİL ÇÖZÜMLERİ' },
  { key: 'corporate.hero.desc', value: 'Toptan iş giyim, promosyon tekstili, baskı ve nakış hizmetleri.' },
  { key: 'corporate.hero.cta1', value: 'TEKLİF AL' },
  { key: 'corporate.hero.cta2', value: 'İLETİŞİME GEÇ' },
  { key: 'corporate.services', value: JSON.stringify([
    { num: '01', title: 'Baskı & Nakış', desc: 'Serigrafi, dijital baskı, transfer baskı ve nakış seçenekleri.' },
    { num: '02', title: 'Toptan Dikim', desc: 'İstediğiniz model, kumaş ve renkte toptan üretim.' },
    { num: '03', title: 'Promosyon Tekstili', desc: 'Etkinlikler, fuarlar ve kampanyalar için promosyon ürünleri.' },
  ]) },
  { key: 'corporate.quote.label', value: 'TEKLİF' },
  { key: 'corporate.quote.title', value: 'BİZE ULAŞIN' },
  { key: 'corporate.quote.desc', value: 'Kurumsal siparişleriniz için teklif almak veya bilgi edinmek için formu doldurun.' },
  // About page
  { key: 'about.title', value: 'İki Kardeşin Hikayesi' },
  { key: 'about.subtitle', value: 'HAKKIMIZDA' },
  { key: 'about.text', value: 'Hithlain Giyim, Antalya merkezli olarak kurumsal tekstil ve iş giyim alanında hizmet vermektedir.' },
  // Contact page
  { key: 'contact.title', value: 'Bize Ulaşın' },
  { key: 'contact.subtitle', value: 'İLETİŞİM' },
  // Logo
  { key: 'logoUrl', value: '/hithlain-logo.png' },
  // Welcome (Karsilama) page
  { key: 'welcome.b2c.title', value: 'BİREYSEL\nALIŞVERİŞ' },
  { key: 'welcome.b2c.desc', value: 'Tişört, sweatshirt, mont ve daha fazlası.\nKendi tasarımını oluştur veya hazır ürünleri keşfet.' },
  { key: 'welcome.b2c.cta', value: 'MAĞAZAYA GİT' },
  { key: 'welcome.b2c.banners', value: JSON.stringify([]) },
  { key: 'welcome.b2b.title', value: 'KURUMSAL\nÇÖZÜMLER' },
  { key: 'welcome.b2b.desc', value: 'Toptan sipariş, baskı & nakış, promosyon tekstili.\n50 adet ve üzeri siparişlerde özel fiyat avantajı.' },
  { key: 'welcome.b2b.cta', value: 'TEKLİF AL' },
  { key: 'welcome.b2b.banners', value: JSON.stringify([]) },
  // Home & Corporate hero banners
  { key: 'home.hero.banners', value: JSON.stringify([]) },
  { key: 'corporate.hero.banners', value: JSON.stringify([]) },
  // Footer / General
  { key: 'logoText', value: 'HITHLAIN' },
  { key: 'footerCopyright', value: '© 2026 Hithlain Giyim. Tüm hakları saklıdır.' },
  { key: 'footerNewsletter', value: 'Kampanya ve yeni ürünlerden haberdar olun.' },
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
