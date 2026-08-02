/* =========================================================
   HMT BIRTHDAY EXPERIENCE
   FINAL PAGE CONTROLLER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       REMOVE OLD LOADING / BUTTON ANIMATION STATE
    ===================================================== */

    document.body.classList.add("final-page");
    document.body.classList.add("loaded");


    /* =====================================================
       REVEAL WISHER
    ===================================================== */

    const revealWisher =
        document.getElementById("revealWisher");


    if (revealWisher) {

        revealWisher.addEventListener("click", () => {

            openWisherReveal();

        });

    }


    /* =====================================================
       MYSTERY BUTTON
       Opens the EXACT same HMT developer popup
    ===================================================== */

    const moreSecretButton =
        document.getElementById("moreSecretButton");


    if (moreSecretButton) {

        moreSecretButton.addEventListener("click", () => {

            const developerBadge =
                document.getElementById("developerBadge");


            if (developerBadge) {

                /*
                   This triggers the exact same click
                   event as pressing the HMT button.

                   Therefore:

                   - same 5 second countdown
                   - same developer screen
                   - same intro.mp3
                   - same closing behavior
                   - same memories.mp3 resume
                */

                developerBadge.click();

            }

        });

    }


    /* =====================================================
       WISHER REVEAL
    ===================================================== */

    function openWisherReveal() {

        if (
            document.querySelector(
                ".special-reveal-overlay"
            )
        ) {

            return;

        }


        const overlay =
            document.createElement("div");


        overlay.className =
            "special-reveal-overlay wisher-overlay";


        overlay.innerHTML = `

            <button
                class="special-reveal-close"
                aria-label="Close"
            >
                ×
            </button>


            <div class="special-reveal-inner">

                <div class="special-reveal-eyebrow">
                    THE PERSON BEHIND THIS
                </div>


                <div class="wisher-photo-wrap">

                    <img
                        src="../assets/images/sakshi.jpg"
                        alt="Sakshi Sharma"
                        class="wisher-photo"
                    >

                </div>


                <div class="special-reveal-small">

                    The one who wanted this
                    day to feel a little different

                </div>


                <h1 class="wisher-name">
                    SAKSHI SHARMA
                </h1>


                <div class="wisher-role">
                    YOUR BEST FRIEND
                </div>


                <div class="wisher-message">

                    Some people become a part
                    of our memories without even
                    realizing how special those
                    moments become.

                    <br><br>

                    So today, someone simply
                    wanted to make sure your
                    birthday had a little extra
                    something.

                </div>


                <div class="special-reveal-signature">

                    — with a little thought behind it

                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                overlay.classList.add(
                    "active"
                );

            });

        });


        /* CLOSE BUTTON */

        const closeButton =
            overlay.querySelector(
                ".special-reveal-close"
            );


        closeButton.addEventListener(
            "click",
            () => {

                closeSpecialOverlay(
                    overlay
                );

            }
        );


        /* CLICK OUTSIDE */

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    closeSpecialOverlay(
                        overlay
                    );

                }

            }
        );


        /* ESCAPE */

        const escapeHandler =
            event => {

                if (
                    event.key === "Escape"
                ) {

                    closeSpecialOverlay(
                        overlay
                    );


                    document.removeEventListener(
                        "keydown",
                        escapeHandler
                    );

                }

            };


        document.addEventListener(
            "keydown",
            escapeHandler
        );

    }


    /* =====================================================
       CLOSE WISHER OVERLAY
    ===================================================== */

    function closeSpecialOverlay(
        overlay
    ) {

        if (!overlay) {

            return;

        }


        overlay.classList.remove(
            "active"
        );


        setTimeout(() => {

            if (
                overlay &&
                overlay.parentNode
            ) {

                overlay.remove();

            }

        }, 700);

    }

});