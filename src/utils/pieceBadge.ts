import { Dish } from '../types';

export interface PieceBadgeInfo {
  text: string;
  bgClass: string;
  borderClass: string;
  detailText: string;
}

export function getPieceBadge(dish: Dish): PieceBadgeInfo | null {
  const nameLower = dish.name.toLowerCase();
  const idLower = dish.id.toLowerCase();

  // 1. Surtidos
  if (idLower.includes('surtido-tokyo') || nameLower.includes('surtido tokyo')) {
    return { 
      text: '16 PIEZAS', 
      bgClass: 'bg-indigo-600 text-white', 
      borderClass: 'border-indigo-700',
      detailText: 'Surtido completo: 16 piezas (8 uramaki, 6 hosomaki, 2 nigiri)'
    };
  }
  if (idLower.includes('surtido-edo') || nameLower.includes('surtido edo')) {
    return { 
      text: '16 PIEZAS', 
      bgClass: 'bg-indigo-600 text-white', 
      borderClass: 'border-indigo-700',
      detailText: 'Surtido Edomae: 16 piezas (6 futomaki, 6 hosomaki, 2 nigiri, 2 sashimi)'
    };
  }
  if (idLower.includes('surtido-nigiri') || nameLower.includes('surtido de nigiri') || nameLower.includes('surtido nigiri')) {
    return { 
      text: '4 PIEZAS', 
      bgClass: 'bg-indigo-600 text-white', 
      borderClass: 'border-indigo-700',
      detailText: 'Degustación de 4 nigiris gourmet de autor'
    };
  }
  if (nameLower.includes('gyoza surtido')) {
    return { 
      text: '8 UNIDADES', 
      bgClass: 'bg-indigo-600 text-white', 
      borderClass: 'border-indigo-700',
      detailText: 'Surtido de 8 unidades de gyoza'
    };
  }

  // 2. Usuzukuri
  if (idLower.includes('usuzukuri-suzuki') || nameLower.includes('usuzukuri suzuki')) {
    return { 
      text: '7 PIEZAS', 
      bgClass: 'bg-sky-600 text-white', 
      borderClass: 'border-sky-700',
      detailText: '7 láminas translúcidas en abanico'
    };
  }
  if (idLower.includes('usuzukuri-maguro') || nameLower.includes('usuzukuri maguro')) {
    return { 
      text: '10 PIEZAS', 
      bgClass: 'bg-sky-600 text-white', 
      borderClass: 'border-sky-700',
      detailText: '10 láminas finas en círculo concéntrico'
    };
  }

  // 3. Uramakis
  if (dish.category === 'uramaki' || nameLower.includes('uramaki') || idLower.includes('tazuna-unagi')) {
    return { 
      text: '8 o 4 PIEZAS', 
      bgClass: 'bg-purple-700 text-white', 
      borderClass: 'border-purple-800',
      detailText: 'Roll: 8 piezas (ración entera) ó 4 piezas (media ración)'
    };
  }

  // 4. Hosomakis
  if (dish.category === 'hosomaki' || nameLower.includes('hosomaki') || idLower.includes('hosomaki')) {
    return { 
      text: '6 PIEZAS', 
      bgClass: 'bg-teal-700 text-white', 
      borderClass: 'border-teal-800',
      detailText: 'Rollo fino tradicional cortado en 6 piezas (3 y 3)'
    };
  }

  // 5. Individual Nigiris (excluye surtidos)
  if ((dish.category === 'nigiri' || nameLower.includes('nigiri')) && !nameLower.includes('surtido')) {
    return { 
      text: '1 PIEZA', 
      bgClass: 'bg-red-600 text-white', 
      borderClass: 'border-red-700',
      detailText: 'Servicio individual: 1 sola pieza'
    };
  }

  // 6. Kushi / Brochetas
  if (nameLower.includes('kushi') || nameLower.includes('brocheta')) {
    if (nameLower.includes('shiitake')) {
      return { 
        text: '2 BROCHETAS', 
        bgClass: 'bg-amber-700 text-white', 
        borderClass: 'border-amber-800',
        detailText: 'Ración de 2 brochetas (3 setas)'
      };
    }
    return { 
      text: '2 BROCHETAS (4 PZ)', 
      bgClass: 'bg-amber-700 text-white', 
      borderClass: 'border-amber-800',
      detailText: 'Ración de 2 brochetas (4 piezas en total)'
    };
  }

  // 7. Platos con unidades o piezas explícitas en el nombre
  const match = dish.name.match(/\((\d+)\s*(piezas|unidades|uds)\)/i);
  if (match) {
    const num = match[1];
    const unit = match[2].toLowerCase().startsWith('u') ? 'UNIDADES' : 'PIEZAS';
    return { 
      text: `${num} ${unit}`, 
      bgClass: 'bg-rose-700 text-white', 
      borderClass: 'border-rose-800',
      detailText: `Ración estándar de ${num} ${unit.toLowerCase()}`
    };
  }

  return null;
}
