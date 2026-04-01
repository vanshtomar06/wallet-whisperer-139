import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, UserRole, Category, TransactionType } from "@/types/finance";
import { mockTransactions } from "@/data/mockData";

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface FinanceStore {
  transactions: Transaction[];
  role: UserRole;
  filters: Filters;
  darkMode: boolean;
  activeTab: string;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: string) => void;
}

const defaultFilters: Filters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: "admin",
      filters: defaultFilters,
      darkMode: false,
      activeTab: "dashboard",
      setRole: (role) => set({ role }),
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...state.transactions,
          ],
        })),
      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      toggleDarkMode: () =>
        set((state) => {
          const newDark = !state.darkMode;
          if (newDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: newDark };
        }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "finance-dashboard-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
