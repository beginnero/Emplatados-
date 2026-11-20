import { useState, useEffect } from 'react';
import {
  X,
  Edit2,
  Trash2,
  ShieldAlert,
  Maximize2,
  UtensilsCrossed,
} from 'lucide-react';
import { Dish } from '../types';
import { STATIONS, CATEGORIES } from '../data/initialDishes';
import { getImageUrl } from '../utils/imageUrl';
import { getPieceBadge } from '../utils/pieceBadge';
import AllergenBadge, { sortAllergens } from './AllergenBadge';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onEdit: (dish: Dish) => void;
  onDelete: (dishId: string) => void;
}

export default function DishDetailModal({
  dish,
  onClose,
  onEdit,
  onDelete,
}: DishDetailModalProps) {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [triedJpgFallback, setTriedJpgFallback] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setIsPhotoZoomed(false);
    setImgError(false);
    setTriedJpgFallback(false);
  }, [dish?.id]);

  useEffect(() => {
    if (!dish) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPhotoZoomed) setIsPhotoZoomed(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dish, isPhotoZoomed, onClose]);

  if (!dish) return null;

  const stationInfo = STATIONS.find((s) => s.id === dish.station);
  const categoryInfo = CATEGORIES.find((c) => c.id === dish.category);
  const pieceBadge = getPieceBadge(dish);

  const isSinGluten =
    dish.chefNotes?.toLowerCase().includes('sin gluten') ||
    dish.platingDescription?.toLowerCase().includes('sin gluten') ||
    dish.finishingTouches?.toLowerCase().includes('sin gluten') ||
    dish.ingredients?.some((i) => i.notes?.toLowerCase().includes('sin gluten'));

  const notesLower = (dish.chefNotes || '').toLowerCase();
  const isPlatoVegano =
    notesLower.includes('plato vegano') || notesLower.includes('100% vegano');
  const isOpcionVegana =
    !isPlatoVegano &&
    !notesLower.includes('no puede ser vegano') &&
    (notesLower.includes('versión vegana') || notesLower.includes('opción vegana'));

  const isNoSinPescado =
    notesLower.includes('no puede ser sin pescado') ||
    notesLower.includes('no pueden ser sin pescado');

  const resolvedSrc = triedJpgFallback
    ? getImageUrl(dish.photoUrl).replace('.webp', '.jpg')
    : getImageUrl(dish.photoUrl);

  return (
    <div
      id="dish-detail-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="dish-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-detail-title"
        className="relative w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#242422] border-t sm:border border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Mobile Sheet Handle */}
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-black/15 dark:bg-white/20 sm:hidden shrink-0" />

        {/* Compact Sticky Sheet Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-black/8 dark:border-white/8 bg-white/95 dark:bg-[#242422]/95 backdrop-blur-md">
          <div className="min-w-0">
            <div className="text-xs text-[#6c6c66] dark:text-[#9a9991] truncate">
              {categoryInfo?.label} · {stationInfo?.label}
            </div>
            <h2
              id="dish-detail-title"
              className="text-lg sm:text-xl font-bold text-[#1a1a18] dark:text-[#f0efe8] truncate"
            >
              {dish.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="min-h-[40px] px-3 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium text-[#6c6c66] dark:text-[#9a9991] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-delete-dish"
                  type="button"
                  onClick={() => onDelete(dish.id)}
                  className="min-h-[40px] px-3 rounded-xl bg-[#b91c1c] text-white text-xs font-medium cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <>
                <button
                  id="btn-modal-edit"
                  type="button"
                  onClick={() => onEdit(dish)}
                  title="Editar plato"
                  aria-label="Editar plato"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6c6c66] dark:text-[#9a9991] hover:bg-black/5 dark:hover:bg-white/6 hover:text-[#1a1a18] dark:hover:text-[#f0efe8] transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  id="btn-modal-delete"
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  title="Eliminar plato"
                  aria-label="Eliminar plato"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6c6c66] dark:text-[#9a9991] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-[#b91c1c] dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              id="btn-close-modal"
              type="button"
              onClick={onClose}
              aria-label="Cerrar ficha"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6c6c66] dark:text-[#9a9991] hover:bg-black/5 dark:hover:bg-white/6 hover:text-[#1a1a18] dark:hover:text-[#f0efe8] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Single Continuous Scrollable Body (No Tabs, No Checkboxes, No Scaler) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {/* 1. Plating Photo + Quick Specs */}
          <div className="space-y-4">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-[#eceae4] dark:bg-[#1a1a18] group">
              {!imgError && dish.photoUrl ? (
                <>
                  <img
                    src={resolvedSrc}
                    alt={`Foto de emplatado de ${dish.name}`}
                    referrerPolicy="no-referrer"
                    onClick={() => setIsPhotoZoomed(true)}
                    className="h-full w-full object-cover cursor-zoom-in"
                    onError={() => {
                      if (!triedJpgFallback && dish.photoUrl.includes('.webp')) {
                        setTriedJpgFallback(true);
                      } else {
                        setImgError(true);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPhotoZoomed(true)}
                    aria-label="Ampliar foto"
                    className="absolute bottom-3 right-3 flex h-9 items-center gap-1.5 rounded-xl bg-black/65 px-3 text-xs font-medium text-white backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Ampliar</span>
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#7a7a74] dark:text-[#8a8a82]">
                  <UtensilsCrossed className="h-8 w-8 opacity-60" />
                  <span className="text-xs font-medium">{dish.name}</span>
                </div>
              )}
            </div>

            {/* Clean Specs Grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {pieceBadge && (
                <div>
                  <dt className="text-xs text-[#6c6c66] dark:text-[#9a9991]">Formato</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#1a1a18] dark:text-[#f0efe8] tabular-nums">
                    {pieceBadge.text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-[#6c6c66] dark:text-[#9a9991]">Vajilla</dt>
                <dd className="mt-0.5 text-sm font-medium text-[#1a1a18] dark:text-[#f0efe8]">
                  {dish.tableware}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6c6c66] dark:text-[#9a9991]">Temperatura</dt>
                <dd className="mt-0.5 text-sm font-medium text-[#1a1a18] dark:text-[#f0efe8]">
                  {dish.servingTemp}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6c6c66] dark:text-[#9a9991]">Tiempo de pase</dt>
                <dd className="mt-0.5 text-sm font-medium font-mono-code tabular-nums text-[#1a1a18] dark:text-[#f0efe8]">
                  {dish.prepTimeMinutes} min
                </dd>
              </div>
            </dl>

            {(pieceBadge || isPlatoVegano || isOpcionVegana) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#6c6c66] dark:text-[#9a9991]">
                {pieceBadge && <span>{pieceBadge.detailText}</span>}
                {isPlatoVegano && (
                  <span className="inline-flex items-center rounded-md border border-emerald-300 dark:border-emerald-700/60 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    Vegano
                  </span>
                )}
                {isOpcionVegana && (
                  <span className="font-medium text-[#2a8549] dark:text-[#4cc376]">
                    Opción vegana disponible
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. Preserved Gluten-Free & Cross-Contamination Protocol Alert */}
          {isSinGluten && (
            <div className="rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-amber-900 dark:text-amber-300">
                  Opción Sin Gluten (bajo petición) — Evitar contaminación cruzada
                </p>
                <p>
                  No dar por sentado que el plato es sin gluten por defecto. Requiere comanda expresa para celíacos: usar soja tamari sin gluten y extremar limpieza de tablas, cuchillos y esterillas.
                </p>
              </div>
            </div>
          )}

          {/* No Fish-Free Warning (e.g. Okonomiyaki dashi base) */}
          {isNoSinPescado && (
            <div className="rounded-xl border border-blue-300/80 dark:border-blue-700/60 bg-blue-50/80 dark:bg-blue-950/30 p-3.5 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-blue-900 dark:text-blue-300">
                  No puede ser sin pescado (contiene dashi en la base)
                </p>
                <p>
                  La masa base lleva caldo dashi de pescado para aportar umami. Aunque se omita el katsuobushi superior, no es apta para alergias al pescado.
                </p>
              </div>
            </div>
          )}

          {/* 3. Montaje y Toque Final */}
          <section className="pt-5 border-t border-black/8 dark:border-white/8 space-y-3">
            <h3 className="text-base font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Montaje y toque final
            </h3>

            {dish.platingDescription && (
              <p className="text-sm text-[#6c6c66] dark:text-[#9a9991] leading-relaxed">
                {dish.platingDescription}
              </p>
            )}

            {dish.platingSteps && dish.platingSteps.length > 0 && (
              <ol className="space-y-2">
                {dish.platingSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-[#1a1a18] dark:text-[#f0efe8] leading-relaxed"
                  >
                    <span className="font-mono-code text-xs font-semibold text-[#6c6c66] dark:text-[#9a9991] tabular-nums pt-1 shrink-0 w-5">
                      {idx + 1}.
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {dish.finishingTouches && (
              <p className="text-sm text-[#1a1a18] dark:text-[#f0efe8] pt-1 leading-relaxed">
                <span className="font-semibold">Toque final: </span>
                <span className="text-[#6c6c66] dark:text-[#9a9991]">{dish.finishingTouches}</span>
              </p>
            )}

            {dish.chefNotes && (
              <div className="rounded-xl bg-[#f5f4f0] dark:bg-[#1a1a18] p-3.5 text-xs text-[#1a1a18] dark:text-[#f0efe8] leading-relaxed">
                <span className="font-semibold">Nota de pase: </span>
                <span className="text-[#6c6c66] dark:text-[#9a9991]">{dish.chefNotes}</span>
              </div>
            )}
          </section>

          {/* 4. Ingredientes (Fixed standard portion, clean 2-column hairline list) */}
          <section className="pt-5 border-t border-black/8 dark:border-white/8 space-y-3">
            <h3 className="text-base font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Ingredientes
            </h3>

            {dish.ingredients && dish.ingredients.length > 0 ? (
              <ul className="divide-y divide-black/6 dark:divide-white/6">
                {dish.ingredients.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-2.5 flex items-baseline justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-[#1a1a18] dark:text-[#f0efe8]">
                        {item.name}
                      </span>
                      {item.notes && (
                        <span className="ml-2 text-xs text-[#6c6c66] dark:text-[#9a9991]">
                          ({item.notes})
                        </span>
                      )}
                    </div>
                    <span className="font-mono-code text-xs sm:text-sm font-semibold tabular-nums text-[#2a8549] dark:text-[#4cc376] shrink-0">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#6c6c66] dark:text-[#9a9991]">
                Sin ingredientes registrados.
              </p>
            )}
          </section>

          {/* 5. Elaboración */}
          {dish.recipeSteps && dish.recipeSteps.length > 0 && (
            <section className="pt-5 border-t border-black/8 dark:border-white/8 space-y-3">
              <h3 className="text-base font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
                Elaboración
              </h3>
              <ol className="space-y-2">
                {dish.recipeSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-[#1a1a18] dark:text-[#f0efe8] leading-relaxed"
                  >
                    <span className="font-mono-code text-xs font-semibold text-[#6c6c66] dark:text-[#9a9991] tabular-nums pt-1 shrink-0 w-5">
                      {idx + 1}.
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 6. Alérgenos */}
          <section className="pt-5 border-t border-black/8 dark:border-white/8 space-y-2.5 pb-2">
            <h3 className="text-base font-semibold text-[#1a1a18] dark:text-[#f0efe8]">
              Alérgenos
            </h3>
            {dish.allergens && dish.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sortAllergens(dish.allergens).map((allergen) => (
                  <AllergenBadge key={allergen} allergen={allergen} size="sm" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#2a8549] dark:text-[#4cc376] font-medium">
                Sin alérgenos de declaración obligatoria
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Fullscreen Photo Zoom */}
      {isPhotoZoomed && (
        <div
          id="photo-zoom-overlay"
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <img
            src={resolvedSrc}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="max-h-[85vh] max-w-full object-contain rounded-xl"
          />
          <p className="mt-3 text-center text-white/85 text-sm font-medium">
            {dish.name} · {dish.tableware}
          </p>
        </div>
      )}
    </div>
  );
}
