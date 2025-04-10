const cacheStore = new Map<string, { data: any; expires: number }>();

export const cache = {
  get: (key: string) => {
    const value = cacheStore.get(key);
    return value && value.expires > Date.now() ? value.data : null;
  },
  set: (key: string, data: any, ttl: number = 3600) => {
    const expires = Date.now() + ttl * 1000;
    cacheStore.set(key, { data, expires });
  },
  delete: (key: string) => {
    cacheStore.delete(key);
  },
  entries: () => cacheStore.entries(),
};