import type { Customer } from "./types";

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

// Fetch single customer by URL (the URL is provided in training's _links)
export function getCustomer(url: string) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching customer");
            }
            return response.json() as Promise<Customer>;
        })
}