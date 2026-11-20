import { useState, type Key } from 'react';
import { ShieldAlert, UtensilsCrossed } from 'lucide-react';
import { Dish } from '../types';
import { STATIONS } from '../data/initialDishes';
import { getImageUrl } from '../utils/imageUrl';
import { getPieceBadge } from '../utils/pieceBadge';
import AllergenBadge, { sortAllergens } from './AllergenBadge';

interface DishCardProps {
  key?: Key;
  dish: Dish;
  onOpenDetail: (dish: Dish) => void;
}

export default function DishCard({ dish, onOpenDetail }: DishCardProps) {
  const [imgError, setImgError] = useState(false);
  const [triedJpgFallback, setTriedJpgFallback] = useState(false);

  const stationInfo = STATIONS.find((s) => s.id === dish.station);
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

  const resolvedSrc = triedJpgFallback
    ? getImageUrl(dish.photoUrl).replace('.webp', '.jpg')
    : getImageUrl(dish.photoUrl);

  return (
    <article
      id={`dish-card-${dish.id}`}
      onClick={() => onOpenDetail(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(dish);
        }
      }}
      className="group flex flex-col rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1e1e1c] overflow-hidden cursor-pointer transition-colors hover:border-black/20 dark:hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a8549] dark:focus-visible:ring-[#4cc376]"
    >
      {/* Large, completely unobstructed plating photo */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#eceae4] dark:bg-[#262624]">
        {!imgError && dish.photoUrl ? (
          <img
            src={resolvedSrc}
            alt={`Emplatado de ${dish.name}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            onError={() => {
              if (!triedJpgFallback && dish.photoUrl.includes('.webp')) {
                setTriedJpgFallback(true);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-4 text-center text-[#7a7a74] dark:text-[#8a8a82]">
            <UtensilsCrossed className="h-6 w-6 opacity-60" />
            <span className="text-xs font-medium truncate max-w-full">{dish.name}</span>
          </div>
        )}
      </div>

      {/* Minimalist metadata body */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 p-4">
        <div>
          <h3 className="text-base font-semibold text-[#1a1a18] dark:text-[#f0efe8] leading-snug">
            {dish.name}
          </h3>

          {/* Clean metadata with typographic separators */}
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#6c6c66] dark:text-[#9a9991] tabular-nums">
            {pieceBadge && (
              <>
                <span className="font-semibold text-[#1a1a18] dark:text-[#f0efe8] lowercase first-letter:uppercase">
                  {pieceBadge.text.toLowerCase()}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{stationInfo?.label || dish.station}</span>
            <span aria-hidden="true">·</span>
            <span>{dish.prepTimeMinutes} min</span>
          </div>

          {/* Colored Allergen Badges (canonical order) */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {dish.allergens && dish.allergens.length > 0 ? (
              sortAllergens(dish.allergens).map((allergen) => (
                <AllergenBadge key={allergen} allergen={allergen} size="sm" />
              ))
            ) : (
              <span className="text-[11px] font-medium text-[#2a8549] dark:text-[#4cc376]">
                Sin alérgenos
              </span>
            )}
          </div>
        </div>

        {/* Preserved Sin Gluten / Vegano safety signals — clean & concise */}
        {(isSinGluten || isPlatoVegano || isOpcionVegana) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/6 dark:border-white/6 text-xs">
            {isSinGluten && (
              <span className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-300">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                Opción Sin Gluten
              </span>
            )}
            {isPlatoVegano && (
              <span className="inline-flex items-center rounded-md border border-emerald-300 dark:border-emerald-700/60 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                Vegano
              </span>
            )}
            {isOpcionVegana && (
              <span className="font-medium text-[#2a8549] dark:text-[#4cc376]">
                Opción Vegana
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
