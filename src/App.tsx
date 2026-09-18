import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  UtensilsCrossed, 
  LayoutGrid, 
  List, 
  ChefHat, 
  Flame, 
  Sparkles,
  Search,
  FilterX
} from 'lucide-react';
import { Dish, DishCategory, KitchenStation } from './types';
import { INITIAL_DISHES, CATEGORIES, STATIONS } from './data/initialDishes';
import Header from './components/Header';
import DishCard from './components/DishCard';
import DishDetailModal from './components/DishDetailModal';
import DishFormModal from './components/DishFormModal';
import KitchenTimer from './components/KitchenTimer';

const STORAGE_KEY = 'restaurant_kitchen_menu_v23';

export default function App() {
  // 1. Dish Catalog State with LocalStorage Persistence
  const [dishes, setDishes] = useState<Dish[]>(() => {
    // Clear legacy keys if existing
    try {
      localStorage.removeItem('restaurant_kitchen_menu_v1');
      localStorage.removeItem('restaurant_kitchen_menu_v2');
      localStorage.removeItem('restaurant_kitchen_menu_v3');
      localStorage.removeItem('restaurant_kitchen_menu_v4');
      localStorage.removeItem('restaurant_kitchen_menu_v5');
      localStorage.removeItem('restaurant_kitchen_menu_v6');
      localStorage.removeItem('restaurant_kitchen_menu_v7');
      localStorage.removeItem('restaurant_kitchen_menu_v8');
      localStorage.removeItem('restaurant_kitchen_menu_v9');
      localStorage.removeItem('restaurant_kitchen_menu_v10');
      localStorage.removeItem('restaurant_kitchen_menu_v11');
      localStorage.removeItem('restaurant_kitchen_menu_v12');
      localStorage.removeItem('restaurant_kitchen_menu_v13');
      localStorage.removeItem('restaurant_kitchen_menu_v14');
      localStorage.removeItem('restaurant_kitchen_menu_v15');
      localStorage.removeItem('restaurant_kitchen_menu_v16');
      localStorage.removeItem('restaurant_kitchen_menu_v17');
      localStorage.removeItem('restaurant_kitchen_menu_v18');
      localStorage.removeItem('restaurant_kitchen_menu_v19');
      localStorage.removeItem('restaurant_kitchen_menu_v20');
      localStorage.removeItem('restaurant_kitchen_menu_v21');
      localStorage.removeItem('restaurant_kitchen_menu_v22');
    } catch {
      // Ignore
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      console.warn('Could not load dishes from localStorage');
    }
    return INITIAL_DISHES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
    } catch {
      console.warn('Could not save dishes to localStorage');
    }
  }, [dishes]);

  // 2. Filters & View State
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>('todos');
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // 3. Modals State
  const [viewingDish, setViewingDish] = useState<Dish | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (selectedCategory !== 'todos' && dish.category !== selectedCategory) {
        return false;
      }

      // Station filter
      if (selectedStation !== 'todas' && dish.station !== selectedStation) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchTableware = dish.tableware.toLowerCase().includes(q);
        const matchPlating = dish.platingDescription.toLowerCase().includes(q);
        const matchAllergens = dish.allergens.some((a) => a.toLowerCase().includes(q));
        const matchIngredients = dish.ingredients?.some((ing) => ing.name.toLowerCase().includes(q));
        const matchStation = dish.station.toLowerCase().includes(q);

        return matchName || matchTableware || matchPlating || matchAllergens || matchIngredients || matchStation;
      }

      return true;
    });
  }, [dishes, selectedCategory, selectedStation, searchQuery]);

  // Handlers for Dish CRUD
  const handleOpenDetail = (dish: Dish) => {
    setViewingDish(dish);
  };

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
  };

  const handleSaveDish = (savedDish: Dish) => {
    setDishes((prev) => {
      const existsIndex = prev.findIndex((d) => d.id === savedDish.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedDish;
        return updated;
      } else {
        return [savedDish, ...prev];
      }
    });
    setIsFormOpen(false);
    setEditingDish(null);
    setViewingDish(savedDish); // Open the saved dish right away for confirmation
  };

  // Export / Import Helpers
  const handleExportMenu = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dishes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `menu_cocina_recetas_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportMenu = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDishes(parsed);
        } else {
          alert('El archivo no contiene un formato de menú válido.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    setDishes(INITIAL_DISHES);
    setSelectedCategory('todos');
    setSelectedStation('todas');
    setSearchQuery('');
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeStationObj = STATIONS.find((s) => s.id === selectedStation);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Primary Kitchen Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStation={selectedStation}
        onStationChange={setSelectedStation}
        onNewDish={handleStartNewDish}
        onExport={handleExportMenu}
        onImport={handleImportMenu}
        onResetDefault={handleResetDefault}
        totalDishes={dishes.length}
      />

      {/* Secondary Bar: Active Filters, Count & Layout Toggle */}
      <div className="bg-white border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700">
            <span>
              Mostrando <strong className="text-stone-950">{filteredDishes.length}</strong> de {dishes.length} platos
            </span>

            {(selectedCategory !== 'todos' || selectedStation !== 'todas' || searchQuery) && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-stone-300">|</span>
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                  {activeCategoryObj?.label}
                </span>
                {selectedStation !== 'todas' && (
                  <span className="text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-medium">
                    {activeStationObj?.label}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setSelectedStation('todas');
                    setSearchQuery('');
                  }}
                  className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-0.5 ml-1"
                >
                  <FilterX className="w-3 h-3" /> Limpiar filtros
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              id="view-mode-grid"
              onClick={() => setViewMode('grid')}
              title="Vista de cuadrícula con fotos de emplatado"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
            <button
              id="view-mode-compact"
              onClick={() => setViewMode('compact')}
              title="Vista compacta de pase"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                viewMode === 'compact'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compacta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {filteredDishes.length > 0 ? (
          viewMode === 'grid' ? (
            /* Cards Grid with Big Plating Photos */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onOpenDetail={handleOpenDetail}
                  onEdit={handleEditDish}
                  onDelete={handleDeleteDish}
                />
              ))}
            </div>
          ) : (
            /* Compact List View for Fast Service / Expediter */
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-200 shadow-xs overflow-hidden">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => handleOpenDetail(dish)}
                  className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <img
                      src={dish.photoUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          {dish.station}
                        </span>
                        <span className="text-xs text-stone-500">• {dish.prepTimeMinutes} min</span>
                      </div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base truncate group-hover:text-amber-800">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-stone-600 truncate mt-0.5">
                        <strong className="text-stone-700">Vajilla:</strong> {dish.tableware} | {dish.servingTemp}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-stone-900 text-white group-hover:bg-stone-800 transition-colors">
                      Ver Emplatado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : dishes.length === 0 ? (
          /* Empty Catalog - Ready for User's Dishes */
          <div className="p-10 sm:p-14 text-center bg-white rounded-3xl border border-stone-200/80 shadow-xs max-w-xl mx-auto my-10">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 mb-4 border border-amber-200">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2 tracking-tight">
              Carta limpia y lista para tus platos
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-6 max-w-md mx-auto">
              Se han eliminado todos los platos de ejemplo. Puedes ir diciéndome cada plato de tu carta aquí por el chat con sus detalles (nombre, partida, emplatado, ingredientes, etc.), o pulsar el botón para añadirlo directamente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStartNewDish}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 text-stone-950 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Añadir Primer Plato
              </button>
            </div>
          </div>
        ) : (
          /* Empty Search / Empty Filter State */
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-3">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">
              No se han encontrado platos
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              {searchQuery
                ? `No hay coincidencias para "${searchQuery}". Intenta con otro término o limpia los filtros.`
                : 'No hay platos registrados en esta partida o categoría todavía.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedStation('todas');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg text-xs font-bold hover:bg-stone-300 transition-colors"
              >
                Ver toda la carta
              </button>
              <button
                onClick={handleStartNewDish}
                className="px-4 py-2 bg-amber-500 text-stone-950 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                + Añadir Nuevo Plato
              </button>
            </div>
          </div>
        )}

        {/* Quick Kitchen Tips & Guidelines Banner */}
        <section className="mt-12 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Normas Fundamentales del Pase de Cocina</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">1. Temperatura de la Vajilla</span>
              Los platos de caliente salen de la mesa térmica a &gt;65°C. Los platos de cuarto frío deben reposar en frío para no atemperar tartares ni ensaladas.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">2. Limpieza de Alas y Bordes</span>
              Ningún plato sale al pase con gotas, huellas o salpicaduras fuera del montaje central. Paño limpio de pase siempre a mano.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">3. Protocolo de Alérgenos</span>
              Ante un ticket con alérgeno marcado, consultar la pestaña de alérgenos de la ficha antes de montar y avisar al jefe de partida.
            </div>
          </div>
        </section>
      </main>

      {/* Floating Kitchen Pass Timer */}
      <KitchenTimer />

      {/* Dish Detail Modal (Plating, Recipe, Scaling, Allergens, Print) */}
      <DishDetailModal
        dish={viewingDish}
        onClose={() => setViewingDish(null)}
        onEdit={handleEditDish}
      />

      {/* Dish Form Modal (Add / Edit) */}
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

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-stone-300 font-medium">
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>Manual Técnico de Cocina • Emplatados y Recetas</span>
          </div>
          <div className="text-stone-500">
            Optimizado para visualización en pantallas y tablets de cocina
          </div>
        </div>
      </footer>
    </div>
  );
}
