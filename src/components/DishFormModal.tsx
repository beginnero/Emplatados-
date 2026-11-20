import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { Dish, DishCategory, KitchenStation, Ingredient } from '../types';
import { CATEGORIES, STATIONS, COMMON_ALLERGENS } from '../data/initialDishes';
import { getImageUrl } from '../utils/imageUrl';
import { sortAllergens } from './AllergenBadge';

interface DishFormModalProps {
  initialDish?: Dish | null;
  onSave: (dish: Dish) => void;
  onClose: () => void;
}

export default function DishFormModal({ initialDish, onSave, onClose }: DishFormModalProps) {
  const [name, setName] = useState(initialDish?.name || '');
  const [category, setCategory] = useState<Exclude<DishCategory, 'todos'>>(
    initialDish?.category || 'donburi'
  );
  const [station, setStation] = useState<Exclude<KitchenStation, 'todas'>>(
    initialDish?.station || 'calientes'
  );
  const [photoUrl, setPhotoUrl] = useState(initialDish?.photoUrl || '');
  const [tableware, setTableware] = useState(initialDish?.tableware || 'Plato llano (26 cm)');
  const [servingTemp, setServingTemp] = useState(initialDish?.servingTemp || 'Caliente');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(initialDish?.prepTimeMinutes || 5);
  const [platingDescription, setPlatingDescription] = useState(
    initialDish?.platingDescription || ''
  );
  const [finishingTouches, setFinishingTouches] = useState(
    initialDish?.finishingTouches || ''
  );
  const [chefNotes, setChefNotes] = useState(initialDish?.chefNotes || '');
  const [formError, setFormError] = useState<string | null>(null);

  const [platingSteps, setPlatingSteps] = useState<string[]>(
    initialDish?.platingSteps && initialDish.platingSteps.length > 0
      ? initialDish.platingSteps
      : ['Colocar la base en el plato.', 'Disponer el elemento principal.']
  );

  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    sortAllergens(initialDish?.allergens || [])
  );

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialDish?.ingredients && initialDish.ingredients.length > 0
      ? initialDish.ingredients
      : [{ name: '', quantity: 100, unit: 'g', notes: '' }]
  );

  const [recipeSteps, setRecipeSteps] = useState<string[]>(
    initialDish?.recipeSteps && initialDish.recipeSteps.length > 0
      ? initialDish.recipeSteps
      : ['Preparar la mise en place.']
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen supera el límite de 5 MB.');
      return;
    }

    setFormError(null);
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

  const handleAddPlatingStep = () => setPlatingSteps([...platingSteps, '']);
  const handleUpdatePlatingStep = (index: number, val: string) => {
    const next = [...platingSteps];
    next[index] = val;
    setPlatingSteps(next);
  };
  const handleRemovePlatingStep = (index: number) => {
    setPlatingSteps(platingSteps.filter((_, i) => i !== index));
  };

  const handleAddRecipeStep = () => setRecipeSteps([...recipeSteps, '']);
  const handleUpdateRecipeStep = (index: number, val: string) => {
    const next = [...recipeSteps];
    next[index] = val;
    setRecipeSteps(next);
  };
  const handleRemoveRecipeStep = (index: number) => {
    setRecipeSteps(recipeSteps.filter((_, i) => i !== index));
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 100, unit: 'g', notes: '' }]);
  };
  const handleUpdateIngredient = (
    index: number,
    field: keyof Ingredient,
    val: string | number
  ) => {
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
      setFormError('Indica el nombre del plato antes de guardar.');
      return;
    }

    const newDish: Dish = {
      id: initialDish?.id || `dish-${Date.now()}`,
      name: name.trim(),
      category,
      station,
      photoUrl: photoUrl.trim(),
      tableware: tableware.trim() || 'Plato estándar',
      servingTemp: servingTemp.trim() || 'Caliente',
      prepTimeMinutes: Number(prepTimeMinutes) || 5,
      platingDescription: platingDescription.trim(),
      platingSteps: platingSteps.filter((s) => s.trim().length > 0),
      finishingTouches: finishingTouches.trim(),
      allergens: sortAllergens(selectedAllergens),
      basePortions: initialDish?.basePortions || 1,
      ingredients: ingredients.filter((i) => i.name.trim().length > 0),
      recipeSteps: recipeSteps.filter((r) => r.trim().length > 0),
      chefNotes: chefNotes.trim(),
      createdAt: initialDish?.createdAt || Date.now(),
    };

    onSave(newDish);
  };

  const inputClass =
    'min-h-[44px] w-full rounded-xl border border-black/12 dark:border-white/12 bg-[#f5f4f0] dark:bg-[#141413] px-3.5 py-2 text-sm text-[#1a1a18] dark:text-[#f0efe8] placeholder:text-[#9c9b94] dark:placeholder:text-[#6a6a63] focus:border-[#2a8549] dark:focus:border-[#4cc376] focus:outline-none';

  return (
    <div
      id="dish-form-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="dish-form-modal"
        role="dialog"
        aria-modal="true"
        className="relative w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#242422] border-t sm:border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-black/15 dark:bg-white/20 sm:hidden shrink-0" />

        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-black/8 dark:border-white/8">
          <h2 className="text-lg font-bold text-[#1a1a18] dark:text-[#f0efe8]">
            {initialDish ? 'Editar ficha' : 'Nuevo plato'}
          </h2>
          <button
            id="btn-close-form"
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6c6c66] dark:text-[#9a9991] hover:bg-black/5 dark:hover:bg-white/6 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {formError && (
            <div className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/30 px-3.5 py-2.5 text-xs font-medium text-[#b91c1c] dark:text-red-400">
              {formError}
            </div>
          )}

          {/* Datos básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="input-dish-name"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Nombre del plato
              </label>
              <input
                id="input-dish-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Okonomiyaki de Salmón"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="select-dish-category"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Categoría
              </label>
              <select
                id="select-dish-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<DishCategory, 'todos'>)}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="select-dish-station"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Partida
              </label>
              <select
                id="select-dish-station"
                value={station}
                onChange={(e) => setStation(e.target.value as Exclude<KitchenStation, 'todas'>)}
                className={inputClass}
              >
                {STATIONS.filter((s) => s.id !== 'todas').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Foto */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 space-y-3">
            <span className="block text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Foto de emplatado
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-2.5">
                <input
                  id="input-dish-photo-url"
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Ruta o URL de la imagen..."
                  className={inputClass}
                />
                <label className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#f5f4f0] dark:bg-[#141413] px-3.5 py-2 text-xs font-medium text-[#1a1a18] dark:text-[#f0efe8] cursor-pointer hover:border-black/25 dark:hover:border-white/25 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Subir desde dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="sm:col-span-4 flex justify-center">
                {photoUrl ? (
                  <img
                    src={getImageUrl(photoUrl)}
                    alt="Vista previa"
                    referrerPolicy="no-referrer"
                    className="w-32 h-22 object-cover rounded-xl border border-black/10 dark:border-white/10"
                  />
                ) : (
                  <div className="w-32 h-22 rounded-xl border border-dashed border-black/15 dark:border-white/15 flex flex-col items-center justify-center text-[#7a7a74] dark:text-[#8a8a82] bg-[#f5f4f0] dark:bg-[#141413]">
                    <ImageIcon className="h-5 w-5 mb-1 opacity-60" />
                    <span className="text-[11px]">Sin foto</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Servicio */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="input-dish-tableware"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Vajilla
              </label>
              <input
                id="input-dish-tableware"
                type="text"
                value={tableware}
                onChange={(e) => setTableware(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="input-dish-temp"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Temperatura
              </label>
              <input
                id="input-dish-temp"
                type="text"
                value={servingTemp}
                onChange={(e) => setServingTemp(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="input-dish-time"
                className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5"
              >
                Tiempo (min)
              </label>
              <input
                id="input-dish-time"
                type="number"
                min={1}
                max={120}
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className={`${inputClass} font-mono-code tabular-nums`}
              />
            </div>
          </div>

          {/* Montaje */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 space-y-4">
            <span className="block text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Montaje y toque final
            </span>

            <textarea
              id="input-plating-desc"
              rows={2}
              value={platingDescription}
              onChange={(e) => setPlatingDescription(e.target.value)}
              placeholder="Resumen del montaje..."
              className="w-full rounded-xl border border-black/12 dark:border-white/12 bg-[#f5f4f0] dark:bg-[#141413] px-3.5 py-2.5 text-sm text-[#1a1a18] dark:text-[#f0efe8] placeholder:text-[#9c9b94] focus:border-[#2a8549] dark:focus:border-[#4cc376] focus:outline-none"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6c6c66] dark:text-[#9a9991]">
                  Pasos de montaje
                </span>
                <button
                  type="button"
                  onClick={handleAddPlatingStep}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a8549] dark:text-[#4cc376] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Añadir paso
                </button>
              </div>
              {platingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono-code text-xs text-[#6c6c66] dark:text-[#9a9991] w-5 tabular-nums">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdatePlatingStep(idx, e.target.value)}
                    placeholder={`Paso ${idx + 1}...`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePlatingStep(idx)}
                    aria-label="Eliminar paso"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#7a7a74] hover:text-[#b91c1c] cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5">
                Toque final
              </label>
              <input
                type="text"
                value={finishingTouches}
                onChange={(e) => setFinishingTouches(e.target.value)}
                placeholder="Salsas, cebolleta, sésamo, sal en escamas..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] mb-1.5">
                Nota de pase (incluye si tiene opción sin gluten o vegana)
              </label>
              <input
                type="text"
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="Ej. Opción sin gluten disponible bajo petición con tamari..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Ingredientes */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
                Ingredientes
              </span>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a8549] dark:text-[#4cc376] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Añadir ingrediente
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                    placeholder="Ingrediente"
                    className={`${inputClass} col-span-12 sm:col-span-5`}
                  />
                  <input
                    type="number"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)
                    }
                    placeholder="Cant."
                    className={`${inputClass} col-span-4 sm:col-span-2 text-right font-mono-code tabular-nums`}
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                    placeholder="Ud."
                    className={`${inputClass} col-span-4 sm:col-span-2`}
                  />
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => handleUpdateIngredient(idx, 'notes', e.target.value)}
                    placeholder="Notas"
                    className={`${inputClass} col-span-3 sm:col-span-2`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    aria-label="Eliminar ingrediente"
                    className="col-span-1 flex h-10 w-full items-center justify-center rounded-xl text-[#7a7a74] hover:text-[#b91c1c] cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Elaboración */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
                Elaboración
              </span>
              <button
                type="button"
                onClick={handleAddRecipeStep}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a8549] dark:text-[#4cc376] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Añadir paso
              </button>
            </div>
            {recipeSteps.map((rStep, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono-code text-xs text-[#6c6c66] dark:text-[#9a9991] w-5 tabular-nums">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={rStep}
                  onChange={(e) => handleUpdateRecipeStep(idx, e.target.value)}
                  placeholder={`Paso ${idx + 1}...`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRecipeStep(idx)}
                  aria-label="Eliminar paso"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#7a7a74] hover:text-[#b91c1c] cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Alérgenos */}
          <div className="pt-5 border-t border-black/8 dark:border-white/8 space-y-2.5">
            <span className="block text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Alérgenos
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ALLERGENS.map((allergen) => {
                const isSelected = selectedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1a18] dark:bg-[#f0efe8] text-white dark:text-[#1a1a18] border-transparent'
                        : 'bg-[#f5f4f0] dark:bg-[#141413] text-[#6c6c66] dark:text-[#9a9991] border-black/10 dark:border-white/10 hover:text-[#1a1a18] dark:hover:text-[#f0efe8]'
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="pt-4 border-t border-black/8 dark:border-white/8 flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-[#242422] py-2">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-medium rounded-xl text-[#6c6c66] dark:text-[#9a9991] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-save-dish"
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-[#1a1a18] dark:bg-[#f0efe8] text-white dark:text-[#1a1a18] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
