
# Gemini Project Instructions: Azmi Studio Portfolio

This file provides context and instructions for Gemini to work with this project.

## 1. Project Overview

This is a single-page application (SPA) portfolio for Azmi Studio. It's built with vanilla JavaScript, HTML, and CSS, and it dynamically loads project information from JSON files and Markdown. The portfolio has two main views: a gallery view and a detail view.

## 2. Key Technologies

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Data:** JSON for project metadata, Markdown for project descriptions.
*   **Routing:** A simple hash-based router in `js/app.js`.

## 3. Development

*   **Running the project:** This is a static website. To run it, simply open the `index.html` file in a web browser. No build step is required.
*   **Entry Point:** `js/app.js` is the main entry point. It handles routing and initializes the views.
*   **Views:**
    *   `view/gallery-view.html`: The template for the main project gallery.
    *   `view/detail-view.html`: The template for the detailed project view.
*   **Rendering Logic:**
    *   `js/render-gallery.js`: Renders the gallery of projects.
    *   `js/render-detail.js`: Renders the detailed view for a single project.

## 4. How to Add a New Project

To add a new project, follow these steps:

1.  **Create a directory:** Add a new folder inside the `project/` directory.
2.  **Add `config.json`:** Inside the new folder, create a `config.json` file. This file contains the project's metadata. You can copy an existing `config.json` and modify it.
3.  **Add `README.md`:** Inside the new folder, create a `README.md` file. This file contains the detailed project description.
4.  **Add media:** Add all project images, videos, and other media to the new folder.
5.  **Update `project/project-library.json`:** Add a new entry for the project in the `project-library.json` file. This file is the master list of all projects.

## 5. Code Style and Conventions

*   **JavaScript:** Follow the existing code style in the `js/` files. Use utility functions from `js/utils.js` where possible.
*   **CSS:** Use the existing CSS classes and structure. The CSS is component-based (e.g., `component-lightbox.css`, `component-quick-look.css`).
*   **File Naming:** Follow the existing file naming conventions (e.g., `render-*.js`, `view-*.html`).
