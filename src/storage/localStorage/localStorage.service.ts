import { IStorageService } from './localStorage.types.ts';

export class LocalStorageService implements IStorageService {
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota or disabled
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Storage unavailable
    }
  }
}

export const storageService = new LocalStorageService();
