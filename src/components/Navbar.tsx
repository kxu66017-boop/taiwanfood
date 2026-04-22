import { PageId } from '../types';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: '首頁' },
    { id: 'search', label: '搜尋' },
    { id: 'map', label: '地圖' },
    { id: 'recommend', label: '推薦' },
    { id: 'account', label: '帳戶' },
  ];

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="h-20 border-b border-editorial-border flex items-center justify-between px-4 md:px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => handleNavigate('home')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:rotate-6 transition-transform">🍜</div>
          <span className="font-display text-2xl font-black tracking-tighter text-primary italic">探索島嶼滋味</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "transition-all pb-1 border-b-2",
                currentPage === item.id 
                  ? "text-taiwan-red border-taiwan-red" 
                  : "text-slate-500 border-transparent hover:text-taiwan-red"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-6 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-slate-900 transition-all uppercase tracking-widest">
            登入帳戶
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-primary"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-stone-200 shadow-xl overflow-hidden">
          <div className="p-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition text-left",
                  currentPage === item.id ? "text-taiwan-red font-bold" : "text-slate-600"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
