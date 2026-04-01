import { useFinanceStore } from "@/store/useFinanceStore";
import { UserRole } from "@/types/finance";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  ShieldCheck,
  Eye,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, darkMode, toggleDarkMode, activeTab, setActiveTab } = useFinanceStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                <span className="text-primary">Fin</span>Track
              </h1>
              <nav className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Switcher */}
              <div className="flex items-center bg-secondary rounded-lg p-0.5">
                <button
                  onClick={() => setRole("viewer")}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    role === "viewer"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Viewer
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    role === "admin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" /> Admin
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden border-t border-border/50 px-4 py-2 flex gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
