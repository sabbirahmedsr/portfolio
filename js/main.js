/* *********************************************************
    Module 3.1.0 : Core SPA Logic (Router & Renderer) - Final Update
    Description: Modifies renderGalleryView to include and handle Quick View button clicks, and now correctly loads all necessary views.
    ************************************************************/

const appContainer = document.getElementById('app');
let masterProjectList = []; 
const views = {}; 

/**
 * Utility to fetch data and check for errors.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string|object>} - The fetched data (JSON or text).
 */
async function fetchData(url, type = 'json') {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return type === 'json' ? response.json() : response.text();
}

/**
 * Initializes the application: loads base data and views, then starts routing.
 */
async function loadInitialData() {
    try {
        // Load master list using the final name and path
        masterProjectList = await fetchData('project/project-library.json');
        
        views.gallery = await fetchData('view/gallery-view.html', 'text');
        views.detail = await fetchData('view/detail-view.html', 'text');
        views.quickView = await fetchData('view/quick-view.html', 'text'); // ✅ FIXED: Loading Quick View HTML
        
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

// -------------------------------------------------------------
// View Rendering Functions
// -------------------------------------------------------------

/**
 * Renders the Gallery View.
 */
function renderGalleryView(filteredList = masterProjectList) {
    appContainer.innerHTML = views.gallery;
    
    // Ensure the Quick View modal is in the DOM and initialized
    // NOTE: initQuickViewModal() must be globally available from js/quickview.js
    if (!document.getElementById('quick-view-modal')) {
        initQuickViewModal();
    }

    const gridContainer = document.getElementById('project-grid');
    if (!gridContainer) return;

    const cardHTML = filteredList.map(project => `
        <div class="project-card-wrapper" data-id="${project.id}">
            <a href="#/project/${project.id}" class="project-card">
                <div class="card-image-wrapper">
                    <img src="${project.previewImage}" alt="${project.title} Preview Image" class="card-image">
                </div>
                <div class="card-info">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-tagline">${project.tagline}</p>
                    <div class="card-meta">
                        <span class="card-year"><i class="fas fa-calendar-alt"></i> ${project.year}</span>
                        <span class="card-platform"><i class="fas fa-desktop"></i> ${project.platforms.join(', ')}</span>
                    </div>
                </div>
            </a>
            <button class="quick-look-btn" data-id="${project.id}">
                <i class="fas fa-search-plus"></i> QUICK LOOK
            </button>
        </div>
    `).join('');

    gridContainer.innerHTML = cardHTML;
    
    // Attach Quick Look button listeners
    // NOTE: renderQuickView() must be globally available from js/quickview.js
    document.querySelectorAll('.quick-look-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.currentTarget.getAttribute('data-id');
            renderQuickView(projectId);
        });
    });
}

/**
 * Utility to determine media type from URL.
 * @param {string} url 
 * @returns {string} - 'video', 'gif', or 'image'
 */
function inferMediaType(url) {
    if (url.includes('youtube.com') || url.includes('vimeo.com') || url.toLowerCase().endsWith('.mp4')) {
        return 'video';
    }
    if (url.toLowerCase().endsWith('.gif')) {
        return 'gif';
    }
    return 'image';
}

/**
 * Renders the Detail View for a specific project by fetching project-info.json.
 */
async function renderDetailView(projectId) {
    const masterEntry = masterProjectList.find(p => p.id === projectId);

    if (!masterEntry) {
        appContainer.innerHTML = '<p class="error-message">Project not found.</p>';
        return;
    }

    appContainer.innerHTML = views.detail;
    
    try {
        const projectConfig = await fetchData(masterEntry.projectConfigPath);
        // Base path for local assets: e.g., "project/HL Dolphin App MRTK3/"
        const projectBasePath = masterEntry.projectConfigPath.replace('project-info.json', '');
        
        const readmePath = projectBasePath + 'README.md';
        const longDescriptionMD = await fetchData(readmePath, 'text');
        
        // --- 3. Populate Static Text/Media ---
        document.getElementById('project-title').textContent = projectConfig.title;
        document.getElementById('project-tagline').textContent = projectConfig.tagline;
        document.getElementById('project-summary').textContent = projectConfig.shortDescription;

        document.getElementById('hero-media').innerHTML = `
            <img src="${projectConfig.previewImage}" alt="${projectConfig.title} Key Art">
        `;

        // Assuming a simple Markdown display for the long description
        document.getElementById('project-description-md').innerHTML = `<pre>${longDescriptionMD}</pre>`; 
        
        // --- 4. Populate Dynamic Lists & Specs ---
        
        // Timeline
        const timelineElement = document.getElementById('project-timeline');
        let timelineHTML = '';
        
        if (projectConfig.proposalDiscussionTime) {
            timelineHTML += `<p><strong>Proposal Discussion:</strong> ${projectConfig.proposalDiscussionTime}</p>`;
        }
        if (projectConfig.projectStartTime) {
            timelineHTML += `<p><strong>Project Start Time:</strong> ${projectConfig.projectStartTime}</p>`;
        }
        if (projectConfig.projectCompletionTime) {
            timelineHTML += `<p><strong>Project Completion Time:</strong> ${projectConfig.projectCompletionTime}</p>`;
        }
        if (projectConfig.projectDuration) {
            timelineHTML += `<p><strong>Total Duration:</strong> ${projectConfig.projectDuration}</p>`;
        }
        timelineElement.innerHTML = timelineHTML;

        // Features List
        const featureList = document.getElementById('feature-list');
        featureList.innerHTML = projectConfig.features.map(f => `<li>${f}</li>`).join('');

        // Tech Stack
        const techStackList = document.getElementById('tech-stack-list');
        techStackList.innerHTML = projectConfig.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

        // Media Gallery (Images, GIFs, Videos)
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = projectConfig.media.map(mediaItem => {
            // Logic to handle local paths vs. full URLs
            const finalUrl = mediaItem.url.startsWith('./') 
                ? projectBasePath + mediaItem.url.replace('./', '') 
                : mediaItem.url;
            
            const mediaType = inferMediaType(finalUrl);
            const isVideo = mediaType === 'video';
            
            return `
                <div class="media-preview-wrapper gallery-media-item" 
                     data-url="${finalUrl}" 
                     data-alt="${mediaItem.alt}" 
                     data-type="${mediaType}">
                    ${isVideo 
                        ? `<div class="video-overlay"><i class="fas fa-play-circle"></i></div>`
                        : ''}
                    <img class="media-preview-image" 
                         src="${isVideo ? projectConfig.previewImage : finalUrl}" 
                         alt="${mediaItem.alt}">
                </div>
            `;
        }).join('');
        
        // --- 5. Populate Quick Links ---
        const linksContainer = document.getElementById('quick-links');
        
        const linkHTML = projectConfig.externalLinks
            .filter(link => link.url) // Only render links that have a URL
            .map(link => {
                const iconHtml = link.iconClass ? `<i class="${link.iconClass}"></i>` : ''; 
                return `<a href="${link.url}" target="_blank" class="quick-link-btn">${iconHtml} ${link.label}</a>`;
            }).join('');
        
        linksContainer.innerHTML = linkHTML;

        // Re-initialize lightbox listeners
        // NOTE: initLightbox() must be globally available from js/gallery.js
        initLightbox();

    } catch (error) {
        appContainer.innerHTML = `<p class="error-message">Error loading project data for ${projectId}.</p>`;
        console.error(`Error loading project ${projectId}:`, error);
    }
}

loadInitialData();