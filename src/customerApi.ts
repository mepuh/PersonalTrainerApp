import type { Customer, CustomerForm } from "./types";

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
                throw new Error("Error when fetching customer" + response.statusText);
            }
            return response.json() as Promise<Customer>;
        })
}

// Delete a customer by its URL (provided in customer's _links)
export function deleteCustomer(url: string) {
    return fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting customer: " + response.statusText);
            }
            return response.json();
        })
}

// Save a new customer to the API
export function saveCustomer(customer: CustomerForm) {
    return fetch(import.meta.env.VITE_API_URL + '/customers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(customer)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error when saving customer: " + response.statusText);
        }
        return response.json();
    })
}