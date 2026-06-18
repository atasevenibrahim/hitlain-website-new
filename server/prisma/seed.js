const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const products = [
  {
    name: 'Basic Bisiklet Yaka Tişört',
    slug: 'basic-bisiklet-yaka-tisort',
    category: 'tisort',
    price: 249,
    description: 'Günlük kullanım için ideal, %100 pamuklu bisiklet yaka tişört.',
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
    name: 'Polo Yaka Tişört',
    slug: 'polo-yaka-tisort',
    category: 'tisort',
    price: 329,
    description: 'Profesyonel görünüm için polo yaka tişört. Nakış ve baskıya uygun.',
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
    name: 'Kargo Pantolon',
    slug: 'kargo-pantolon',
    category: 'pantolon',
    price: 379,
    description: 'Dayanıklı kargo pantolon. Çoklu cep tasarımı.',
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

// 6-8 demo studio templates (Fabric.js JSON)
const studioTemplates = [
  {
    name: 'Sol Göğüs Logo',
    category: 'Minimal',
    sortOrder: 1,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 80,
          height: 80,
          fill: '#2d6a4f',
          rx: 4,
          ry: 4,
        },
        {
          type: 'text',
          left: 90,
          top: 90,
          text: 'LOGO',
          fontSize: 18,
          fontFamily: 'Barlow Condensed',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center',
        },
      ],
    }),
  },
  {
    name: 'Sırt Büyük Metin',
    category: 'Metin',
    sortOrder: 2,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'text',
          left: 250,
          top: 200,
          text: 'HITHLAIN',
          fontSize: 64,
          fontFamily: 'Barlow Condensed',
          fontWeight: '900',
          fill: '#1a1a1a',
          originX: 'center',
          originY: 'center',
          charSpacing: 100,
        },
        {
          type: 'text',
          left: 250,
          top: 270,
          text: 'EST. 2024',
          fontSize: 18,
          fontFamily: 'Barlow',
          fontWeight: '600',
          fill: '#6b6b6b',
          originX: 'center',
          originY: 'center',
          charSpacing: 300,
        },
      ],
    }),
  },
  {
    name: 'Geometrik Çerçeve',
    category: 'Geometrik',
    sortOrder: 3,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 200,
          height: 200,
          fill: 'transparent',
          stroke: '#1a1a1a',
          strokeWidth: 3,
        },
        {
          type: 'rect',
          left: 62,
          top: 62,
          width: 176,
          height: 176,
          fill: 'transparent',
          stroke: '#2d6a4f',
          strokeWidth: 1,
        },
        {
          type: 'text',
          left: 150,
          top: 150,
          text: 'METİN',
          fontSize: 28,
          fontFamily: 'Barlow Condensed',
          fontWeight: '700',
          fill: '#1a1a1a',
          originX: 'center',
          originY: 'center',
          charSpacing: 150,
        },
      ],
    }),
  },
  {
    name: 'Rozet Şablonu',
    category: 'Geometrik',
    sortOrder: 4,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'circle',
          left: 150,
          top: 50,
          radius: 90,
          fill: '#1a1a1a',
          originX: 'center',
          originY: 'center',
        },
        {
          type: 'circle',
          left: 150,
          top: 50,
          radius: 75,
          fill: 'transparent',
          stroke: '#2d6a4f',
          strokeWidth: 2,
          originX: 'center',
          originY: 'center',
        },
        {
          type: 'text',
          left: 150,
          top: 40,
          text: 'MARKA',
          fontSize: 20,
          fontFamily: 'Barlow Condensed',
          fontWeight: '700',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center',
          charSpacing: 200,
        },
        {
          type: 'text',
          left: 150,
          top: 65,
          text: 'ANTALYA',
          fontSize: 11,
          fontFamily: 'Barlow',
          fontWeight: '500',
          fill: '#9a9a9a',
          originX: 'center',
          originY: 'center',
          charSpacing: 250,
        },
      ],
    }),
  },
  {
    name: 'Çizgili Ad Etiketi',
    category: 'Metin',
    sortOrder: 5,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 160,
          y2: 0,
          left: 50,
          top: 80,
          stroke: '#1a1a1a',
          strokeWidth: 2,
        },
        {
          type: 'text',
          left: 130,
          top: 100,
          text: 'AD SOYAD',
          fontSize: 22,
          fontFamily: 'Barlow Condensed',
          fontWeight: '600',
          fill: '#1a1a1a',
          originX: 'center',
          originY: 'center',
          charSpacing: 100,
        },
        {
          type: 'text',
          left: 130,
          top: 125,
          text: 'ÜNVAN / DEPARTMAN',
          fontSize: 11,
          fontFamily: 'DM Sans',
          fill: '#6b6b6b',
          originX: 'center',
          originY: 'center',
          charSpacing: 150,
        },
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 160,
          y2: 0,
          left: 50,
          top: 145,
          stroke: '#1a1a1a',
          strokeWidth: 2,
        },
      ],
    }),
  },
  {
    name: 'Üçgen Etki',
    category: 'Geometrik',
    sortOrder: 6,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'triangle',
          left: 150,
          top: 50,
          width: 160,
          height: 140,
          fill: '#2d6a4f',
          originX: 'center',
          originY: 'center',
        },
        {
          type: 'text',
          left: 150,
          top: 100,
          text: 'METIN',
          fontSize: 20,
          fontFamily: 'Barlow Condensed',
          fontWeight: '700',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center',
          charSpacing: 150,
        },
      ],
    }),
  },
  {
    name: 'Yatay Bant',
    category: 'Minimal',
    sortOrder: 7,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          left: 0,
          top: 100,
          width: 500,
          height: 60,
          fill: '#1a1a1a',
        },
        {
          type: 'text',
          left: 250,
          top: 130,
          text: 'MARKANIZ BURADA',
          fontSize: 24,
          fontFamily: 'Barlow Condensed',
          fontWeight: '700',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center',
          charSpacing: 200,
        },
      ],
    }),
  },
  {
    name: 'Boş Şablon',
    category: 'Minimal',
    sortOrder: 8,
    canvasJson: JSON.stringify({
      version: '5.3.0',
      objects: [],
    }),
  },
]

const settings = [
  { key: 'siteName', value: 'HITHLAIN Giyim' },
  { key: 'metaDescription', value: 'Tişört, sweatshirt, mont ve daha fazlası. Kendi tasarımını oluştur.' },
  { key: 'whatsapp', value: '905436861994' },
  { key: 'instagram', value: '@hithlaingiyim' },
  { key: 'email', value: 'hithlaingiyim@gmail.com' },
  { key: 'phone', value: '0543 686 19 94' },
  { key: 'address', value: 'Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA' },
  { key: 'freeShippingLimit', value: '1500' },
  { key: 'standardShipping', value: '79' },
  { key: 'fastShipping', value: '149' },
  { key: 'marqueeItems', value: JSON.stringify(['YENİ SEZON GELDİ', 'ÜCRETSİZ KARGO 1500₺ ÜZERİ', 'HIZLI TESLİMAT', 'KENDİN TASARLA']) },
  { key: 'trustBarItems', value: JSON.stringify([
    { icon: '✓', text: 'Güvenli Alışveriş' },
    { icon: '⬡', text: '1500₺ Üzeri Kargo Bedava' },
    { icon: '→', text: 'Hızlı Teslimat' },
    { icon: '◎', text: 'Online Destek' },
  ]) },
  // Hero
  { key: 'hero.label', value: 'HITHLAIN GİYİM' },
  { key: 'hero.title', value: 'TARZINI\nKENDİN\nSEÇ' },
  { key: 'hero.description', value: 'Tişört, sweatshirt, mont ve daha fazlası. Kendi tasarımını oluştur veya hazır ürünleri keşfet.' },
  { key: 'hero.cta1', value: 'ÜRÜNLERİ KEŞFET' },
  { key: 'hero.cta2', value: 'KENDİN TASARLA' },
  { key: 'home.hero.slides', value: JSON.stringify([]) },
  // Categories
  { key: 'categories.label', value: 'KATEGORİLER' },
  { key: 'categories.title', value: 'NE ARIYORSUNUZ?' },
  { key: 'categories.list', value: JSON.stringify([
    { id: 'tisort', name: 'Tişört' },
    { id: 'sweatshirt', name: 'Sweatshirt' },
    { id: 'mont-ceket', name: 'Mont ve Ceket' },
    { id: 'pantolon', name: 'Pantolon' },
    { id: 'ikaz-yelegi', name: 'İkaz Yeleği' },
  ]) },
  // Bestsellers
  { key: 'bestsellers.label', value: 'ÇOK SATANLAR' },
  { key: 'bestsellers.title', value: 'EN SEVİLEN ÜRÜNLER' },
  // Studio
  { key: 'studio.label', value: 'TASARIM STÜDYOSU' },
  { key: 'studio.title', value: 'KENDİN\nTASARLA' },
  { key: 'studio.description', value: 'Kendi tasarımını yükle veya stüdyomuzda oluştur. Baskı bölgesini seç, ürünü özelleştir.' },
  { key: 'studio.cta', value: 'STÜDYOYA GİT' },
  // Why Us
  { key: 'whyus.label', value: 'NEDEN BİZ' },
  { key: 'whyus.title', value: 'FARKINIZ BİZİZ' },
  { key: 'whyus.items', value: JSON.stringify([
    { title: 'Kaliteli Kumaş', desc: 'Sadece A sınıfı, sertifikalı kumaşlar kullanıyoruz.' },
    { title: 'Hızlı Teslimat', desc: 'Siparişlerinizi 3-5 iş gününde teslim ediyoruz.' },
    { title: 'Profesyonel Baskı', desc: 'Serigrafi, dijital ve nakış, her teknikte uzman ekip.' },
    { title: 'Uygun Fiyat', desc: 'Fabrikadan direkt, rekabetçi fiyat avantajı.' },
  ]) },
  // Stats
  { key: 'stats.1.num', value: '50K+' },
  { key: 'stats.1.label', value: 'Mutlu Müşteri' },
  { key: 'stats.2.num', value: '200+' },
  { key: 'stats.2.label', value: 'Ürün Çeşidi' },
  { key: 'stats.3.num', value: '15+' },
  { key: 'stats.3.label', value: 'Yıllık Deneyim' },
  { key: 'stats.4.num', value: '%98' },
  { key: 'stats.4.label', value: 'Memnuniyet' },
  // About
  { key: 'aboutHome.label', value: 'HAKKIMIZDA' },
  { key: 'aboutHome.title', value: 'İKİ KARDEŞİN HİKAYESİ' },
  { key: 'aboutHome.text1', value: "Antalya'da küçük bir atölyede başlayan yolculuğumuz, bugün on binlerce müşteriye hizmet veren bir markaya dönüştü." },
  { key: 'aboutHome.text2', value: 'Her bir ürünümüzde aynı özveri ve titizliği gösteriyoruz. Amacımız sadece giysi üretmek değil, tarzını en iyi şekilde yansıtacak çözümler sunmak.' },
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
    { id: 1, name: 'Ahmet Y.', text: 'Kalite ve hız konusunda çok memnun kaldım. Kesinlikle tavsiye ederim.', rating: 5 },
    { id: 2, name: 'Fatma D.', text: 'Fiyat-performans oranı mükemmel. Baskı çok kaliteli çıktı.', rating: 5 },
    { id: 3, name: 'Mehmet K.', text: 'Stüdyo özelliği harika, kendi tasarımımı çok kolay oluşturdum.', rating: 5 },
  ]) },
  // FAQ
  { key: 'faq.items', value: JSON.stringify([
    { question: 'Kargo süresi ne kadardır?', answer: 'Standart 3-5 iş günü, hızlı kargo 1-2 iş günü.' },
    { question: 'İade yapabilir miyim?', answer: 'Özel baskılı ürünlerde iade yoktur. Standart ürünlerde 14 gün içinde iade alıyoruz.' },
    { question: 'Ödeme güvenli mi?', answer: 'Ödeme altyapımız PayTR güvencesi ile korunmaktadır.' },
    { question: 'Tasarım stüdyosunu nasıl kullanabilirim?', answer: 'Stüdyo sayfasına giderek ürün seçin, tasarımınızı oluşturun ve sepete ekleyin.' },
  ]) },
  // About page
  { key: 'about.title', value: 'İki Kardeşin Hikayesi' },
  { key: 'about.subtitle', value: 'HAKKIMIZDA' },
  { key: 'about.text', value: "Hithlain Giyim, Antalya merkezli olarak bireysel giyim ve özel baskı alanında hizmet vermektedir. 2010 yılında iki kardeşin küçük bir atölyesinde başlayan hikayemiz, bugün binlerce müşteriye ulaşan bir markaya dönüştü." },
  // Contact
  { key: 'contact.title', value: 'Bize Ulaşın' },
  { key: 'contact.subtitle', value: 'İLETİŞİM' },
  // Legal pages
  { key: 'legal.kvkk', value: `# KVKK Aydınlatma Metni

## 6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni

**Veri Sorumlusu:** HITHLAIN Giyim
**Adres:** Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA
**E-posta:** hithlaingiyim@gmail.com

### Toplanan Kişisel Veriler

Adınız, soyadınız, e-posta adresiniz, telefon numaranız, teslimat adresiniz ve sipariş bilgileriniz işlenmektedir.

### İşleme Amaçları

- Sipariş ve teslimat süreçlerinin yürütülmesi
- Müşteri hizmetleri ve destek sunulması
- Yasal yükümlülüklerin yerine getirilmesi

### Hukuki Dayanak

KVKK m.5/2-c (sözleşmenin ifası) ve m.5/2-ç (veri sorumlusunun hukuki yükümlülüğü).

### Veri Saklama Süresi

Kişisel verileriniz sipariş tarihinden itibaren 10 yıl saklanır.

### Haklarınız

KVKK m.11 kapsamında; bilgi talep etme, düzeltme, silme, işlemeyi kısıtlama ve itiraz etme haklarına sahipsiniz. Taleplerinizi hithlaingiyim@gmail.com adresine iletebilirsiniz.` },
  { key: 'legal.mesafeli-satis', value: `# Mesafeli Satış Sözleşmesi

**Tarih:** Sipariş tarihi itibarıyla geçerlidir.

## Taraflar

**Satıcı:** HITHLAIN Giyim, Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA
**Alıcı:** Sipariş formunda belirtilen müşteri

## Sözleşmenin Konusu

İşbu sözleşme, Alıcı'nın www.hithlain.com üzerinden sipariş ettiği ürün(ler)in satışı ve teslimatına ilişkin tarafların hak ve yükümlülüklerini düzenler.

## Ürün Bilgileri

Ürün bilgileri, fiyatlar ve teslimat süreleri sipariş onay sayfasında ve e-postada belirtilmiştir.

## Ödeme

Ödeme PayTR altyapısı üzerinden güvenli şekilde alınmaktadır.

## Teslimat

Siparişler, ödeme onayından itibaren 3-5 iş günü içinde kargoya verilir.

## Cayma Hakkı

Alıcı, teslim tarihinden itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Özel tasarım/baskılı ürünler cayma hakkı kapsamı dışındadır (TKHK m.48/4-c).

## Uyuşmazlık Çözümü

Antalya Tüketici Hakem Heyeti ve Tüketici Mahkemeleri yetkilidir.` },
  { key: 'legal.iptal-iade', value: `# İptal ve İade Politikası

## İptal

- Sipariş **kargoya verilmeden önce** iptal talebinizi hithlaingiyim@gmail.com adresine veya WhatsApp'a iletebilirsiniz.
- Kargoya verildikten sonra iptal mümkün değildir; iade süreci başlatılır.

## İade Koşulları

- Ürün, teslimat tarihinden itibaren **14 gün** içinde iade edilebilir.
- Ürün kullanılmamış, yıkanmamış ve orijinal ambalajında olmalıdır.
- **Özel tasarım, baskılı veya nakışlı ürünler iade edilemez.**

## İade Süreci

1. hithlaingiyim@gmail.com adresine sipariş numaranızı ve iade nedeninizi bildirin.
2. Ürünü, kargo ücreti tarafınıza ait olacak şekilde belirtilen adrese gönderin.
3. Ürün incelemesi tamamlandıktan sonra ödeme iadesi 5-7 iş günü içinde yapılır.

## Hasarlı/Hatalı Ürün

Kargo hasarı veya hatalı ürün durumunda, teslimat tarihinden itibaren 48 saat içinde bizimle iletişime geçin. Bu durumlarda kargo ücreti tarafımızca karşılanır.` },
  { key: 'legal.gizlilik', value: `# Gizlilik Politikası

## Toplanan Bilgiler

Sitemizi kullandığınızda; ad-soyad, e-posta, telefon, adres ve ödeme bilgileriniz toplanmaktadır. Ödeme bilgileri tarafımızca saklanmaz; PayTR güvenli ödeme altyapısına iletilir.

## Çerezler (Cookies)

Sitemizdeki deneyiminizi geliştirmek amacıyla çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.

## Veri Paylaşımı

Kişisel verileriniz; kargo şirketleri (teslimat için), ödeme altyapısı (PayTR) ve yasal yükümlülükler dışında üçüncü taraflarla paylaşılmaz.

## Veri Güvenliği

Verileriniz SSL şifreleme ve güvenli sunucular ile korunmaktadır.

## İletişim

Gizlilik politikamız hakkında sorularınız için: hithlaingiyim@gmail.com` },
  // Footer
  { key: 'logoUrl', value: '/hithlain-logo.png' },
  { key: 'logoText', value: 'HITHLAIN' },
  { key: 'footerCopyright', value: '© 2026 Hithlain Giyim. Tüm hakları saklıdır.' },
  { key: 'footerNewsletter', value: 'Kampanya ve yeni ürünlerden haberdar olun.' },
]

async function main() {
  console.log('Seeding database...')

  await prisma.studioOrderItem.deleteMany()
  await prisma.studioOrder.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.studioTemplate.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.setting.deleteMany()

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: { email: 'admin@hithlain.com', password: hashedPassword },
  })
  console.log('Admin: admin@hithlain.com / admin123')

  // Products + variants
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
  console.log(`${products.length} products seeded`)

  // Studio templates
  for (const t of studioTemplates) {
    await prisma.studioTemplate.create({ data: t })
  }
  console.log(`${studioTemplates.length} studio templates seeded`)

  // Settings
  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }
  console.log(`${settings.length} settings seeded`)

  // Sample orders
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
      paymentStatus: 'paid',
      paidAt: new Date(),
      items: { create: [{ productId: createdProducts[0].id, size: 'M', color: 'Beyaz', quantity: 3, price: 249 }] },
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
      paymentStatus: 'paid',
      paidAt: new Date(),
      items: { create: [{ productId: createdProducts[1].id, size: 'S', color: 'Lacivert', quantity: 2, price: 329 }] },
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
      paymentStatus: 'paid',
      paidAt: new Date(),
      items: { create: [{ productId: createdProducts[5].id, size: 'L', color: 'Siyah', quantity: 2, price: 699 }] },
    },
  ]

  for (const order of sampleOrders) {
    await prisma.order.create({ data: order })
  }
  console.log('3 sample orders seeded')

  // Sample studio orders
  const studioOrders = [
    {
      customerName: 'Ali Özkan',
      email: 'ali@example.com',
      phone: '0542 555 66 77',
      designUrl: '/uploads/design-sample.png',
      printArea: 'front',
      printZone: 'center',
      status: 'pending',
      items: { create: [{ productId: createdProducts[0].id, color: 'Beyaz', sizes: JSON.stringify({ S: 5, M: 10, L: 5 }), price: 249 }] },
    },
  ]

  for (const so of studioOrders) {
    await prisma.studioOrder.create({ data: so })
  }
  console.log('1 sample studio order seeded')

  console.log('\nSeed completed!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
