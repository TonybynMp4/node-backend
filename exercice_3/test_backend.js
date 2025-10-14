// On utilise le fetch de node pour Node.js >= 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

// Fonction utilitaire pour faire des requêtes avec fetch
async function makeRequest(method, path, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    return await response.text();
}

async function runTests() {
    try {
        console.log("Démarrage des tests...\n");

        // Test GET /tasks
        console.log("Test 1: GET /tasks");
        const initialTasks = await makeRequest('GET', '/tasks');
        console.log("✓ Liste des tâches récupérée avec succès");

        // Test POST /new-task
        console.log("\nTest 2: POST /new-task");
        const newTask = {
            title: "Nouvelle tâche de test",
            description: "Description de test",
            isDone: false
        };
        const createdTask = await makeRequest('POST', '/new-task', newTask);
        console.log("✓ Nouvelle tâche créée avec succès");
        const taskId = createdTask.id;

        // Test PUT /update-task/:id
        console.log("\nTest 3: PUT /update-task/:id");
        const updatedData = {
            isDone: true
        };
        await makeRequest('PUT', `/update-task/${taskId}`, updatedData);
        console.log("✓ Tâche mise à jour avec succès");

        // Vérification de la mise à jour
        const tasks = await makeRequest('GET', '/tasks');
        const updatedTask = tasks.find(task => task.id === taskId);
        if (!updatedTask || updatedTask.isDone !== true) {
            throw new Error("La mise à jour n'a pas été effectuée correctement");
        }
        console.log("✓ Mise à jour vérifiée avec succès");

        // Test DELETE /delete-task/:id
        console.log("\nTest 4: DELETE /delete-task/:id");
        await makeRequest('DELETE', `/delete-task/${taskId}`);
        console.log("✓ Tâche supprimée avec succès");

        // Vérification de la suppression
        const finalTasks = await makeRequest('GET', '/tasks');
        if (finalTasks.some(task => task.id === taskId)) {
            throw new Error("La tâche n'a pas été supprimée correctement");
        }
        console.log("✓ Suppression vérifiée avec succès");

        console.log("\n✨ Tous les tests ont réussi!");

    } catch (error) {
        console.error("\n❌ Erreur lors des tests:");
        console.error(error.message);
        process.exit(1);
    }
}

runTests();