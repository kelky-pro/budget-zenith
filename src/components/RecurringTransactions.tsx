import React from 'react';
import { Calendar, Clock, ArrowRight, BellRing, ToggleLeft as Toggle } from 'lucide-react';
import { RecurringTransaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface RecurringTransactionsProps {
  recurring: RecurringTransaction[];
}

export const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({ recurring }) => {
  return (
    <div className="space-y-6">
      <div className="px-2">
        <h3 className="text-xl font-black text-gray-900">Upcoming Bills</h3>
        <p className="text-sm text-gray-500 font-medium">Automatic payments scheduled for this month</p>
      </div>

      <div className="space-y-3">
        {recurring.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                item.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm leading-tight">{item.description}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.frequency}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Next: {item.nextOccurrence}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-black text-base",
                item.type === 'income' ? "text-emerald-600" : "text-rose-600"
              )}>
                {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
              </p>
              <div className="mt-1">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  item.isActive ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400"
                )}>
                  {item.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 flex items-center justify-between overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-white">Smart Reminders</h4>
            <p className="text-xs text-indigo-100 font-medium">Get notified 2 days before a bill is due.</p>
          </div>
        </div>
        <button className="relative z-10 p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};