/* *********************************************************
    Module: Core Application Logic
    Description: Initializes the SPA, loads all data and views, and handles routing.
************************************************************/

import { fetchData } from './utils.js';
import { renderGalleryView } from './render-gallery.js';
import { renderDetailView } from './render-detail.js';

export const appContainer = document.getElementById('app');
export let masterProjectList = []; 
export const views = {}; 

// Determine base path for asset loading. Handles GitHub Pages deployment.
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/portfolio/' : '/';
export let currentCategory = '_Unity_Project'; // Default category

/**
 * Processes a project category by fetching its library and configuration files.
 * @param {string} category - The category name (e.g., 'unity', 'blender').
 * @returns {Promise<Array>} A promise that resolves to an array of project objects.
 */
async function processProjectCategory(category) {
    try {
        const projectPaths = await fetchData(`${basePath}${category}/project-library.json`);
        const fetchPromises = projectPaths.map(async (entry) => {
            const finalFetchPath = `${basePath}${category}/` + entry.projectConfigPath;
            const config = await fetchData(finalFetchPath);
            return {
                ...config, 
                id: entry.id,
                projectConfigPath: finalFetchPath,
                category: category // Add category to each project
            };
        });
        return Promise.all(fetchPromises);
    } catch (error) {
        console.error(`Error loading projects for category: ${category}`, error);
        return []; // Return empty array if a category fails to load
    }
}

/**
 * Initializes the application: loads all data and views, then starts routing.
 */
async function loadInitialData() {
    try {
        const unityProjects = await processProjectCategory('_Unity_Project');
        const blenderProjects = await processProjectCategory('_Blender_Project');
        masterProjectList = [...unityProjects, ...blenderProjects];

        views.gallery = await fetchData(`${basePath}view/gallery-view.html`, 'text');
        views.detail = await fetchData(`${basePath}view/detail-view.html`, 'text');
        views.quickLook = await fetchData(`${basePath}view/quick-look.html`, 'text'); 
        
        window.addEventListener('hashchange', router);
        router(); // Initial route
        setupPortfolioSwitcher();
    } catch (error) {
        appContainer.innerHTML = '<p class="error-message">Failed to load essential portfolio data. Please check the console.</p>';
        console.error("Error loading initial data:", error);
    }
}

/**
 * Sets up event listeners for the portfolio switcher buttons.
 */
function setupPortfolioSwitcher() {
    appContainer.addEventListener('click', (e) => {
        if (e.target.id === 'unity-portfolio-btn') {
            currentCategory = '_Unity_Project';
            router();
        } else if (e.target.id === 'blender-portfolio-btn') {
            currentCategory = '_Blender_Project';
            router();
        }
    });
}

/**
 * Main router function that decides which view to render based on the URL hash.
 */
function router() {
    const path = window.location.hash.slice(1) || '/';
    appContainer.scrollTop = 0; 

    if (path.startsWith('/project/')) {
        const projectId = path.split('/')[2];
        renderDetailView(projectId);
    } else {
        const projectsToShow = masterProjectList.filter(p => p.category === currentCategory);
        renderGalleryView(projectsToShow);
    }
}

// Start the application
loadInitialData();