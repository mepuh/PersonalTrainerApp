import type { TrainingForm } from "./types";

// Fetch trainings from the API
export function getTrainings() {
    return fetch(import.meta.env.VITE_API_URL + '/trainings')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when fetching trainings: " + response.statusText);
            }
            return response.json();
        })
}

// Delete a training by its URL (provided in training's _links)
export function deleteTraining(url: string) {
    return fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting training: " + response.statusText);
            }
        })
}

// Add training session to customer
export function addTraining(training: TrainingForm) {
    return fetch(import.meta.env.VITE_API_URL + '/trainings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(training)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error when adding training: " + response.statusText);
        }
        return response.json();
    })
}