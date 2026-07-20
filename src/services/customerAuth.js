const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function requestOtp({ phone, email }) {
  const res = await fetch(`${API_BASE_URL}/customer/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to send OTP');
  }

  return data;
}

export async function verifyOtp({ phone, otp }) {
  const res = await fetch(`${API_BASE_URL}/customer/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Invalid OTP');
  }

  localStorage.setItem('customerToken', data.token);
  localStorage.setItem('customerPhone', data.customer.phone);
  localStorage.setItem('customerEmail', data.customer.email);
  window.dispatchEvent(new Event('customerAuthChanged'));

  return data;
}

export function getCustomerToken() {
  return localStorage.getItem('customerToken');
}

export function isLoggedIn() {
  return !!getCustomerToken();
}

export function logout() {
  localStorage.removeItem('customerToken');
  localStorage.removeItem('customerPhone');
  localStorage.removeItem('customerEmail');
  window.dispatchEvent(new Event('customerAuthChanged'));
}

export async function getMyOrders() {
  const res = await fetch(`${API_BASE_URL}/customer/orders`, {
    headers: { Authorization: `Bearer ${getCustomerToken()}` },
  });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired, please log in again');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Unable to load orders');
  }

  return data;
}
