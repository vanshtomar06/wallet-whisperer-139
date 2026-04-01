export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investments"
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills & Utilities"
  | "Healthcare"
  | "Travel"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export type UserRole = "viewer" | "admin";

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}
