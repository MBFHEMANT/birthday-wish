/* =========================================================
   HMT BIRTHDAY EXPERIENCE
   MAIN JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       PRELOADER
    ----------------------------------------------------- */

    const preloader = document.getElementById("preloader");

    if (preloader) {

        window.addEventListener("load", () => {

            setTimeout(() => {
                preloader.classList.add("loaded");
            }, 700);

        });

    }


    /* -----------------------------------------------------
       PARTICLES
    ----------------------------------------------------- */

    const particleContainer = document.getElementById("particles");

    if (particleContainer) {

        const particleCount =
            window.innerWidth < 600 ? 18 : 35;

        for (let i = 0; i < particleCount; i++) {

            const particle =
                document.createElement("span");

            particle.className = "particle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.animationDuration =
                `${8 + Math.random() * 15}s`;

            particle.style.animationDelay =
                `${Math.random() * 10}s`;

            particle.style.opacity =
                `${0.2 + Math.random() * 0.5}`;

            particleContainer.appendChild(particle);

        }

    }


    /* -----------------------------------------------------
       FINAL PAGE ANIMATION
    ----------------------------------------------------- */

    if (document.body.classList.contains("final-page")) {

        setTimeout(() => {

            document.body.classList.add("loaded");

        }, 500);

    }


    /* -----------------------------------------------------
       ESCAPE KEY
    ----------------------------------------------------- */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            const lightbox =
                document.getElementById("lightbox");

            if (lightbox) {
                lightbox.classList.remove("active");
            }

        }

    });

});