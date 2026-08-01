/* =========================================================
   MEMORIES PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (
        !document.body.classList.contains(
            "memories-page"
        )
    ) {
        return;
    }


    /* -----------------------------------------------------
       START MEMORY MUSIC
    ----------------------------------------------------- */

    const startMemoryMusic = () => {

        if (window.BirthdayMusic) {

            window.BirthdayMusic.playMemories();

        }

        document.removeEventListener(
            "click",
            startMemoryMusic
        );

    };


    document.addEventListener(
        "click",
        startMemoryMusic,
        { once: true }
    );


    /* -----------------------------------------------------
       IMAGE REVEAL
    ----------------------------------------------------- */

    const cards =
        document.querySelectorAll(
            ".memory-card"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    cards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(50px)";

        card.style.transition =
            "opacity 1s ease, transform 1s ease";

        observer.observe(card);

    });

});