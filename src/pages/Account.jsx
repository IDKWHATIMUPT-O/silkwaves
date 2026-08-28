import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { isLoggedIn, logout } from '../services/customerAuth.js';
import {
  getMe,
  updateMe,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../services/customerProfile.js';

const API = import.meta.env.VITE_API_BASE_URL;

const inputClasses =
  'min-h-12 w-full rounded-md border border-line bg-ivory px-4 text-ink placeholder:text-muted focus:border-maroon focus:outline-none disabled:bg-ivory-soft disabled:text-muted';

const emptyForm = {
  label: '',
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

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

export default function Account() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [isServiceable, setIsServiceable] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    async function load() {
      try {
        const [me, addressList] = await Promise.all([getMe(), getAddresses()]);
        setCustomer(me);
        setNameInput(me.name || '');
        setAddresses(addressList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  async function saveName() {
    try {
      const updated = await updateMe({ name: nameInput });
      setCustomer(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setIsServiceable(false);
    setDeliveryStatus('');
  }

  function startEdit(addr) {
    setForm({
      label: addr.label || '',
      name: addr.name || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr._id);
    setShowForm(true);
    // Existing address already has a verified pincode; re-check to refresh
    // city/state and confirm it's still serviceable before it can be saved again.
    if (addr.pincode?.length === 6) {
      checkPincode(addr.pincode);
    } else {
      setIsServiceable(false);
    }
    setDeliveryStatus('');
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function checkPincode(pin) {
    if (pin.length !== 6) return;

    setCheckingPincode(true);
    setIsServiceable(false);

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

        setIsServiceable(true);
        setDeliveryStatus(`Delivery available in ${office.city}`);
      } else {
        setForm((current) => ({ ...current, city: '', state: '' }));
        setDeliveryStatus('Delivery not available at this pincode');
      }
    } catch (err) {
      console.error(err);
      setDeliveryStatus('Unable to check delivery');
    } finally {
      setCheckingPincode(false);
    }
  }

  async function saveAddress(event) {
    event.preventDefault();
    setError('');

    if (!isServiceable) {
      setError('This pincode is not serviceable, so the address cannot be saved.');
      return;
    }

    try {
      const result = editingId
        ? await updateAddress(editingId, form)
        : await addAddress(form);

      setAddresses(result);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeAddress(addressId) {
    if (!window.confirm('Remove this address?')) return;

    try {
      const result = await deleteAddress(addressId);
      setAddresses(result);
    } catch (err) {
      setError(err.message);
    }
  }

  async function setDefault(addr) {
    try {
      const result = await updateAddress(addr._id, { isDefault: true });
      setAddresses(result);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-[min(760px,calc(100%-32px))] py-16 text-center text-muted">
        Loading account...
      </div>
    );
  }

  return (
    <section className="mx-auto w-[min(760px,calc(100%-32px))] py-14 md:py-16">
      <span className="eyebrow">Account</span>
      <h1 className="mt-2 mb-8 text-h1">My Account</h1>

      {error && (
        <p className="mb-6 rounded-lg border border-line bg-ivory p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mb-10 rounded-lg border border-line bg-ivory-soft p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-muted">
            Name
            <input
              className={inputClasses}
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-muted">
            Phone
            <input className={inputClasses} value={customer?.phone || ''} readOnly disabled />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-muted sm:col-span-2">
            Email
            <input className={inputClasses} value={customer?.email || ''} readOnly disabled />
          </label>
        </div>

        <Button className="mt-4" onClick={saveName}>
          Save Name
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button variant="secondary" onClick={startAdd}>
          <Plus size={17} /> Add Address
        </Button>
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="m-0 mb-6 rounded-lg border border-line bg-ivory p-6 text-center text-muted">
          No saved addresses yet.
        </p>
      )}

      <div className="mb-6 grid gap-4">
        {addresses.map((addr) => (
          <div key={addr._id} className="rounded-lg border border-line bg-ivory p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="eyebrow">
                {addr.label || 'Address'}
              </span>
              {addr.isDefault && (
                <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-ink">
                  Default
                </span>
              )}
            </div>
            <p className="m-0 font-semibold">{addr.name}</p>
            <p className="m-0 text-sm text-muted">{addr.phone}</p>
            <p className="m-0 text-sm text-muted">
              {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
            </p>

            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
              {!addr.isDefault && (
                <button className="text-maroon underline-offset-2 hover:underline" onClick={() => setDefault(addr)}>
                  Set as default
                </button>
              )}
              <button
                className="inline-flex items-center gap-1 text-ink underline-offset-2 hover:underline"
                onClick={() => startEdit(addr)}
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                className="inline-flex items-center gap-1 text-red-700 underline-offset-2 hover:underline"
                onClick={() => removeAddress(addr._id)}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form className="mb-10 grid gap-4 rounded-lg border border-line bg-ivory-soft p-6" onSubmit={saveAddress}>
          <h3 className="m-0 text-base font-semibold">{editingId ? 'Edit Address' : 'New Address'}</h3>

          <input
            className={inputClasses}
            placeholder="Label (Home, Office...)"
            value={form.label}
            onChange={(event) => updateForm('label', event.target.value)}
          />
          <input
            className={inputClasses}
            placeholder="Full Name"
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            required
          />
          <input
            className={inputClasses}
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => updateForm('phone', event.target.value)}
            required
          />
          <input
            className={inputClasses}
            placeholder="Address"
            value={form.address}
            onChange={(event) => updateForm('address', event.target.value)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <input className={inputClasses} placeholder="City" value={form.city} readOnly disabled />
            <input className={inputClasses} placeholder="State" value={form.state} readOnly disabled />
            <input
              className={inputClasses}
              placeholder="Pincode"
              value={form.pincode}
              onChange={(event) => {
                const pin = event.target.value.replace(/\D/g, '').slice(0, 6);

                updateForm('pincode', pin);
                setIsServiceable(false);
                setDeliveryStatus('');

                if (pin.length === 6) {
                  checkPincode(pin);
                }
              }}
              required
            />
          </div>

          {checkingPincode && <p className="m-0 text-sm text-muted">Checking delivery...</p>}
          {deliveryStatus && (
            <p className={`m-0 text-sm font-semibold ${isServiceable ? 'text-maroon' : 'text-red-700'}`}>
              {deliveryStatus}
            </p>
          )}

          <label className="flex items-center gap-2 text-sm font-semibold text-muted">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => updateForm('isDefault', event.target.checked)}
            />
            Set as default address
          </label>

          <div className="flex gap-3">
            <Button type="submit" disabled={!isServiceable || checkingPincode}>
              {editingId ? 'Save Changes' : 'Add Address'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <button
        type="button"
        className="text-sm font-semibold text-maroon underline-offset-2 hover:underline"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Log out
      </button>
    </section>
  );
}
