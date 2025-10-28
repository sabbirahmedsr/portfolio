/* *********************************************************
    Module: Utilities
    Description: Contains shared helper functions used throughout the application, such as data fetching and media type inference.
************************************************************/

/**
 * Utility to fetch data and check for errors.
 * @param {string} url - The URL to fetch.
 * @param {string} type - The expected return type ('json' or 'text').
 * @returns {Promise<string|object>} - The fetched data (JSON or text).
 */
export async function fetchData(url, type = 'json') {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return type === 'json' ? response.json() : response.text();
}

/**
 * Utility to determine media type from URL.
 * @param {string} url - 'video', 'gif', or 'image'
 */
export function inferMediaType(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.toLowerCase().endsWith('.mp4')) {
        return 'video';
    }
    if (url.toLowerCase().endsWith('.gif')) {
        return 'gif';
    }
    return 'image';
}

/**
 * Converts various YouTube URL formats to a standardized embeddable URL.
 * @param {string} url The original YouTube URL.
 * @returns {string} The embeddable URL.
 */
export function convertToYoutubeEmbedUrl(url) {
    let videoId = null;
    // Regex to extract video ID from various YouTube URL formats
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    // If it's not a recognizable YouTube URL, return it as is.
    return url;
}

/**
 * Parses a date string in "dd-mm-yyyy" format.
 * @param {string} dateString - The date string to parse.
 * @returns {Date|null} A Date object or null if invalid.
 */
export function parseDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    // Note: month is 0-indexed in JavaScript Date constructor (0=Jan, 11=Dec)
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
 * Formats a Date object into "Mon YYYY" format (e.g., "Jan 2025").
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export function formatDateShort(date) {
    if (!date || isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Formats a Date object into "Month Day, Year" format (e.g., "January 1, 2025").
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export function formatDateLong(date) {
    if (!date || isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}