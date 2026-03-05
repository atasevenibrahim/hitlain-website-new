# HITHLAIN GİYİM — MASTER CLAUDE.md
## Tam Proje Tasarım & Geliştirme Kılavuzu

> Bu dosya projedeki her sayfanın, bileşenin ve özelliğin tek referans kaynağıdır.
> Yeni bir şey üretmeden önce bu dosyayı baştan sona oku.

---

## 1. PROJE KİMLİĞİ

| Alan | Değer |
|---|---|
| Marka | HITHLAIN Giyim |
| Domain | hithlain.com |
| Segment | B2B (kurumsal toptan) + B2C (perakende e-ticaret) |
| Dil | Türkçe |
| İletişim | hithlaingiyim@gmail.com · 0543 686 19 94 |
| Adres | Varsak Karşıyaka Mah. Gazi cad. 1Üzüm apt. No:11/A Kepez/ANTALYA |
| WhatsApp | 905436861994 |
| Instagram | @hithlaingiyim |

---

## 2. TEKNİK STACK

```
Frontend  : React 18 + Vite
Routing   : React Router DOM v6
State     : Zustand (cart, studio, auth)
Styling   : CSS Modules (her bileşen kendi .module.css dosyasına sahip)
Canvas    : Fabric.js (tasarım stüdyosu için)
HTTP      : Axios
Backend   : Node.js + Express
ORM       : Prisma
DB        : SQLite (dev) → PostgreSQL (prod)
Auth      : JWT (admin)
Upload    : Multer (görsel yükleme)
```

**Dosya Uzantıları:** `.jsx` ve `.js` (TypeScript sonraki aşamada)

---

## 3. TASARIM SİSTEMİ

### 3.1 Renk Paleti
```css
:root {
  /* Zemin & Yüzeyler */
  --white:      #ffffff;
  --off:        #f7f7f5;   /* Kırık beyaz bölümler */
  --off2:       #f0efe9;   /* Daha koyu kırık zemin */

  /* Gri Skalası */
  --ink:        #1a1a1a;   /* Ana metin, koyu bölüm arkaplanı */
  --ink2:       #2d2d2d;
  --ink3:       #3f3f3f;
  --mid:        #6b6b6b;   /* Açıklama metni */
  --subtle:     #9a9a9a;   /* Yardımcı, placeholder */
  --border:     #e4e4e4;   /* Ana kenarlık */
  --border2:    #f0f0f0;   /* Hafif kenarlık */

  /* Aksan — YEŞİL (tek aksan rengi) */
  --green:      #2d6a4f;   /* Ana aksan, CTA buton */
  --green-l:    #40916c;   /* Hover, vurgu */
  --green-xl:   #d8f3dc;   /* Açık yüzey, badge arkaplanı */
  --green-txt:  #1b4332;   /* Yeşil yüzey üzeri metin */

  /* Durum Renkleri */
  --success:    #2d6a4f;
  --warning:    #b45309;
  --error:      #b91c1c;
  --warning-bg: #fef3c7;
  --error-bg:   #fee2e2;
}
```

**Kural:** Arkaplan daima `--white` veya `--off`. Yeşil **sadece** CTA butonu, ikon, hover vurgusu, badge için. Siyah (`--ink`) bloklar section bazlı.

### 3.2 Tipografi
```css
@import url('fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

--font-display : 'Barlow Condensed'  /* H1, hero, büyük başlıklar */
--font-ui      : 'Barlow'            /* Buton, nav, etiket, tablo başlığı */
--font-body    : 'DM Sans'           /* Paragraf, form, genel */
```

**Başlık:** `font-weight:900`, `line-height:0.88–0.95`, `letter-spacing:-0.01em`
**Seksiyon Etiketi:** `font-size:0.65rem`, `font-weight:700`, `letter-spacing:0.28em`, `text-transform:uppercase`
**Gövde:** `font-size:0.88–0.92rem`, `line-height:1.7`, `color:var(--mid)`

### 3.3 Buton Sistemi
| Sınıf | Görünüm | Kullanım |
|---|---|---|
| `.btn-primary` | `bg:--green`, white metin | Ana CTA |
| `.btn-secondary` | `border:--ink`, şeffaf | İkincil aksiyon |
| `.btn-ghost` | `border:--border`, şeffaf | Tablo aksiyonları |
| `.btn-outline-white` | `border:rgba(white,0.5)` | Koyu yüzey üzeri |
| `.btn-danger` | `bg:--error`, white | Sil, iptal |
| `.btn-wa` | `bg:#25D366`, white | WhatsApp |

Tüm butonlar: `border-radius:2px`, `font-family:--font-ui`, `letter-spacing:0.12em`, `text-transform:uppercase`, hover → `translateY(-2px)`

### 3.4 Grid & Spacing
```
Section padding   : 6rem 0
Container max-w   : 1200px, padding: 0 2rem
1px grid trick    : gap:1px + background:var(--border) → kenarlık efekti
Form gap          : 1rem
Responsive break  : 900px (tablet), 640px (mobil)
```

### 3.5 Animasyonlar
```css
/* Scroll Reveal */
.reveal { opacity:0; transform:translateY(24px); transition:0.6s cubic-bezier(0.4,0,0.2,1); }
.reveal.visible { opacity:1; transform:translateY(0); }
/* delay varyantları: .rd1 → 0.1s, .rd2 → 0.2s, .rd3 → 0.3s */

/* Marquee */
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
/* 22s linear infinite, içerik 2x tekrar */

/* Hover geçişleri */
transition: 0.2s cubic-bezier(0.4,0,0.2,1)
```

---

## 4. SAYFA & ROUTE HARİTASI

```
/                     → Ana Sayfa (Landing)
/shop                 → Ürün Listesi
/shop/:category       → Kategori filtreli liste
/product/:id          → Ürün Detay
/studio               → Tasarım Stüdyosu
/cart                 → Sepet
/checkout             → Ödeme
/checkout/success     → Sipariş Başarılı
/corporate            → Kurumsal Sayfa
/about                → Hakkımızda
/contact              → İletişim
/faq                  → SSS

/admin                → Admin Dashboard (korumalı)
/admin/products       → Ürün Yönetimi
/admin/products/new   → Yeni Ürün
/admin/products/:id   → Ürün Düzenle
/admin/orders         → Sipariş Yönetimi
/admin/stock          → Stok Takibi
/admin/references     → Referans Yönetimi
/admin/studio-orders  → Stüdyo Siparişleri
/admin/settings       → Site Ayarları
```

---

## 5. PAYLAŞILAN BILEŞENLER

### `<MarqueeBanner />`
- `bg:--ink`, kayan metin: "TOPTAN FİYAT AVANTAJI ◆ SCROLL TRANSFORM ◆"
- `font:--font-ui`, `0.7rem`, `weight:600`, `letter-spacing:0.22em`
- Ayırıcı `◆` sembolü, renk `--green-l`

### `<TrustBar />`
- 4 madde yatay: ✓ Güvenli · ⬡ 1500₺ Kargo Bedava · → Hızlı Teslimat · ◎ Online Destek
- `border-bottom:1px --border`, ikon: 16px yuvarlak `bg:--green`

### `<Navbar />`
- `sticky top:0`, `z-index:100`, `height:68px`, `bg:white`, `border-bottom:1px --border`
- Sol: Logo `HITHL[A]İN` — "A" harfi `--green`
- Orta: TİŞÖRT / SWEATSHIRT / MONT VE CEKET / PANTOLON / ÖNLÜK / İKAZ YELEĞİ
- Sağ: Arama (Q), Stüdyo ikonu (✏), Sepet sayacı, Hesap ikonu
- Nav link hover: `color:--ink` + alt çizgi `scaleX(0→1)` animasyonu

### `<CartDrawer />`
- Sağdan kayan drawer, `width:420px`, transition `0.35s cubic-bezier(0.77,0,0.18,1)`
- Zustand `useCartStore` ile bağlı
- Boş sepet durumu, ürün listesi, toplam, "Ödemeye Geç" CTA

### `<Toast />`
- Global bildirim, `bottom:2rem center`
- `.success` → `bg:--green`, `.error` → `bg:--error`, varsayılan → `bg:--ink`
- `border-radius:99px`, `0.82rem`, fade animasyonu 2.6s

### `<SectionHeader />`
- Props: `label`, `title`, `subtitle`, `align` (left/center)
- Küçük etiket: çizgi + metin pattern

### `<Footer />`
- 3 sütun: Kategoriler · Sözleşmeler · Bülten
- Bülten: input + "ABONE OL" butonu birleşik
- Alt: Logo + telif hakkı
- `bg:--ink`

---

## 6. ANA SAYFA (Landing) — `/`

**Bölümler sırayla:**

1. `<MarqueeBanner />`
2. `<TrustBar />`
3. `<Navbar />`
4. **Hero** — 2 sütun grid, sol `--ink` panel (başlık + CTA), sağ B2B/B2C split panel
5. **Kategoriler** — 5 kart grid, `aspect-ratio:3/4`, hover emoji animasyonu
6. **Çok Satanlar** — 3 ürün kartı, hover scale efekti
7. **Kendin Tasarla** — sol `--green` panel + sağ floating canvas önizleme
8. **Kurumsal Çözümler** — 2 kart (Baskı/Nakış · Toptan Dikim), numbered (01/02)
9. **Neden Biz + İstatistikler** — `--ink` bölüm, sol özellik listesi, sağ büyük rakamlar
10. **Referanslar** — logo grid (S. / PAYDIN / UMKE / @kadoil / 112) + testimonial
11. **Hakkımızda** — görsel sol + metin sağ, "İki Kardeşin Hikayesi"
12. **Müşteri Yorumları** — 3 kart, ★★★★★
13. **SSS Özeti** — 4 soru akordeon
14. **İletişim Özeti** — adres/email/tel + form
15. **Instagram** — 6 fotoğraf grid
16. `<Footer />`

---

## 7. ÜRÜN LİSTESİ — `/shop`

```
Layout:
  - Sol: filtre sidebar (240px, sticky)
  - Sağ: ürün grid (auto-fill, minmax 260px)

Filtre Sidebar:
  - Kategori checkbox listesi
  - Fiyat aralığı (min/max input veya range slider)
  - Renk swatches (tıklanabilir daireler)
  - Beden checkbox (XS S M L XL XXL)
  - "Filtreleri Temizle" link

Ürün Kartı (.product-card):
  - Görsel: aspect-ratio 3/4, hover → img scale(1.04)
  - Badge: "Çok Satan" (--green) / "Yeni" (--ink) / "Son Stok" (--warning)
  - Hızlı ekle butonu: hover'da görselin altından çıkar (translateY animasyonu)
  - Renk swatches (4'ten fazlaysa "+N daha")
  - Fiyat: Barlow Condensed 900

Üst Bar:
  - Sonuç sayısı + sıralama dropdown (Önerilen/Fiyat Az-Çok/Yeni)
  - Grid/Liste görünüm toggle

Sayfalama: "Daha Fazla Yükle" butonu (infinite scroll değil, explicit)
```

---

## 8. ÜRÜN DETAY — `/product/:id`

```
Layout: 2 sütun grid (sağ sticky)

Sol — Görsel Galerisi:
  - Büyük ana görsel (aspect-ratio 4/5)
  - Alt thumbnail strip (yatay scroll)
  - "Stüdyoda Özelleştir" banner (--green-xl bg, stüdyoya link)

Sağ — Ürün Bilgisi (sticky top:80px):
  - Breadcrumb: Ana Sayfa > Kategori > Ürün
  - Marka etiketi (küçük, --subtle)
  - H1: Barlow Condensed 900, büyük
  - Fiyat: --green rengi, büyük
  - Stok durumu badge
  - ─────────────────
  - Renk Seçimi: büyük swatch'lar (32px), seçili = --ink border + outline
  - Beden Seçimi: 48px kare butonlar, tükenmiş = çizgili + opacity:0.3
  - Beden Rehberi linki (modal açar)
  - ─────────────────
  - Adet: −/+ kontrol
  - "Sepete Ekle" → btn-primary (tam genişlik)
  - "Tasarımla Ekle" → btn-secondary (tam genişlik, stüdyoya yönlendirir)
  - ─────────────────
  - Ürün Açıklaması (collapsible)
  - Kumaş & Bakım (collapsible)
  - Kargo & İade (collapsible)

Alt Bölüm:
  - "Bu Ürünü Beğenenlerin İlgilendiği" → 4 ürün kartı
```

---

## 9. TASARIM STÜDYOSU — `/studio`

> Fabric.js tabanlı tam gelişmiş canvas editörü.

```
GENEL LAYOUT:
┌─────────────────────────────────────────────────┐
│  Stüdyo Navbar (logo + adım göstergesi + kaydet)│
├──────────┬──────────────────────┬───────────────┤
│  SOL     │   ORTA CANVAS        │  SAĞ          │
│  ARAÇLAR │   (Fabric.js)        │  ÖZELLİKLER  │
│  (240px) │                      │  (280px)      │
└──────────┴──────────────────────┴───────────────┘
│                 ALT PANEL                        │
│         Ürün Seçimi & Beden & Renk               │
└─────────────────────────────────────────────────┘

SOL ARAÇ PANELİ:
  Gruplar (accordion):
  ① Tasarım Yükle
     - Sürükle-bırak upload alanı
     - "Dosya Seç" butonu
     - Kabul: PNG, JPG, SVG (max 10MB)
  ② Yazı Ekle
     - Yazı input alanı
     - Font ailesi dropdown (10 font)
     - Font boyutu slider
     - Renk picker
     - Bold / İtalic / Underline toggle
     - "Ekle" butonu → canvas'a Text nesnesi
  ③ Şekil Ekle
     - Kare, Daire, Üçgen, Çizgi ikonları
     - Renk picker + stroke picker
  ④ Baskı Bölgesi
     - Ön / Arka toggle
     - Sol göğüs / Sağ göğüs / Orta / Sırt
     - Her bölge canvas'ta mavi kesikli çerçeve ile gösterilir
  ⑤ Arka Plan
     - Saydam kalır seçeneği
     - Düz renk picker

ORTA CANVAS:
  - Fabric.js canvas, 500x600px görüntüleme alanı
  - Ürün mockup'ı canvas'ın altında statik img olarak
  - Seçili nesne: mavi tutamaçlı transform box
  - Araç çubuğu (canvas üstünde):
    ↩ Geri Al · ↪ İleri Al · ⧉ Kopyala · 🗑 Sil · ⇅ Katman Yukarı · ⇅ Katman Aşağı
  - Canvas zoom: scroll + Ctrl
  - Baskı bölgesi kılavuz çizgileri toggle (göster/gizle)

SAĞ ÖZELLİK PANELİ:
  (Seçili nesne yokken boş / nesne seçiliyken dolu)
  - Pozisyon: X, Y input
  - Boyut: W, H input + kilit oranı
  - Döndür: açı slider + input
  - Opaklık: slider (0-100)
  - Nesne türüne göre ek özellikler:
    • Görsel: brightness, contrast slider
    • Yazı: tüm yazı özellikleri
    • Şekil: fill, stroke, stroke-width

ALT PANEL — ÜRÜN & VARYANTLEŞTİRME:
  Adım 1 - Ürün Seç:
    Küçük ürün kartları yatay scroll (tişört modelleri)
    Seçili kart: --green border
  Adım 2 - Renk Seç:
    Büyük renk swatch'ları
    Mockup rengi anlık güncellenir (CSS filter veya canvas overlay)
  Adım 3 - Beden & Adet:
    Her beden için ayrı adet input (toplu sipariş için)
    Toplam adet + birim fiyat + toplam fiyat özeti
  Adım 4 - Sepete Ekle:
    Tasarım PNG olarak Fabric.js'ten export edilir
    Ürün + renk + bedenler + tasarım veri olarak sepete eklenir

DURUM YÖNETİMİ (Zustand — useStudioStore):
  {
    canvas: null,           // Fabric.js canvas instance
    product: null,          // seçili ürün
    color: null,            // seçili renk
    sizes: {},              // { S: 2, M: 3 } gibi
    printArea: 'front',     // front | back
    printZone: 'center',    // sol-göğüs | sağ-göğüs | orta | sırt
    history: [],            // undo/redo stack
    historyIndex: -1,
    designDataURL: null,    // export edilen PNG
  }
```

---

## 10. SEPET — `/cart`

```
Layout: 2 sütun (ürünler 1fr | özet 380px sticky)

Sol — Ürün Listesi:
  - Her satır: thumbnail (80px) + ürün bilgisi + adet kontrol + fiyat + sil
  - Stüdyo siparişleri için tasarım önizleme thumbnail'i gösterilir
  - "Alışverişe Devam Et" linki

Sağ — Sipariş Özeti (sticky):
  - Ara toplam
  - Kargo: "1500₺ üzeri bedava" bilgi satırı
  - İndirim kodu input + "Uygula" butonu
  - Toplam (büyük, --ink)
  - "Ödemeye Geç" → btn-primary tam genişlik
  - Güvenli ödeme ikonları (SSL, vs)
  - "veya WhatsApp ile Sipariş Ver" → btn-wa
```

---

## 11. ÖDEME — `/checkout`

```
Adım Göstergesi: Bilgiler ── Kargo ── Ödeme (linear stepper)

Adım 1 — Kişisel Bilgiler:
  Ad Soyad | E-posta
  Telefon | (boş)
  İl dropdown | İlçe dropdown
  Adres textarea
  "Devam Et" → btn-primary

Adım 2 — Kargo:
  Kargo seçenekleri (radio card):
    • Standart (3-5 iş günü) — Ücretsiz (1500₺ üzeri) / 79₺
    • Hızlı (1-2 iş günü) — 149₺
  Sipariş notu textarea (opsiyonel)

Adım 3 — Ödeme:
  Kart bilgileri formu (sadece UI, gerçek entegrasyon backend'de):
    Kart No (4 gruplu otomatik boşluk)
    Ad Soyad
    MM/YY | CVV
  Sipariş özeti tekrarı (mini versiyon)
  "Siparişi Tamamla" → btn-primary

Başarı Sayfası (/checkout/success):
  Büyük ✓ ikonu (--green)
  "Siparişiniz Alındı!" başlığı
  Sipariş numarası
  E-posta gönderildi bilgisi
  "Alışverişe Devam Et" + "WhatsApp ile Takip Et" butonları
```

---

## 12. ADMİN PANELİ — `/admin/*`

> JWT korumalı. Login yoksa `/admin/login`'e yönlendir.

```
LAYOUT:
┌──────────────┬─────────────────────────────────┐
│   SIDEBAR    │        MAIN CONTENT             │
│   (220px)    │                                 │
│   bg:--ink   │   bg:#f8f7f3                    │
└──────────────┴─────────────────────────────────┘

SIDEBAR:
  - Logo: "HITH[L]AİN Admin" — "L" harfi --green
  - Nav items (ikon + etiket):
    📊 Dashboard
    👕 Ürünler
    📦 Stok Takibi
    📋 Siparişler
    🎨 Stüdyo Siparişleri
    🏢 Referanslar
    ⚙️  Site Ayarları
    ← Siteye Dön
  - Aktif item: --green left border + hafif yeşil arkaplan
  - Alt: kullanıcı adı + çıkış

TOPBAR (her sayfada):
  - Sayfa başlığı (Barlow Condensed)
  - Sağ: breadcrumb + kullanıcı

─── DASHBOARD (/admin) ───
  İstatistik kartları (4'lü grid):
    Toplam Ürün · Aktif Sipariş · Bu Ay Ciro · Düşük Stok Uyarısı
  Hızlı aksiyonlar: Ürün Ekle · Stok Güncelle
  Son 5 Sipariş tablosu
  Son 5 Stüdyo Siparişi tablosu
  Stok uyarı listesi (stok < 5 olan varyantlar)

─── ÜRÜN YÖNETİMİ (/admin/products) ───
  Üst: "Yeni Ürün Ekle" butonu + arama input + kategori filtresi
  Tablo sütunları:
    Görsel (50px) | Ad | Kategori | Fiyat | Stok | Durum | İşlem (Düzenle/Sil)
  Satır hover: hafif --off arkaplan

  Yeni/Düzenle Formu (/admin/products/new veya /:id):
    2 sütun grid:
    Sol:
      - Ürün Adı
      - Kategori dropdown
      - Fiyat (₺)
      - Açıklama (textarea)
      - Kumaş Detayı
      - Bakım Talimatları
    Sağ:
      - Görsel Upload (çoklu, sürükle-bırak)
        Yüklenen görseller küçük thumbnail + sil butonu
      - Renkler: renk ismi + hex picker + swatch önizleme (dinamik ekle/çıkar)
      - Bedenler: XS S M L XL XXL checkbox'ları
      - Başlangıç Stoku (beden x renk matrix)
      - Durum: Aktif / Taslak / Arşiv toggle
      - Öne Çıkar: checkbox
      - Yeni Ürün: checkbox

─── STOK TAKİBİ (/admin/stock) ───
  Filtre: Tümü / Düşük Stok / Tükendi
  Tablo: Ürün | Renk swatch | Beden | Mevcut Stok | Min Stok | Durum badge | Güncelle input
  Stok durum barları (0→20 arası renkli fill)
  Toplu Güncelle: csv import butonu

─── SİPARİŞ YÖNETİMİ (/admin/orders) ───
  Filtre: Tümü / Bekliyor / Hazırlanıyor / Kargoda / Tamamlandı / İptal
  Tablo: #ID | Müşteri | Ürünler (mini list) | Toplam | Tarih | Durum | Detay
  Detay modalı:
    Müşteri bilgileri
    Ürün listesi (görsel + beden + adet + fiyat)
    Kargo bilgisi
    Durum değiştir dropdown + "Güncelle" butonu
    Notlar alanı

─── STÜDYO SİPARİŞLERİ (/admin/studio-orders) ───
  Tablo: #ID | Müşteri | Ürün | Tasarım Önizleme | Baskı Bölgesi | Adet | Durum
  Her siparişte tasarım PNG büyütme (modal lightbox)
  "Üretim Onayı" butonu
  Tasarım indir (PNG) butonu

─── REFERANSLAR (/admin/references) ───
  Ekleme Formu:
    Firma Adı | Sektör | Üretim Adedi
    Proje Açıklaması (textarea)
    Logo Upload
    Proje Görselleri Upload
    Aktif/Gizli toggle
  Tablo: Logo | Firma | Adet | Sektör | Durum | İşlem

─── SITE AYARLARI (/admin/settings) ───
  Genel:
    Site Adı | Meta Açıklama
    WhatsApp Numarası
    Instagram Handle
    Adres/E-posta/Telefon
  Kargo:
    Ücretsiz kargo limiti (₺)
    Standart kargo ücreti
    Hızlı kargo ücreti
  Marquee Metni (textarea, her satır bir öğe)
  Trust Bar öğeleri
  Kaydet butonu
```

---

## 13. VERİTABANI ŞEMASI (Prisma)

```prisma
model Product {
  id          Int       @id @default(autoincrement())
  name        String
  slug        String    @unique
  description String?
  fabric      String?
  care        String?
  category    String
  price       Float
  images      String[]
  isFeatured  Boolean   @default(false)
  isNew       Boolean   @default(false)
  status      String    @default("active") // active | draft | archived
  variants    Variant[]
  orderItems  OrderItem[]
  studioItems StudioOrderItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Variant {
  id        Int     @id @default(autoincrement())
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  size      String
  color     String
  colorHex  String
  stock     Int     @default(0)
  minStock  Int     @default(5)
}

model Order {
  id           Int         @id @default(autoincrement())
  customerName String
  email        String
  phone        String
  address      String
  city         String
  district     String
  total        Float
  shippingFee  Float       @default(0)
  status       String      @default("pending")
  note         String?
  items        OrderItem[]
  createdAt    DateTime    @default(now())
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   Int
  product   Product @relation(fields: [productId], references: [id])
  productId Int
  size      String
  color     String
  quantity  Int
  price     Float
}

model StudioOrder {
  id           Int                @id @default(autoincrement())
  customerName String
  email        String
  phone        String
  designUrl    String
  printArea    String
  printZone    String
  status       String             @default("pending")
  items        StudioOrderItem[]
  createdAt    DateTime           @default(now())
}

model StudioOrderItem {
  id            Int         @id @default(autoincrement())
  studioOrder   StudioOrder @relation(fields: [studioOrderId], references: [id])
  studioOrderId Int
  product       Product     @relation(fields: [productId], references: [id])
  productId     Int
  color         String
  sizes         Json        // { "S": 2, "M": 3 }
  price         Float
}

model Reference {
  id          Int      @id @default(autoincrement())
  clientName  String
  sector      String?
  description String?
  logoUrl     String?
  images      String[]
  quantity    Int?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Admin {
  id        Int    @id @default(autoincrement())
  email     String @unique
  password  String
}

model Setting {
  id    Int    @id @default(autoincrement())
  key   String @unique
  value String
}
```

---

## 14. ZUSTAND STORE'LARI

### `useCartStore`
```js
{
  items: [],            // { key, product, size, color, qty, isStudio, designUrl }
  isOpen: false,
  addItem(product, size, color, qty, isStudio?, designUrl?),
  removeItem(key),
  updateQty(key, qty),
  clearCart(),
  openCart(), closeCart(),
  get totalItems(),
  get totalPrice(),
}
```

### `useStudioStore`
```js
{
  canvas: null,
  product: null,
  color: null,
  sizes: {},
  printArea: 'front',
  printZone: 'center',
  history: [],
  historyIndex: -1,
  designDataURL: null,
  setCanvas(c), setProduct(p), setColor(c),
  setSizeQty(size, qty),
  setPrintArea(area), setPrintZone(zone),
  saveHistory(), undo(), redo(),
  exportDesign(),           // Fabric.js → PNG dataURL
}
```

### `useAdminStore`
```js
{
  user: null,
  token: null,
  login(email, password),   // → JWT
  logout(),
  isAuthenticated(),
}
```

---

## 15. API ROUTE'LARI (Express)

```
GET    /api/products              → liste (filtre: category, sort, page)
GET    /api/products/:id          → detay
POST   /api/products              → ekle [ADMIN]
PUT    /api/products/:id          → güncelle [ADMIN]
DELETE /api/products/:id          → sil [ADMIN]

GET    /api/variants/product/:id  → ürün varyantları
PUT    /api/variants/:id/stock    → stok güncelle [ADMIN]

POST   /api/orders                → yeni sipariş
GET    /api/orders                → liste [ADMIN]
GET    /api/orders/:id            → detay [ADMIN]
PUT    /api/orders/:id/status     → durum güncelle [ADMIN]

POST   /api/studio-orders         → yeni stüdyo siparişi
GET    /api/studio-orders         → liste [ADMIN]
PUT    /api/studio-orders/:id/status → durum güncelle [ADMIN]

GET    /api/references            → aktif referanslar
POST   /api/references            → ekle [ADMIN]
PUT    /api/references/:id        → güncelle [ADMIN]
DELETE /api/references/:id        → sil [ADMIN]

POST   /api/auth/login            → JWT al
POST   /api/upload                → görsel yükle [ADMIN]

GET    /api/settings              → ayarlar
PUT    /api/settings              → güncelle [ADMIN]
```

---

## 16. GENEL KURALLAR

1. **Her zaman CSS Modules** — global class yazmak yasak, tek istisna `:root` değişkenleri
2. **`--border` trick** — grid/tablo kenarlığı için `gap:1px + background:var(--border)`
3. **Yeşil ekonomisi** — `--green` sadece CTA, ikon, seçili durum, badge için
4. **Ghost typography** — hero/section arka planına dev yarı saydam başlık (opacity 0.03–0.06)
5. **Section label pattern** — her bölüm `20px çizgi + küçük uppercase etiket` ile başlar
6. **Boş durum tasarımı** — boş liste, boş sepet, 0 sonuç için her zaman özel UI
7. **Responsive önce mobil** — 900px ve 640px breakpoint, sidebar'lar drawer'a dönüşür
8. **Admin koruması** — `/admin/*` route'ları `<ProtectedRoute>` ile sarılır
9. **WhatsApp fallback** — ödeme yoksa siparişler WhatsApp'a yönlendirilir
10. **Tutarlı loading state** — her async işlem için skeleton veya spinner göster

---

## 17. SPRINT PLANI

```
Sprint 1 — Temel Altyapı
  □ Vite + React + Router scaffold
  □ CSS değişkenleri + global stiller
  □ Shared bileşenler: Navbar, Footer, Toast, CartDrawer
  □ Mock data katmanı

Sprint 2 — Vitrin Sayfaları
  □ Landing (tüm section'lar)
  □ Shop + filtre sidebar
  □ Product Detail

Sprint 3 — Stüdyo
  □ Fabric.js entegrasyonu
  □ Sol araç paneli
  □ Sağ özellik paneli
  □ Ürün seçimi + stüdyo Zustand store

Sprint 4 — Sepet & Ödeme
  □ Cart sayfası
  □ Checkout adım akışı
  □ Başarı sayfası

Sprint 5 — Admin Paneli
  □ Login + JWT
  □ Dashboard
  □ Ürün CRUD + görsel upload
  □ Stok yönetimi
  □ Sipariş + stüdyo sipariş yönetimi
  □ Referans yönetimi

Sprint 6 — Backend
  □ Express + Prisma kurulum
  □ Tüm API route'ları
  □ Auth middleware
  □ Frontend → API bağlantısı (mock → gerçek)

Sprint 7 — Polish
  □ Scroll reveal animasyonları
  □ SEO meta tag'leri
  □ Responsive testler
  □ Error boundary'ler
  □ Loading skeleton'lar
```
