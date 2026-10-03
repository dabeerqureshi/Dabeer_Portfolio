function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (!menu || !icon) {
        return;
    }

    const isOpen = menu.classList.toggle("open");

    icon.classList.toggle("open", isOpen);
    icon.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("DOMContentLoaded", function () {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------- Current year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ---------- Reveal on scroll ---------- */
    const animatedItems = document.querySelectorAll(".reveal-on-scroll");

    if ("IntersectionObserver" in window && animatedItems.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
        );

        animatedItems.forEach((item) => revealObserver.observe(item));
    } else {
        animatedItems.forEach((item) => item.classList.add("visible"));
    }

    /* ---------- Animated stat counters ---------- */
    const counters = document.querySelectorAll("[data-count-to]");

    const runCounter = (el) => {
        const target = parseFloat(el.getAttribute("data-count-to"));
        const suffix = el.getAttribute("data-count-suffix") || "";
        if (Number.isNaN(target)) {
            return;
        }

        if (prefersReducedMotion) {
            el.textContent = target + suffix;
            return;
        }

        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window && counters.length) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(runCounter);
    }

    /* ---------- Scroll progress + back to top ---------- */
    const progressBar = document.getElementById("scroll-progress");
    const backToTop = document.getElementById("back-to-top");

    const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

        if (progressBar) {
            progressBar.style.width = (ratio * 100).toFixed(2) + "%";
        }
        if (backToTop) {
            backToTop.classList.toggle("show", scrollTop > 600);
        }
    };

    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true }
    );
    onScroll();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });
    }

    /* ---------- Active nav link ---------- */
    const navLinks = document.querySelectorAll(
        '.nav-links a[href^="#"], .menu-links a[href^="#"]'
    );
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
        const linksByHash = {};
        navLinks.forEach((link) => {
            const hash = link.getAttribute("href");
            if (hash && hash !== "#") {
                linksByHash[hash] = linksByHash[hash] || [];
                linksByHash[hash].push(link);
            }
        });

        const setActive = (id) => {
            Object.keys(linksByHash).forEach((hash) => {
                const isActive = hash === "#" + id;
                linksByHash[hash].forEach((link) =>
                    link.classList.toggle("active", isActive)
                );
            });
        };

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ---------- Close mobile menu on Escape ---------- */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        if (menu && menu.classList.contains("open")) {
            menu.classList.remove("open");
            if (icon) {
                icon.classList.remove("open");
                icon.setAttribute("aria-expanded", "false");
            }
        }
    });
});
