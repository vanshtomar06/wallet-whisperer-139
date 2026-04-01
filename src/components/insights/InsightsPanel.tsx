import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useFinanceSummary } from "@/hooks/useFinanceData";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Calendar,
} from "lucide-react";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}

export default function InsightsPanel() {
  const { transactions } = useFinanceStore();
  const { totalIncome, totalExpenses, topCategory, categoryBreakdown } = useFinanceSummary();

  const insights = useMemo(() => {
    const items: { icon: typeof TrendingUp; title: string; description: string; color: string }[] = [];

    if (topCategory) {
      items.push({
        icon: BarChart3,
        title: "Highest Spending Category",
        description: `${topCategory[0]} at ${formatCurrency(topCategory[1])}, accounting for ${((topCategory[1] / totalExpenses) * 100).toFixed(1)}% of total expenses.`,
        color: "text-chart-3",
      });
    }

    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    items.push({
      icon: savingsRate >= 20 ? TrendingUp : AlertTriangle,
      title: "Savings Health",
      description: savingsRate >= 20
        ? `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`
        : `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing discretionary spending.`,
      color: savingsRate >= 20 ? "text-income" : "text-chart-3",
    });

    // Monthly comparison
    const now = new Date();
    const thisMonth = transactions.filter(
      (t) => t.type === "expense" && new Date(t.date).getMonth() === now.getMonth()
    );
    const lastMonth = transactions.filter(
      (t) => t.type === "expense" && new Date(t.date).getMonth() === now.getMonth() - 1
    );
    const thisTotal = thisMonth.reduce((s, t) => s + t.amount, 0);
    const lastTotal = lastMonth.reduce((s, t) => s + t.amount, 0);

    if (lastTotal > 0) {
      const change = ((thisTotal - lastTotal) / lastTotal) * 100;
      items.push({
        icon: Calendar,
        title: "Monthly Comparison",
        description: change > 0
          ? `Spending increased ${change.toFixed(1)}% compared to last month (${formatCurrency(lastTotal)} → ${formatCurrency(thisTotal)}).`
          : `Spending decreased ${Math.abs(change).toFixed(1)}% compared to last month (${formatCurrency(lastTotal)} → ${formatCurrency(thisTotal)}).`,
        color: change > 0 ? "text-expense" : "text-income",
      });
    }

    // Category count insight
    const catCount = Object.keys(categoryBreakdown).length;
    items.push({
      icon: Lightbulb,
      title: "Spending Diversity",
      description: `You spend across ${catCount} categories. ${catCount > 5 ? "Consider consolidating to track better." : "Focused spending is easier to manage."}`,
      color: "text-chart-6",
    });

    // Largest single transaction
    const largest = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];
    if (largest) {
      items.push({
        icon: TrendingDown,
        title: "Largest Expense",
        description: `"${largest.description}" on ${new Date(largest.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} for ${formatCurrency(largest.amount)}.`,
        color: "text-expense",
      });
    }

    return items;
  }, [transactions, totalIncome, totalExpenses, topCategory, categoryBreakdown]);

  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h3 className="text-base font-semibold text-foreground">Insights</h3>
      {insights.length === 0 ? (
        <div className="glass-card rounded-lg p-8 text-center text-muted-foreground">
          Not enough data to generate insights
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <div key={i} className="glass-card rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${insight.color}`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
