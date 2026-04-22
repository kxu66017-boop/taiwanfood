import { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Map as MapIcon, 
  TrendingUp, 
  Award, 
  MapPin, 
  ArrowLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import Navbar from './components/Navbar';
import FoodCard from './components/FoodCard';
import { FOOD_DATA, REGIONS, TYPES } from './constants';
import { Food, PageId, Recommendation } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem('recommendations');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const currentFood = useMemo(() => 
    FOOD_DATA.find(f => f.id === selectedFoodId), 
  [selectedFoodId]);

  const filteredFoods = useMemo(() => {
    return FOOD_DATA.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRegion = regionFilter === '全部' || f.region === regionFilter;
      const matchesType = typeFilter === '全部' || f.type === typeFilter;
      return matchesSearch && matchesRegion && matchesType;
    });
  }, [searchQuery, regionFilter, typeFilter]);

  const showDetail = (id: number) => {
    setSelectedFoodId(id);
    setCurrentPage('detail');
  };

  const addRecommendation = (rec: Omit<Recommendation, 'id' | 'created_at'>) => {
    const newRec: Recommendation = {
      ...rec,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    setRecommendations(prev => [newRec, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col grain">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 overflow-x-hidden no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {currentPage === 'home' && (
              <HomePage 
                onExplore={() => setCurrentPage('search')} 
                onMap={() => setCurrentPage('map')}
                totalFoods={FOOD_DATA.length}
                favoritesCount={favorites.length}
                onSelectFood={showDetail}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            )}
            {currentPage === 'search' && (
              <SearchPage 
                foods={filteredFoods}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectFood={showDetail}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            )}
            {currentPage === 'map' && (
              <MapPage 
                foods={filteredFoods}
                regionFilter={regionFilter}
                setRegionFilter={setRegionFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                onSelectFood={showDetail}
              />
            )}
            {currentPage === 'recommend' && (
              <RecommendPage 
                recommendations={recommendations}
                onAddRecommendation={addRecommendation}
              />
            )}
            {currentPage === 'detail' && currentFood && (
              <DetailPage 
                food={currentFood} 
                onBack={() => setCurrentPage('search')} 
              />
            )}
            {currentPage === 'account' && (
              <AccountPage 
                favorites={favorites}
                recommendationsCount={recommendations.length}
                onSelectFood={showDetail}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-PAGES ---

interface HomePageProps {
  onExplore: () => void;
  onMap: () => void;
  totalFoods: number;
  favoritesCount: number;
  onSelectFood: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
}

function HomePage({ 
  onExplore, 
  onMap, 
  totalFoods, 
  favoritesCount, 
  onSelectFood, 
  onToggleFavorite, 
  favorites 
}: HomePageProps) {
  const featured = FOOD_DATA.filter(f => f.featured);
  const latest = FOOD_DATA.filter(f => f.latest);

  return (
    <div>
      <header className="pt-20 pb-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="h-px w-12 bg-taiwan-red"></span>
            <span className="text-taiwan-red font-bold tracking-[0.2em] uppercase text-[10px]">Taiwan Gastronomy Platform</span>
            <span className="h-px w-12 bg-taiwan-red"></span>
          </div>
          
          <h1 className="font-display font-black text-6xl md:text-8xl text-primary mb-8 leading-[0.9] italic tracking-tighter">
            每一口，<br/>
            <span className="text-accent underline decoration-stone-200 decoration-4 underline-offset-8">都是一個故事</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-medium">
            從台北的繁華夜市到台南的巷弄老店，我們為您挑選了最具台灣靈魂的味覺體驗。不僅是食物，更是歷史與情感的傳承。
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            <button 
              onClick={onExplore}
              className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-slate-900 transition-all shadow-xl hover:shadow-primary/20 flex items-center gap-2 uppercase tracking-widest text-xs"
            >
              <Search className="w-4 h-4" /> Start Exploring
            </button>
            <button 
              onClick={onMap}
              className="px-10 py-4 bg-white text-primary border border-editorial-border rounded-full font-bold hover:bg-stone-50 transition shadow-lg flex items-center gap-2 uppercase tracking-widest text-xs"
            >
              <MapIcon className="w-4 h-4" /> Discovery Map
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-16 border-y border-editorial-border py-12 max-w-3xl mx-auto">
            <StatColumn value={`${totalFoods}+`} label="收錄店家" />
            <div className="h-12 w-px bg-editorial-border"></div>
            <StatColumn value="4.9" label="用戶好評" />
            <div className="h-12 w-px bg-editorial-border"></div>
            <StatColumn value={favoritesCount} label="我的收藏" color="taiwan-red" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20 border-t border-editorial-border">
        <section className="mb-32">
          <SectionHeader title="精選推薦" subtitle="在地饕客評選出的頂級美味" icon="★" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featured.map(f => (
              <FoodCard 
                key={f.id} 
                food={f} 
                isFavorite={favorites.includes(f.id)} 
                onToggleFavorite={onToggleFavorite} 
                onClick={onSelectFood}
              />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader title="最新發現" subtitle="近期社群討論度最高的熱門店家" icon="●" color="taiwan-red" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map(f => (
              <FoodCard 
                key={f.id} 
                food={f} 
                isFavorite={favorites.includes(f.id)} 
                onToggleFavorite={onToggleFavorite} 
                onClick={onSelectFood}
              />
            ))}
          </div>
        </section>

        <div className="bg-primary rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="font-display font-bold text-3xl mb-4">找不到想吃的？</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">試試我們的情境搜尋，根據你的心情推薦最適合的餐廳</p>
            <button onClick={onExplore} className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-stone-100 transition">我要推薦</button>
          </div>
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 select-none">
            <span className="text-[15rem]">🍜</span>
          </div>
        </div>
      </main>
    </div>
  );
}

interface SearchPageProps {
  foods: Food[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectFood: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
}

function SearchPage({ foods, searchQuery, onSearchChange, onSelectFood, onToggleFavorite, favorites }: SearchPageProps) {
  const popular = [...FOOD_DATA].sort((a,b) => b.reviews - a.reviews).slice(0,3);
  const rating = [...FOOD_DATA].sort((a,b) => b.rating - a.rating).slice(0,3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5 text-taiwan-red" /> 熱門排行
            </h3>
            <div className="space-y-4">
              {popular.map((f, i) => (
                <RankItem key={f.id} index={i+1} food={f} meta={`${f.reviews} 次評價`} onClick={() => onSelectFood(f.id)} />
              ))}
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> 高分好評
            </h3>
            <div className="space-y-4">
              {rating.map((f, i) => (
                <RankItem key={f.id} index={i+1} food={f} meta={`${f.rating} 分`} onClick={() => onSelectFood(f.id)} variant="dark" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-2 rounded-3xl shadow-xl border border-stone-100 mb-8 flex items-center group focus-within:ring-4 ring-primary/5 transition-all">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-6 h-6 text-slate-300" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜尋美食、區域或標籤..." 
                className="w-full p-4 focus:outline-none font-medium"
              />
            </div>
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold">搜尋</button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-primary">
              {searchQuery ? `「${searchQuery}」的搜尋結果` : '所有美食'}
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {foods.map((f: Food) => (
                <FoodCard 
                  key={f.id} 
                  food={f} 
                  isFavorite={favorites.includes(f.id)} 
                  onToggleFavorite={onToggleFavorite} 
                  onClick={onSelectFood}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {foods.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔎</div>
              <p className="text-slate-400">找不到相關美食，換個關鍵字試試看</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MapPageProps {
  foods: Food[];
  regionFilter: string;
  setRegionFilter: (r: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  onSelectFood: (id: number) => void;
}

function MapPage({ foods, regionFilter, setRegionFilter, typeFilter, setTypeFilter, onSelectFood }: MapPageProps) {
  const regionsSummary: Record<string, string> = {
    "全部": "探索全台各地的美食靈魂，從巷弄小吃到米其林盛宴。",
    "北部": "台北的精緻工藝與基隆的港口海味，構築了北部的多元味覺。",
    "中部": "台中的創意飲品與嘉義、彰濱的古早米食，展現了中部的人情味。",
    "南部": "府城台南的鮮甜精華與高雄、屏東的高溫熱情，是南台最純粹的魅力。",
    "東部": "花蓮與台東的自然饋贈，山海之間的純淨滋味在此交會。",
    "外島": "菊島澎湖與金馬前線，濃縮了海洋與戰地的傳奇手藝。"
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Fixed Sidebar for Filters */}
      <aside className="w-full md:w-80 border-r border-editorial-border p-8 overflow-y-auto shrink-0 bg-editorial-bg/30">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-primary"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Filtering</span>
          </div>
          <h1 className="font-display font-black text-2xl italic">探索參數</h1>
        </div>
        
        <div className="space-y-10">
          <FilterGroup label="地區範圍" options={REGIONS} current={regionFilter} onChange={setRegionFilter} />
          <FilterGroup label="料理類型" options={TYPES} current={typeFilter} onChange={setTypeFilter} />
        </div>

        <div className="mt-20 p-6 bg-primary rounded-3xl text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Editor's Tip</p>
            <p className="text-xs leading-relaxed font-medium">切換地區可即時探索該區域特有的美食文化脈絡。</p>
          </div>
          <span className="absolute -right-4 -bottom-4 text-6xl opacity-10 italic font-display">Tip</span>
        </div>
      </aside>

      {/* Main Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar bg-white">
        <header className="mb-12 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-taiwan-red font-bold tracking-[0.3em] uppercase text-[10px]">Regional Spotlight</span>
            <span className="h-px flex-1 bg-editorial-border"></span>
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl italic text-primary mb-6 tracking-tighter">
            {regionFilter === '全部' ? '全島味覺圖譜' : `${regionFilter}美食特輯`}
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            {regionsSummary[regionFilter]}
          </p>
        </header>

        {foods.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {foods.map((f: Food, idx: number) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white rounded-[2.5rem] border border-editorial-border p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                onClick={() => onSelectFood(f.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{f.emoji}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-taiwan-red mb-1">{f.city}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-[10px]">★</span>
                      <span className="font-mono text-xs font-bold">{f.rating}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-black text-2xl text-primary italic mb-2 tracking-tight group-hover:text-taiwan-red transition-colors">
                  {f.name}
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-2">
                  {f.desc}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-editorial-border/50">
                  <span className="font-mono font-bold text-slate-400 text-xs">{f.type}</span>
                  <button className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                    Detail <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-editorial-border rounded-[3rem] text-slate-300">
            <span className="text-4xl mb-4">🏮</span>
            <p className="font-bold uppercase tracking-widest text-xs">該區域暫無符合條件的美食</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface RecommendPageProps {
  recommendations: Recommendation[];
  onAddRecommendation: (rec: any) => void;
}

function RecommendPage({ recommendations, onAddRecommendation }: RecommendPageProps) {
  const [formData, setFormData] = useState({
    restaurant_name: '',
    food_name: '',
    region: '北部',
    rating: 0,
    comment: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) return alert('請給予評分');
    onAddRecommendation(formData);
    setFormData({
      restaurant_name: '',
      food_name: '',
      region: '北部',
      rating: 0,
      comment: ''
    });
    alert('感謝你的推薦！已加入社群動態');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h1 className="font-display font-bold text-3xl mb-2">分享你的私藏清單</h1>
          <p className="text-slate-500 mb-8">好味道不該被埋沒，分享你最喜歡的餐廳幫助更多食客！</p>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">餐廳名稱</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.restaurant_name}
                    onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                    className="w-full p-3 bg-stone-50 rounded-xl focus:ring-2 ring-accent/20 outline-none border border-stone-100 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">推薦美食</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.food_name}
                    onChange={(e) => setFormData({...formData, food_name: e.target.value})}
                    className="w-full p-3 bg-stone-50 rounded-xl focus:ring-2 ring-accent/20 outline-none border border-stone-100 transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">地區</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full p-3 bg-stone-50 rounded-xl outline-none border border-stone-100 transition"
                  >
                    {REGIONS.filter(r => r !== '全部').map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">你的評分</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(r => (
                      <button 
                        key={r}
                        type="button" 
                        onClick={() => setFormData({...formData, rating: r})}
                        className={cn(
                          "text-2xl transition",
                          formData.rating >= r ? "opacity-100 scale-110" : "grayscale opacity-30 hover:opacity-50"
                        )}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">推薦理由</label>
                <textarea 
                  rows={4} 
                  required 
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="這道菜為什麼迷人？必點的原因是什麼？" 
                  className="w-full p-3 bg-stone-50 rounded-xl focus:ring-2 ring-accent/20 outline-none border border-stone-100 transition"
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-taiwan-red text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all">
                提交推薦資訊
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-bold text-xl">社區最新動態</h2>
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((r: Recommendation) => (
              <motion.div 
                key={r.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-primary">{r.restaurant_name}</p>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400 font-bold">{r.region}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">推薦：{r.food_name}</p>
                <p className="text-xs text-slate-400 italic">「{r.comment}」</p>
              </motion.div>
            ))}
            {recommendations.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">尚無推薦內容</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPage({ food, onBack }: { food: Food, onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-primary transition font-bold group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回列表
      </button>
      <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100">
        <div className="h-64 md:h-96 bg-stone-50 flex items-center justify-center text-9xl select-none">
          {food.emoji}
        </div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-primary mb-2 font-display">{food.name}</h1>
              <p className="text-slate-400 flex items-center gap-2 italic">
                <MapPin className="w-4 h-4" /> {food.region} · {food.city}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-amber-500">{food.rating}</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">平均評分</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-primary">{food.price.split('-')[0]}</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">起價</p>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 font-display">美食介紹</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {food.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {food.tags.map(t => (
              <span key={t} className="px-4 py-2 bg-stone-100 rounded-xl text-sm font-bold text-slate-500">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccountPageProps {
  favorites: number[];
  recommendationsCount: number;
  onSelectFood: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

function AccountPage({ favorites, recommendationsCount, onSelectFood, onToggleFavorite }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState('favorites');
  const favoriteFoods = FOOD_DATA.filter(f => favorites.includes(f.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center text-4xl text-white shadow-xl">👤</div>
        <div>
          <h1 className="text-3xl font-black text-primary">你好，美食探險家</h1>
          <p className="text-slate-400">
            目前已有 <span className="font-bold text-taiwan-red">{favorites.length + recommendationsCount}</span> 則紀錄
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-stone-100">
        <TabButton id="favorites" label="我的收藏" current={activeTab} onClick={setActiveTab} />
        <TabButton id="preferences" label="偏好設定" current={activeTab} onClick={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'favorites' ? (
          <motion.div 
            key="favs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {favoriteFoods.map(f => (
              <FoodCard 
                key={f.id} 
                food={f} 
                isFavorite={true} 
                onToggleFavorite={onToggleFavorite} 
                onClick={onSelectFood} 
              />
            ))}
            {favoriteFoods.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-stone-200">
                <p className="text-slate-400">尚未收藏任何美食，快去探索吧！</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="prefs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm"
          >
            <h3 className="font-bold mb-6 font-display text-xl">飲食偏好自定義</h3>
            <div className="space-y-4">
              <PreferenceToggle label="僅顯示素食友善" />
              <PreferenceToggle label="接受辛辣口味" defaultChecked />
              <PreferenceToggle label="顯示路邊攤位" defaultChecked />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SHARED UI COMPONENTS ---

function StatColumn({ value, label, color = 'primary' }: { value: any, label: string, color?: string }) {
  return (
    <div className="text-center group">
      <p className={cn("text-4xl font-black mb-1 transition-transform group-hover:scale-110", color === 'taiwan-red' ? 'text-taiwan-red' : 'text-primary')}>{value}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">{label}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon, color = 'taiwan-red' }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("h-px w-8", color === 'taiwan-red' ? 'bg-taiwan-red' : 'bg-accent')}></span>
          <span className={cn("font-bold tracking-[0.2em] uppercase text-[10px]", color === 'taiwan-red' ? 'text-taiwan-red' : 'text-accent')}>Curated Collection</span>
        </div>
        <h2 className="font-display font-black text-4xl text-primary italic lowercase tracking-tight">
          {title}
        </h2>
        <p className="text-slate-400 mt-2 font-medium">{subtitle}</p>
      </div>
      <button className="flex items-center gap-2 font-bold text-xs text-taiwan-red uppercase tracking-widest group">
        Explore more <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
}

function RankItem({ index, food, meta, onClick, variant = 'light' }: any) {
  return (
    <div 
      className="flex items-center gap-4 cursor-pointer hover:translate-x-1 transition group" 
      onClick={onClick}
    >
      <span className={cn(
        "text-2xl font-black", 
        variant === 'dark' ? 'text-slate-800' : 'text-slate-100'
      )}>{index.toString().padStart(2, '0')}</span>
      <div>
        <p className="font-bold text-sm group-hover:text-taiwan-red transition-colors">{food.name}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{meta}</p>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, current, onChange, accent }: any) {
  return (
    <section>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button 
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
              current === opt 
                ? `bg-primary text-white border-primary shadow-md` 
                : "bg-white border-stone-200 text-slate-500 hover:border-slate-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </section>
  );
}

function TabButton({ id, label, current, onClick }: any) {
  const active = id === current;
  return (
    <button 
      onClick={() => onClick(id)}
      className={cn(
        "pb-4 px-2 font-bold transition relative",
        active ? "text-taiwan-red" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-taiwan-red" 
        />
      )}
    </button>
  );
}

function PreferenceToggle({ label, defaultChecked = false }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl cursor-pointer hover:bg-stone-100 transition">
      <span className="font-medium text-slate-700">{label}</span>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-5 h-5 accent-taiwan-red rounded-lg" 
      />
    </label>
  );
}
