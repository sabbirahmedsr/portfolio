/* *********************************************************
    Module: Core Application Logic
    Description: Initializes the SPA, loads all data and views, and handles routing.
************************************************************/

import { fetchData } from './utils.js';
import { renderGalleryView } from './render-gallery.js';
import { renderDetailView } from './render-detail.js';
import { renderLandingPage } from './render-landing.js';

export const appContainer = document.getElementById('app');
export let masterProjectList = []; 
export const views = {}; 

// Determine base path for asset loading. Handles GitHub Pages deployment.
// Use relative paths to ensure assets load correctly on both local server and GitHub Pages.
const isInViewDir = window.location.pathname.includes('/view/');
const rootPath = isInViewDir ? '../' : '';
export let currentCategory = 'a_unity'; // Default category

/**
 * Processes a project category by fetching its library and configuration files.
 * @param {string} category - The category name (e.g., 'unity', 'blender').
 * @returns {Promise<Array>} A promise that resolves to an array of project objects.
 */
async function processProjectCategory(category) {
    try {
        const projectPaths = await fetchData(`${rootPath}${category}/project-library.json`);
        const fetchPromises = projectPaths.map(async (entry) => {
            const finalFetchPath = `${rootPath}${category}/` + entry.projectConfigPath;
            const config = await fetchData(finalFetchPath);
            const projectBaseDir = finalFetchPath.substring(0, finalFetchPath.lastIndexOf('/'));
            return {
                ...config, 
                id: entry.id,
                projectConfigPath: finalFetchPath,
                baseDir: projectBaseDir,
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
        const unityProjects = await processProjectCategory('a_unity');
        const blenderProjects = await processProjectCategory('b_blender');
        masterProjectList = [...unityProjects, ...blenderProjects];

        // Load Views
        views.landing = await fetchData(`${rootPath}view/landing-view.html`, 'text');
        views.gallery = await fetchData(`${rootPath}view/gallery-view.html`, 'text');
        views.detail = await fetchData(`${rootPath}view/detail-view.html`, 'text');
        views.quickLook = await fetchData(`${rootPath}view/quick-look.html`, 'text'); 
        
        window.addEventListener('hashchange', router);
        router(); // Initial route
        setupPortfolioSwitcher(); // Setup delegation for switcher buttons
    } catch (error) {
        if (appContainer) appContainer.innerHTML = '<p class="error-message">Failed to load essential portfolio data. Please check the console.</p>';
        console.error("Error loading initial data:", error);
    }
}

/**
 * Sets up event listeners for the portfolio switcher buttons.
 */
function setupPortfolioSwitcher() {
    appContainer.addEventListener('click', (e) => {
        if (e.target.id === 'unity-portfolio-btn') {
            currentCategory = 'a_unity';
            router();
        } else if (e.target.id === 'blender-portfolio-btn') {
            currentCategory = 'b_blender';
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
    } else if (path === '/gallery') {
        // Render Gallery View
        const initialList = masterProjectList.filter(p => p.category === currentCategory);
        renderGalleryView(initialList);
    } else {
        // Render Landing View (Default)
        appContainer.innerHTML = views.landing;
        renderLandingPage(masterProjectList, rootPath, isInViewDir);
        initFeaturedSlider();
    }
}

/**
 * Updates the visual state of the portfolio switcher tabs.
 */
function updateTabState() {
    const unityBtn = document.getElementById('unity-portfolio-btn');
    const blenderBtn = document.getElementById('blender-portfolio-btn');
    
    if (unityBtn && blenderBtn) {
        unityBtn.classList.toggle('active', currentCategory === 'a_unity');
        blenderBtn.classList.toggle('active', currentCategory === 'b_blender');
    }
}

/**
 * Initializes the featured projects slider on the landing page.
 * Reads configuration from the DOM, renders slides, and handles auto/manual navigation.
 */
function initFeaturedSlider() {
    const sliderContainer = document.getElementById('featured-slider');
    const configScript = document.getElementById('featured-config-data');
    const track = document.getElementById('slider-track');
    
    if (!sliderContainer || !configScript || !track) return;

    // Parse the list of featured project paths
    let featuredPaths = [];
    try {
        featuredPaths = JSON.parse(configScript.textContent);
    } catch (e) {
        console.error("Invalid JSON in featured-config-data", e);
        return;
    }

    // Find corresponding projects in masterProjectList
    const featuredProjects = featuredPaths.map(path => {
        return masterProjectList.find(p => p.projectConfigPath && p.projectConfigPath.includes(path));
    }).filter(p => p); // Remove undefined if not found

    if (featuredProjects.length === 0) return;

    // Render Slides
    track.innerHTML = featuredProjects.map((p, index) => {
        const imageUrl = p.baseDir ? `${p.baseDir}/${p.previewImage}` : p.previewImage;
        const activeClass = index === 0 ? 'active' : '';
        const detailLink = p.slug ? `#/project/${p.slug}` : '#/gallery';
        
        return `
        <div class="slide-item ${activeClass}" data-index="${index}">
            <div class="slide-bg" style="background-image: url('${imageUrl}');"></div>
            <div class="slide-inner">
                <div class="slide-text">
                    <span style="background: #4db8ff; color: #000; padding: 4px 8px; font-size: 0.8rem; font-weight: 700; border-radius: 2px; text-transform: uppercase;">Featured</span>
                    <h2 style="font-size: 3rem; color: #fff; margin: 0.8rem 0; line-height: 1.1; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${p.title}</h2>
                    <p style="font-size: 1.1rem; color: #ccc; max-width: 600px;">${p.tagline || p.shortDescription}</p>
                    <a href="${detailLink}" style="display: inline-block; margin-top: 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 0.7rem 1.5rem; border-radius: 4px; text-decoration: none; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.borderColor='#fff'; this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.background='transparent'">View Details</a>
                </div>
                <div class="slide-visual">
                    <img src="${imageUrl}" alt="${p.title}">
                </div>
            </div>
        </div>`;
    }).join('');

    // Slider Logic
    let currentIndex = 0;
    const slides = track.querySelectorAll('.slide-item');
    const totalSlides = slides.length;
    let intervalId;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
        currentIndex = index;
    };

    const nextSlide = () => showSlide((currentIndex + 1) % totalSlides);
    const prevSlide = () => showSlide((currentIndex - 1 + totalSlides) % totalSlides);

    // Controls
    document.getElementById('slider-next').addEventListener('click', () => { nextSlide(); resetTimer(); });
    document.getElementById('slider-prev').addEventListener('click', () => { prevSlide(); resetTimer(); });

    // Auto-play with pause on hover
    const startTimer = () => { intervalId = setInterval(nextSlide, 5000); };
    const resetTimer = () => { clearInterval(intervalId); startTimer(); };
    
    sliderContainer.addEventListener('mouseenter', () => clearInterval(intervalId));
    sliderContainer.addEventListener('mouseleave', startTimer);
    
    startTimer();
}

// Start the application
loadInitialData();