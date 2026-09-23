import { useState, type ChangeEvent } from 'react';
import { 
  ChefHat, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { DishCategory } from '../types';
import { CATEGORIES } from '../data/initialDishes';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: DishCategory;
  onCategoryChange: (cat: DishCategory) => void;
  onNewDish: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onResetDefault: () => void;
  totalDishes: number;
}

export default function Header({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onNewDish,
  onExport,
  onImport,
  onResetDefault,
  totalDishes,
}: HeaderProps) {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(file);
    setImportStatus('Menú importado correctamente');
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <header className="bg-stone-900 text-stone-100 sticky top-0 z-30 shadow-md border-b border-stone-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Kitchen Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Uso Exclusivo de Cocina
                </span>
                <span className="hidden sm:inline-block text-xs text-stone-400 font-medium">
                  {totalDishes} {totalDishes === 1 ? 'plato registrado' : 'platos registrados'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                Emplatado & Recetario Técnico
              </h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* New Dish Button */}
            <button
              id="btn-header-new-dish"
              onClick={onNewDish}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Añadir Plato</span>
              <span className="sm:hidden">Nuevo</span>
            </button>

            {/* Menu Dropdown Toggle for backup & options */}
            <div className="relative">
              <button
                id="btn-header-menu-tools"
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                title="Opciones de copia de seguridad y cartas"
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {showToolsMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-fadeIn"
                  onMouseLeave={() => setShowToolsMenu(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Gestión del Menú
                  </div>
                  <button
                    onClick={() => {
                      onExport();
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-stone-100 flex items-center gap-2 font-medium"
                  >
                    <Download className="w-4 h-4 text-stone-600" />
                    <span>Exportar copia del menú (.json)</span>
                  </button>

                  <label className="w-full px-3 py-2 text-left hover:bg-stone-100 flex items-center gap-2 font-medium cursor-pointer">
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>Cargar archivo de menú</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        handleFileImport(e);
                        setShowToolsMenu(false);
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="my-1 border-t border-stone-200" />

                  <button
                    onClick={() => {
                      if (confirm('¿Deseas vaciar toda la carta actual? Se borrarán los platos registrados.')) {
                        onResetDefault();
                      }
                      setShowToolsMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-red-500" />
                    <span>Vaciar carta completa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {importStatus && (
          <div className="pb-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> {importStatus}
          </div>
        )}

        {/* Shortcuts & Search Row - Optimized for Quick Kitchen Service */}
        <div className="py-2.5 border-t border-stone-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Shortcuts: Toda la carta, Entrantes, Sushi, Principales, Postres */}
          <nav aria-label="Atajos de categorías de carta" className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                onClick={() => onCategoryChange(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold ring-2 ring-amber-400/80'
                    : 'bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700 border border-stone-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Quick Search */}
          <div className="relative flex-1 md:max-w-xs lg:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="search-dish-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por plato, ingrediente..."
              className="w-full pl-9 pr-7 py-2 text-xs sm:text-sm bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
