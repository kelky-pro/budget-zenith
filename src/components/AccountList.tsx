import React from 'react';
import { CreditCard, MoreVertical, Plus, ChevronRight } from 'lucide-react';
import { Account } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';

interface AccountListProps {
  accounts: Account[];
}

export const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
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
      className="space-y-8 pb-12"
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-gray-900">My Wallets</h3>
        <button className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <motion.div 
            key={account.id}
            variants={item}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: account.color + '20', color: account.color }}
                >
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900">{account.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{account.type}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </div>

            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Balance</p>
                <h3 className="text-3xl font-black text-gray-900">{formatCurrency(account.balance)}</h3>
              </div>
              
              <div className="w-24 h-8 bg-gray-50 rounded-xl overflow-hidden relative">
                 <div 
                   className="absolute inset-y-0 left-0 bg-indigo-500 rounded-xl opacity-20" 
                   style={{ width: '65%', backgroundColor: account.color }}
                 ></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-[10px] font-black text-gray-500">65% Used</span>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-bold">Add New<br/>Account</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-[2.5rem] text-white">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <MoreVertical className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-bold">Manage<br/>Limits</p>
        </div>
      </div>
    </motion.div>
  );
};