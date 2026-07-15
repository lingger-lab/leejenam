'use client';

const NAME_KEY = 'ijn_name';

export function getStoredName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setStoredName(name: string): void {
  localStorage.setItem(NAME_KEY, name);
  window.dispatchEvent(new CustomEvent('name-updated'));
}
