import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cart.js';
import { formatPrice } from '../utils/currency.js';
import { isLoggedIn } from '../services/customerAuth.js';
import { getMe, getAddresses } from '../services/customerProfile.js';

const API = import.meta.env.VITE_API_BASE_URL;

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const STATE_NAMES = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UK: 'Uttarakhand',
  WB: 'West Bengal',
  DL: 'Delhi',
};

const inputClasses =
  'min-h-12 w-full rounded-md border border-line bg-ivory px-4 text-ink placeholder:text-muted focus:border-maroon focus:outline-none disabled:bg-ivory-soft disabled:text-muted';

export default function Checkout() {
  const navigate = useNavigate();

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) return;

    async function loadSavedAddresses() {
      try {
        const [me, addresses] = await Promise.all([getMe(), getAddresses()]);

        setForm((current) => ({ ...current, email: current.email || me.email || '' }));
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          applyAddress(defaultAddress);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function applyAddress(addr) {
    setSelectedAddressId(addr._id);
    setForm((current) => ({
      ...current,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }));
    setDeliveryStatus('');
  }

  async function checkPincode(pin) {
    if (pin.length !== 6) return;

    setCheckingPincode(true);

    try {
      const res = await fetch(`${API}/public/check-serviceability?pincode=${pin}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Unable to check serviceability');
      }

      if (data.delivery_codes && data.delivery_codes.length > 0) {
        const office = data.delivery_codes[0].postal_code;

        setForm((current) => ({
          ...current,
          city: office.city,
          state: STATE_NAMES[office.state_code] || office.state_code,
        }));

        setDeliveryStatus(`Delivery available in ${office.city}`);
      } else {
        setDeliveryStatus('Delivery Not Available');
      }
    } catch (err) {
      console.error(err);
      setDeliveryStatus('Unable to check delivery');
    } finally {
      setCheckingPincode(false);
    }
  }

  async function placeOrder() {
    setLoading(true);

    if (cart.length === 0) {
      setLoading(false);
      return alert('Your cart is empty.');
    }

    if (!form.name.trim()) {
      setLoading(false);
      return alert('Please enter your name.');
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setLoading(false);
      return alert('Please enter a valid 10-digit phone number.');
    }

    if (!form.address.trim()) {
      setLoading(false);
      return alert('Please enter your address.');
    }

    if (!form.city.trim()) {
      setLoading(false);
      return alert('Please enter your city.');
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setLoading(false);
      return alert('Please enter a valid 6-digit pincode.');
    }

    try {
      const productsResponse = await fetch(`${API}/products`);

      const productList = await productsResponse.json();

      for (const item of cart) {
        const latest = productList.find(
          (p) => String(p._id) === String(item.id) || String(p.id) === String(item.id)
        );

        if (!latest) {
          throw new Error(`${item.title} no longer exists.`);
        }

        if (latest.stock < item.quantity) {
          throw new Error(`${item.title} only has ${latest.stock} item(s) left in stock.`);
        }
      }

      const orderPayload = {
        customer: form.name,
        email: form.email || '',
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        amount: total,
        items: cart.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const orderRequest = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRequest.ok) {
        throw new Error('Unable to create order');
      }

      const pendingOrder = await orderRequest.json();
      const payment = await fetch(`${API}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId: pendingOrder.id,
        }),
      });

      const order = await payment.json();

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        order_id: order.id,
        name: 'Silkwaves',
        description: 'Saree Purchase',
        handler: async function (response) {
          try {
            const verify = await fetch(`${API}/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: pendingOrder.id,
              }),
            });

            const verifyResult = await verify.json();

            if (!verify.ok) {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }

            localStorage.removeItem('cart');

            window.dispatchEvent(new Event('cartUpdated'));

            navigate('/success');
          } catch (err) {
            alert(err.message);
          }
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-14 md:py-16">
      <span className="eyebrow">Checkout</span>
      <h1 className="mt-2 mb-8 text-h1">Complete Order</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="grid gap-4">
          {savedAddresses.length > 0 && (
            <div className="grid gap-2 rounded-lg border border-line bg-ivory-soft p-4">
              <span className="text-sm font-semibold text-muted">Use a saved address</span>
              <div className="grid gap-2">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    className={`rounded-md border p-3 text-left text-sm transition-colors ${
                      selectedAddressId === addr._id
                        ? 'border-maroon bg-ivory'
                        : 'border-line bg-ivory hover:border-maroon'
                    }`}
                    onClick={() => applyAddress(addr)}
                  >
                    <strong>{addr.label || 'Address'}</strong> — {addr.name}, {addr.address}, {addr.city}
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            className={inputClasses}
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />

          <input
            className={inputClasses}
            placeholder="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />

          <input
            className={inputClasses}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />

          <input
            className={inputClasses}
            placeholder="Address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />

          <input className={inputClasses} placeholder="City" value={form.city} readOnly disabled />
          <input className={inputClasses} placeholder="State" value={form.state} readOnly disabled />

          <input
            className={inputClasses}
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => {
              const pin = e.target.value;

              update('pincode', pin);

              if (pin.length === 6) {
                checkPincode(pin);
              }
            }}
          />

          {checkingPincode && <p className="m-0 text-sm text-muted">Checking delivery...</p>}
          {deliveryStatus && <p className="m-0 text-sm font-semibold text-maroon">{deliveryStatus}</p>}
        </div>

        <div className="h-fit rounded-lg border border-line bg-ivory-soft p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="mb-3 flex justify-between">
              <div>
                <strong>{item.title}</strong>
                <br />
                Qty: {item.quantity}
              </div>
              <div className="tabular-nums">{formatPrice(Number(item.price) * item.quantity)}</div>
            </div>
          ))}

          <hr className="my-4 border-line" />

          <div className="mb-2 flex justify-between">
            <strong>Subtotal</strong>
            <strong className="tabular-nums">{formatPrice(total)}</strong>
          </div>

          <div className="mb-2 flex justify-between">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <hr className="my-4 border-line" />

          <div className="mb-2 flex justify-between text-xl">
            <strong>Total</strong>
            <strong className="tabular-nums text-maroon">{formatPrice(total)}</strong>
          </div>
        </div>
      </div>

      <button
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-maroon px-8 font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
        onClick={placeOrder}
        disabled={loading}
      >
        {loading ? 'Opening Payment...' : 'Pay Now'}
      </button>
    </section>
  );
}
