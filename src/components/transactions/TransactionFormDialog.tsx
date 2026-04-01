import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Transaction, Category, TransactionType } from "@/types/finance";
import { X } from "lucide-react";

const categories: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Shopping",
  "Transportation", "Entertainment", "Bills & Utilities", "Healthcare",
  "Travel", "Education", "Other",
];

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionFormDialog({ transaction, onClose }: Props) {
  const { addTransaction, editTransaction } = useFinanceStore();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
    amount: transaction?.amount.toString() || "",
    category: transaction?.category || ("Food & Dining" as Category),
    type: transaction?.type || ("expense" as TransactionType),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
    };
    if (isEdit) {
      editTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4 shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-card-foreground">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Amount</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                className="w-full px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-3 py-2 text-sm rounded-md bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
