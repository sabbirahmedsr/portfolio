# 🌐 Azmi Studio Portfolio - Technical Documentation

## 📋 Project Summary
This project is a **Single Page Application (SPA)** portfolio designed to showcase Unity and Blender projects. It is built using **Vanilla JavaScript, HTML5, and CSS3**, avoiding heavy frameworks to ensure maximum performance and ease of customization.

### The GitHub Pages SPA Approach
Hosting SPAs on GitHub Pages can be challenging because it only serves static files and doesn't support server-side routing (like Nginx/Apache rewrites). This project solves that using **Hash-Based Routing**:
1.  **Navigation**: URLs look like `domain.com/#/project/my-project`. The `#` prevents the browser from sending a new request to the server, allowing JavaScript to handle the URL change.
2.  **Data Fetching**: Instead of a database, the application treats the file system as an API. It uses `fetch()` to retrieve JSON configuration files and HTML templates dynamically.
3.  **Asset Management**: Relative paths are calculated dynamically (`rootPath`) to ensure assets load correctly whether hosted at the root domain or a subdirectory (common with GitHub Project Pages).

---

## 🛠️ How to Manage Content

### 1. Modifying Feature Groups (Landing Page)
The sections on the landing page (e.g., "HoloLens", "VR", "Simulations") are not hardcoded HTML. They are defined in a JSON configuration block embedded within `view/landing-view.html`.

**To add or edit a section:**
1.  Open `view/landing-view.html`.
2.  Locate the `<script id="landing-config-data">` block.
3.  Add a new object to the array:

```json
{
    "id": "new-section-id",
    "title": "New Section Title",
    "description": "Description of this collection.",
    "linkUrl": "#/gallery",
    "projects": [
        "a_unity/Path/To/Project/config.json",
        "b_blender/Path/To/Another/config.json"
    ]
}
```

**To update the Featured Slider:**
Edit the `<script id="featured-config-data">` block in the same file. It is a simple array of paths to project config files.

### 2. Adding a New Project
The system scans specific "Category" folders (`a_unity`, `b_blender`) based on an index file.

**Step 1: Create Project Files**
Create a new folder inside the category directory (e.g., `a_unity/MyNewGame/`). Inside, add:
*   `config.json`: The metadata (see sample below).
*   `preview.png`: The thumbnail image.
*   `README.md`: The detailed description (Markdown format).
*   Additional media (images/videos).

**Step 2: Sample `config.json`**
```json
{
    "title": "My New Game",
    "slug": "my-new-game",
    "tagline": "A short catchy tagline.",
    "shortDescription": "Brief summary for the card view.",
    "previewImage": "./preview.png",
    "client": "Personal Project",
    "platforms": ["PC", "WebGL"],
    "InitiationDate": "01-01-2024",
    "DevStartDate": "01-02-2024",
    "DevEndDate": "01-03-2024",
    "techStack": ["Unity", "C#", "HLSL"],
    "media": [
        { "url": "./preview.png", "alt": "Main cover" },
        { "url": "https://youtube.com/...", "alt": "Gameplay Trailer" }
    ],
    "externalLinks": [
        { "label": "GitHub", "url": "...", "iconClass": "fab fa-github" }
    ]
}
```

**Step 3: Register the Project**
Open the `project-library.json` file located in the category root (e.g., `a_unity/project-library.json`) and add a reference to your new config:

```json
[
    { "id": "existing-project", "projectConfigPath": "ExistingProject/config.json" },
    { "id": "my-new-game", "projectConfigPath": "MyNewGame/config.json" }
]
```

---

## 📂 Directory Structure
*   `js/`: Core logic (`app.js` router, renderers).
*   `css/`: Modular styles.
*   `view/`: HTML templates (Landing, Gallery, Detail).
*   `a_unity/` & `b_blender/`: Content directories containing project folders and the `project-library.json` index.
