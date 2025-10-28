/* *********************************************************
    Module: Detail View Renderer
    Description: Handles rendering the detailed project view.
************************************************************/

import { masterProjectList, views } from './app.js';
import { fetchData, inferMediaType, convertToYoutubeEmbedUrl, parseDate, formatDateLong } from './utils.js';
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
        const longDescriptionMD = await fetchData(readmePath, 'text');
        
        document.getElementById('project-title').textContent = projectConfig.title;

        const taglineElement = document.getElementById('project-tagline');
        if (projectConfig.tagline) {
            taglineElement.textContent = projectConfig.tagline;
        } else {
            taglineElement.style.display = 'none';
        }
        document.getElementById('project-summary').textContent = projectConfig.shortDescription;

        const heroImageUrl = projectConfig.previewImage.startsWith('./')
            ? projectBasePath + projectConfig.previewImage.replace('./', '')
            : projectConfig.previewImage;

        document.getElementById('hero-media').innerHTML = `
            <img src="${heroImageUrl}" alt="${projectConfig.title} Key Art">
        `;

        document.getElementById('project-description-md').innerHTML = `<pre>${longDescriptionMD}</pre>`; 
        
        // Timeline
        const timelineElement = document.getElementById('project-timeline');
        let timelineHTML = '';
        
        const proposalDate = parseDate(projectConfig.InitiationDate);
        const startDate = parseDate(projectConfig.DevStartDate);
        const completionDate = parseDate(projectConfig.DevEndDate);

        if (proposalDate) {
            timelineHTML += `<p><strong>Proposal Discussion:</strong> ${formatDateLong(proposalDate)}</p>`;
        }
        if (startDate) {
            timelineHTML += `<p><strong>Project Start Time:</strong> ${formatDateLong(startDate)}</p>`;
        }
        if (completionDate) {
            timelineHTML += `<p><strong>Project Completion Time:</strong> ${formatDateLong(completionDate)}</p>`;
        }
        timelineElement.innerHTML = timelineHTML;

        // Tech Stack
        const techStackList = document.getElementById('tech-stack-list');
        techStackList.innerHTML = projectConfig.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

        // Media Gallery
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = projectConfig.media.map(mediaItem => {
            const finalUrl = mediaItem.url.startsWith('./') 
                ? projectBasePath + mediaItem.url.replace('./', '') 
                : mediaItem.url;
            
            const mediaType = inferMediaType(finalUrl);
            const isVideo = mediaType === 'video';
            const embedUrl = isVideo ? convertToYoutubeEmbedUrl(finalUrl) : finalUrl;
            
            return `
                <div class="media-preview-wrapper gallery-media-item"
                     data-url="${embedUrl}"
                     data-alt="${mediaItem.alt}"
                     data-type="${mediaType}">
                    ${isVideo 
                        ? `<div class="video-overlay"><i class="fas fa-play-circle"></i></div>`
                        : ''}
                    <img class="media-preview-image" 
                         src="${isVideo ? heroImageUrl : finalUrl}" 
                         alt="${mediaItem.alt}">
                </div>
            `;
        }).join('');
        
        // Quick Links
        const linksContainer = document.getElementById('quick-links');
        
        const linkHTML = projectConfig.externalLinks
            .filter(link => link.url)
            .map(link => {
                const iconHtml = link.iconClass ? `<i class="${link.iconClass}"></i>` : ''; 
                return `<a href="${link.url}" target="_blank" class="quick-link-btn">${iconHtml} ${link.label}</a>`;
            }).join('');
        
        linksContainer.innerHTML = linkHTML;

        initLightbox();

    } catch (error) {
        appContainer.innerHTML = `<p class="error-message">Error loading project data for ${projectId}.</p>`;
        console.error(`Error loading project ${projectId}:`, error);
    }
}