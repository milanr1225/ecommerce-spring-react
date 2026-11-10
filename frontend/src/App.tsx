import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductListPage from './pages/ProductListPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App