import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Transaction } from "@/types/finance";

export function useFilteredTransactions() {
  const { transactions, filters } = useFinanceStore();

  return useMemo(() => {
    let filtered = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    filtered.sort((a, b) => {
      const dir = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") {
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return dir * (a.amount - b.amount);
    });

    return filtered;
  }, [transactions, filters]);
}

export function useFinanceSummary() {
  const { transactions } = useFinanceStore();

  return useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCategory = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b - a
    )[0];

    return { totalIncome, totalExpenses, balance, categoryBreakdown, topCategory };
  }, [transactions]);
}
