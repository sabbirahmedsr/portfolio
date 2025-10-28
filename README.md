# Unity & Interactive Media Portfolio

Welcome to my portfolio, a curated showcase of my professional and personal projects with a strong focus on **Unity development for XR and other interactive applications**.

This site serves as a central hub for my work, detailing the architecture, features, and development process behind each project.

**[➡️ View the Live Demo Here](https://your-live-url.com)**

## ✨ About This Portfolio

This portfolio was engineered with several key principles in mind:

- **Blazing Fast SPA:** A custom hash-based router provides a seamless, app-like experience with no page reloads.
- **Fully Data-Driven:** Projects are not hardcoded. All content is dynamically loaded from a series of local JSON files, making the portfolio incredibly easy to update.
- **Component-Based Views:** The application uses distinct HTML templates for the gallery, project detail page, and quick-view modal, which are fetched and rendered on demand.
- **Rich Media Experience:**
  - **Quick View Modal:** Get a project snapshot without leaving the gallery.
  - **Quick Look Modal:** Get a project snapshot without leaving the gallery.
  - **Dynamic Lightbox:** A sleek, full-screen viewer for images, GIFs, and embedded YouTube videos.
- **Modern & Responsive UI:** A premium, dark-themed design built with modern CSS (Flexbox, Grid, and Custom Properties) that looks great on any device.
- **Zero Frameworks, Zero Dependencies:** This project proudly stands on the shoulders of core web technologies, demonstrating a deep understanding of the browser's native capabilities.

---

## 🛠️ Portfolio Tech Stack

This project is a testament to the power of modern vanilla web development.

- **JavaScript (ES6+):**
  - **`async/await`** with the **`fetch` API** for all asynchronous operations (loading views and project data).
  - **Custom Hash-Based Router** to manage application state and history.
  - **Modular Code Structure** separating core logic, view rendering, and UI components (`app.js`, `render-gallery.js`, `render-detail.js`, `quicklook.js`, `lightbox.js`, `utils.js`).
- **CSS3:**
  - **CSS Variables (Custom Properties)** for a highly maintainable and themeable design system.
  - **Flexbox & Grid** for sophisticated, responsive layouts.
  - **Modular CSS Files** split by view/component (`base.css`, `gallery.css`, `detail.css`, etc.).
- **HTML5:**
  - A minimal `index.html` shell.
  - **View Templates** (`/view/*.html`) that are dynamically loaded into the main application container.

---

## 📁 Project Structure

The architecture is designed for scalability and separation of concerns.

```
Portfolio/
├── css/
│   ├── base.css           # Global styles, variables, and fonts
│   ├── gallery.css        # Styles for the project grid and cards
│   ├── detail.css         # Styles for the project detail page (Note: The user provided `view-detail.css` in the previous turn, but the `index.html` points to `detail.css`. I'll assume `detail.css` is the correct one to document.)
│   ├── quick-look.css     # Styles for the quick look modal
│   └── lightbox.css       # Styles for the media lightbox
│
├── js/
│   ├── main.js            # Core application logic (router, data loading, view rendering)
│   ├── gallery.js         # Logic for the media lightbox
│   └── quicklook.js       # Logic for the quick look modal
│
├── project/
│   ├── project-library.json # Master list of all projects
│   └── [project-name]/      # Folder for an individual project
│       ├── project-info.json  # Detailed data for this project
│       ├── README.md          # Long description for the detail view
│       └── (media files...)   # preview.png, gameplay.gif, etc.
│
├── view/
│   ├── gallery-view.html    # HTML template for the gallery page
│   ├── detail-view.html     # HTML template for the detail page (Note: The user provided `detail-view.html`.)
│   └── quick-look.html    # HTML template for the quick look modal
│
├── index.html             # Main entry point of the application
└── README.md              # This file
```

---

## 🚀 How to Run Locally

Because this project uses the `fetch` API to load local files, you cannot simply open `index.html` in your browser from the file system (due to CORS security policies). You must serve the files from a local web server.

The easiest way is to use the **Live Server** extension in Visual Studio Code:
1.  Install the Live Server extension.
2.  Right-click on `index.html` in the VS Code explorer.
3.  Select "Open with Live Server".

This will start a local server and open the portfolio in your default browser.

---

## 📝 How to Add a New Project

Adding a new project is straightforward and requires no changes to the JavaScript code.

#### Step 1: Create the Project Folder

Create a new folder inside the `/project/` directory. The folder name should be descriptive (e.g., `my-new-app`).

#### Step 2: Add Project Files

Inside your new folder (`/project/my-new-app/`), add the following:
1.  **`project-info.json`:** A JSON file containing all the details for your project. Copy an existing one and modify it.
2.  **`README.md`:** A Markdown file that will be used for the "Project Description" section on the detail page.
3.  **Media Files:** Add your preview image, GIFs, and any other local media referenced in `project-info.json`.

#### Step 3: Update the Master Library

Finally, open `/project/project-library.json` and add a new entry for your project. This entry tells the main application that your project exists and where to find its configuration.

```json
// In /project/project-library.json
[
  {
    "id": "hl-dolphin-app-mrtk3",
    "title": "HL Dolphin App (MRTK3)",
    "previewImage": "project/HL Dolphin App MRTK3/README_SS.PNG",
    "projectConfigPath": "project/HL Dolphin App MRTK3/project-info.json"
  },
  {
    "id": "vr-q2-firefighter",
    "title": "VR Q2 Firefighter Simulator",
    "previewImage": "project/VR Q2 Firefighter/preview.png",
    "projectConfigPath": "project/VR Q2 Firefighter/project-info.json"
  },
  {
    "id": "my-new-app",
    "title": "My New Awesome App",
    "previewImage": "project/my-new-app/preview.jpg",
    "projectConfigPath": "project/my-new-app/project-info.json"
  }
]
```

Once you save the file and refresh your browser, the new project will automatically appear in the gallery.