let snapLoaded = false;
let snapLoading = false;
let snapLoadPromise = null;

export async function loadMidtransSnap() {
    // Kalau udah loaded, return langsung
    if (snapLoaded && window.snap) {
        return window.snap;
    }

    // Kalau sedang loading, tunggu promise yang sama
    if (snapLoading && snapLoadPromise) {
        return snapLoadPromise;
    }

    // Mulai loading
    snapLoading = true;
    
    snapLoadPromise = (async () => {
        try {
            // Fetch client key dari backend
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${baseURL}/payments/config/client-key`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch client key: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.success || !data.data?.client_key) {
                throw new Error('Invalid response format from config endpoint');
            }

            const clientKey = data.data.client_key;

            // Load script Snap.js
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
                script.setAttribute('data-client-key', clientKey);
                script.async = true;

                script.onload = () => {
                    snapLoaded = true;
                    snapLoading = false;
                    resolve(window.snap);
                };

                script.onerror = () => {
                    snapLoading = false;
                    snapLoadPromise = null;  // reset biar bisa retry
                    reject(new Error('Failed to load Midtrans Snap.js library'));
                };

                document.head.appendChild(script);
            });
        } catch (error) {
            snapLoading = false;
            snapLoadPromise = null;  // reset biar bisa retry
            throw error;
        }
    })();

    return snapLoadPromise;
}