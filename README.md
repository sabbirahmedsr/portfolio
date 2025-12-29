# 🌐 Azmi Studio Portfolio - Technical Documentation

## 📋 Project Summary
This project is a **Single Page Application (SPA)** portfolio designed to showcase Unity and Blender projects. It is built using **Vanilla JavaScript, HTML5, and CSS3**, avoiding heavy frameworks to ensure maximum performance and ease of customization.

### The GitHub Pages SPA Approach
Hosting SPAs on GitHub Pages can be challenging because it only serves static files and doesn't support server-side routing (like Nginx/Apache rewrites). This project solves that using **Hash-Based Routing**:
1.  **Navigation**: URLs look like `domain.com/#/project/my-project`. The `#` prevents the browser from sending a new request to the server, allowing JavaScript to handle the URL change.
2.  **Data Fetching**: Instead of a database, the application treats the file system as an API. It uses `fetch()` to retrieve JSON configuration files and HTML templates dynamically.
3.  **Asset Management**: Relative paths are calculated dynamically (`rootPath`) to ensure assets load correctly whether hosted at the root domain or a subdirectory (common with GitHub Project Pages).

---

## 🎨 Template Documentation
The UI structure is defined in HTML templates located in the `view/` directory. Since there is no build step, you can edit these files directly to change the layout.

*   **`view/landing-view.html`**: The homepage layout. Contains embedded JSON configuration for the slider and sections.
*   **`view/gallery-view.html`**: The grid layout for the "Explore Gallery" page.
*   **`view/detail-view.html`**: The template for a single project's detail page. The JavaScript router populates this template by replacing placeholders with data from the project's `config.json`.

---

## ✅ Project Validation Standards
Before adding a project to the portfolio, ensure it meets these standards:

- [ ] **Repository Shortcuts**: Create internet shortcut files (`.url`) for both **GitHub** and **GitLab** inside the project root folder for quick access.
- [ ] **Thumbnail**: The main preview image (e.g., `.preview00.png`) must have a **3:2 aspect ratio**.
- [ ] **README.md**: The project must have a `README.md` file using the sample structure below.
- [ ] **Sync**: Push all assets and changes to both GitHub and GitLab.

### 📄 Sample README.md
Copy and adapt this template for your project:

````markdown

# [Project Title]

Short catchy and engaging description of the project

---

## 🔗 Quick Links

| [Github](https://github.com/sabbirahmedsr/[SLUG]) | [Gitlab](https://gitlab.com/sabbirahmedsr/[SLUG]) | [Info](./Assets/Info) | [Portfolio](https://sabbirahmedsr.github.io/portfolio/#/project/[SLUG]) | [Publish]([Publish-URL]) |
| :---: | :---: | :---: | :---: | :---: |

---

### 📸 Previews
<!-- Option 1: Full Width Image -->
<p align="center">
  <img src="./.preview00.png" width="100%" alt="Main App Preview">
</p>

<!-- Option 2: Duo Collage (2 Images) -->
<p align="center">
  <img src="./.preview01.png" width="49%" alt="Preview 01">
  <img src="./.preview02.png" width="49%" alt="Preview 02">
</p>

<!-- Option 3: Trio Collage (3 Images) -->
<p align="center">
  <img src="./.preview01.png" width="32.5%" alt="Preview 01">
  <img src="./.preview02.png" width="32.5%" alt="Preview 02">
  <img src="./.preview03.png" width="32.5%" alt="Preview 03">
</p>

<!-- Option 4: Quad Collage (4 Images) -->
<p align="center">
  <img src="./.preview01.png" width="24.5%" alt="Preview 01">
  <img src="./.preview02.png" width="24.5%" alt="Preview 02">
  <img src="./.preview03.png" width="24.5%" alt="Preview 03">
  <img src="./.preview04.png" width="24.5%" alt="Preview 04">
</p>

### 🎬 Gameplay
[![Gameplay V1](https://img.youtube.com/vi/[VideoID]/sddefault.jpg)](https://www.youtube.com/watch?v=[VideoID])
> **[▶ Click here to watch the gameplay video](https://www.youtube.com/watch?v=[VideoID])**


<!-- Option 2: Centered Video with 60% Width -->
<p align="center">
  <a href="https://www.youtube.com/watch?v=[VideoID]">
    <img src="https://img.youtube.com/vi/[VideoID]/sddefault.jpg" width="60%" alt="Video Title">
  </a>
</p>

---

## 📅 Project Timeline & Status

| Proposal Discussion | Project Start | Project Completion | Duration |
| :---: | :---: | :---: | :---: |
| Month Day, Year | **Month Day, Year** | Month Day, Year | Duration |

---

## ✨ Key Features

* **Feature Name:** Description of the feature.
* **Feature Name:** Description of the feature.
---

## 🛠️ Technical Details

* Engine: **[Unity xxxx.x.xxf1]**
* Render Pipeline: **[Built-in / URP / HDRP]]**
* Language: [C# / C++]
* Platform: [PC / ANDROID / IOS / WEB / HOLOLENS / VR / QUEST]


### ⚙️ **Packages & Dependencies**
The following specific versions were used to ensure stability:

| Package Name | Version |
| :--- | :--- |
| `package.name` | x.x.x |

---

## 🏷️ Attribution

* **Category:** [Asset Name](URL)(Author), [Asset Name](URL)(Author)
* **Category:** [Asset Name](URL)(Author), [Asset Name](URL)(Author)
* **Category:** [Asset Name](URL)(Author), [Asset Name](URL)(Author)

*Full details can be found in the [Attribution File](./Assets/Info/Attribute.md).*


````

---

## ➕ Adding a New Project to Portfolio
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
        { "label": "GitHub", "url": "...", "iconClass": "fab fa-github" },
        { "label": "GitLab", "url": "...", "iconClass": "fab fa-gitlab" }
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

## 🏠 Landing Page Configuration
The landing page content is dynamic and controlled by JSON configuration blocks embedded directly within `view/landing-view.html`.

### 1. Modifying Feature Groups
The vertical sections on the landing page (e.g., "HoloLens", "VR") are defined in the `landing-config-data` script block.

1.  Open `view/landing-view.html`.
2.  Locate the `<script type="application/json" id="landing-config-data">` block.
3.  Add or edit objects in the array. Each object represents a section:

```json
{
    "id": "unique-section-id",
    "title": "Section Display Title",
    "description": "A brief description for the section header.",
    "linkUrl": "#/gallery",
    "projects": [
        "a_unity/Category/ProjectFolder/config.json",
        "b_blender/Category/ProjectFolder/config.json"
    ]
}
```

### 2. Updating the Featured Slider
The auto-scrolling slider at the top of the landing page is configured in the `featured-config-data` script block.

1.  Open `view/landing-view.html`.
2.  Locate the `<script type="application/json" id="featured-config-data">` block.
3.  Update the array with the paths to the `config.json` files of the projects you want to feature:

```json
[
    "b_blender/Dining Room/config.json",
    "a_unity/++Hololens Project++/HL Dolphin App MRTK3/config.json"
]
```

---

## 📂 Directory Structure
*   `js/`: Core logic (`app.js` router, renderers).
*   `css/`: Modular styles.
*   `view/`: HTML templates (Landing, Gallery, Detail).
*   `a_unity/` & `b_blender/`: Content directories containing project folders and the `project-library.json` index.

---

## 💻 Code Organization & Standards
**Note for AI Assistants & Contributors:**
To ensure a professional, maintainable, and scalable codebase, strict adherence to the following modular structure is required.

### 1. Modular Architecture (Separation of Concerns)
*   **HTML (`view/`)**: Defines structure only.
*   **CSS (`css/`)**: Handles all visual styling.
    *   **Requirement**: **Do not** use `<style>` blocks or inline styles within HTML templates.
    *   **Structure**: Each view file must have a dedicated CSS file in the `css/` directory (e.g., `view/landing-view.html` → `css/landing-view.css`).
*   **JS (`js/`)**: Manages logic, routing, and data binding.

### 2. Refactoring Mandate
When modifying existing files (e.g., `landing-view.html`), if you encounter inline styles, you are required to **refactor** them into the corresponding external CSS file.
