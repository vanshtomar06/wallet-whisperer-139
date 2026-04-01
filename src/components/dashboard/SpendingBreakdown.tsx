import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useFinanceSummary } from "@/hooks/useFinanceData";

const COLORS = [
  "hsl(221,83%,53%)",
  "hsl(152,69%,41%)",
  "hsl(38,92%,50%)",
  "hsl(280,67%,54%)",
  "hsl(0,84%,60%)",
  "hsl(199,89%,48%)",
];

export default function SpendingBreakdown() {
  const { categoryBreakdown } = useFinanceSummary();

  const data = Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-5 flex items-center justify-center h-80">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in" style={{ animationDelay: "280ms" }}>
      <h3 className="text-base font-semibold text-card-foreground mb-4">Spending Breakdown</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
