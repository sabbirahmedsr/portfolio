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

/**
 * Initializes the application: loads all data and views, then starts routing.
 */
async function loadInitialData() {
    try {
        const projectPaths = await fetchData('project/project-library.json');

        const fetchPromises = projectPaths.map(async (entry) => {
            
            const finalFetchPath = 'project/' + entry.projectConfigPath; 
            
            const config = await fetchData(finalFetchPath);
            
            // Combine the necessary ID and path with the full config data
            return {
                ...config, 
                id: entry.id,
                projectConfigPath: finalFetchPath 
            };
        });

        masterProjectList = await Promise.all(fetchPromises);

        views.gallery = await fetchData('view/gallery-view.html', 'text');
        views.detail = await fetchData('view/detail-view.html', 'text');
        views.quickLook = await fetchData('view/quick-look.html', 'text'); 
        
        window.addEventListener('hashchange', router);
        router();
    } catch (error) {
        appContainer.innerHTML = '<p class="error-message">Failed to load essential portfolio data. Please check the console.</p>';
        console.error("Error loading initial data:", error);
    }
}

/**
 * Main router function that decides which view to render based on the URL hash.
 */
function router() {
    const hash = window.location.hash.slice(1) || 'projects'; 
    appContainer.scrollTop = 0; 

    if (hash === 'projects' || hash === '/') {
        renderGalleryView();
    } else if (hash.startsWith('project/')) {
        const projectId = hash.split('/')[1];
        renderDetailView(projectId);
    } else {
        appContainer.innerHTML = `<section id="${hash}-view" class="static-view"><h1 class="page-title">${hash.charAt(0).toUpperCase() + hash.slice(1)}</h1><p>Content for the ${hash} section will go here.</p></section>`;
    }
}

// Start the application
loadInitialData();