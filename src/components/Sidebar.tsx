import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  PieChart, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'My Accounts', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">FinFlow</span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-10">Wealth Manager</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-blue-600" : "text-gray-400")} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-xl hover:bg-gray-50 cursor-pointer group">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/6a98af50-f80a-44c5-a0a3-35c3420fd93c/user-avatar-4d943c1b-1774612184969.webp" 
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all"
            alt="Profile"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">Alex Morgan</p>
            <p className="text-xs text-gray-500 truncate">Premium Member</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};