import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, ShippingAddress } from '@/types';

interface CartStore {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;

  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, qty: number) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  clearCart: () => void;

  // Computed values
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: null,
      paymentMethod: 'Concordato',
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,

      addToCart: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x.product === item.product);

        let newCartItems;
        if (existItem) {
          // Update quantity if item already exists
          newCartItems = state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          );
        } else {
          // Add new item
          newCartItems = [...state.cartItems, item];
        }

        // Calculate prices
        const itemsPrice = newCartItems.reduce((a, c) => a + c.priceVal * c.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = 0.15 * itemsPrice;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        return {
          cartItems: newCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        };
      }),

      removeFromCart: (productId) => set((state) => {
        const newCartItems = state.cartItems.filter((x) => x.product !== productId);

        // Recalculate prices
        const itemsPrice = newCartItems.reduce((a, c) => a + c.priceVal * c.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = 0.15 * itemsPrice;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        return {
          cartItems: newCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        };
      }),

      updateCartItemQty: (productId, qty) => set((state) => {
        const newCartItems = state.cartItems.map((x) =>
          x.product === productId ? { ...x, qty } : x
        );

        // Recalculate prices
        const itemsPrice = newCartItems.reduce((a, c) => a + c.priceVal * c.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = 0.15 * itemsPrice;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        return {
          cartItems: newCartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        };
      }),

      saveShippingAddress: (address) => set({ shippingAddress: address }),

      savePaymentMethod: (method) => set({ paymentMethod: method }),

      clearCart: () => set({
        cartItems: [],
        shippingAddress: null,
        paymentMethod: 'Concordato',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
