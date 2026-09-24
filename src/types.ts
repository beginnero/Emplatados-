export type DishCategory = 
  | 'todos'
  | 'entrantes'
  | 'hosomaki'
  | 'nigiri'
  | 'uramaki'
  | 'usuzukiri'
  | 'surtidos'
  | 'principales'
  | 'postres';

export type KitchenStation = 
  | 'todas'
  | 'cuarto_frio'
  | 'calientes'
  | 'plancha_brasa'
  | 'pasteleria'
  | 'pase';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Dish {
  id: string;
  name: string;
  category: Exclude<DishCategory, 'todos'>;
  station: Exclude<KitchenStation, 'todas'>;
  photoUrl: string;
  tableware: string; // Tipo de plato/vajilla
  servingTemp: string; // ej. Caliente (>75°C), Templado, Frío (4-6°C)
  prepTimeMinutes: number; // Tiempo de pase en minutos
  platingDescription: string;
  platingSteps: string[];
  finishingTouches: string;
  allergens: string[];
  basePortions: number;
  ingredients: Ingredient[];
  recipeSteps: string[];
  chefNotes?: string;
  createdAt: number;
}

export interface AllergenInfo {
  id: string;
  name: string;
  iconName: string;
  colorClass: string;
}
