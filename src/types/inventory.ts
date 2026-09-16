export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface InventoryItem {
  id: string;
  item: string;
  category: "Raw Material" | "Dairy" | "Packaging" | "Syrup" | "Ingredient" | "Food";
  current_stock: number;
  min_threshold: number;
  unit: "kg" | "L" | "pcs";
  status: StockStatus;
  last_updated: string;
}
