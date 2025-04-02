import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  selectedStoreId: number | null;
  storeData: any;
  setSelectedStore: (storeId: number | null, items: any) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      selectedStoreId: null,
      storeData: [],
      setSelectedStore: (storeId, items) =>
        set({ selectedStoreId: storeId, storeData: items }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
