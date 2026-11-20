import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Dish, DishCategory } from './types';
import { INITIAL_DISHES, CATEGORIES } from './data/initialDishes';
import Header from './components/Header';
import DishCard from './components/DishCard';
import DishDetailModal from './components/DishDetailModal';
import DishFormModal from './components/DishFormModal';
import KitchenTimer from './components/KitchenTimer';

const STORAGE_KEY = 'restaurant_kitchen_menu_v75';
const THEME_KEY = 'kitchen_manual_theme';

export default function App() {
  // 1. Light / Dark Theme (Pedidosapp palette)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore storage access errors
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // 2. Dish Catalog State with LocalStorage Persistence
  const [dishes, setDishes] = useState<Dish[]>(() => {
    let customFromPrev: Dish[] = [];
    const initialIds = new Set(INITIAL_DISHES.map((d) => d.id));

    try {
      const prevV74 = localStorage.getItem('restaurant_kitchen_menu_v74');
      if (prevV74 && !localStorage.getItem(STORAGE_KEY)) {
        const parsedPrev = JSON.parse(prevV74);
        if (Array.isArray(parsedPrev)) {
          customFromPrev = parsedPrev.filter((d: Dish) => !initialIds.has(d.id));
        }
      }
      localStorage.removeItem('restaurant_kitchen_menu_v55');
      localStorage.removeItem('restaurant_kitchen_menu_v56');
      localStorage.removeItem('restaurant_kitchen_menu_v57');
      localStorage.removeItem('restaurant_kitchen_menu_v58');
      localStorage.removeItem('restaurant_kitchen_menu_v59');
      localStorage.removeItem('restaurant_kitchen_menu_v60');
      localStorage.removeItem('restaurant_kitchen_menu_v61');
      localStorage.removeItem('restaurant_kitchen_menu_v62');
      localStorage.removeItem('restaurant_kitchen_menu_v63');
      localStorage.removeItem('restaurant_kitchen_menu_v64');
      localStorage.removeItem('restaurant_kitchen_menu_v65');
      localStorage.removeItem('restaurant_kitchen_menu_v66');
      localStorage.removeItem('restaurant_kitchen_menu_v67');
      localStorage.removeItem('restaurant_kitchen_menu_v68');
      localStorage.removeItem('restaurant_kitchen_menu_v69');
      localStorage.removeItem('restaurant_kitchen_menu_v70');
      localStorage.removeItem('restaurant_kitchen_menu_v71');
      localStorage.removeItem('restaurant_kitchen_menu_v72');
      localStorage.removeItem('restaurant_kitchen_menu_v73');
      localStorage.removeItem('restaurant_kitchen_menu_v74');
    } catch {
      // Ignore
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(INITIAL_DISHES.map((d) => [d.id, d]));
          const existingIds = new Set(parsed.map((d: Dish) => d.id));
          const missingInitial = INITIAL_DISHES.filter((d) => !existingIds.has(d.id));
          return [...parsed, ...missingInitial].map((d: Dish) => {
            const initial = initialMap.get(d.id);
            let cat = d.category;
            if (d.id.startsWith('dish-sando') || d.name.toLowerCase().includes('sando')) {
              cat = 'entrantes';
            } else if (d.id.includes('okonomiyaki') || d.name.toLowerCase().includes('okonomiyaki')) {
              cat = 'okonomiyaki';
            } else if (d.id.includes('kare') || d.name.toLowerCase().includes('kare') || d.name.toLowerCase().includes('curry')) {
              cat = 'curry';
            } else if ((cat as string) === 'principales' || d.id.includes('donburi') || d.name.toLowerCase().includes('-don')) {
              cat = 'donburi';
            } else if (!cat || (cat as string) === 'sushi') {
              if (d.id.includes('hosomaki') || d.name.toLowerCase().includes('hosomaki')) {
                cat = 'hosomaki';
              } else if (d.id.includes('uramaki') || d.name.toLowerCase().includes('uramaki')) {
                cat = 'uramaki';
              } else if (d.id.includes('usuzuk') || d.name.toLowerCase().includes('usuzuk')) {
                cat = 'usuzukiri';
              } else if (d.id.includes('surtido') || d.name.toLowerCase().includes('surtido')) {
                cat = 'surtidos';
              } else {
                cat = 'nigiri';
              }
            }
            return {
              ...d,
              ...(initial ? { photoUrl: initial.photoUrl } : {}),
              category: cat,
            };
          });
        }
      }
    } catch {
      console.warn('Could not load dishes from localStorage');
    }
    return [...customFromPrev, ...INITIAL_DISHES];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
    } catch {
      console.warn('Could not save dishes to localStorage');
    }
  }, [dishes]);

  // 3. Filters, Modals & Toast
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDish, setViewingDish] = useState<Dish | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: dishes.length };
    for (const d of dishes) {
      counts[d.category] = (counts[d.category] || 0) + 1;
    }
    return counts;
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return dishes.filter((dish) => {
      if (selectedCategory !== 'todos' && dish.category !== selectedCategory) {
        return false;
      }
      if (q) {
        const matchName = dish.name.toLowerCase().includes(q);
        const matchTableware = dish.tableware.toLowerCase().includes(q);
        const matchPlating = dish.platingDescription.toLowerCase().includes(q);
        const matchAllergens = dish.allergens.some((a) => a.toLowerCase().includes(q));
        const matchIngredients = dish.ingredients?.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        return matchName || matchTableware || matchPlating || matchAllergens || matchIngredients;
      }
      return true;
    });
  }, [dishes, selectedCategory, searchQuery]);

  // Handlers
  const handleStartNewDish = () => {
    setEditingDish(null);
    setIsFormOpen(true);
  };

  const handleEditDish = (dish: Dish) => {
    setViewingDish(null);
    setEditingDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteDish = (dishId: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    if (viewingDish?.id === dishId) {
      setViewingDish(null);
    }
    showToast('Ficha eliminada');
  };

  const handleSaveDish = (savedDish: Dish) => {
    setDishes((prev) => {
      const existsIndex = prev.findIndex((d) => d.id === savedDish.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedDish;
        return updated;
      }
      return [savedDish, ...prev];
    });
    setIsFormOpen(false);
    setEditingDish(null);
    setViewingDish(savedDish);
    showToast('Ficha guardada');
  };

  const handleExportMenu = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dishes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `menu_cocina_recetas_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia exportada');
  };

  const handleImportMenu = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDishes(parsed);
          showToast('Carta importada correctamente');
        } else {
          showToast('El archivo no tiene un formato válido');
        }
      } catch {
        showToast('No se pudo leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    setDishes(INITIAL_DISHES);
    setSelectedCategory('todos');
    setSearchQuery('');
    showToast('Carta oficial restaurada');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f0] dark:bg-[#141413] text-[#1a1a18] dark:text-[#f0efe8]">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onNewDish={handleStartNewDish}
        onExport={handleExportMenu}
        onImport={handleImportMenu}
        onResetDefault={handleResetDefault}
        onLogoClick={() => {
          setSelectedCategory('todos');
          setSearchQuery('');
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6 pb-20">
        {/* Clean Search Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a74] dark:text-[#8a8a82]" />
            <input
              id="search-dish-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar plato, ingrediente o alérgeno..."
              aria-label="Buscar plato, ingrediente o alérgeno"
              className="w-full min-h-[44px] rounded-xl border border-black/12 dark:border-white/12 bg-white dark:bg-[#1e1e1c] pl-10 pr-10 text-sm text-[#1a1a18] dark:text-[#f0efe8] placeholder:text-[#9c9b94] dark:placeholder:text-[#6a6a63] focus:border-[#2a8549] dark:focus:border-[#4cc376] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-[#7a7a74] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6c6c66] dark:text-[#9a9991] tabular-nums">
            <span>
              {filteredDishes.length} {filteredDishes.length === 1 ? 'plato' : 'platos'}
            </span>
            {(selectedCategory !== 'todos' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('todos');
                  setSearchQuery('');
                }}
                className="text-xs font-medium text-[#2a8549] dark:text-[#4cc376] hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Horizontal Category Strip */}
        <nav
          aria-label="Categorías de carta"
          className="mt-3 flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                id={`filter-category-mobile-${cat.id}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                  isActive
                    ? 'bg-[#1a1a18] dark:bg-[#f0efe8] text-white dark:text-[#1a1a18]'
                    : 'bg-white dark:bg-[#1e1e1c] border border-black/10 dark:border-white/10 text-[#5c5c56] dark:text-[#a8a8a0]'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </nav>

        {/* Desktop Left Sidebar + Minimalist Photo Card Grid */}
        <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-6">
          {/* Desktop Sticky Category Directory */}
          <aside className="hidden lg:block sticky top-18 rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1e1e1c] p-2">
            <div className="px-3 py-2 text-xs font-semibold text-[#7a7a74] dark:text-[#8a8a82]">
              Categorías
            </div>
            <nav aria-label="Categorías" className="space-y-0.5">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    id={`filter-category-${cat.id}`}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#f5f4f0] dark:bg-[#2a2a27] font-semibold text-[#1a1a18] dark:text-[#f0efe8]'
                        : 'font-medium text-[#5c5c56] dark:text-[#a8a8a0] hover:bg-black/3 dark:hover:bg-white/4'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    <span
                      className={`text-xs tabular-nums shrink-0 ${
                        isActive
                          ? 'text-[#2a8549] dark:text-[#4cc376] font-semibold'
                          : 'text-[#8a8a82]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Cards Grid */}
          <section>
            {filteredDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onOpenDetail={setViewingDish}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1e1e1c] p-10 text-center max-w-md mx-auto my-8">
                <p className="text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
                  No hay platos que coincidan
                </p>
                <p className="mt-1 text-xs text-[#6c6c66] dark:text-[#9a9991]">
                  Prueba otra búsqueda o cambia de categoría.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('todos');
                      setSearchQuery('');
                    }}
                    className="min-h-[40px] rounded-xl border border-black/10 dark:border-white/10 px-4 text-xs font-medium text-[#1a1a18] dark:text-[#f0efe8] cursor-pointer"
                  >
                    Ver toda la carta
                  </button>
                  <button
                    type="button"
                    onClick={handleStartNewDish}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#1a1a18] dark:bg-[#f0efe8] px-4 text-xs font-medium text-white dark:text-[#1a1a18] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Añadir plato</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <KitchenTimer />

      <DishDetailModal
        dish={viewingDish}
        onClose={() => setViewingDish(null)}
        onEdit={handleEditDish}
        onDelete={handleDeleteDish}
      />

      {isFormOpen && (
        <DishFormModal
          initialDish={editingDish}
          onSave={handleSaveDish}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDish(null);
          }}
        />
      )}

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#1a1a18] dark:bg-[#f0efe8] px-4 py-2.5 text-xs font-medium text-white dark:text-[#1a1a18] shadow-lg whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
