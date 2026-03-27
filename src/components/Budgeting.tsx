import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, ChevronRight, AlertCircle, Wallet } from 'lucide-react';
import { Goal, Budget } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { toast } from 'sonner';

interface BudgetingProps {
  budgets: Budget[];
  goals: Goal[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
}

export const Budgeting: React.FC<BudgetingProps> = ({ budgets, goals, onAddBudget, onAddGoal }) => {
  const [view, setView] = useState<'budgets' | 'goals'>('budgets');

  return (
    <div className="space-y-8">
      <div className="flex p-1.5 bg-gray-100 rounded-[1.5rem]">
        <button
          onClick={() => setView('budgets')}
          className={cn(
            "flex-1 py-3 rounded-[1.2rem] text-sm font-black transition-all",
            view === 'budgets' ? "bg-white text-indigo-600 shadow-md" : "text-gray-500"
          )}
        >
          Budgets
        </button>
        <button
          onClick={() => setView('goals')}
          className={cn(
            "flex-1 py-3 rounded-[1.2rem] text-sm font-black transition-all",
            view === 'goals' ? "bg-white text-indigo-600 shadow-md" : "text-gray-500"
          )}
        >
          Goals
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'budgets' ? (
          <motion.div
            key="budgets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {budgets.map((budget) => {
              const progress = (budget.spent / budget.limit) * 100;
              const isOverBudget = budget.spent > budget.limit;
              const isNearingLimit = progress > 80 && !isOverBudget;

              return (
                <div key={budget.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        isOverBudget ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                      )}>
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900">{budget.category}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Budget</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">{formatCurrency(budget.spent)}</p>
                      <p className="text-xs font-bold text-gray-400">of {formatCurrency(budget.limit)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          isOverBudget ? "bg-rose-500" : isNearingLimit ? "bg-amber-500" : "bg-indigo-600"
                        )}
                      />
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-1.5 text-rose-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">Exceeded by {formatCurrency(budget.spent - budget.limit)}</span>
                      </div>
                    )}
                    {isNearingLimit && (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">80% of budget reached</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-200 hover:text-indigo-400 transition-all">
              <Plus className="w-5 h-5" /> Add New Budget
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${goal.color}15`, color: goal.color }}>
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900">{goal.name}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{goal.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">{formatCurrency(goal.currentAmount)}</p>
                      <p className="text-xs font-bold text-gray-400">of {formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-200 hover:text-indigo-400 transition-all">
              <Plus className="w-5 h-5" /> Start New Goal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};