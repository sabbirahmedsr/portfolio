# 🌐 Sabbir Ahmed's Dynamic Portfolio Showcase

This is a modern, single-page application (SPA) style portfolio built with Vanilla JavaScript, HTML5, and CSS3. It features a custom, premium dark theme inspired by platforms like the Unity Asset Store for a clean, professional presentation.

## ✨ Key Features


---
## 🗂️ Project Structure

```
└── 📁Portfolio        
    └── 📁css
        ├── base.css
        ├── component-lightbox.css
        ├── component-quick-look.css
        ├── view-detail.css
        ├── view-gallery.css
    └── 📁data
    └── 📁image
        ├── azmi-studio-logo.png
    └── 📁js
        ├── app.js
        ├── lightbox.js
        ├── quicklook.js
        ├── render-detail.js
        ├── render-gallery.js
        ├── utils.js
    └── 📁project
        └── 📁Project 01
            ├── config.json
            ├── preview.png
            ├── README.md
        └── 📁Project 02
            ├── config.json
            ├── preview.png
            ├── README.md
        ├── project-library.json
    └── 📁view
        ├── detail-view.html
        ├── gallery-view.html
        ├── quick-look.html
    ├── index.html
    ├── README.md
    └── reference.png
```

## 💻 Core Script Roles (The `js/` Directory)

Each JavaScript module has a clear, isolated responsibility:

| File Name | Role / Primary Function | Key Exports/Logic |
| :--- | :--- | :--- |
| `app.js` | **Application Entry & Router** | Initializes data (`masterProjectList`, `views`), sets up global state, listens for hash changes, and calls the appropriate renderer (`renderGalleryView` or `renderDetailView`). |
| `utils.js` | **Helper Utilities** | Provides common utility functions like `fetchData` (handling JSON/Text), `inferMediaType` (determining if a file is a video, GIF, or image), and `convertToYoutubeEmbedUrl`. |
| `render-gallery.js` | **Gallery View Renderer** | Fetches the `gallery-view.html` template, populates the filter bar, and builds the grid of project cards using data from `masterProjectList`. |
| `render-detail.js` | **Detail View Renderer** | Fetches the `detail-view.html` template, loads the project's `config.json` and `README.md`, and renders the full project page (hero media, specs, gallery). **(Exports `renderDetailView`)** |
| `quicklook.js` | **Quick Look Controller** | Manages the opening and closing of the Quick Look modal and dynamically populates its content when a user clicks the Quick Look button on a card. |
| `lightbox.js` | **Lightbox Controller** | Initializes click listeners on all media items (`hero-media`, `gallery-item`, Quick Look media) and handles the full-screen display of images, GIFs, and videos. **(Exports `initLightbox`)** |

## ➕ How to Add a New Project

The data-driven design makes adding new projects straightforward. Follow these three steps:

### Step 1: Create a New Project Directory

In the `project/` folder, create a new sub-folder for your project.
*Example: `project/My-New-Amazing-App/`*

### Step 2: Add Configuration and Media Files

Inside your new folder (`/project/My-New-Amazing-App/`), add the following three files:

1.  **`config.json`**
    * This file defines all project metadata, links, features, and the media gallery list.
    * **Tip:** Copy an existing `config.json` and modify the values. Ensure all paths to local media are correct relative to this file.

2.  **`README.md`**
    * This markdown file contains the extended, long-form description of your project. Its content will be loaded and displayed in the **Project Description** section on the detail page.

3.  **Media Files**
    * Add your primary preview image, video files, screenshots, and GIFs as referenced in your `config.json`.

### Step 3: Update the Master Library
