/**
 * Bulletproof Multi-Tier Storage Engine for KESWA WEAR CMS
 * Combines in-memory state, localStorage, and IndexedDB with automatic quota fallback.
 */

export const STORAGE_KEYS = {
  CONTENT: 'keswa_site_content_v3',
  PRODUCTS: 'keswa_products_v3',
  ORDERS: 'keswa_orders_v3',
  CART: 'keswa_cart_v3',
  WISHLIST: 'keswa_wishlist_v3',
  LANG: 'keswa_language_v3',
  DELETED_ORDERS: 'keswa_deleted_orders_v3',
  DELETED_PRODUCTS: 'keswa_deleted_products_v3',
  DELETED_CATEGORIES: 'keswa_deleted_categories_v3',
  TIMESTAMPS: 'keswa_timestamps_v3'
};

const DB_NAME = 'keswa_store_db_v3';
const STORE_NAME = 'store_data';

// -------------------------------------------------------------
// 1. IndexedDB Core (Virtually unlimited storage for rich images)
// -------------------------------------------------------------
function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function idbSet(key, value) {
  try {
    const db = await openDatabase();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

export async function idbGet(key) {
  try {
    const db = await openDatabase();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function idbDelete(key) {
  try {
    const db = await openDatabase();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

// -------------------------------------------------------------
// 2. Metadata & Timestamps Tracking
// -------------------------------------------------------------
function getTimestampMap() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMESTAMPS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function updateKeyTimestamp(key, source = 'local') {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const map = getTimestampMap();
    map[key] = { time: Date.now(), source };
    localStorage.setItem(STORAGE_KEYS.TIMESTAMPS, JSON.stringify(map));
  } catch (e) {}
}

// -------------------------------------------------------------
// 3. Cleanup Legacy Keys
// -------------------------------------------------------------
export const cleanupLegacyStorage = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('keswa_') && !k.endsWith('_v3')) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {}
};

// -------------------------------------------------------------
// 4. Multi-Tier safeSetStorage & safeGetStorage
// -------------------------------------------------------------
export const safeSetStorage = (key, value) => {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  
  // 1. Asynchronously persist full data to IndexedDB
  idbSet(key, value).catch(() => {});

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  // 2. Persist to localStorage with auto-pruning & sessionStorage fallback
  try {
    localStorage.setItem(key, serialized);
    updateKeyTimestamp(key, 'local');
    // If successfully written to localStorage, clear any stale session mirror
    try { sessionStorage.removeItem(key); } catch (e) {}
  } catch (err) {
    console.warn(`[Storage] localStorage quota reached for "${key}". Pruning and falling back.`, err);
    cleanupLegacyStorage();
    try {
      localStorage.setItem(key, serialized);
      updateKeyTimestamp(key, 'local');
    } catch (retryErr) {
      // If localStorage is completely full, store in sessionStorage and record timestamp
      try {
        sessionStorage.setItem(key, serialized);
        updateKeyTimestamp(key, 'session');
      } catch (sessionErr) {
        console.warn(`[Storage] sessionStorage also full, relying on IndexedDB.`, sessionErr);
      }
    }
  }

  // 3. Dispatch broadcast event for multi-tab / reactive UI updates
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('keswa_storage_update', { detail: { key } }));
    }
  } catch (e) {}
};

export const safeGetStorage = (key) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const timestampMap = getTimestampMap();
    const meta = timestampMap[key];

    // If metadata indicates session storage was written more recently, prefer it
    if (meta && meta.source === 'session' && typeof sessionStorage !== 'undefined') {
      try {
        const sessionVal = sessionStorage.getItem(key);
        if (sessionVal !== null) return sessionVal;
      } catch (e) {}
    }

    // Otherwise read from localStorage
    const localVal = localStorage.getItem(key);
    if (localVal !== null) return localVal;

    // Fallback to sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const fallbackVal = sessionStorage.getItem(key);
      if (fallbackVal !== null) return fallbackVal;
    }
  } catch (e) {}
  return null;
};

// -------------------------------------------------------------
// 5. Deleted IDs Tracking (Orders, Products, Categories)
// -------------------------------------------------------------
export const getDeletedIds = (key) => {
  try {
    const raw = safeGetStorage(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addDeletedId = (key, id) => {
  try {
    const current = getDeletedIds(key);
    if (!current.includes(id)) {
      const updated = [...current, id];
      safeSetStorage(key, updated);
      idbSet(key, updated).catch(() => {});
    }
  } catch (e) {}
};

export const removeDeletedId = (key, id) => {
  try {
    const current = getDeletedIds(key);
    if (current.includes(id)) {
      const updated = current.filter(x => x !== id);
      safeSetStorage(key, updated);
      idbSet(key, updated).catch(() => {});
    }
  } catch (e) {}
};
