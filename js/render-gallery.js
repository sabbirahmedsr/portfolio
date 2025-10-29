/* *********************************************************
    Module: Gallery Renderer (Updated for Thumbnail Overlays)
    Description: Handles rendering the main project gallery view into the app container.
************************************************************/

import { appContainer, masterProjectList, views, currentCategory } from './app.js';
import { initQuickLookModal, renderQuickLook } from './quicklook.js';
import { inferMediaType, parseDate } from './utils.js'; // Import inferMediaType and parseDate

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
export function renderGalleryView(filteredList = masterProjectList, filterState = { year: 'all', platform: 'all' }) {
    appContainer.innerHTML = views.gallery;
    
    if (!document.getElementById('quick-look-modal')) {
        initQuickLookModal();
    }

    populateFilters(filterState);

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

        // Extract year from DevEndDate for display
        const completionDate = parseDate(project.DevEndDate);
        const displayYear = completionDate ? completionDate.getFullYear() : 'N/A';
            
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
                        <span class="card-year"><i class="fas fa-calendar-alt"></i> ${displayYear}</span>
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

    const unityBtn = document.getElementById('unity-portfolio-btn');
    const blenderBtn = document.getElementById('blender-portfolio-btn');

    if (currentCategory === '_Unity_Project') {
        unityBtn.classList.add('active');
        blenderBtn.classList.remove('active');
    } else if (currentCategory === '_Blender_Project') {
        blenderBtn.classList.add('active');
        unityBtn.classList.remove('active');
    }

    const platformFilterGroup = document.getElementById('platform-filter-group');
    if (currentCategory === '_Blender_Project') {
        platformFilterGroup.style.display = 'none';
    } else {
        platformFilterGroup.style.display = 'flex';
    }
}

/**
 * Populates filter dropdowns and attaches event listeners.
 */
function populateFilters(filterState = { year: 'all', platform: 'all' }) {
    const yearFilter = document.getElementById('filter-year');
    const platformFilter = document.getElementById('filter-platform');
    const searchInput = document.getElementById('search-input');

    const years = [...new Set(masterProjectList.map(p => {
        const date = parseDate(p.DevEndDate);
        return date ? date.getFullYear() : null;
    }).filter(year => year !== null))]
    .sort((a, b) => b - a);
    const platforms = [...new Set(masterProjectList.flatMap(p => p.platforms))].sort();

    years.forEach(year => {
        const option = new Option(year, year);
        yearFilter.add(option);
    });

    platforms.forEach(platform => {
        const option = new Option(platform, platform);
        platformFilter.add(option);
    });

    yearFilter.value = filterState.year;
    platformFilter.value = filterState.platform;

    const applyFilters = () => {
        const selectedYear = yearFilter.value;
        const selectedPlatform = platformFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filterState = { year: selectedYear, platform: selectedPlatform };

        let filteredList = masterProjectList;

        if (selectedYear !== 'all') {
            filteredList = filteredList.filter(p => {
                const date = parseDate(p.DevEndDate);
                return date && date.getFullYear() == selectedYear;
            });
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

        renderGalleryView(filteredList, filterState);
    };

    [yearFilter, platformFilter].forEach(el => el.addEventListener('change', applyFilters));
    searchInput.addEventListener('keyup', applyFilters);
}