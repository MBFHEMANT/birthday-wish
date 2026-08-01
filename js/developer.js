/* =========================================================
   HMT DEVELOPER EASTER EGG
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const badge =
        document.getElementById(
            "developerBadge"
        );


    if (!badge) {
        return;
    }


    /* -----------------------------------------------------
       CREATE OVERLAY
    ----------------------------------------------------- */

    const overlay =
        document.createElement("div");

    overlay.className =
        "developer-overlay";


    overlay.innerHTML = `

        <button
            class="developer-close"
            aria-label="Close developer information"
        >
            ×
        </button>


        <div class="developer-content">

            <div class="developer-countdown">
                5
            </div>

            <div class="developer-card">

                <img
                    src="../assets/developer/hmt-photo.jpg"
                    class="developer-photo"
                    alt="HMT Develops"
                >

                <div class="developer-eyebrow">
                    Website Developed & Coded By
                </div>

                <h2>
                    HMT <span>DEVELOPS</span>
                </h2>

                <div class="developer-rights">
                    All Rights Reserved
                </div>

                <div class="developer-contact">

                    <p>
                        Need a website?
                    </p>

                    <a
                        href="https://www.instagram.com/hemant.s__07/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="instagram-link"
                    >
                        @hemant.s__07
                    </a>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const countdown =
        overlay.querySelector(
            ".developer-countdown"
        );

    const card =
        overlay.querySelector(
            ".developer-card"
        );

    const close =
        overlay.querySelector(
            ".developer-close"
        );


    card.style.display =
        "none";


    /* -----------------------------------------------------
       OPEN
    ----------------------------------------------------- */

    badge.addEventListener(
        "click",
        () => {

            overlay.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";


            let count = 5;

            countdown.textContent =
                count;


            countdown.style.display =
                "block";

            card.style.display =
                "none";


            const interval =
                setInterval(
                    () => {

                        count--;

                        if (count > 0) {

                            countdown.textContent =
                                count;

                        } else {

                            clearInterval(
                                interval
                            );


                            countdown.style.display =
                                "none";


                            card.style.display =
                                "block";


                            card.style.animation =
                                "revealScale 1s forwards";

                        }

                    },
                    1000
                );

        }
    );


    /* -----------------------------------------------------
       CLOSE
    ----------------------------------------------------- */

    close.addEventListener(
        "click",
        () => {

            overlay.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

        }
    );

});