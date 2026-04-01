import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useFinanceSummary } from "@/hooks/useFinanceData";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}

export default function SummaryCards() {
  const { totalIncome, totalExpenses, balance } = useFinanceSummary();
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      icon: Wallet,
      accent: "text-primary",
      bgAccent: "bg-primary/10",
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      accent: "text-income",
      bgAccent: "bg-income/10",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      accent: "text-expense",
      bgAccent: "bg-expense/10",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      icon: DollarSign,
      accent: "text-chart-6",
      bgAccent: "bg-chart-6/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="glass-card rounded-lg p-5 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <div className={`${card.bgAccent} p-2 rounded-lg`}>
              <card.icon className={`h-4 w-4 ${card.accent}`} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
