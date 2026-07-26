import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Collections from './pages/Collections.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Sale from "./pages/Sale.jsx";
import Wishlist from "./pages/Wishlist.jsx";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/success"element={<Success />}/>
        <Route path="/my-orders"element={<MyOrders />}/>
      </Route>
    </Routes>
  );
}
