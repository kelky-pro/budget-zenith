import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Tag, CreditCard, AlignLeft, RefreshCcw } from 'lucide-react';
import { Transaction, Account, CATEGORIES } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionFormProps {
  accounts: Account[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, onAddTransaction, isOpen, onClose }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !accountId) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      category,
      accountId,
      description,
      date,
      isRecurring,
    });
    
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    onClose();
    // Reset form
    setAmount('');
    setDescription('');
    setIsRecurring(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[3rem] shadow-2xl overflow-hidden max-w-md mx-auto"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>

            <div className="px-8 pt-2 pb-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-white py-2 z-10">
                <h2 className="text-2xl font-black text-gray-900">New Transaction</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Switcher */}
                <div className="flex p-1.5 bg-gray-100 rounded-[1.5rem]">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={cn(
                      "flex-1 py-3 rounded-[1.2rem] text-sm font-black transition-all",
                      type === 'expense' ? "bg-white text-rose-600 shadow-md" : "text-gray-500"
                    )}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={cn(
                      "flex-1 py-3 rounded-[1.2rem] text-sm font-black transition-all",
                      type === 'income' ? "bg-white text-emerald-600 shadow-md" : "text-gray-500"
                    )}
                  >
                    Income
                  </button>
                </div>

                {/* Amount Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <span className="text-3xl font-black text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-14 pr-8 py-8 bg-gray-50 rounded-[2rem] text-4xl font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-200"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Account Selection */}
                  <div className="relative group">
                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="w-full pl-14 pr-10 py-4 bg-gray-50 rounded-2xl appearance-none font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Category Selection */}
                  <div className="relative">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-14 pr-10 py-4 bg-gray-50 rounded-2xl appearance-none font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES[type].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Date Input */}
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-14 pr-8 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                  </div>

                  {/* Recurrence Toggle */}
                  <div className="bg-gray-50 p-4 rounded-2xl space-y-4 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RefreshCcw className={cn("w-5 h-5 transition-colors", isRecurring ? "text-indigo-600" : "text-gray-400")} />
                        <span className="font-bold text-gray-700">Make Recurring</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={cn(
                          "w-12 h-7 rounded-full transition-all duration-300 flex items-center p-1",
                          isRecurring ? "bg-indigo-600 justify-end" : "bg-gray-200 justify-start"
                        )}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>

                    {isRecurring && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 gap-2 pt-2"
                      >
                        {['daily', 'weekly', 'monthly', 'yearly'].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFrequency(f as any)}
                            className={cn(
                              "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              frequency === f ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-400 border border-gray-100"
                            )}
                          >
                            {f}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div className="relative">
                    <AlignLeft className="absolute left-5 top-5 w-5 h-5 text-gray-400" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full pl-14 pr-8 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                      rows={2}
                      placeholder="What was this for?"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={cn(
                    "w-full py-5 rounded-[2rem] font-black text-lg text-white shadow-xl transition-all",
                    type === 'expense' 
                      ? "bg-rose-500 shadow-rose-200 hover:bg-rose-600" 
                      : "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600"
                  )}
                >
                  Save {isRecurring ? 'Recurring ' : ''}{type === 'income' ? 'Income' : 'Expense'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </AnimatePresence>
  );
};