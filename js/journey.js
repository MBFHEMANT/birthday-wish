/* =========================================================
   JOURNEY PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (
        !document.body.classList.contains(
            "journey-page"
        )
    ) {
        return;
    }


    const timelineItems =
        document.querySelectorAll(
            ".timeline-item"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "timeline-visible"
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    timelineItems.forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(45px)";

        item.style.transition =
            "opacity 1s ease, transform 1s ease";

        observer.observe(item);

    });


    const style =
        document.createElement("style");

    style.innerHTML = `

        .timeline-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

    `;

    document.head.appendChild(style);

});