import type { CustomerForm } from "./types";

// Fetch customers from the API
export function getCustomers() {
    return fetch(import.meta.env.VITE_API_URL + '/customers')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching customers" + response.statusText);
            }
            return response.json();
        })
}