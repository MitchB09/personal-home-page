
export type Recipe = {
  id: string,
  title: string,
  recipeUrl: string,
  tags: string[];
  lastUpdated?: number,
}

export type AddRecieForm = {
  recipeUrl: string;
  title: string;
  notes: string;
  tags: string[];
};