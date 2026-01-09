
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { AppState, ToolModel } from '../types';

interface DashboardProps {
  state: AppState;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const modelStats = useMemo(() => {
    const stats: Record<ToolModel, number> = { T45: 0, T50: 0, T51: 0 };
    state.inventory.forEach(item => {
      stats[item.model] += item.stock;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [state.inventory]);

  const recentActivity = useMemo(() => {
    // Get total withdrawals per day for the last 7 entries
    const daily = state.withdrawals.reduce((acc: any, curr) => {
      const date = curr.date.split('T')[0];
      acc[date] = (acc[date] || 0) + curr.quantity;
      return acc;
    }, {});
    return Object.entries(daily).map(([date, total]) => ({ date, total })).slice(-7);
  }, [state.withdrawals]);

  const criticalItems = state.inventory.filter(i => i.stock <= i.minStock);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-medium">Total de Itens</h3>
            <i className="fa-solid fa-boxes-stacked text-blue-500"></i>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {state.inventory.reduce((acc, i) => acc + i.stock, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-medium">Itens Críticos</h3>
            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
          </div>
          <p className="text-3xl font-bold text-slate-800">{criticalItems.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-500 text-sm font-medium">Retiradas Hoje</h3>
            <i className="fa-solid fa-truck-ramp-box text-emerald-500"></i>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {state.withdrawals.filter(w => w.date.startsWith(new Date().toISOString().split('T')[0])).reduce((a, b) => a + b.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Estoque por Modelo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Tendência de Retiradas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
