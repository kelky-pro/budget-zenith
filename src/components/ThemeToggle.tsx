import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  theme: string;
  setTheme: (theme: string) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const THEMES = [
  { id: 'indigo', color: 'bg-indigo-600' },
  { id: 'rose', color: 'bg-rose-500' },
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'amber', color: 'bg-amber-500' },
  { id: 'violet', color: 'bg-violet-600' },
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme, isDark, toggleDark }) => {
  return (
    <div className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-black text-gray-700">Appearance</span>
        </div>
        <button 
          onClick={toggleDark}
          className={cn(
            "w-14 h-8 rounded-full p-1 transition-all duration-300 flex items-center",
            isDark ? "bg-indigo-600 justify-end" : "bg-gray-200 justify-start"
          )}
        >
          <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
            {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          </div>
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Accent Color</p>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-3xl">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "w-10 h-10 rounded-2xl transition-all relative flex items-center justify-center",
                t.color,
                theme === t.id ? "scale-110 ring-4 ring-white" : "opacity-60 hover:opacity-100"
              )}
            >
              {theme === t.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};