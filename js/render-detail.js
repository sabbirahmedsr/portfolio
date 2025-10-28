/* *********************************************************
    Module: Detail View Renderer
    Description: Handles rendering the detailed project view, inspired by the Quick Look layout.
************************************************************/

import { appContainer, masterProjectList, views } from './app.js';
import { fetchData, inferMediaType, convertToYoutubeEmbedUrl, parseDate, formatDateLong, getYoutubeThumbnailUrl } from './utils.js';
import { initLightbox } from './lightbox.js';

/**
 * Renders the Detail View for a specific project.
 */
export async function renderDetailView(projectId) {
    const projectConfig = masterProjectList.find(p => p.id === projectId);
    
    if (!projectConfig) {
        appContainer.innerHTML = '<p class="error-message">Project not found.</p>';
        return;
    }

    appContainer.innerHTML = views.detail;

    try {
        const projectBasePath = projectConfig.projectConfigPath.replace('config.json', '');
        
        const readmePath = projectBasePath + 'README.md';

        // --- Populate Info Sidebar ---
        document.getElementById('project-title').textContent = projectConfig.title;
        const taglineElement = document.getElementById('project-tagline');
        if (projectConfig.tagline) {
            taglineElement.textContent = projectConfig.tagline;
        } else {
            taglineElement.remove();
        }
        document.getElementById('project-summary').textContent = projectConfig.shortDescription;

        // Populate Specs in the sidebar
        const specsContainer = document.getElementById('project-specs');
        let specsHTML = '';
        // Reorder and include all date fields separately
        const specsData = [
            { label: 'Unity Version', value: projectConfig.unityVersion },
            { label: 'Initiation Date', value: formatDateLong(parseDate(projectConfig.InitiationDate)) },
            { label: 'Start Date', value: formatDateLong(parseDate(projectConfig.DevStartDate)) },
            { label: 'End Date', value: formatDateLong(parseDate(projectConfig.DevEndDate)) },
            { label: 'Platform(s)', value: projectConfig.platforms.join(', ') },
            { label: 'Client', value: projectConfig.client }
        ];
        specsData.forEach(item => {
            if (item.value && item.value !== 'N/A') {
                specsHTML += `<div class="spec-item"><span class="spec-label">${item.label}</span><span class="spec-value">${item.value}</span></div>`;
            }
        });
        specsContainer.innerHTML = specsHTML;

        const linksContainer = document.getElementById('quick-links');
        linksContainer.innerHTML = projectConfig.externalLinks
            .filter(link => link.url)
            .map(link => {
                const iconHtml = link.iconClass ? `<i class="${link.iconClass}"></i>` : ''; 
                return `<a href="${link.url}" target="_blank" class="sidebar-link-btn">${iconHtml} ${link.label}</a>`;
            }).join('');

        // --- Render Main Content Column ---
        renderDetailMedia(projectConfig, projectBasePath);

        // Fetch and render README.md as HTML using marked.js
        const longDescriptionMD = await fetchData(readmePath, 'text');
        document.getElementById('project-description-md').innerHTML = marked.parse(longDescriptionMD);

    } catch (error) {
        appContainer.innerHTML = `<p class="error-message">Error loading project data for ${projectId}.</p>`;
        console.error(`Error loading project ${projectId}:`, error);
    }
}

/**
 * Renders the main media and thumbnails for the detail view.
 */
function renderDetailMedia(projectConfig, projectBasePath) {
    const mainMediaContainer = document.getElementById('detail-main-media');
    const thumbnailsContainer = document.getElementById('detail-thumbnails');
    if (!mainMediaContainer || !thumbnailsContainer) return;

    mainMediaContainer.innerHTML = '';
    thumbnailsContainer.innerHTML = '';

    if (!projectConfig.media || projectConfig.media.length === 0) return;

    const getFinalUrl = (url) => url.startsWith('./') ? projectBasePath + url.replace('./', '') : url;

    const createMediaElement = (url, alt, type) => {
        if (type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = convertToYoutubeEmbedUrl(url);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            return iframe;
        } else {
            const img = document.createElement('img');
            img.src = url;
            img.alt = alt;
            return img;
        }
    };

    // Set the first media item as the main view
    const firstMedia = projectConfig.media[0];
    const firstMediaUrl = getFinalUrl(firstMedia.url);
    const firstMediaType = inferMediaType(firstMediaUrl);
    mainMediaContainer.appendChild(createMediaElement(firstMediaUrl, firstMedia.alt, firstMediaType));

    // Render thumbnails
    const thumbnailsWrapper = document.createElement('div');
    thumbnailsWrapper.className = 'detail-thumbnails-wrapper';
    thumbnailsContainer.appendChild(thumbnailsWrapper);

    projectConfig.media.forEach((mediaItem, index) => {
        const thumbUrl = getFinalUrl(mediaItem.url);
        const thumbType = inferMediaType(thumbUrl);
        
        let thumbDisplayImageUrl = thumbUrl;
        let mediaOverlayHtml = '';

        if (thumbType === 'gif') {
            thumbDisplayImageUrl = thumbUrl;
        } else if (thumbType === 'video') {
            // For videos, first try to get an auto-generated YouTube thumbnail.
            // If that fails (e.g., not a YouTube video), fall back to the project's main preview image.
            const youtubeThumbUrl = getYoutubeThumbnailUrl(thumbUrl);
            thumbDisplayImageUrl = youtubeThumbUrl || getFinalUrl(projectConfig.previewImage);
        }

        if (thumbType === 'video') {
            mediaOverlayHtml = `<div class="media-overlay video-overlay"></div>`;
        } else if (thumbType === 'gif') {
            mediaOverlayHtml = `<div class="media-overlay gif-overlay">GIF</div>`;
        }

        const thumbnail = document.createElement('div');
        thumbnail.className = 'detail-thumbnail-item';
        thumbnail.innerHTML = `<img src="${thumbDisplayImageUrl}" alt="${mediaItem.alt}">${mediaOverlayHtml}`;
        
        thumbnail.addEventListener('click', () => {
            mainMediaContainer.innerHTML = '';
            mainMediaContainer.appendChild(createMediaElement(thumbUrl, mediaItem.alt, thumbType));
            
            document.querySelectorAll('.detail-thumbnail-item').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailsWrapper.appendChild(thumbnail);
        if (index === 0) thumbnail.classList.add('active');
    });
}