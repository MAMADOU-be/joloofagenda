import { Prospect } from './types';

const STORAGE_KEY = 'artisan_prospects';

export function loadProspects(): Prospect[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveProspects(prospects: Prospect[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
}
