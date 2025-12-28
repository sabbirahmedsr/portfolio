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

// Pagination State
let currentPage = 1;
const itemsPerPage = 9; // 3 columns * 3 rows
let currentFullList = []; // Holds the currently filtered and sorted list
let currentFilterState = {}; // Holds current filter state

/**
 * Renders the Gallery View.
 */
export function renderGalleryView(filteredList = masterProjectList, filterState = { year: 'all', platform: 'all', sort: 'date-desc' }, resetPage = false) {
    // Only inject the gallery structure if it doesn't exist
    if (!document.getElementById('gallery-view')) {
        appContainer.innerHTML = views.gallery;
        // Setup pagination listeners when view is first injected
        setupPaginationListeners();
        
        if (!document.getElementById('quick-look-modal')) {
            initQuickLookModal();
        }
    }

    // Always update filters (safe to call repeatedly with the fix below)
    populateFilters(filterState);

    // Update module-level state
    currentFilterState = filterState;
    if (resetPage) currentPage = 1;

    const gridContainer = document.getElementById('project-grid');
    if (!gridContainer) return;

    // Sort the list before rendering
    const projectsToRender = [...filteredList];
    projectsToRender.sort((a, b) => {
        const sort = filterState.sort;
        if (sort === 'date-desc') return (parseDate(b.DevEndDate) || 0) - (parseDate(a.DevEndDate) || 0);
        if (sort === 'date-asc') return (parseDate(a.DevEndDate) || 0) - (parseDate(b.DevEndDate) || 0);
        if (sort === 'name-asc') return a.title.localeCompare(b.title);
        if (sort === 'name-desc') return b.title.localeCompare(a.title);
        return 0;
    });
    currentFullList = projectsToRender;

    // Pagination Logic: Slice the list
    const totalPages = Math.ceil(currentFullList.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedProjects = currentFullList.slice(startIndex, endIndex);

    const cardHTML = pagedProjects.map(project => {
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
    
    // Update Pagination UI
    updatePaginationUI(totalPages);

    document.querySelectorAll('.quick-look-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the parent link from navigating
            e.stopPropagation(); // Stop the click from bubbling up to the parent link
            renderQuickLook(e.currentTarget.dataset.id);
        });
    });

    const unityBtn = document.getElementById('unity-portfolio-btn');
    const blenderBtn = document.getElementById('blender-portfolio-btn');

    if (currentCategory === 'a_unity') {
        unityBtn.classList.add('active');
        blenderBtn.classList.remove('active');
    } else if (currentCategory === 'b_blender') {
        blenderBtn.classList.add('active');
        unityBtn.classList.remove('active');
    }

    const platformFilterGroup = document.getElementById('platform-filter-group');
    if (currentCategory === 'b_blender') {
        platformFilterGroup.style.display = 'none';
    } else {
        platformFilterGroup.style.display = 'flex';
    }
}

/**
 * Updates the pagination buttons and info text.
 */
function updatePaginationUI(totalPages) {
    const infoEl = document.getElementById('pagination-info');
    const btnFirst = document.getElementById('btn-first');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnLast = document.getElementById('btn-last');

    if (infoEl) infoEl.textContent = `Page ${currentPage} of ${totalPages}`;
    
    if (btnFirst) btnFirst.disabled = currentPage === 1;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    
    if (btnNext) btnNext.disabled = currentPage === totalPages;
    if (btnLast) btnLast.disabled = currentPage === totalPages;
}

/**
 * Sets up event listeners for pagination buttons.
 */
function setupPaginationListeners() {
    const btnFirst = document.getElementById('btn-first');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnLast = document.getElementById('btn-last');

    if (!btnFirst) return;

    const handlePageChange = (newPage) => {
        if (newPage !== currentPage) {
            currentPage = newPage;
            renderGalleryView(currentFullList, currentFilterState, false);
            // Smooth scroll to top of gallery
            const header = document.querySelector('.main-header');
            if (header) header.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Calculate total pages dynamically based on current list
    const getTotalPages = () => Math.ceil(currentFullList.length / itemsPerPage) || 1;

    btnFirst.addEventListener('click', () => handlePageChange(1));
    btnPrev.addEventListener('click', () => handlePageChange(currentPage - 1));
    btnNext.addEventListener('click', () => handlePageChange(currentPage + 1));
    btnLast.addEventListener('click', () => handlePageChange(getTotalPages()));
}

/**
 * Populates filter dropdowns and attaches event listeners.
 */
function populateFilters(filterState = { year: 'all', platform: 'all', sort: 'date-desc' }) {
    const yearFilter = document.getElementById('filter-year');
    const platformFilter = document.getElementById('filter-platform');
    const sortFilter = document.getElementById('filter-sort');
    const searchInput = document.getElementById('search-input');

    // Get projects for the current category to populate filters accurately
    const projectsForCurrentCategory = masterProjectList.filter(p => p.category === currentCategory);

    const years = [...new Set(projectsForCurrentCategory.map(p => {
        const date = parseDate(p.DevEndDate);
        return date ? date.getFullYear() : null;
    }).filter(year => year !== null))]
    .sort((a, b) => b - a);
    const platforms = [...new Set(projectsForCurrentCategory.flatMap(p => p.platforms))].sort();

    // Clear existing options (keep the first 'All' option)
    while (yearFilter.options.length > 1) yearFilter.remove(1);
    while (platformFilter.options.length > 1) platformFilter.remove(1);

    years.forEach(year => {
        const option = new Option(year, year, false, year == filterState.year);
        yearFilter.add(option);
    });

    platforms.forEach(platform => {
        const option = new Option(platform, platform);
        platformFilter.add(option);
    });

    yearFilter.value = filterState.year;
    platformFilter.value = filterState.platform;
    if (sortFilter) sortFilter.value = filterState.sort;

    const applyFilters = () => {
        const selectedYear = yearFilter.value;
        const selectedPlatform = platformFilter.value;
        const selectedSort = sortFilter ? sortFilter.value : 'date-desc';
        const searchTerm = searchInput.value.toLowerCase().trim();

        const filterState = { year: selectedYear, platform: selectedPlatform, sort: selectedSort };

        // Start with projects from the current category, not the master list
        let filteredList = masterProjectList.filter(p => p.category === currentCategory);

        if (selectedYear !== 'all') {
            filteredList = filteredList.filter(p => {
                const date = parseDate(p.DevEndDate);
                return date && date.getFullYear() == selectedYear;
            });
        }

        if (selectedPlatform !== 'all' && currentCategory !== 'b_blender') {
            filteredList = filteredList.filter(p => p.platforms.includes(selectedPlatform));
        }

        if (searchTerm) {
            filteredList = filteredList.filter(p => 
                p.title.toLowerCase().includes(searchTerm) || 
                p.techStack.some(t => t.toLowerCase().includes(searchTerm))
            );
        }

        renderGalleryView(filteredList, filterState, true); // Reset to page 1 on filter change
    };

    // Use 'onchange'/'oninput' to prevent duplicate listeners if this function is called multiple times
    yearFilter.onchange = applyFilters;
    platformFilter.onchange = applyFilters;
    if (sortFilter) sortFilter.onchange = applyFilters;
    searchInput.oninput = applyFilters;
}