"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction } from "../api";

interface PaymentStore {
  lastTransaction: Transaction | null;
  setLastTransaction: (transaction: Transaction) => void;
  clearLastTransaction: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      lastTransaction: null,
      setLastTransaction: (transaction) => set({ lastTransaction: transaction }),
      clearLastTransaction: () => set({ lastTransaction: null }),
    }),
    {
      name: "payment-store",
    }
  )
);
