/* *********************************************************
    Module 3.2.0 : Lightbox Gallery
    Description: Simple JavaScript to handle opening and closing a modal/lightbox for project media (images, videos, gifs).
    ************************************************************/

/**
 * Initializes listeners for all gallery media items.
 * Must be called after the detail view is rendered.
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContainer = document.querySelector('.lightbox-content');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryMedias = document.querySelectorAll('.gallery-media-item');
    const closeBtn = document.getElementById('close-lightbox');
    
    // Clear previous media and listeners
    lightboxContainer.innerHTML = '<span id="close-lightbox" class="close-btn">&times;</span><img id="lightbox-image" class="lightbox-media" src="" alt="Zoomed in project media"><p id="lightbox-caption" class="lightbox-caption"></p>';
    const lightboxImage = document.getElementById('lightbox-image');


    const showLightbox = (mediaUrl, altText, mediaType) => {
        // Clear previous content
        lightboxContainer.innerHTML = ''; 

        let mediaElement;
        if (mediaType === 'video') {
            // Use iframe for external video embeds
            mediaElement = document.createElement('iframe');
            mediaElement.src = mediaUrl;
            mediaElement.setAttribute('frameborder', '0');
            mediaElement.setAttribute('allow', 'autoplay; encrypted-media');
            mediaElement.setAttribute('allowfullscreen', '');
            mediaElement.className = 'lightbox-media lightbox-video';
        } else {
            // Use image tag for image/gif
            mediaElement = document.createElement('img');
            mediaElement.src = mediaUrl;
            mediaElement.alt = altText;
            mediaElement.className = 'lightbox-media';
        }

        // Re-add close button
        const closeBtnClone = closeBtn.cloneNode(true);
        closeBtnClone.addEventListener('click', hideLightbox);

        // Append elements
        lightboxContainer.appendChild(closeBtnClone);
        lightboxContainer.appendChild(mediaElement);
        // Note: Caption logic is omitted as per user request to not have captions.
        
        lightbox.classList.add('is-active'); 
        document.body.style.overflow = 'hidden'; 
    };

    const hideLightbox = () => {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = ''; 
    };

    galleryMedias.forEach(item => {
        // Remove existing listener before adding a new one (important for SPA)
        item.removeEventListener('click', handleMediaClick); 
        item.addEventListener('click', handleMediaClick);
    });
    
    function handleMediaClick() {
        const url = this.getAttribute('data-url');
        const alt = this.getAttribute('data-alt');
        const type = this.getAttribute('data-type');
        showLightbox(url, alt, type);
    }

    // Event listeners for closing
    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { 
            hideLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
            hideLightbox();
        }
    });
}