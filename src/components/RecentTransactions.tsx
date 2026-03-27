import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { Transaction, Account } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface RecentTransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, accounts }) => {
  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {transactions.map((t) => (
          <motion.div 
            key={t.id} 
            variants={item}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm",
                t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <p className="text-[15px] font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{t.description || t.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">{t.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">{getAccountName(t.accountId)}</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className={cn(
                "text-base font-black leading-tight",
                t.type === 'income' ? "text-emerald-600" : "text-gray-900"
              )}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">{formatDate(t.date)}</p>
            </div>
          </motion.div>
        ))}

        {transactions.length === 0 && (
          <div className="py-24 text-center space-y-6">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <div>
              <p className="text-gray-900 font-black text-lg">No transactions found</p>
              <p className="text-gray-400 font-bold text-sm max-w-[200px] mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};