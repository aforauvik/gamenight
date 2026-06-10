let isSessionStorageAvailable = false;
try {
	if (typeof window !== "undefined" && window.sessionStorage) {
		const testKey = "__storage_test__";
		window.sessionStorage.setItem(testKey, testKey);
		window.sessionStorage.removeItem(testKey);
		isSessionStorageAvailable = true;
	}
} catch (e) {
	isSessionStorageAvailable = false;
}

const memoryStore = {};

export const safeSessionStorage = {
	getItem: (key) => {
		if (isSessionStorageAvailable) {
			try {
				return window.sessionStorage.getItem(key);
			} catch (e) {
				console.warn("sessionStorage read failed, falling back to memory:", e);
			}
		}
		return memoryStore[key] || null;
	},
	setItem: (key, value) => {
		if (isSessionStorageAvailable) {
			try {
				window.sessionStorage.setItem(key, value);
				return;
			} catch (e) {
				console.warn("sessionStorage write failed, falling back to memory:", e);
			}
		}
		memoryStore[key] = String(value);
	},
	removeItem: (key) => {
		if (isSessionStorageAvailable) {
			try {
				window.sessionStorage.removeItem(key);
				return;
			} catch (e) {
				console.warn("sessionStorage delete failed, falling back to memory:", e);
			}
		}
		delete memoryStore[key];
	},
	clear: () => {
		if (isSessionStorageAvailable) {
			try {
				window.sessionStorage.clear();
				return;
			} catch (e) {
				console.warn("sessionStorage clear failed, falling back to memory:", e);
			}
		}
		for (const key in memoryStore) {
			delete memoryStore[key];
		}
	},
};
