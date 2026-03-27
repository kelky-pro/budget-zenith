import React, { useState, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, LayoutGrid, BarChart3, PieChartIcon } from 'lucide-react';
import { Transaction, Account } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, accounts }) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState('7D');

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const monthlyData = useMemo(() => {
    const data = transactions.reduce((acc: any[], t) => {
      const date = new Date(t.date);
      const label = timeRange === '7D' 
        ? date.toLocaleDateString('default', { weekday: 'short' })
        : date.toLocaleString('default', { month: 'short' });
      
      const existing = acc.find(i => i.label === label);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expenses += t.amount;
      } else {
        acc.push({
          label,
          income: t.type === 'income' ? t.amount : 0,
          expenses: t.type === 'expense' ? t.amount : 0
        });
      }
      return acc;
    }, []);

    // Sort by date if needed, but let's keep it simple for now
    return data;
  }, [transactions, timeRange]);

  const stats = [
    { 
      label: 'Balance', 
      value: totalBalance, 
      icon: Wallet, 
      color: 'bg-indigo-500', 
      trend: '+2.5%',
      isPositive: true
    },
    { 
      label: 'Income', 
      value: transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0), 
      icon: ArrowUpRight, 
      color: 'bg-emerald-500', 
      trend: '+12%',
      isPositive: true
    },
    { 
      label: 'Expenses', 
      value: transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0), 
      icon: ArrowDownLeft, 
      color: 'bg-rose-500', 
      trend: '-4%',
      isPositive: false
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Card */}
      <motion.div variants={item} className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-indigo-100 font-bold mb-1 uppercase tracking-widest text-[10px]">Available Balance</p>
          <h2 className="text-4xl font-black mb-8 tracking-tight">{formatCurrency(totalBalance)}</h2>
          
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-emerald-400/20 rounded-lg">
                  <ArrowUpRight className="w-3 h-3 text-emerald-300" />
                </div>
                <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Income</span>
              </div>
              <p className="text-lg font-black">{formatCurrency(stats[1].value)}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-rose-400/20 rounded-lg">
                  <ArrowDownLeft className="w-3 h-3 text-rose-300" />
                </div>
                <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Spent</span>
              </div>
              <p className="text-lg font-black">{formatCurrency(stats[2].value)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-gray-900">Financial Pulse</h3>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setChartType('area')}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                chartType === 'area' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
              )}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                chartType === 'bar' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-center gap-3">
            {['7D', '1M', '3M', '6M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  timeRange === range 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorExpenses)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Account Overview */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-gray-900">Active Accounts</h3>
          <button className="text-xs font-black text-indigo-600 uppercase tracking-widest">Manage All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {accounts.map((acc, i) => (
            <div 
              key={acc.id} 
              className="flex-shrink-0 w-44 p-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div 
                className="w-10 h-10 rounded-xl mb-6 flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: acc.color }}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{acc.name}</p>
              <h4 className="text-lg font-black text-gray-900 truncate">{formatCurrency(acc.balance)}</h4>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+{Math.floor(Math.random() * 5)}%</span>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse"></div>
              </div>
            </div>
          ))}
          <button className="flex-shrink-0 w-44 h-[180px] rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-100 hover:text-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Add Card</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div variants={item} className="bg-indigo-50 rounded-[2.5rem] p-6 border border-indigo-100 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-600/5 rounded-full" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-indigo-900">Saving Insight</h4>
            <p className="text-sm text-indigo-700/80 font-medium leading-relaxed mt-1">
              You've spent <span className="font-black">12% less</span> on Food this month compared to your average. Great job!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};