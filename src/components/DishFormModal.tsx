import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Sparkles,
  Utensils
} from 'lucide-react';
import { Dish, DishCategory, KitchenStation, Ingredient } from '../types';
import { CATEGORIES, STATIONS, COMMON_ALLERGENS } from '../data/initialDishes';

interface DishFormModalProps {
  initialDish?: Dish | null;
  onSave: (dish: Dish) => void;
  onClose: () => void;
}

export default function DishFormModal({ initialDish, onSave, onClose }: DishFormModalProps) {
  const [name, setName] = useState(initialDish?.name || '');
  const [category, setCategory] = useState<Exclude<DishCategory, 'todos'>>(initialDish?.category || 'principales');
  const [station, setStation] = useState<Exclude<KitchenStation, 'todas'>>(initialDish?.station || 'calientes');
  const [photoUrl, setPhotoUrl] = useState(initialDish?.photoUrl || '');
  const [tableware, setTableware] = useState(initialDish?.tableware || 'Plato llano blanco (26 cm)');
  const [servingTemp, setServingTemp] = useState(initialDish?.servingTemp || 'Caliente (>70°C)');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(initialDish?.prepTimeMinutes || 10);
  const [platingDescription, setPlatingDescription] = useState(initialDish?.platingDescription || '');
  const [finishingTouches, setFinishingTouches] = useState(initialDish?.finishingTouches || '');
  const [chefNotes, setChefNotes] = useState(initialDish?.chefNotes || '');
  const [basePortions, setBasePortions] = useState(initialDish?.basePortions || 1);

  // Plating steps
  const [platingSteps, setPlatingSteps] = useState<string[]>(
    initialDish?.platingSteps && initialDish.platingSteps.length > 0
      ? initialDish.platingSteps
      : ['Colocar la base en el centro del plato.', 'Disponer el elemento principal.', 'Salsear y terminar con decoración.']
  );

  // Allergens
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialDish?.allergens || []);

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialDish?.ingredients && initialDish.ingredients.length > 0
      ? initialDish.ingredients
      : [
          { name: 'Ingrediente principal', quantity: 150, unit: 'g', notes: 'cortado limpio' },
          { name: 'Salsa o guarnición', quantity: 50, unit: 'g', notes: 'templada' },
        ]
  );

  // Recipe steps
  const [recipeSteps, setRecipeSteps] = useState<string[]>(
    initialDish?.recipeSteps && initialDish.recipeSteps.length > 0
      ? initialDish.recipeSteps
      : ['Preparar la mise en place y pesar ingredientes.', 'Cocinar y mantener a temperatura.']
  );

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit ~5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Por favor elige una imagen menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  // Plating step helpers
  const handleAddPlatingStep = () => {
    setPlatingSteps([...platingSteps, '']);
  };
  const handleUpdatePlatingStep = (index: number, val: string) => {
    const next = [...platingSteps];
    next[index] = val;
    setPlatingSteps(next);
  };
  const handleRemovePlatingStep = (index: number) => {
    setPlatingSteps(platingSteps.filter((_, i) => i !== index));
  };

  // Recipe step helpers
  const handleAddRecipeStep = () => {
    setRecipeSteps([...recipeSteps, '']);
  };
  const handleUpdateRecipeStep = (index: number, val: string) => {
    const next = [...recipeSteps];
    next[index] = val;
    setRecipeSteps(next);
  };
  const handleRemoveRecipeStep = (index: number) => {
    setRecipeSteps(recipeSteps.filter((_, i) => i !== index));
  };

  // Ingredient helpers
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 100, unit: 'g', notes: '' }]);
  };
  const handleUpdateIngredient = (index: number, field: keyof Ingredient, val: string | number) => {
    const next = [...ingredients];
    next[index] = { ...next[index], [field]: val };
    setIngredients(next);
  };
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor indica el nombre del plato.');
      return;
    }

    const newDish: Dish = {
      id: initialDish?.id || `dish-${Date.now()}`,
      name: name.trim(),
      category,
      station,
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      tableware: tableware.trim() || 'Plato estándar',
      servingTemp: servingTemp.trim() || 'Caliente',
      prepTimeMinutes: Number(prepTimeMinutes) || 5,
      platingDescription: platingDescription.trim(),
      platingSteps: platingSteps.filter((s) => s.trim().length > 0),
      finishingTouches: finishingTouches.trim(),
      allergens: selectedAllergens,
      basePortions: Number(basePortions) || 1,
      ingredients: ingredients.filter((i) => i.name.trim().length > 0),
      recipeSteps: recipeSteps.filter((r) => r.trim().length > 0),
      chefNotes: chefNotes.trim(),
      createdAt: initialDish?.createdAt || Date.now(),
    };

    onSave(newDish);
  };

  return (
    <div 
      id="dish-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="dish-form-modal"
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {initialDish ? 'Editar Ficha de Plato' : 'Añadir Nuevo Plato al Menú'}
            </h2>
          </div>
          <button
            id="btn-close-form"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Nombre del Plato *
              </label>
              <input
                id="input-dish-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Tartar de Atún Rojo Balfegó"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Categoría en Carta
              </label>
              <select
                id="select-dish-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<DishCategory, 'todos'>)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Partida Asignada en Cocina
              </label>
              <select
                id="select-dish-station"
                value={station}
                onChange={(e) => setStation(e.target.value as Exclude<KitchenStation, 'todas'>)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {STATIONS.filter((s) => s.id !== 'todas').map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Photo Setup */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <span className="block text-xs font-bold text-stone-700 uppercase">
              Foto de Referencia del Emplatado
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-2">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">URL de la imagen:</label>
                  <input
                    id="input-dish-photo-url"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... o sube una foto desde tu dispositivo"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Subir foto desde móvil / PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-stone-500">Admite fotos tomadas con la cámara</span>
                </div>
              </div>

              <div className="sm:col-span-4 flex justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Vista previa"
                    referrerPolicy="no-referrer"
                    className="w-28 h-24 object-cover rounded-lg border border-stone-300 shadow-xs"
                  />
                ) : (
                  <div className="w-28 h-24 rounded-lg border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 bg-white">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Sin foto</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Tableware, Temp & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Tipo de Vajilla / Plato
              </label>
              <input
                id="input-dish-tableware"
                type="text"
                value={tableware}
                onChange={(e) => setTableware(e.target.value)}
                placeholder="Ej. Plato cerámico negro 26cm"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Temperatura de Servicio
              </label>
              <input
                id="input-dish-temp"
                type="text"
                value={servingTemp}
                onChange={(e) => setServingTemp(e.target.value)}
                placeholder="Ej. Muy caliente (>75°C) o Frío (4°C)"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Tiempo de Pase (minutos)
              </label>
              <input
                id="input-dish-time"
                type="number"
                min={1}
                max={120}
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Section 4: Emplatado */}
          <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Guía de Emplatado (Instrucciones para el Pase)
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Descripción general del concepto de montaje:
              </label>
              <textarea
                id="input-plating-desc"
                rows={2}
                value={platingDescription}
                onChange={(e) => setPlatingDescription(e.target.value)}
                placeholder="Ej. Montaje central en aro con quenelle a la derecha y salsa perimetral..."
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
              />
            </div>

            {/* Plating steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">Pasos de montaje (en orden):</span>
                <button
                  type="button"
                  onClick={handleAddPlatingStep}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Paso
                </button>
              </div>

              <div className="space-y-2">
                {platingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400 w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleUpdatePlatingStep(idx, e.target.value)}
                      placeholder={`Paso ${idx + 1} de emplatado...`}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePlatingStep(idx)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Toques finales imprescindibles (Sal, brotes, aceite, etc.):
              </label>
              <input
                type="text"
                value={finishingTouches}
                onChange={(e) => setFinishingTouches(e.target.value)}
                placeholder="Ej. Escamas de sal Maldon, 3 brotes de albahaca y chorrito de AOVE arbequina"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-red-700 mb-1">
                ¡Punto Crítico del Chef! (Notas de atención durante el servicio):
              </label>
              <input
                type="text"
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="Ej. Cuidado: el plato debe estar caliente; no cortar la carne antes de reposar."
                className="w-full px-3 py-2 text-xs border border-red-300 rounded-lg bg-red-50/50"
              />
            </div>
          </div>

          {/* Section 5: Ingredients & Recipe */}
          <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase">
                Ingredientes de la Ficha Técnica
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600">Raciones base:</span>
                <input
                  type="number"
                  min={1}
                  value={basePortions}
                  onChange={(e) => setBasePortions(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 px-2 py-1 text-xs border border-stone-300 rounded bg-white text-center font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              {ingredients.map((item, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white p-2 rounded-lg border border-stone-200">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                    placeholder="Nombre del ingrediente"
                    className="flex-2 min-w-[140px] px-2.5 py-1 text-xs border border-stone-300 rounded"
                  />
                  <input
                    type="number"
                    step="any"
                    value={item.quantity}
                    onChange={(e) => handleUpdateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="Cant."
                    className="w-20 px-2 py-1 text-xs border border-stone-300 rounded text-right"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                    placeholder="Unid. (g, ml, ud)"
                    className="w-20 px-2 py-1 text-xs border border-stone-300 rounded"
                  />
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => handleUpdateIngredient(idx, 'notes', e.target.value)}
                    placeholder="Corte / notas"
                    className="flex-1 min-w-[100px] px-2 py-1 text-xs border border-stone-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold mt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Ingrediente
              </button>
            </div>

            {/* Recipe Steps */}
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">Pasos de Elaboración / Mise en place:</span>
                <button
                  type="button"
                  onClick={handleAddRecipeStep}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Paso de Receta
                </button>
              </div>

              <div className="space-y-2">
                {recipeSteps.map((rStep, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400 w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      value={rStep}
                      onChange={(e) => handleUpdateRecipeStep(idx, e.target.value)}
                      placeholder={`Paso ${idx + 1} de elaboración...`}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipeStep(idx)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Allergens selector */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-stone-700 uppercase">
              Alérgenos Presentes (Toca para activar/desactivar)
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
              {COMMON_ALLERGENS.map((allergen) => {
                const isSelected = selectedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                        : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? `✓ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer actions inside form */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-save-dish"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg bg-stone-900 text-white hover:bg-stone-800 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Ficha de Plato</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
