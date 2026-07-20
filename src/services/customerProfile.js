import { getCustomerToken, logout } from './customerAuth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCustomerToken()}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired, please log in again');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function getMe() {
  return request('/customer/me');
}

export function updateMe(payload) {
  return request('/customer/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getAddresses() {
  return request('/customer/addresses');
}

export function addAddress(payload) {
  return request('/customer/addresses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAddress(addressId, payload) {
  return request(`/customer/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteAddress(addressId) {
  return request(`/customer/addresses/${addressId}`, {
    method: 'DELETE',
  });
}
