/* *********************************************************
    Module: Quick Look Component
    Description: Handles opening, closing, and populating the Quick Look modal. Pulls data from the master project list.
************************************************************/

import { masterProjectList, views } from './app.js';
import { inferMediaType, convertToYoutubeEmbedUrl } from './utils.js';

let currentProjectConfig = null;
let projectBasePath = '';

/**
 * Initializes the Quick Look modal structure and attaches close listener.
 */
export function initQuickLookModal() {
    const quickLookHtml = views.quickLook;
    const modalPlaceholder = document.createElement('div');
    modalPlaceholder.id = 'quick-look-container';
    modalPlaceholder.innerHTML = quickLookHtml;
    document.body.appendChild(modalPlaceholder);

    const closeModal = () => {
        const modal = document.getElementById('quick-look-modal');
        if (modal) {
            modal.classList.remove('is-active');
        }
        document.body.style.overflow = '';
        // Clear main media content to stop videos from playing
        const mainMediaContainer = document.querySelector('.ql-main-media');
        if (mainMediaContainer) mainMediaContainer.innerHTML = '';
    };

    const closeBtn = document.getElementById('close-quick-look');
    const modalOverlay = document.getElementById('quick-look-modal');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'quick-look-modal') {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('quick-look-modal');
        if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
}

/**
 * Populates and displays the Quick Look modal.
 * @param {string} projectId 
 */
export function renderQuickLook(projectId) {
    const masterEntry = masterProjectList.find(p => p.id === projectId);
    
    if (!masterEntry) return;

    currentProjectConfig = masterEntry; 
    projectBasePath = masterEntry.projectConfigPath.replace('config.json', '');

    try {
        document.getElementById('ql-title').textContent = currentProjectConfig.title;
        document.getElementById('ql-tagline').textContent = currentProjectConfig.tagline;
        document.getElementById('ql-summary').textContent = currentProjectConfig.shortDescription;
        
        const detailsBtn = document.getElementById('ql-view-details-btn');
        detailsBtn.href = `#/project/${projectId}`;
        
        const featuresList = document.getElementById('ql-features');
        if (featuresList) {
            featuresList.innerHTML = currentProjectConfig.features
                .slice(0, 3) 
                .map(f => `<li>${f}</li>`).join('');
        }

        const qlSpecs = document.getElementById('ql-specs');
        if (qlSpecs) {
            const specsHTML = `
                <p><strong>Platforms:</strong> ${currentProjectConfig.platforms.join(', ')}</p>
                <p><strong>Duration:</strong> ${currentProjectConfig.projectDuration}</p>
                <p><strong>Key Tech:</strong> ${currentProjectConfig.techStack.slice(0, 3).join(', ')}...</p>
            `;
            qlSpecs.innerHTML = specsHTML;
        }

        renderQuickLookMedia();
        
        const modal = document.getElementById('quick-look-modal');
        if (modal) {
            modal.classList.add('is-active');
        }
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error("Error populating Quick Look data:", error);
    }
}

/**
 * Renders the main media and the thumbnail navigation for the Quick Look.
 */
function renderQuickLookMedia() {
    const mainMediaContainer = document.querySelector('.ql-main-media'); // Already correct, but good to confirm
    const thumbnailsContainer = document.getElementById('ql-thumbnails');
    if (!mainMediaContainer || !thumbnailsContainer) return;

    mainMediaContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';
    
    if (!currentProjectConfig || !currentProjectConfig.media || currentProjectConfig.media.length === 0) return;

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
        
        let thumbDisplayImageUrl = thumbUrl;
        let mediaOverlayHtml = '';

        if (thumbType === 'video') {
            thumbDisplayImageUrl = getFinalUrl(currentProjectConfig.previewImage);
            mediaOverlayHtml = '<div class="media-overlay video-overlay"><i class="fas fa-play-circle"></i></div>';
        } else if (thumbType === 'gif') {
            mediaOverlayHtml = '<div class="media-overlay gif-overlay">GIF</div>';
        }

        const thumbnail = document.createElement('div');
        thumbnail.className = 'ql-thumbnail-item';
        thumbnail.innerHTML = `
            <img src="${thumbDisplayImageUrl}" alt="${mediaItem.alt}">
            ${mediaOverlayHtml} `;
        
        thumbnail.addEventListener('click', () => {
            const newMediaElement = createMediaElement(thumbUrl, mediaItem.alt, thumbType, true);
            mainMediaContainer.innerHTML = '';
            mainMediaContainer.appendChild(newMediaElement);
            
            document.querySelectorAll('.ql-thumbnail-item').forEach(t => t.classList.remove('active'));
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
        iframe.src = convertToYoutubeEmbedUrl(url);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.className = isMain ? 'ql-main-media-element ql-video' : 'ql-thumbnail-element ql-video';
        return iframe;
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.className = isMain ? 'ql-main-media-element' : 'ql-thumbnail-element';
        return img;
    }
}