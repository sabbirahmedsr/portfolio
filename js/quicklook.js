/* *********************************************************
    Module: Quick Look Component
    Description: Handles opening, closing, and populating the Quick Look modal. Pulls data from the master project list.
************************************************************/

import { masterProjectList, views } from './app.js';
import { inferMediaType, convertToYoutubeEmbedUrl, parseDate, formatDateShort, getYoutubeThumbnailUrl } from './utils.js';

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
        const titleElement = document.getElementById('ql-title');
        if (titleElement) titleElement.textContent = currentProjectConfig.title;
        
        const taglineElement = document.getElementById('ql-tagline');
        if (taglineElement) {
            if (currentProjectConfig.tagline) {
                taglineElement.textContent = currentProjectConfig.tagline;
                taglineElement.style.display = 'block';
            } else {
                taglineElement.style.display = 'none';
            }
        }

        const summaryElement = document.getElementById('ql-summary');
        if (summaryElement) summaryElement.textContent = currentProjectConfig.shortDescription;
        
        const detailsBtn = document.getElementById('ql-view-details-btn');
        if (detailsBtn) detailsBtn.href = `#/project/${projectId}`;

        const qlSpecs = document.getElementById('ql-specs');
        if (qlSpecs) {
            let specsHTML = '';
            if (currentProjectConfig.unityVersion && currentProjectConfig.unityVersion !== 'N/A') {
                specsHTML += `<div class="spec-item">
                                <span class="spec-label">Unity Version</span>
                                <span class="spec-value">${currentProjectConfig.unityVersion}</span>
                              </div>`;
            }
            const startDate = parseDate(currentProjectConfig.DevStartDate);
            const endDate = parseDate(currentProjectConfig.DevEndDate);
            if (startDate && endDate) {
                specsHTML += `<div class="spec-item">
                                <span class="spec-label">Timeline</span>
                                <span class="spec-value">${formatDateShort(startDate)} - ${formatDateShort(endDate)}</span>
                              </div>`;
            }
            if (currentProjectConfig.platforms && currentProjectConfig.platforms.length > 0) {
                specsHTML += `<div class="spec-item">
                                <span class="spec-label">Platform</span>
                                <span class="spec-value">${currentProjectConfig.platforms.join(', ')}</span>
                              </div>`;
            }
            qlSpecs.innerHTML = specsHTML;
        }

        // External Links
        const linksWrapper = document.getElementById('ql-links-wrapper');
        const linksContainer = document.getElementById('ql-external-links');
        if (linksWrapper && linksContainer && currentProjectConfig.externalLinks) {
            const validLinks = currentProjectConfig.externalLinks
                .filter(link => link.url)
                .slice(0, 4);

            if (validLinks.length > 0) {
                let linksHTML = '';
                for (let i = 0; i < 4; i++) {
                    if (validLinks[i]) {
                        const link = validLinks[i];
                        const iconHtml = link.iconClass ? `<i class="${link.iconClass}"></i>` : '';
                        linksHTML += `<a href="${link.url}" target="_blank" class="ql-external-link-btn">${iconHtml} ${link.label}</a>`;
                    } else {
                        // Add a placeholder for an empty cell to maintain the grid structure
                        linksHTML += `<div class="ql-external-link-placeholder"></div>`;
                    }
                }
                linksContainer.innerHTML = linksHTML;
                linksWrapper.style.display = 'block';
            }
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
    // Create a wrapper inside the container to handle centering
    const thumbnailsWrapper = document.createElement('div');
    thumbnailsWrapper.className = 'ql-thumbnails-wrapper';
    thumbnailsContainer.appendChild(thumbnailsWrapper);

    currentProjectConfig.media.forEach((mediaItem, index) => {
        const thumbUrl = getFinalUrl(mediaItem.url);
        const thumbType = inferMediaType(thumbUrl);
        
        let thumbDisplayImageUrl = thumbUrl;
        let mediaOverlayHtml = '';

        if (thumbType === 'gif') {
            // For GIFs, use the GIF itself as the thumbnail.
            // This will make the thumbnail animated.
            thumbDisplayImageUrl = thumbUrl;
        } else if (mediaItem.thumbnailUrl) {
            // For other types (like video), use an explicit thumbnail if provided.
            thumbDisplayImageUrl = getFinalUrl(mediaItem.thumbnailUrl);
        } else if (thumbType === 'video') {
            // Otherwise, for videos, auto-generate from YouTube or fallback.
            const youtubeThumbUrl = getYoutubeThumbnailUrl(thumbUrl);
            thumbDisplayImageUrl = youtubeThumbUrl || getFinalUrl(currentProjectConfig.previewImage);
        }

        // Determine the overlay based on the original media type
        if (thumbType === 'video') {
            mediaOverlayHtml = `<div class="media-overlay video-overlay"></div>`;
        } else if (thumbType === 'gif') {
            mediaOverlayHtml = `<div class="media-overlay gif-overlay">GIF</div>`;
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
        
        thumbnailsWrapper.appendChild(thumbnail);
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