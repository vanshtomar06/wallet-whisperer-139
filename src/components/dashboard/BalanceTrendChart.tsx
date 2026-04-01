import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockMonthlyData } from "@/data/mockData";

export default function BalanceTrendChart() {
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-base font-semibold text-card-foreground mb-4">Balance Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockMonthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152,69%,41%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152,69%,41%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0,84%,60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0,84%,60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
            <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Area type="monotone" dataKey="income" stroke="hsl(152,69%,41%)" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="hsl(0,84%,60%)" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
