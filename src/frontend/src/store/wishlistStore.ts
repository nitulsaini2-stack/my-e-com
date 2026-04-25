import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

interface WishlistStore {
  items: Product[];
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === product.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== product.id) };
          }
          return { items: [...state.items, product] };
        }),
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
    }),
    { name: "my-ecom-wishlist" },
  ),
);
