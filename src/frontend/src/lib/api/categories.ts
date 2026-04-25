import type { Category } from "../../types";
import { getCategories } from "./products";

const categoryImages: Record<string, string> = {
  electronics: "https://fakestoreapi.com/img/81fAn1SHalL._AC_SX679_.jpg",
  jewelery:
    "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg",
  "men's clothing": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
  "women's clothing": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
};

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getCategoriesWithImages(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.map((cat) => ({
    id: cat,
    name: capitalize(cat),
    slug: cat.replace(/ /g, "-"),
    image: categoryImages[cat] ?? "",
  }));
}
