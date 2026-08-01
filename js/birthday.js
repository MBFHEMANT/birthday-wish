/* =========================================================
   BIRTHDAY EXPERIENCE
   FINAL VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const blowButton =
        document.getElementById("blowButton");

    const celebrationOverlay =
        document.getElementById("celebrationOverlay");

    const candles =
        document.querySelectorAll(".candle");

    const wishText =
        document.getElementById("wishText");


    if (!blowButton) {
        return;
    }


    let alreadyBlown = false;


    /* ---------------------------------------------------------
       CREATE CONTINUE BUTTON
    --------------------------------------------------------- */

    const continueButton =
        document.createElement("a");

    continueButton.href =
        "pages/memories.html";

    continueButton.className =
        "primary-button birthday-continue-button";

    continueButton.innerHTML = `
        Continue
        <span>→</span>
    `;

    continueButton.style.opacity = "0";
    continueButton.style.visibility = "hidden";
    continueButton.style.transform =
        "translateY(15px)";

    continueButton.style.transition =
        "opacity 800ms ease, transform 800ms ease";


    /* Put button inside celebration content */

    if (celebrationOverlay) {

        const celebrationContent =
            celebrationOverlay.querySelector(
                ".celebration-content"
            );

        if (celebrationContent) {

            celebrationContent.appendChild(
                continueButton
            );

        }

    }


    /* ---------------------------------------------------------
       CONTINUE BUTTON
    --------------------------------------------------------- */

    continueButton.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            /*
               Birthday music remains playing
               until this exact moment.
            */

            if (window.BirthdayMusic) {

                await window.BirthdayMusic
                    .stopBirthday();

                /*
                   Start memories before navigation.
                   The browser interaction that clicked
                   Continue is already valid user interaction.
                */

                sessionStorage.setItem(
                    "startMemoriesMusic",
                    "true"
                );

            }

            window.location.href =
                "pages/memories.html";

        }
    );


    /* ---------------------------------------------------------
       BLOW CANDLES
    --------------------------------------------------------- */

    blowButton.addEventListener(
        "click",
        () => {

            if (alreadyBlown) {
                return;
            }

            alreadyBlown = true;


            /* BUTTON */

            blowButton.disabled = true;

            blowButton.style.transition =
                "opacity 500ms ease, transform 500ms ease";

            blowButton.style.opacity = "0";

            blowButton.style.transform =
                "translateY(10px)";


            /* WISH TEXT */

            if (wishText) {

                wishText.style.transition =
                    "600ms ease";

                wishText.style.opacity =
                    "0";

            }


            /* CANDLES */

            candles.forEach(
                (candle, index) => {

                    setTimeout(
                        () => {

                            candle.classList.add(
                                "blown"
                            );

                        },
                        index * 120
                    );

                }
            );


            /* SCREEN EFFECT */

            document.body.classList.add(
                "blowing-screen"
            );


            /*
               IMPORTANT:
               DO NOT TOUCH birthdayMusic.

               It is already playing from page load.
            */


            /* CELEBRATION */

            setTimeout(
                () => {

                    if (celebrationOverlay) {

                        celebrationOverlay.classList.add(
                            "active"
                        );

                    }

                },
                850
            );


            /* SHOW CONTINUE */

            setTimeout(
                () => {

                    continueButton.style.visibility =
                        "visible";

                    requestAnimationFrame(
                        () => {

                            continueButton.style.opacity =
                                "1";

                            continueButton.style.transform =
                                "translateY(0)";

                        }
                    );

                },
                3000
            );

        }
    );

});