/* =========================================================
   HMT DEVELOPER EXPERIENCE
   FINAL VERSION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const badge =
            document.getElementById(
                "developerBadge"
            );


        if (!badge) {
            return;
        }


        /* -----------------------------------------------------
           PATH
        ----------------------------------------------------- */

        const isRootPage =
            !window.location.pathname.includes(
                "/pages/"
            );

        const developerPhotoPath =
            isRootPage
                ? "assets/developer/hmt-photo.jpg"
                : "../assets/developer/hmt-photo.jpg";


        /* -----------------------------------------------------
           IMPROVE THE BUTTON
        ----------------------------------------------------- */

        badge.innerHTML = `
            <span class="developer-star">✦</span>

            <span class="developer-badge-copy">
                <small>BUILT BY</small>
                <strong>HMT</strong>
            </span>

            <span class="developer-arrow">↗</span>
        `;


        /* -----------------------------------------------------
           CREATE OVERLAY
        ----------------------------------------------------- */

        const overlay =
            document.createElement(
                "div"
            );

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

                    <div class="developer-card-topline">
                        THE PERSON BEHIND THE SCREEN
                    </div>


                    <img
                        src="${developerPhotoPath}"
                        class="developer-photo"
                        alt="HMT Develops"
                    >


                    <div class="developer-eyebrow">
                        Website Developed & Coded By
                    </div>


                    <h2>
                        HMT
                        <span>DEVELOPS</span>
                    </h2>


                    <div class="developer-divider"></div>


                    <p class="developer-message">

                        Some people come into our lives,
                        give us beautiful moments,
                        and eventually become strangers.

                        Sometimes, those moments even turn
                        into reasons to dislike them.

                        But perhaps we should never forget
                        that, once upon a time, they were the
                        very people whose presence made our
                        lives feel a little more complete.

                    </p>


                    <div class="developer-rights">
                        Website Developed & Coded by HMT Develops
                        <br>
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


        let countdownInterval =
            null;


        /* -----------------------------------------------------
           OPEN
        ----------------------------------------------------- */

        badge.addEventListener(
            "click",
            async () => {

                if (
                    overlay.classList.contains(
                        "active"
                    )
                ) {

                    return;

                }


                /* MUSIC */

                if (
                    window.BirthdayMusic
                ) {

                    await window.BirthdayMusic
                        .playDeveloperMusic();

                }


                /* SCREEN */

                document.body.classList.add(
                    "developer-open"
                );

                document.body.style.overflow =
                    "hidden";


                overlay.classList.add(
                    "active"
                );


                /* RESET */

                if (countdownInterval) {

                    clearInterval(
                        countdownInterval
                    );

                }


                let count = 5;

                countdown.textContent =
                    count;

                countdown.style.display =
                    "block";


                card.style.display =
                    "none";


                /* COUNTDOWN */

                countdownInterval =
                    setInterval(
                        () => {

                            count--;


                            if (count > 0) {

                                countdown.textContent =
                                    count;

                            } else {

                                clearInterval(
                                    countdownInterval
                                );

                                countdownInterval =
                                    null;


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

        async function closeDeveloper() {

            if (
                countdownInterval
            ) {

                clearInterval(
                    countdownInterval
                );

                countdownInterval =
                    null;

            }


            overlay.classList.remove(
                "active"
            );


            document.body.classList.remove(
                "developer-open"
            );


            document.body.style.overflow =
                "";


            if (
                window.BirthdayMusic
            ) {

                await window.BirthdayMusic
                    .closeDeveloperMusic();

            }

        }


        close.addEventListener(
            "click",
            closeDeveloper
        );


        /* -----------------------------------------------------
           ESCAPE
        ----------------------------------------------------- */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    overlay.classList.contains(
                        "active"
                    )
                ) {

                    closeDeveloper();

                }

            }
        );

    }
);