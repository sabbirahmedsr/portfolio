/* *********************************************************
    Module: Gallery Renderer (Updated for Thumbnail Overlays)
    Description: Handles rendering the main project gallery view into the app container.
************************************************************/

import { appContainer, masterProjectList, views } from './app.js';
import { initQuickLookModal, renderQuickLook } from './quicklook.js';
import { inferMediaType } from './utils.js'; // Import inferMediaType

/**
 * Gets a specific Font Awesome icon class based on the platform name.
 * @param {string} platform The name of the platform.
 * @returns {string} The corresponding icon class.
 */
function getPlatformIcon(platform) {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('windows')) {
        return 'fab fa-windows';
    }
    if (platformLower.includes('quest') || platformLower.includes('vr') || platformLower.includes('oculus')) {
        return 'fas fa-vr-cardboard';
    }
    if (platformLower.includes('android')) {
        return 'fab fa-android';
    }
    if (platformLower.includes('web')) {
        return 'fas fa-globe';
    }
    // Default icon
    return 'fas fa-desktop';
}

/**
 * Renders the Gallery View.
 */
export function renderGalleryView(filteredList = masterProjectList) {
    appContainer.innerHTML = views.gallery;
    
    if (!document.getElementById('quick-look-modal')) {
        initQuickLookModal();
    }

    populateFilters();

    const gridContainer = document.getElementById('project-grid');
    if (!gridContainer) return;

    const cardHTML = filteredList.map(project => {
        const projectBasePath = project.projectConfigPath.replace('config.json', '');
        const previewImageUrl = project.previewImage.startsWith('./')
            ? projectBasePath + project.previewImage.replace('./', '')
            : project.previewImage;
        
        // Determine media type for the preview image
        const previewMediaType = inferMediaType(previewImageUrl);
        let mediaOverlayHtml = '';
        if (previewMediaType === 'video') {
            mediaOverlayHtml = '<div class="media-overlay video-overlay"><i class="fas fa-play-circle"></i></div>';
        } else if (previewMediaType === 'gif') {
            mediaOverlayHtml = '<div class="media-overlay gif-overlay">GIF</div>';
        }

        // Get the primary platform and its specific icon
        const firstPlatform = project.platforms && project.platforms.length > 0 ? project.platforms[0] : 'N/A';
        const platformIconClass = getPlatformIcon(firstPlatform);
            
        return `<div class="project-card-wrapper" data-id="${project.id}">
            <a href="#/project/${project.id}" class="project-card">
                <div class="card-image-wrapper">
                    <img src="${previewImageUrl}" alt="${project.title} Preview Image" class="card-image">
                    ${mediaOverlayHtml}
                    <button class="quick-look-btn" data-id="${project.id}">
                        <i class="fas fa-eye"></i> Quick Look
                    </button>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${project.title}</h3>
                    <div class="card-meta">
                        <span class="card-year"><i class="fas fa-calendar-alt"></i> ${project.year}</span>
                        <span class="card-platform"><i class="${platformIconClass}"></i> ${firstPlatform}</span>
                    </div>
                </div>
            </a>
        </div>`;
    }).join('');

    gridContainer.innerHTML = cardHTML;
    
    document.querySelectorAll('.quick-look-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the parent link from navigating
            e.stopPropagation(); // Stop the click from bubbling up to the parent link
            renderQuickLook(e.currentTarget.dataset.id);
        });
    });
}

/**
 * Populates filter dropdowns and attaches event listeners.
 */
function populateFilters() {
    const yearFilter = document.getElementById('filter-year');
    const platformFilter = document.getElementById('filter-platform');
    const searchInput = document.getElementById('search-input');

    const years = [...new Set(masterProjectList.map(p => p.year))].sort((a, b) => b - a);
    const platforms = [...new Set(masterProjectList.flatMap(p => p.platforms))].sort();

    years.forEach(year => {
        const option = new Option(year, year);
        yearFilter.add(option);
    });

    platforms.forEach(platform => {
        const option = new Option(platform, platform);
        platformFilter.add(option);
    });

    const applyFilters = () => {
        const selectedYear = yearFilter.value;
        const selectedPlatform = platformFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredList = masterProjectList;

        if (selectedYear !== 'all') {
            filteredList = filteredList.filter(p => p.year == selectedYear);
        }

        if (selectedPlatform !== 'all') {
            filteredList = filteredList.filter(p => p.platforms.includes(selectedPlatform));
        }

        if (searchTerm) {
            filteredList = filteredList.filter(p => 
                p.title.toLowerCase().includes(searchTerm) || 
                p.techStack.some(t => t.toLowerCase().includes(searchTerm))
            );
        }

        renderGalleryView(filteredList);
    };

    [yearFilter, platformFilter].forEach(el => el.addEventListener('change', applyFilters));
    searchInput.addEventListener('keyup', applyFilters);
}