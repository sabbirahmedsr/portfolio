/* *********************************************************
    Module: Render Landing
    Description: Handles rendering of the landing page sections based on HTML data attributes.
************************************************************/

/**
 * Renders the landing page sections by reading the embedded configuration from the view.
 * @param {Array} masterProjectList - List of all loaded projects.
 * @param {string} rootPath - The root path for assets.
 * @param {boolean} isInViewDir - Whether the current page is inside the view directory.
 */
export async function renderLandingPage(masterProjectList, rootPath, isInViewDir) {
    const container = document.getElementById('landing-sections');
    const configElement = document.getElementById('landing-config-data');
    
    if (!container || !configElement) return;

    try {
        const landingConfig = JSON.parse(configElement.textContent);

        container.innerHTML = landingConfig.map(section => {
            const sectionProjects = section.projects
                .map(configPath => {
                    const lookupPath = rootPath + configPath;
                    return masterProjectList.find(p => p.projectConfigPath === lookupPath);
                })
                .filter(p => p !== undefined)
                .slice(0, 4); // Limit to 4 cards

            if (sectionProjects.length === 0) return '';

            return `
                <section id="${section.id}" class="category-section">
                    <div class="section-header">
                        <h2>${section.title}</h2>
                        ${section.description ? `<p style="color:var(--text-secondary); margin-bottom:1rem;">${section.description}</p>` : ''}
                        <a href="${section.linkUrl || '#/gallery'}" class="view-all">View All</a>
                    </div>
                    <div class="projects-grid">
                        ${sectionProjects.map(p => createLandingCard(p, rootPath, isInViewDir)).join('')}
                    </div>
                </section>
            `;
        }).join('');
    } catch (error) {
        console.error("Error rendering landing page:", error);
        container.innerHTML = '<p class="error-message">Failed to load landing page content.</p>';
    }
}

/**
 * Creates the HTML for a single landing page card.
 */
function createLandingCard(project, rootPath, isInViewDir) {
    // Fix image path relative to root
    let imgPath = project.previewImage;
    if (project.previewImage.startsWith('./')) {
        imgPath = project.baseDir + project.previewImage.substring(1);
    }
    
    // If on landing page (index.html), link to view/gallery.html. If inside view/, link to gallery.html
    const linkUrl = `#/project/${project.id}`;
    
    return `
        <div class="landing-card">
            <div class="landing-card-image">
                <img src="${imgPath}" alt="${project.title}" loading="lazy">
            </div>
            <div class="landing-card-content">
                <h3>${project.title}</h3>
                <a href="${linkUrl}" class="landing-card-btn">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
}