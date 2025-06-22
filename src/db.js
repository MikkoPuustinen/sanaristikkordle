const DB_NAME = "sanaristikkordle";
const STORE_NAME = "Puzzles";

function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
  
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("Times")) {
            db.createObjectStore("Times", { keyPath: 'id' });
        }
      };
  
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
}
  
export async function savePuzzle(id, values) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, values });
    return tx.complete;
}

export async function saveTime(id, values) {
    const db = await openDB();
    const tx = db.transaction("Times", 'readwrite');
    const store = tx.objectStore("Times");
    store.put({ id, values });
    return tx.complete;
}

export async function getPuzzle(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result?.values || []);
    });
}

export async function getTime(id) {
    const db = await openDB();
    const tx = db.transaction("Times", 'readonly');
    const store = tx.objectStore("Times");
    return new Promise((resolve) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result?.values || []);
    });
}

export async function getAllArrays() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
}