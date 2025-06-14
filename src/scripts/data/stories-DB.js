const DB_NAME = "dicoding-intermediate-db";
const DB_VERSION = 1;
const STORY_STORE = "stories";

const dbPromise = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject("Error opening database");
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORY_STORE)) {
                db.createObjectStore(STORY_STORE, { keyPath: "id" });
            }
        };
    });
};

export async function saveStories(stories) {
    const db = await dbPromise();
    const tx = db.transaction(STORY_STORE, "readwrite");
    const store = tx.objectStore(STORY_STORE);
    return Promise.all(stories.map(story => {
        return new Promise((resolve, reject) => {
            const request = store.put(story);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }));
}

export async function getAllStories() {
    const db = await dbPromise();
    const tx = db.transaction(STORY_STORE, "readonly");
    const store = tx.objectStore(STORY_STORE);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}
