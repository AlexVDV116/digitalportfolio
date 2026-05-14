/**
 * Theme toggle — switches between "light" (Academic Light) and "dark" (Midnight Scholar).
 *
 * Usage:
 *   import { initThemeToggle } from "../scripts/shared/themeToggle.js";
 *   initThemeToggle();
 *
 * Expects a <button class="themeToggle"> in the DOM (inserted by HTML).
 * Persists preference in localStorage under "theme".
 */

const STORAGE_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

/** Apply theme to <html> and update toggle buttons. */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update all toggle buttons (one per page, but just in case)
    document.querySelectorAll(".themeToggle").forEach(btn => {
        btn.setAttribute("aria-label",
            theme === DARK ? "Schakel naar licht thema" : "Schakel naar donker thema"
        );
        btn.title = theme === DARK ? "Academic Light" : "Midnight Scholar";
    });
}

/** Read stored preference, or default to light. */
function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    return LIGHT;
}

/** Toggle between light and dark. */
function toggle() {
    const current = document.documentElement.getAttribute("data-theme") || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
}

/**
 * Initialise theme system. Call once per page.
 * Applies saved/preferred theme immediately, then wires up toggle button(s).
 */
export function initThemeToggle() {
    // Apply ASAP (before paint if this runs in <head>, but we're module so after parse)
    applyTheme(getPreferred());

    // Wire up toggle buttons
    document.querySelectorAll(".themeToggle").forEach(btn => {
        btn.addEventListener("click", toggle);
    });

}
