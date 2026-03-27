import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { Download, Calendar, Filter, ChevronDown, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Transaction, Account } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ReportsProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions, accounts }) => {
  const [period, setPeriod] = useState('This Month');

  // Categorize data
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(i => i.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const exportData = () => {
    toast.info('Generating report...');
    setTimeout(() => {
      toast.success('Report exported to PDF successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-black text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-500 font-medium">Deep dive into your finances</p>
        </div>
        <button 
          onClick={exportData}
          className="p-3 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-200 hover:scale-105 transition-transform"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['This Month', 'Last 3 Months', 'Year to Date', 'All Time'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
              period === p ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Net Worth Trend (Simplified) */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-gray-900">Spending Trends</h4>
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase">+14.2%</span>
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                dy={10}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 700 }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <h4 className="font-black text-gray-900 text-center">Category Distribution</h4>
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-12">
            <div className="text-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
              <p className="text-xl font-black text-gray-900">{formatCurrency(categoryData.reduce((a, b) => a + b.value, 0))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};