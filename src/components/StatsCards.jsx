import { Users, Building2, UserCheck } from "lucide-react";

export default function StatsCards({ totalUsers, uniqueDepartments, currentPageUsers }) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Departments",
      value: uniqueDepartments,
      icon: Building2,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      title: "Current Page",
      value: currentPageUsers,
      icon: UserCheck,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-white rounded-lg border border-border p-4 flex items-center shadow-sm hover-elevate transition-all">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mr-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
