import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Bell, 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  PieChart,
  Settings,
  TrendingUp,
  User,
  History,
  CreditCard as CardIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Search,
  Target,
  CalendarCheck
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { AccountList } from './components/AccountList';
import { RecentTransactions } from './components/RecentTransactions';
import { Reports } from './components/Reports';
import { Budgeting } from './components/Budgeting';
import { RecurringTransactions } from './components/RecurringTransactions';
import { ThemeToggle } from './components/ThemeToggle';
import { Onboarding } from './components/Onboarding';
import { SearchFilter } from './components/SearchFilter';
import { Transaction, Account, Budget, Goal, RecurringTransaction } from './types';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Checking', balance: 5240.50, type: 'checking', color: '#6366f1' },
  { id: '2', name: 'Savings Account', balance: 12500.00, type: 'savings', color: '#10B981' },
  { id: '3', name: 'Credit Card', balance: -840.20, type: 'credit', color: '#EF4444' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 3500, category: 'Salary', accountId: '1', description: 'Monthly Salary', date: '2023-10-01' },
  { id: '2', type: 'expense', amount: 120, category: 'Food', accountId: '1', description: 'Whole Foods', date: '2023-10-02' },
  { id: '3', type: 'expense', amount: 45, category: 'Transport', accountId: '3', description: 'Uber Ride', date: '2023-10-03' },
  { id: '4', type: 'expense', amount: 800, category: 'Rent', accountId: '1', description: 'Apartment Rent', date: '2023-10-01' },
  { id: '5', type: 'income', amount: 200, category: 'Freelance', accountId: '2', description: 'Logo Design', date: '2023-10-05' },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: '1', category: 'Food', limit: 500, spent: 320, period: 'monthly' },
  { id: '2', category: 'Entertainment', limit: 200, spent: 185, period: 'monthly' },
  { id: '3', category: 'Transport', limit: 150, spent: 45, period: 'monthly' },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'New MacBook Pro', targetAmount: 2500, currentAmount: 1200, category: 'Electronics', color: '#6366f1' },
  { id: '2', name: 'Summer Vacation', targetAmount: 5000, currentAmount: 3200, category: 'Travel', color: '#10B981' },
  { id: '3', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, category: 'Savings', color: '#F59E0B' },
];

const INITIAL_RECURRING: RecurringTransaction[] = [
  { id: '1', type: 'expense', amount: 85.50, category: 'Utilities', accountId: '1', description: 'Electricity Bill', frequency: 'monthly', startDate: '2023-09-15', nextOccurrence: '2023-11-15', isActive: true },
  { id: '2', type: 'expense', amount: 15.99, category: 'Entertainment', accountId: '3', description: 'Netflix', frequency: 'monthly', startDate: '2023-01-01', nextOccurrence: '2023-11-01', isActive: true },
  { id: '3', type: 'income', amount: 3500, category: 'Salary', accountId: '1', description: 'Company Salary', frequency: 'monthly', startDate: '2022-01-01', nextOccurrence: '2023-11-01', isActive: true },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(INITIAL_RECURRING);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboarding_complete'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [theme, setTheme] = useState('indigo');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };

    setTransactions([transaction, ...transactions]);

    setAccounts(accounts.map(acc => {
      if (acc.id === transaction.accountId) {
        return {
          ...acc,
          balance: transaction.type === 'income' 
            ? acc.balance + transaction.amount 
            : acc.balance - transaction.amount
        };
      }
      return acc;
    }));

    // Update budget if it exists for this category
    if (transaction.type === 'expense') {
      setBudgets(budgets.map(b => {
        if (b.category === transaction.category) {
          return { ...b, spent: b.spent + transaction.amount };
        }
        return b;
      }));
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'all' || t.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, filterCategory]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, x: 10 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.98, x: -10 }
  };

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
    toast.success('Welcome to FinFlow!');
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
          className="pb-32 pt-4 px-5"
        >
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} accounts={accounts} />}
          {activeTab === 'accounts' && <AccountList accounts={accounts} />}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <SearchFilter 
                onSearch={setSearchQuery} 
                onFilter={setFilterCategory} 
                categories={categories} 
              />
              <RecentTransactions transactions={filteredTransactions} accounts={accounts} />
            </div>
          )}
          {activeTab === 'budgeting' && (
            <div className="space-y-8">
              <Budgeting 
                budgets={budgets} 
                goals={goals} 
                onAddBudget={() => {}} 
                onAddGoal={() => {}} 
              />
              <RecurringTransactions recurring={recurring} />
            </div>
          )}
          {activeTab === 'analytics' && <Reports transactions={transactions} accounts={accounts} />}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex flex-col items-center pt-8 pb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-violet-600 p-1 shadow-2xl shadow-indigo-200 rotate-3">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                      className="w-full h-full rounded-[2.3rem] object-cover"
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-4">Alex Morgan</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Diamond Member</span>
                  <div className="flex gap-0.5 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
              
              <ThemeToggle 
                theme={theme} 
                setTheme={setTheme} 
                isDark={isDark} 
                toggleDark={() => setIsDark(!isDark)} 
              />

              <div className="bg-white rounded-[2.5rem] p-3 shadow-xl shadow-gray-100 border border-gray-100">
                {[
                  { icon: ShieldCheck, label: 'Security & Privacy', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { icon: Bell, label: 'Notifications', color: 'text-rose-500', bg: 'bg-rose-50' },
                  { icon: Zap, label: 'Smart Automations', color: 'text-amber-500', bg: 'bg-amber-50' },
                  { icon: History, label: 'Export Data', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-[2rem] group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                        <item.icon className={cn("w-6 h-6", item.color)} />
                      </div>
                      <span className="font-black text-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { localStorage.removeItem('onboarding_complete'); window.location.reload(); }}
                className="w-full py-5 rounded-[2rem] bg-gray-50 text-gray-400 font-bold hover:bg-gray-100 transition-all"
              >
                Reset App Data
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark ? "bg-gray-950 text-white" : "bg-[#FDFDFF] text-gray-900"
    )}>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
      <Toaster position="top-center" expand={true} richColors closeButton />
      
      {/* Phone Emulator Container */}
      <div className={cn(
        "max-w-md mx-auto min-h-screen relative flex flex-col overflow-hidden sm:my-8 sm:rounded-[3rem] sm:min-h-[850px] sm:max-h-[850px] sm:border-[8px] sm:border-gray-900 transition-all",
        isDark ? "bg-gray-900 shadow-2xl" : "bg-white shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)]"
      )}>
        
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-40 backdrop-blur-xl px-6 pt-8 pb-4 flex items-center justify-between transition-colors",
          isDark ? "bg-gray-900/90 border-b border-gray-800" : "bg-white/90 border-b border-gray-50"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors", `bg-${theme}-600`)}>
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn("text-xl font-black leading-tight", isDark ? "text-white" : "text-gray-900")}>FinFlow</h1>
              <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", `text-${theme}-500`)}>Elite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className={cn(
              "p-2.5 rounded-2xl transition-all",
              isDark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
            )}>
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar">
          {renderContent()}
        </main>

        {/* FAB */}
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 sm:absolute sm:bottom-28">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFormOpen(true)}
            className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl ring-8 transition-colors", `bg-${theme}-600 shadow-${theme}-300 ring-${isDark ? 'gray-900' : 'white'}`)}
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <nav className={cn(
          "sticky bottom-0 border-t px-4 py-6 pb-10 flex justify-between items-center z-40 backdrop-blur-2xl transition-colors",
          isDark ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-50"
        )}>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'budgeting', icon: Target, label: 'Budgets' },
            { id: 'analytics', icon: PieChart, label: 'Stats' },
            { id: 'transactions', icon: ArrowLeftRight, label: 'Activity' },
            { id: 'profile', icon: User, label: 'Me' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 group relative"
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-500 relative overflow-hidden",
                activeTab === item.id 
                  ? `bg-${theme}-600 text-white shadow-2xl shadow-${theme}-200` 
                  : "text-gray-400 group-hover:text-gray-600"
              )}>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className={cn("absolute inset-0 -z-10", `bg-${theme}-600`)}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest transition-colors duration-300",
                activeTab === item.id ? `text-${theme}-600` : "text-gray-400"
              )}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <TransactionForm 
        accounts={accounts} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onAddTransaction={addTransaction}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        body {
          background-color: ${isDark ? '#030712' : '#F8FAFC'};
        }
        @media (min-width: 640px) {
          body {
             background-image: 
              radial-gradient(at 0% 0%, ${isDark ? 'hsla(253,16%,15%,1)' : 'hsla(253,16%,7%,1)'} 0, transparent 50%), 
              radial-gradient(at 50% 0%, ${isDark ? 'hsla(225,39%,20%,1)' : 'hsla(225,39%,30%,1)'} 0, transparent 50%), 
              radial-gradient(at 100% 0%, ${isDark ? 'hsla(339,49%,20%,1)' : 'hsla(339,49%,30%,1)'} 0, transparent 50%);
            background-attachment: fixed;
          }
        }
      `}</style>
    </div>
  );
}