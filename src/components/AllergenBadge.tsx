import type { Key } from 'react';

interface AllergenBadgeProps {
  key?: Key;
  allergen: string;
  size?: 'sm' | 'md';
}

export const ALLERGEN_ORDER: readonly string[] = [
  'Gluten',
  'Crustáceos',
  'Huevos',
  'Pescado',
  'Cacahuetes',
  'Soja',
  'Lácteos',
  'Frutos de cáscara',
  'Apio',
  'Mostaza',
  'Sésamo',
  'Sulfitos',
  'Moluscos',
  'Altramuces',
];

export function normalizeAllergenName(allergen: string): string {
  const trimmed = allergen.trim();
  if (trimmed.toLowerCase() === 'huevo') return 'Huevos';
  return trimmed;
}

export function sortAllergens(allergens: string[] = []): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of allergens) {
    const clean = normalizeAllergenName(item);
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      normalized.push(clean);
    }
  }

  return normalized.sort((a, b) => {
    const idxA = ALLERGEN_ORDER.indexOf(a);
    const idxB = ALLERGEN_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b, 'es');
  });
}

export const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60',
  Crustáceos: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700/60',
  Huevos: 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700/60',
  Pescado: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700/60',
  Cacahuetes: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700/60',
  Soja: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/60',
  Lácteos: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-700/60',
  'Frutos de cáscara': 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60',
  Apio: 'bg-lime-100 text-lime-900 border-lime-300 dark:bg-lime-950/50 dark:text-lime-300 dark:border-lime-700/60',
  Mostaza: 'bg-yellow-100 text-yellow-950 border-yellow-400 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700/60',
  Sésamo: 'bg-stone-200 text-stone-900 border-stone-400 dark:bg-white/10 dark:text-[#e5e4dc] dark:border-white/20',
  Sulfitos: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-700/60',
  Moluscos: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-700/60',
  Altramuces: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700/60',
};

export default function AllergenBadge({ allergen, size = 'sm' }: AllergenBadgeProps) {
  const displayAllergen = normalizeAllergenName(allergen);
  const colorClass =
    ALLERGEN_COLORS[displayAllergen] ||
    'bg-stone-100 text-stone-800 border-stone-300 dark:bg-white/10 dark:text-[#f0efe8] dark:border-white/20';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      id={`allergen-badge-${displayAllergen.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center rounded-md border font-medium whitespace-nowrap ${colorClass} ${sizeClass}`}
      title={`Alérgeno: ${displayAllergen}`}
    >
      {displayAllergen}
    </span>
  );
}
