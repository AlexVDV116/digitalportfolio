export function initHamburgerNav() {
    const nav = document.getElementById("nav");
    const btn = document.getElementById("navBtn");
    const menu = document.getElementById("navMenu");
    if (!nav || !btn || !menu) return;

    function open() {
        nav.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        // focus first item
        const first = menu.querySelector('[role="menuitem"]');
        first?.focus?.();
    }

    function close() {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
    }

    function toggle() {
        nav.classList.contains("is-open") ? close() : open();
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!nav.contains(e.target)) close();
    });

    // Close on Esc
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    // Close after clicking an item
    menu.addEventListener("click", (e) => {
        const a = e.target.closest("[data-nav-close]");
        if (a) close();
    });
}
