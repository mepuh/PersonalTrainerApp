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