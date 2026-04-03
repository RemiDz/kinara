export interface SavedProfile {
  id: string;
  name: string;
  day: string;
  month: string;
  year: string;
}

const KEY = 'kinara-profiles';

export function loadProfiles(): SavedProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveProfile(p: Omit<SavedProfile, 'id'>): void {
  const list = loadProfiles();
  const idx = list.findIndex(x => x.name.toLowerCase() === p.name.toLowerCase());
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...p };
  } else {
    list.push({ ...p, id: `p${Date.now()}` });
  }
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function removeProfile(id: string): void {
  const list = loadProfiles().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
