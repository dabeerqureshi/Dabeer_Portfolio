function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.toggle("open");

    icon.classList.toggle("open", isOpen);
    icon.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("DOMContentLoaded", function () {
    const animatedItems = document.querySelectorAll(".reveal-on-scroll");

    if (!animatedItems.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -60px 0px",
        }
    );

    animatedItems.forEach((item) => observer.observe(item));
});
