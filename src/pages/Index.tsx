import { useFinanceStore } from "@/store/useFinanceStore";
import AppShell from "@/components/layout/AppShell";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdown from "@/components/dashboard/SpendingBreakdown";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import InsightsPanel from "@/components/insights/InsightsPanel";

const Index = () => {
  const { activeTab } = useFinanceStore();

  return (
    <AppShell>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <SummaryCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceTrendChart />
            <SpendingBreakdown />
          </div>
          <TransactionsTable />
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-6">
          <TransactionsTable />
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <SummaryCards />
          <InsightsPanel />
        </div>
      )}
    </AppShell>
  );
};

export default Index;
