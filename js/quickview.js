/* *********************************************************
    Module 3.3.0 : Quick View Logic
    Description: Handles opening, closing, and populating the Quick View modal with project-info data.
    ************************************************************/

const quickViewContainer = document.getElementById('quick-view-container'); // Container for the modal itself (placed in index.html)
let currentProjectConfig = null;
let projectBasePath = '';

/**
 * Initializes the Quick View modal structure and attaches close listener.
 * Must be called after the modal container is added to the DOM.
 */
function initQuickViewModal() {
    // Inject the HTML structure into the main app container for overlaying
    const quickViewHtml = views.quickView;
    const modalPlaceholder = document.createElement('div');
    modalPlaceholder.id = 'quick-view-container';
    modalPlaceholder.innerHTML = quickViewHtml;
    document.body.appendChild(modalPlaceholder);

    const closeModal = () => {
        document.getElementById('quick-view-modal').classList.remove('is-active');
        document.body.style.overflow = '';
    };

    document.getElementById('close-quick-view').addEventListener('click', closeModal);
    
    // Close on overlay click
    document.getElementById('quick-view-modal').addEventListener('click', (e) => {
        if (e.target.id === 'quick-view-modal') {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('quick-view-modal').classList.contains('is-active')) {
            closeModal();
        }
    });
}

/**
 * Populates and displays the Quick View modal.
 * @param {string} projectId 
 */
async function renderQuickView(projectId) {
    const masterEntry = masterProjectList.find(p => p.id === projectId);
    if (!masterEntry) return;

    // Fetch the detailed project configuration
    try {
        currentProjectConfig = await fetchData(masterEntry.projectConfigPath);
        projectBasePath = masterEntry.projectConfigPath.replace('project-info.json', '');

        // 1. Populate Header and Summary
        document.getElementById('qv-title').textContent = currentProjectConfig.title;
        document.getElementById('qv-tagline').textContent = currentProjectConfig.tagline;
        document.getElementById('qv-summary').textContent = currentProjectConfig.shortDescription;
        
        // 2. Populate Action Button
        const detailsBtn = document.getElementById('qv-view-details-btn');
        detailsBtn.href = `#/project/${projectId}`;
        
        // 3. Populate Features
        document.getElementById('qv-features').innerHTML = currentProjectConfig.features
            .slice(0, 3) // Show top 3 features for brevity
            .map(f => `<li>${f}</li>`).join('');

        // 4. Populate Specs (TechStack, Platforms, Duration)
        const qvSpecs = document.getElementById('qv-specs');
        const specsHTML = `
            <p><strong>Platforms:</strong> ${currentProjectConfig.platforms.join(', ')}</p>
            <p><strong>Duration:</strong> ${currentProjectConfig.projectDuration}</p>
            <p><strong>Key Tech:</strong> ${currentProjectConfig.techStack.slice(0, 3).join(', ')}...</p>
        `;
        qvSpecs.innerHTML = specsHTML;

        // 5. Populate Media Gallery (Thumbs and Main)
        renderQuickViewMedia();
        
        // 6. Show Modal
        document.getElementById('quick-view-modal').classList.add('is-active');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error("Error loading Quick View data:", error);
    }
}

/**
 * Renders the main media and the thumbnail navigation for the Quick View.
 */
function renderQuickViewMedia() {
    const mainMediaContainer = document.getElementById('qv-main-media');
    const thumbnailsContainer = document.getElementById('qv-thumbnails');
    mainMediaContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';
    
    if (!currentProjectConfig || currentProjectConfig.media.length === 0) return;

    // Helper to get final URL
    const getFinalUrl = (url) => url.startsWith('./') 
        ? projectBasePath + url.replace('./', '') 
        : url;

    // Set the first media item as the main view
    const firstMedia = currentProjectConfig.media[0];
    const firstMediaUrl = getFinalUrl(firstMedia.url);
    const firstMediaType = inferMediaType(firstMediaUrl);
    
    const mediaElement = createMediaElement(firstMediaUrl, firstMedia.alt, firstMediaType, true);
    mainMediaContainer.appendChild(mediaElement);

    // Render thumbnails
    currentProjectConfig.media.forEach((mediaItem, index) => {
        const thumbUrl = getFinalUrl(mediaItem.url);
        const thumbType = inferMediaType(thumbUrl);
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'qv-thumbnail-item';
        thumbnail.innerHTML = `<img src="${thumbType === 'video' ? currentProjectConfig.previewImage : thumbUrl}" alt="${mediaItem.alt}">`;
        
        thumbnail.addEventListener('click', () => {
            // Update the main media view when a thumbnail is clicked
            const newMediaElement = createMediaElement(thumbUrl, mediaItem.alt, thumbType, true);
            mainMediaContainer.innerHTML = '';
            mainMediaContainer.appendChild(newMediaElement);
            
            // Highlight the active thumbnail (optional styling)
            document.querySelectorAll('.qv-thumbnail-item').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumbnail);
        if (index === 0) thumbnail.classList.add('active');
    });
}

/**
 * Creates the appropriate HTML element for a media item.
 */
function createMediaElement(url, alt, type, isMain) {
    if (type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        iframe.className = isMain ? 'qv-main-media-element qv-video' : 'qv-thumbnail-element qv-video';
        return iframe;
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.className = isMain ? 'qv-main-media-element' : 'qv-thumbnail-element';
        return img;
    }
}