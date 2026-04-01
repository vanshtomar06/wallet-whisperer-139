import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useFilteredTransactions } from "@/hooks/useFinanceData";
import { Category, TransactionType, Transaction } from "@/types/finance";
import {
  Search,
  ArrowUpDown,
  Filter,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Download,
} from "lucide-react";
import TransactionFormDialog from "./TransactionFormDialog";

const categories: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Shopping",
  "Transportation", "Entertainment", "Bills & Utilities", "Healthcare",
  "Travel", "Education", "Other",
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}

export default function TransactionsTable() {
  const { role, filters, setFilters, deleteTransaction } = useFinanceStore();
  const filtered = useFilteredTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const isAdmin = role === "admin";

  const handleSort = (by: "date" | "amount") => {
    if (filters.sortBy === by) {
      setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortBy: by, sortOrder: "desc" });
    }
  };

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filtered
      .map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
      {/* Header & Filters */}
      <div className="p-5 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-semibold text-card-foreground">Transactions</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            {isAdmin && (
              <button
                onClick={() => { setEditingTx(null); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as TransactionType | "all" })}
            className="px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value as Category | "all" })}
            className="px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(filters.search || filters.type !== "all" || filters.category !== "all") && (
            <button
              onClick={() => useFinanceStore.getState().resetFilters()}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th
                className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("date")}
              >
                <span className="inline-flex items-center gap-1">
                  Date <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Type</th>
              <th
                className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("amount")}
              >
                <span className="inline-flex items-center justify-end gap-1">
                  Amount <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              {isAdmin && (
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-3 font-medium text-card-foreground">{tx.description}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                      {tx.type === "income" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold tabular-nums ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => { setEditingTx(tx); setShowForm(true); }}
                          className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionFormDialog
          transaction={editingTx}
          onClose={() => { setShowForm(false); setEditingTx(null); }}
        />
      )}
    </div>
  );
}
