import type { Key } from 'react';

interface AllergenBadgeProps {
  key?: Key;
  allergen: string;
  size?: 'sm' | 'md';
}

export const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: 'bg-amber-100 text-amber-900 border-amber-300',
  Crustáceos: 'bg-red-100 text-red-900 border-red-300',
  Huevos: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  Pescado: 'bg-blue-100 text-blue-900 border-blue-300',
  Cacahuetes: 'bg-orange-100 text-orange-900 border-orange-300',
  Soja: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Lácteos: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  'Frutos de cáscara': 'bg-amber-100 text-amber-950 border-amber-400',
  Apio: 'bg-lime-100 text-lime-900 border-lime-300',
  Mostaza: 'bg-yellow-100 text-yellow-950 border-yellow-400',
  Sésamo: 'bg-stone-200 text-stone-900 border-stone-400',
  Sulfitos: 'bg-purple-100 text-purple-900 border-purple-300',
  Moluscos: 'bg-teal-100 text-teal-900 border-teal-300',
  Altramuces: 'bg-orange-100 text-orange-950 border-orange-300',
};

export default function AllergenBadge({ allergen, size = 'sm' }: AllergenBadgeProps) {
  const colorClass = ALLERGEN_COLORS[allergen] || 'bg-stone-100 text-stone-800 border-stone-300';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  return (
    <span
      id={`allergen-badge-${allergen.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center rounded-md border font-medium ${colorClass} ${sizeClass}`}
      title={`Alérgeno: ${allergen}`}
    >
      {allergen}
    </span>
  );
}
