"use strict";
// const cacheStore = new Map<string, any>();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
// const cache = {
//   get: (key: string) => {
//     const value = cacheStore.get(key);
//     return value?.expires > Date.now() ? value.data : null;
//   },
//   set: (key: string, data: any, ttl: number = 3600) => {
//     const expires = Date.now() + ttl * 1000;
//     cacheStore.set(key, { data, expires });
//   },
//   delete: (key: string) => {
//     cacheStore.delete(key);
//   },
// };
// setInterval(() => {
//   const now = Date.now();
//   for (const [key, value] of cacheStore.entries()) {
//     if (now > value.expires) {
//       cacheStore.delete(key);
//     }
//   }
// }, 60 * 1000); // Runs every 60 seconds
// const setCache = cache.set;
// const getCache = cache.get;
// export { setCache, getCache, cache };
const cacheStore = new Map();
exports.cache = {
    get: (key) => {
        const value = cacheStore.get(key);
        return value && value.expires > Date.now() ? value.data : null;
    },
    set: (key, data, ttl = 3600) => {
        const expires = Date.now() + ttl * 1000;
        cacheStore.set(key, { data, expires });
    },
    delete: (key) => {
        cacheStore.delete(key);
    },
    entries: () => cacheStore.entries(),
};
