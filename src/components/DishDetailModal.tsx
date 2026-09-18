import { useState } from 'react';
import { 
  X, 
  Clock, 
  Utensils, 
  Flame, 
  Printer, 
  Edit2, 
  CheckSquare, 
  Square, 
  ShieldAlert, 
  Maximize2, 
  Info,
  ChefHat,
  Sparkles,
  Users
} from 'lucide-react';
import { Dish } from '../types';
import { STATIONS, CATEGORIES } from '../data/initialDishes';
import AllergenBadge from './AllergenBadge';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onEdit: (dish: Dish) => void;
}

export default function DishDetailModal({ dish, onClose, onEdit }: DishDetailModalProps) {
  if (!dish) return null;

  const [activeTab, setActiveTab] = useState<'emplatado' | 'receta' | 'alergenos'>('emplatado');
  const [portions, setPortions] = useState<number>(dish.basePortions || 1);
  const [checkedPlatingSteps, setCheckedPlatingSteps] = useState<Record<number, boolean>>({});
  const [checkedRecipeSteps, setCheckedRecipeSteps] = useState<Record<number, boolean>>({});
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  const stationInfo = STATIONS.find((s) => s.id === dish.station);
  const categoryInfo = CATEGORIES.find((c) => c.id === dish.category);

  // Multiplier for recipe ingredients
  const ratio = portions / (dish.basePortions || 1);

  const togglePlatingStep = (index: number) => {
    setCheckedPlatingSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleRecipeStep = (index: number) => {
    setCheckedRecipeSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="dish-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="dish-detail-modal"
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
      >
        {/* Header Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400">
              <ChefHat className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                  {stationInfo?.label}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-300 font-medium">
                  {categoryInfo?.label}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Ficha Técnica de Cocina
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-print-dish"
              onClick={handlePrint}
              title="Imprimir ficha para la cocina"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Ficha</span>
            </button>
            <button
              id="btn-modal-edit"
              onClick={() => onEdit(dish)}
              title="Editar plato"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          {/* Top Hero Section with Plating Photo & Key Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-stone-200 bg-stone-50">
            {/* Plating Photo Container */}
            <div className="md:col-span-6 relative aspect-4/3 md:aspect-auto min-h-[260px] md:min-h-[340px] bg-stone-900 group">
              <img
                src={dish.photoUrl}
                alt={`Foto de emplatado de ${dish.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsPhotoZoomed(true)}
              />
              <div 
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in pointer-events-none"
              >
                <span className="bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                  <Maximize2 className="w-3.5 h-3.5" /> Ampliar foto de emplatado
                </span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                📸 Foto de Referencia de Emplatado
              </div>
            </div>

            {/* Quick Specs for the Chef / Cook */}
            <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {dish.name}
                </h1>

                {/* Primary Quick Indicators */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                      Vajilla de Servicio
                    </span>
                    <div className="mt-1 flex items-start gap-1.5 text-xs font-bold text-stone-800">
                      <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{dish.tableware}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                      Temperatura de Pase
                    </span>
                    <div className="mt-1 flex items-start gap-1.5 text-xs font-bold text-stone-800">
                      <Flame className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{dish.servingTemp}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                      Tiempo Estimado de Pase
                    </span>
                    <div className="mt-1 flex items-start gap-1.5 text-xs font-bold text-stone-800">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{dish.prepTimeMinutes} minutos</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                      Partida Asignada
                    </span>
                    <div className="mt-1 flex items-start gap-1.5 text-xs font-bold text-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      <span>{stationInfo?.label}</span>
                    </div>
                  </div>
                </div>

                {/* Plating Concept Highlight */}
                <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/80">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Concepto de Montaje:
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {dish.platingDescription}
                  </p>
                </div>
              </div>

              {/* Finishing Touches Note */}
              {dish.finishingTouches && (
                <div className="p-2.5 bg-stone-100 rounded-lg text-xs text-stone-700 border border-stone-200">
                  <strong className="text-stone-900">Toque final imprescindible: </strong>
                  {dish.finishingTouches}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Emplatado / Receta / Alérgenos) */}
          <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-5 sm:px-6 flex items-center justify-between">
            <nav className="flex space-x-2 sm:space-x-4">
              <button
                id="tab-emplatado"
                onClick={() => setActiveTab('emplatado')}
                className={`py-3.5 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'emplatado'
                    ? 'border-amber-600 text-stone-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>1. Guía de Emplatado (Paso a Paso)</span>
              </button>

              <button
                id="tab-receta"
                onClick={() => setActiveTab('receta')}
                className={`py-3.5 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'receta'
                    ? 'border-amber-600 text-stone-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>2. Receta & Ingredientes</span>
              </button>

              <button
                id="tab-alergenos"
                onClick={() => setActiveTab('alergenos')}
                className={`py-3.5 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'alergenos'
                    ? 'border-amber-600 text-stone-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>3. Alérgenos ({dish.allergens.length})</span>
              </button>
            </nav>
          </div>

          {/* Tab 1: Guía de Emplatado */}
          {activeTab === 'emplatado' && (
            <div className="p-5 sm:p-7 space-y-6">
              {/* Critical Chef Notes Callout */}
              {dish.chefNotes && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-900">
                    <Info className="w-4 h-4 text-red-600 shrink-0" />
                    <span>¡Punto Crítico del Chef para este pase!</span>
                  </div>
                  <p className="mt-1 text-sm text-red-800 leading-relaxed font-medium">
                    {dish.chefNotes}
                  </p>
                </div>
              )}

              {/* Step by step assembly */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    Pasos de Montaje en el Pase
                  </h3>
                  <span className="text-xs text-stone-600 font-medium">
                    Pulsa para marcar pasos completados
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dish.platingSteps && dish.platingSteps.length > 0 ? (
                    dish.platingSteps.map((step, idx) => {
                      const isChecked = !!checkedPlatingSteps[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => togglePlatingStep(idx)}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-amber-400'
                          }`}
                        >
                          <button 
                            type="button" 
                            className="mt-0.5 shrink-0 text-stone-500 hover:text-amber-600"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <span className="inline-block text-xs font-bold text-stone-700 uppercase tracking-wide mr-2">
                              Paso {idx + 1}:
                            </span>
                            <span className="text-sm font-medium leading-relaxed">
                              {step}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-stone-600 italic">
                      No se han detallado pasos individuales. Consulta la descripción general del emplatado arriba.
                    </p>
                  )}
                </div>
              </div>

              {/* Finishing Details Box */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Checklist Final antes de salir a sala:
                </h4>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                  <li>Limpieza rigurosa del ala y los bordes del plato con paño limpio y alcohol o vinagre.</li>
                  <li>Temperatura verificada: el plato debe coincidir con los requerimientos ({dish.servingTemp}).</li>
                  <li>{dish.finishingTouches || 'Toque de flor / brote / sal según ficha.'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Receta y Elaboración */}
          {activeTab === 'receta' && (
            <div className="p-5 sm:p-7 space-y-6">
              {/* Portions Scaler */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-stone-100/80 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-stone-700" />
                  <div>
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                      Escalado de Raciones para Producción
                    </span>
                    <span className="text-xs text-stone-600">
                      Calcula automáticamente las cantidades para la mise en place
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 4, 10, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPortions(num)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        portions === num
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {num} {num === 1 ? 'ración' : 'raciones'}
                    </button>
                  ))}
                  <div className="ml-2 flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={portions}
                      onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 text-xs font-bold border border-stone-300 rounded bg-white text-center"
                    />
                    <span className="text-xs text-stone-500 font-medium">rac.</span>
                  </div>
                </div>
              </div>

              {/* Ingredients Table */}
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Ingredientes ({portions} {portions === 1 ? 'ración' : 'raciones'})</span>
                  {ratio !== 1 && (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Escalado x{ratio.toFixed(1)}
                    </span>
                  )}
                </h3>

                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-4">Ingrediente</th>
                        <th className="py-2.5 px-4 w-32 text-right">Cantidad</th>
                        <th className="py-2.5 px-4">Notas / Corte</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {dish.ingredients && dish.ingredients.length > 0 ? (
                        dish.ingredients.map((item, idx) => {
                          const scaledQty = Number((item.quantity * ratio).toFixed(2));
                          return (
                            <tr key={idx} className="hover:bg-stone-50">
                              <td className="py-2.5 px-4 font-semibold text-stone-900">
                                {item.name}
                              </td>
                              <td className="py-2.5 px-4 text-right font-bold text-amber-900 bg-amber-50/40">
                                {scaledQty} {item.unit}
                              </td>
                              <td className="py-2.5 px-4 text-xs text-stone-600">
                                {item.notes || '-'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 px-4 text-center text-stone-500 italic">
                            No se han especificado ingredientes.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Preparation Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-stone-900">
                    Elaboración y Mise en Place
                  </h3>
                  <span className="text-xs text-stone-600 font-medium">
                    Marca los pasos listos
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dish.recipeSteps && dish.recipeSteps.length > 0 ? (
                    dish.recipeSteps.map((step, idx) => {
                      const isChecked = !!checkedRecipeSteps[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleRecipeStep(idx)}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-amber-400'
                          }`}
                        >
                          <button 
                            type="button" 
                            className="mt-0.5 shrink-0 text-stone-500 hover:text-amber-600"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <span className="inline-block text-xs font-bold text-stone-700 uppercase tracking-wide mr-2">
                              Paso {idx + 1}:
                            </span>
                            <span className="text-sm font-medium leading-relaxed">
                              {step}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-stone-600 italic">
                      No hay pasos de elaboración registrados.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Alérgenos Oficiales */}
          {activeTab === 'alergenos' && (
            <div className="p-5 sm:p-7 space-y-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Declaración Obligatoria de Alérgenos (Reglamento UE 1169/2011)
                </h3>
                <p className="text-xs text-stone-600">
                  Consulta rápida para responder a Sala en caso de preguntas de comensales con alergias o intolerancias.
                </p>
              </div>

              {dish.allergens && dish.allergens.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Alérgenos PRESENTES en este plato:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dish.allergens.map((allergen) => (
                      <AllergenBadge key={allergen} allergen={allergen} size="md" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-semibold">
                  ✓ Este plato está libre de alérgenos de declaración obligatoria según su receta actual.
                </div>
              )}

              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Precaución de Contaminación Cruzada:</strong> Todo plato elaborado en partidas con presencia de harina, mariscos o frutos secos puede contener trazas no intencionadas. Ante comensales celíacos graves o alergias severas, limpiar minuciosamente la superficie y usar sartenes / utensilios exclusivos.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-600 font-medium">
            Ficha para uso interno de cocina • {dish.name}
          </div>
          <button
            id="btn-modal-done"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            Cerrar Ficha
          </button>
        </footer>
      </div>

      {/* Full Photo Zoom Overlay */}
      {isPhotoZoomed && (
        <div
          id="photo-zoom-overlay"
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={dish.photoUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl border border-stone-800"
            />
            <div className="mt-3 text-center text-white text-sm font-medium">
              {dish.name} • <span className="text-amber-400">{dish.tableware}</span> (Toca en cualquier sitio para cerrar)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
