export function getCart() {

  return JSON.parse(

    localStorage.getItem("cart") || "[]"

  );

}

function saveCart(cart) {

  localStorage.setItem(

    "cart",

    JSON.stringify(cart)

  );

  window.dispatchEvent(

    new Event("cartUpdated")

  );

}

// -----------------------------

// Add Product

// -----------------------------

export function addToCart(product) {

  const cart = getCart();

  const existing = cart.find(
  p => p.id === product._id
);

  if (existing) {

    existing.quantity += 1;

  }

  else {

    cart.push({

      id: product._id,

      title: product.title,

      price: Number(product.price),

      coverImage: product.coverImage,

      quantity: 1

    });

  }

  saveCart(cart);

}

// -----------------------------

// Remove Product

// -----------------------------

export function removeFromCart(productId) {

  const cart = getCart().filter(

    item => item.id !== productId

  );

  saveCart(cart);

}

// -----------------------------

// Increase Quantity

// -----------------------------

export function increaseQuantity(productId) {

  const cart = getCart();

  const item = cart.find(

    p => p.id === productId

  );

  if (item) {

    item.quantity++;

  }

  saveCart(cart);

}

// -----------------------------

// Decrease Quantity

// -----------------------------

export function decreaseQuantity(productId) {

  const cart = getCart();

  const item = cart.find(

    p => p.id === productId

  );

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {

    removeFromCart(productId);

    return;

  }

  saveCart(cart);

}

// -----------------------------

// Update Quantity

// -----------------------------

export function updateQuantity(

  productId,

  quantity

) {

  const cart = getCart();

  const item = cart.find(

    p => p.id === productId

  );

  if (!item) return;

  item.quantity = Number(quantity);

  if (item.quantity <= 0) {

    removeFromCart(productId);

    return;

  }

  saveCart(cart);

}

// -----------------------------

// Clear Cart

// -----------------------------

export function clearCart() {

  saveCart([]);

}

// -----------------------------

// Total Price

// -----------------------------

export function getCartTotal() {

  return getCart().reduce(

    (total, item) =>

      total +

      item.price *

      item.quantity,

    0

  );

}

// -----------------------------

// Total Items

// -----------------------------

export function getCartCount() {

  return getCart().reduce(

    (count, item) =>

      count +

      item.quantity,

    0

  );

}