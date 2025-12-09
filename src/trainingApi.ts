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