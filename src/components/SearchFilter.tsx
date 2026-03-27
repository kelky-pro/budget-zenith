import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  categories: string[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, categories }) => {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          type="text"
          placeholder="Search transactions..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => onFilter('all')}
          className="whitespace-nowrap px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-200"
        >
          All
        </button>
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => onFilter(cat)}
            className="whitespace-nowrap px-6 py-3 bg-white text-gray-500 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};