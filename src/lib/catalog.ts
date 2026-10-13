import data from "@/data/catalog.json";
import siteData from "@/data/site.json";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  imageCrop?: string;
  badge?: string;
  sample?: boolean;
  short: string;
  description: string;
  details: string[];
};

export type Category = { slug: string; name: string; tagline: string; image: string };
export type Addon = { id: string; name: string; price: number; description: string };
export type Plan = { id: string; name: string; price: number; featured?: boolean; description: string; features: string[] };
export type Frequency = { id: string; name: string; interval: string; count: number; discount: number };
export type Zone = { name: string; fee: number; sameDay: boolean; zips: string[] };

export const site = siteData;
export const products = data.products as Product[];
export const categories = data.categories as Category[];
export const addons = data.addons as Addon[];
export const plans = data.plans as Plan[];
export const frequencies = data.frequencies as Frequency[];
export const delivery = data.delivery as { cutoffHour: number; timezone: string; zones: Zone[] };

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsIn = (slug: string) => products.filter((p) => p.category === slug);

export function related(product: Product, n = 4) {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = products.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, n);
}
