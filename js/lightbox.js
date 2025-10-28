/* *********************************************************
    Module: Lightbox Component
    Description: Handles the lightbox functionality for viewing media items from the detail page gallery.
************************************************************/

import { convertToYoutubeEmbedUrl } from './utils.js';

/**
 * Initializes the lightbox functionality.
 */
export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxContainer = lightbox.querySelector('.lightbox-content');
    const galleryMedias = document.querySelectorAll('.gallery-media-item');
    const closeBtn = document.getElementById('close-lightbox');

    if (!lightboxContainer || !closeBtn) return;

    const showLightbox = (mediaUrl, altText, mediaType) => {
        // Clear previous content to prevent duplicated elements
        lightboxContainer.innerHTML = ''; 

        let mediaElement;
        if (mediaType === 'video') {
            // Use iframe for external video embeds like YouTube
            mediaElement = document.createElement('iframe');
            mediaElement.src = convertToYoutubeEmbedUrl(mediaUrl);
            mediaElement.setAttribute('frameborder', '0');
            mediaElement.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            mediaElement.setAttribute('allowfullscreen', '');
            mediaElement.className = 'lightbox-media lightbox-video';
        } else {
            // Use image tag for images and GIFs
            mediaElement = document.createElement('img');
            mediaElement.src = mediaUrl;
            mediaElement.alt = altText;
            mediaElement.className = 'lightbox-media';
        }

        // Re-create and append the close button inside the container
        const newCloseBtn = document.createElement('span');
        newCloseBtn.id = 'close-lightbox';
        newCloseBtn.className = 'close-btn';
        newCloseBtn.innerHTML = '&times;';
        newCloseBtn.addEventListener('click', hideLightbox);

        lightboxContainer.appendChild(newCloseBtn);
        lightboxContainer.appendChild(mediaElement);
        
        lightbox.classList.add('is-active'); 
        document.body.style.overflow = 'hidden'; 
    };

    const hideLightbox = () => {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = ''; 
        // Clear the content to stop videos from playing in the background
        lightboxContainer.innerHTML = '';
    };

    // This function will be the event handler for each media item
    function handleMediaClick(event) {
        const item = event.currentTarget;
        const url = item.getAttribute('data-url');
        const alt = item.getAttribute('data-alt');
        const type = item.getAttribute('data-type');
        showLightbox(url, alt, type);
    }

    // Attach a single click listener to each media item
    galleryMedias.forEach(item => {
        // A common issue in SPAs is duplicating listeners. This ensures it's clean.
        // A simple way is to just add it, but for robustness, one might clone and replace the node.
        // For this app's flow, re-adding is fine since the view is rebuilt.
        item.addEventListener('click', handleMediaClick);
    });

    // Event listeners for closing the lightbox
    closeBtn.addEventListener('click', hideLightbox);
    
    lightbox.addEventListener('click', (e) => {
        // Close if the dark overlay area (the parent) is clicked, but not the content inside it
        if (e.target === lightbox) { 
            hideLightbox();
        }
    });

    // Use a single, persistent keydown listener on the document
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
            hideLightbox();
        }
    });
}
