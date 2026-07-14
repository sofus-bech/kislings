import { useEffect, useState } from 'react';

import * as seed from '@/data/content';
import type { Coffee, Guide, NewsItem } from '@/data/content';
import { pb } from '@/lib/pb';

const DA_MONTHS = [
  'januar', 'februar', 'marts', 'april', 'maj', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'december',
];

function daDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()}. ${DA_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const mapCoffee = (r: any): Coffee => ({
  id: r.id,
  name: r.name,
  origin: [r.origin, r.process].filter(Boolean).join(' · '),
  notes: r.tasting_notes ?? '',
  grinder: !!r.on_grinder,
  // `description` is a richer story field added later; fall back to notes.
  story: r.description || r.tasting_notes || '',
});

// Pull step texts out of the recipe's rich-text `steps` (<li> items).
function parseSteps(html?: string): { n: string; text: string; time: string }[] {
  if (!html) return [];
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m, i) => ({
    n: String(i + 1),
    text: m[1].replace(/<[^>]+>/g, '').trim(),
    time: '',
  }));
}

const mapNews = (r: any): NewsItem => ({
  id: r.id,
  title: r.title,
  date: daDate(r.published_at),
  body: r.body ?? '',
});

const mapGuide = (r: any): Guide => ({
  id: r.id,
  name: r.method,
  meta: [r.ratio, r.temp].filter(Boolean).join(' · '),
  ratio: r.ratio ?? '',
  dose: r.dose ?? '',
  water: r.water ?? '',
  temp: r.temp ?? '',
  steps: parseSteps(r.steps),
});

type Opts = { sort?: string; filter?: string };

/**
 * Fetch a collection, map it, and keep it live via a realtime subscription.
 * Any change on the collection triggers a refetch. Falls back to the local
 * seed content while the backend is unreachable so screens never go blank.
 */
function useCollection<T>(collection: string, map: (r: any) => T, fallback: T[], opts: Opts = {}) {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    const load = async () => {
      try {
        const records = await pb.collection(collection).getFullList({
          sort: opts.sort ?? '-created',
          filter: opts.filter ?? '',
        });
        if (active && records.length) setItems(records.map(map));
      } catch {
        // unreachable backend — keep the seed fallback
      }
    };

    load();
    pb.collection(collection)
      .subscribe('*', () => load())
      .then((u) => {
        unsub = u;
      })
      .catch(() => {});

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, [collection, opts.sort, opts.filter]);

  return items;
}

export const useCoffees = () =>
  useCollection<Coffee>('coffees', mapCoffee, seed.coffees, {
    sort: '-on_grinder,name',
    filter: 'active = true',
  });

export const useNews = () =>
  useCollection<NewsItem>('news', mapNews, seed.news, { sort: '-published_at' });

export const useGuides = () =>
  useCollection<Guide>('recipes', mapGuide, seed.guides, { sort: 'method' });
