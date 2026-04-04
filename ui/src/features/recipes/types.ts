
export type Recipe = {
  id?: string,
  title: string,
  recipeUrl: string,
  notes?: string;
  tags: string[];
  lastUpdated?: number,
}

export type RecipeForm = {
  id?: string,
  recipeUrl?: string;
  title?: string;
  notes?: string;
  tags?: string[];
};