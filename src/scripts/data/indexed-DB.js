const DB_NAME = "dicoding-intermediate-db";
const DB_VERSION = 2; // versi dinaikkan agar onupgradeneeded dijalankan ulang
const STORE_NAME = "bookmarked-reports";

const dbPromise = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject("Error opening database");
        };
        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                });
                store.createIndex("bookmarkedAt", "bookmarkedAt", {
                    unique: false,
                });
            }
        };
    });
};

// Menyimpan satu report ke dalam database
export async function saveReport(report) {
    const db = await dbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.put(report);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Menghapus report berdasarkan id
export async function deleteReport(id) {
    const db = await dbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Mengambil satu report berdasarkan id
export async function getReport(id) {
    const db = await dbPromise();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Mengambil semua report yang sudah dibookmark
export async function getAllBookmarkedReports() {
    const db = await dbPromise();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}
