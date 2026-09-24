import type { Key } from 'react';
import { Clock, Eye, Utensils, Flame, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { Dish } from '../types';
import { STATIONS } from '../data/initialDishes';
import { getImageUrl } from '../utils/imageUrl';
import AllergenBadge from './AllergenBadge';

interface DishCardProps {
  key?: Key;
  dish: Dish;
  onOpenDetail: (dish: Dish) => void;
  onEdit: (dish: Dish) => void;
  onDelete: (dishId: string) => void;
}

export default function DishCard({ dish, onOpenDetail, onEdit, onDelete }: DishCardProps) {
  const stationInfo = STATIONS.find((s) => s.id === dish.station);
  const isNigiri = dish.name.toLowerCase().includes('nigiri');
  const isUramaki = dish.name.toLowerCase().includes('uramaki') || dish.id.includes('uramaki');
  const isSinGluten = dish.chefNotes?.toLowerCase().includes('sin gluten') || dish.platingDescription?.toLowerCase().includes('sin gluten');
  const isVegano = dish.chefNotes?.toLowerCase().includes('vegana') || dish.chefNotes?.toLowerCase().includes('vegano');

  return (
    <article
      id={`dish-card-${dish.id}`}
      className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:border-stone-300"
    >
      {/* Header Image with Photo of the Plating */}
      <div 
        className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onOpenDetail(dish)}
      >
        <img
          src={getImageUrl(dish.photoUrl)}
          alt={`Emplatado de ${dish.name}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('.webp')) {
              target.src = target.src.replace('.webp', '.jpg');
            } else {
              target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }
          }}
        />

        {/* Overlay gradient for badges legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Station tag & Nigiri / Uramaki tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border shadow-xs bg-white/95 text-stone-800 border-stone-200 backdrop-blur-xs`}>
            {stationInfo?.label || dish.station}
          </span>
          {isNigiri && (
            <span className="px-2.5 py-1 text-xs font-black rounded-md border shadow-md bg-red-600 text-white border-red-700 tracking-wider uppercase">
              1 PIEZA
            </span>
          )}
          {isUramaki && (
            <span className="px-2.5 py-1 text-xs font-black rounded-md border shadow-md bg-purple-700 text-white border-purple-800 tracking-wider uppercase">
              8 o 4 PIEZAS
            </span>
          )}
        </div>

        {/* Time and Temp */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-stone-200" />
          <span>{dish.prepTimeMinutes} min</span>
        </div>

        {/* Quick hint on hover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="truncate font-medium flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 shrink-0 text-amber-300" />
            <span className="truncate drop-shadow-xs">{dish.tableware}</span>
          </span>
          <span className="shrink-0 bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 shadow-xs">
            <Eye className="w-3 h-3" /> Ver Ficha
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Dish Name */}
          <h3 
            onClick={() => onOpenDetail(dish)}
            className="text-lg font-bold text-stone-900 leading-snug cursor-pointer hover:text-amber-800 transition-colors"
          >
            {dish.name}
          </h3>

          {/* Temperature and diet tags */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium text-stone-700">{dish.servingTemp}</span>
            </div>
            {isUramaki && (
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                8 o 4 piezas
              </span>
            )}
            {isVegano && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                🌱 Opción Vegana
              </span>
            )}
            {isSinGluten && (
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                🌾 Sin Gluten
              </span>
            )}
          </div>

          {/* Plating Guide Brief */}
          <div className="mt-2 text-xs text-stone-600 line-clamp-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
            <span className="font-semibold text-stone-800">Montaje: </span>
            {dish.platingDescription.replace(/^⚠️[^.]+\.\s*/, '')}
          </div>
        </div>

        {/* Allergens & Quick Action */}
        <div className="pt-2 border-t border-stone-100 space-y-2.5">
          {dish.allergens && dish.allergens.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] text-stone-600 font-semibold flex items-center gap-0.5 mr-1">
                <ShieldAlert className="w-3 h-3 text-red-500" />
                Alérgenos:
              </span>
              {dish.allergens.slice(0, 4).map((allergen) => (
                <AllergenBadge key={allergen} allergen={allergen} size="sm" />
              ))}
              {dish.allergens.length > 4 && (
                <span className="text-[11px] text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 font-medium">
                  +{dish.allergens.length - 4}
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-emerald-700 font-medium">
              ✓ Sin alérgenos de declaración obligatoria
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              id={`btn-open-dish-${dish.id}`}
              onClick={() => onOpenDetail(dish)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Emplatado y Receta</span>
            </button>

            <button
              id={`btn-edit-dish-${dish.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(dish);
              }}
              title="Editar ficha del plato"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              id={`btn-delete-dish-${dish.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar la ficha de "${dish.name}"?`)) {
                  onDelete(dish.id);
                }
              }}
              title="Eliminar plato"
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
