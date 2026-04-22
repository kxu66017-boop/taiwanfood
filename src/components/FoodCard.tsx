import { Food } from '../types';
import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FoodCardProps {
  food: Food;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: (id: number) => void;
}

export default function FoodCard({ food, isFavorite, onToggleFavorite, onClick }: FoodCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] border border-editorial-border overflow-hidden cursor-pointer flex flex-col h-full group shadow-sm hover:shadow-2xl transition-all duration-500"
      onClick={() => onClick(food.id)}
    >
      <div className="h-48 bg-stone-50 flex items-center justify-center relative overflow-hidden">
        <span className="text-7xl group-hover:scale-125 transition-transform duration-500">{food.emoji}</span>
        <div className={cn(
          "absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-widest",
          food.region === '北部' ? 'text-taiwan-red' : 'text-accent'
        )}>
          {food.city} · {food.region}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.id);
          }} 
          className={cn(
            "absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg transition active:scale-90",
            isFavorite ? "text-taiwan-red" : "text-slate-300 hover:text-taiwan-red"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-primary font-display ">{food.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <span className="text-xs font-bold">★</span>
            <span className="text-sm font-bold font-mono">{food.rating}</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed font-medium">{food.desc}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="font-mono font-bold text-primary">{food.price}</span>
          <div className="flex flex-wrap gap-2 justify-end">
            {food.tags.slice(0, 1).map(t => (
              <span key={t} className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-editorial-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
