'use client';

const CART_KEY = 'ijn_cart';

export type CartItem = {
  productId: 'peach' | 'plum' | 'berry';
  productName: string;
  engraveName: string;
  price: number;
  quantity: number;
};

function dispatchCartUpdated(): void {
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchCartUpdated();
}

/**
 * Add an item to cart.
 * - Same product + same engrave name = increase quantity
 * - Same product + different name = separate item
 */
export function addToCart(item: CartItem): void {
  const cart = getCart();

  const existing = cart.find(
    (c) => c.productId === item.productId && c.engraveName === item.engraveName,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }

  saveCart(cart);
}

export function removeFromCart(index: number): void {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart(cart);
}

export function updateQuantity(index: number, qty: number): void {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;

  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = qty;
  }

  saveCart(cart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  dispatchCartUpdated();
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
