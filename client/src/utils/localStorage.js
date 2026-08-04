const isLocalStorageAvailable = () => {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

export const storage = {
    get: (key, defaultValue = null) => {
        if (!isLocalStorageAvailable()) {
            console.warn('Local storage is not available');
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting item from local storage:', error);
            return defaultValue;
        }
    },

    set: (key, value) => {
        if (!isLocalStorageAvailable()) {
            console.warn('Local storage is not available');
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item in local storage:', error);
            return false;
        }
    },


    remove: (key) => {
        if (!isLocalStorageAvailable()) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from local storage:', error);
        }
    },

    clear: () => {
        if (!isLocalStorageAvailable()) return;

        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing local storage:', error);
        }
    }
    
}