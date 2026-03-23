import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { SiteContentProvider } from './hooks/useSiteContent'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import MarqueeBanner from './components/MarqueeBanner/MarqueeBanner'
import TrustBar from './components/TrustBar/TrustBar'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import CartDrawer from './components/CartDrawer/CartDrawer'
import Toast from './components/Toast/Toast'

import Welcome from './pages/Welcome/Welcome'
import Home from './pages/Home/Home'
import Shop from './pages/Shop/Shop'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Studio from './pages/Studio/Studio'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess/CheckoutSuccess'
import Corporate from './pages/Corporate/Corporate'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import FAQ from './pages/FAQ/FAQ'
import MyOrders from './pages/MyOrders/MyOrders'
import Legal from './pages/Legal/Legal'

import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/Login/Login'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import Products from './pages/admin/Products/Products'
import ProductForm from './pages/admin/Products/ProductForm'
import Stock from './pages/admin/Stock/Stock'
import Orders from './pages/admin/Orders/Orders'
import StudioOrders from './pages/admin/StudioOrders/StudioOrders'
import References from './pages/admin/References/References'
import Settings from './pages/admin/Settings/Settings'
import SiteContent from './pages/admin/SiteContent/SiteContent'

function PublicLayout() {
  return (
    <>
      <TrustBar />
      <Navbar />
      <MarqueeBanner />
      <CartDrawer />
      <Toast />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <SiteContentProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/privacy" element={<Legal slug="privacy" />} />
          <Route path="/terms" element={<Legal slug="terms" />} />
          <Route path="/return-policy" element={<Legal slug="returnPolicy" />} />
          <Route path="/kvkk" element={<Legal slug="kvkk" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="stock" element={<Stock />} />
          <Route path="orders" element={<Orders />} />
          <Route path="studio-orders" element={<StudioOrders />} />
          <Route path="references" element={<References />} />
          <Route path="settings" element={<Settings />} />
          <Route path="site-content" element={<SiteContent />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </SiteContentProvider>
    </ErrorBoundary>
  )
}
