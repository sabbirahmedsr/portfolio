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
let sliderIntervalId = null; // Track slider interval globally to prevent leaks

// --- UI/UX: Global Loader & Transitions ---
const loaderStyles = document.createElement('style');
loaderStyles.textContent = `
    #global-loader {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #0b0d11; z-index: 9999;
        display: flex; justify-content: center; align-items: center;
        transition: opacity 0.4s ease, visibility 0.4s;
        opacity: 0; visibility: hidden; pointer-events: none;
    }
    #global-loader.active { opacity: 1; visibility: visible; pointer-events: all; }
    .loader-spinner {
        width: 48px; height: 48px;
        border: 3px solid rgba(255,255,255,0.1);
        border-top-color: #4db8ff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .view-fade-enter { animation: viewFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes viewFade { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(loaderStyles);
const loaderEl = document.createElement('div');
loaderEl.id = 'global-loader';
loaderEl.innerHTML = '<div class="loader-spinner"></div>';
document.body.appendChild(loaderEl);
const setLoader = (active) => document.getElementById('global-loader')?.classList.toggle('active', active);
// ------------------------------------------

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
    setLoader(true); // Show loader during initialization
    try {
        const unityProjects = await processProjectCategory('a_unity');
        const blenderProjects = await processProjectCategory('b_blender');
        masterProjectList = [...unityProjects, ...blenderProjects];

        // Load Views
        const footerHTML = await fetchData(`${rootPath}view/footer-view.html`, 'text');

        views.landing = (await fetchData(`${rootPath}view/landing-view.html`, 'text')) + footerHTML;
        views.gallery = (await fetchData(`${rootPath}view/gallery-view.html`, 'text')) + footerHTML;
        views.detail = (await fetchData(`${rootPath}view/detail-view.html`, 'text')) + footerHTML;
        views.quickLook = await fetchData(`${rootPath}view/quick-look.html`, 'text'); 
        
        window.addEventListener('hashchange', router);
        await router(); // Initial route
        setupPortfolioSwitcher(); // Setup delegation for switcher buttons
    } catch (error) {
        if (appContainer) appContainer.innerHTML = '<p class="error-message">Failed to load essential portfolio data. Please check the console.</p>';
        console.error("Error loading initial data:", error);
    } finally {
        setTimeout(() => setLoader(false), 400); // Smooth exit
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
async function router() {
    const path = window.location.hash.slice(1) || '/';
    if (path !== 'contact') {
        window.scrollTo(0, 0); // Reset window scroll
        appContainer.scrollTop = 0; 
    }

    // Clear any active slider interval when navigating
    if (sliderIntervalId) {
        clearTimeout(sliderIntervalId);
        sliderIntervalId = null;
    }

    // Prepare for transition
    appContainer.classList.remove('view-fade-enter');

    if (path.startsWith('/project/')) {
        setLoader(true); // Show loader for detail view fetch
        const projectId = path.split('/')[2];
        
        // Wait for the view to render before scrolling
        await renderDetailView(projectId);
        
        setTimeout(() => {
            const nav = appContainer.querySelector('nav');
            if (nav) {
                window.scrollTo({ top: nav.offsetHeight, behavior: 'smooth' });
            }
        }, 100);
        setLoader(false);
    } else if (path === '/gallery') {
        // Render Gallery View
        const initialList = masterProjectList.filter(p => p.category === currentCategory);
        renderGalleryView(initialList);
    } else {
        // Render Landing View (Default)
        appContainer.innerHTML = views.landing;
        renderLandingPage(masterProjectList, rootPath, isInViewDir);
        initFeaturedSlider();

        if (path === 'contact') {
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    // Trigger fade-in animation
    void appContainer.offsetWidth; // Force reflow
    appContainer.classList.add('view-fade-enter');
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
                    <span class="slide-badge">Featured</span>
                    <h2 class="slide-title">${p.title}</h2>
                    <p class="slide-description">${p.tagline || p.shortDescription}</p>
                    <a href="${detailLink}" class="slide-cta">View Details</a>
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
    const normalInterval = 4000;
    const slowInterval = 6000;
    let isPaused = false;
    let currentInterval = normalInterval;
    let lastSlideTime = Date.now();

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
        currentIndex = index;
    };

    const scheduleNextSlide = () => {
        if (sliderIntervalId) clearTimeout(sliderIntervalId);
        if (isPaused) return;
        
        const elapsed = Date.now() - lastSlideTime;
        const delay = Math.max(0, currentInterval - elapsed);
        
        sliderIntervalId = setTimeout(() => {
            nextSlide();
        }, delay);
    };

    const nextSlide = () => {
        showSlide((currentIndex + 1) % totalSlides);
        lastSlideTime = Date.now();
        scheduleNextSlide();
    };

    const prevSlide = () => {
        showSlide((currentIndex - 1 + totalSlides) % totalSlides);
        lastSlideTime = Date.now();
        scheduleNextSlide();
    };

    // Controls
    document.getElementById('slider-next').addEventListener('click', nextSlide);
    document.getElementById('slider-prev').addEventListener('click', prevSlide);

    // 1. General Hover: Slow down to 6s
    sliderContainer.addEventListener('mouseenter', () => {
        currentInterval = slowInterval;
        scheduleNextSlide();
    });
    sliderContainer.addEventListener('mouseleave', () => {
        currentInterval = normalInterval;
        scheduleNextSlide();
    });

    // 2. Specific Interaction: Only pause on "View Details" button without resetting timer
    const viewDetailsBtns = track.querySelectorAll('.slide-text a');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => { 
            isPaused = true; 
            if (sliderIntervalId) clearTimeout(sliderIntervalId);
        });
        btn.addEventListener('mouseleave', () => { 
            isPaused = false; 
            scheduleNextSlide();
        });
    });
    
    scheduleNextSlide();
}

// Start the application
loadInitialData();