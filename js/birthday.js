/* =========================================================
   BIRTHDAY EXPERIENCE
   FINAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const blowButton =
            document.getElementById(
                "blowButton"
            );

        const celebrationOverlay =
            document.getElementById(
                "celebrationOverlay"
            );

        const candles =
            document.querySelectorAll(
                ".candle"
            );

        const wishText =
            document.getElementById(
                "wishText"
            );


        if (!blowButton) {

            return;

        }


        let alreadyBlown =
            false;


        /* -----------------------------------------------------
           CONTINUE BUTTON
        ----------------------------------------------------- */

        const continueButton =
            document.createElement(
                "a"
            );


        continueButton.href =
            "pages/memories.html";


        continueButton.className =
            "primary-button birthday-continue-button";


        continueButton.innerHTML = `
            Continue
            <span>→</span>
        `;


        continueButton.style.opacity =
            "0";

        continueButton.style.visibility =
            "hidden";

        continueButton.style.transform =
            "translateY(15px)";


        continueButton.style.transition =
            "opacity .8s ease, transform .8s ease";


        const celebrationContent =
            celebrationOverlay
                ?.querySelector(
                    ".celebration-content"
                );


        if (celebrationContent) {

            celebrationContent.appendChild(
                continueButton
            );

        }


        /* -----------------------------------------------------
           CONTINUE
        ----------------------------------------------------- */

        continueButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                /*
                   Birthday music stops ONLY here.

                   This is exactly what we want.
                */

                if (
                    window.BirthdayMusic
                ) {

                    await window.BirthdayMusic
                        .stopBirthday();

                }


                /*
                   Tell Chapter 2 that memories
                   should start.
                */

                sessionStorage.setItem(
                    "hmt_memories_started",
                    "true"
                );


                window.location.href =
                    "pages/memories.html";

            }
        );


        /* -----------------------------------------------------
           BLOW CANDLES
        ----------------------------------------------------- */

        blowButton.addEventListener(
            "click",
            () => {

                if (alreadyBlown) {

                    return;

                }


                alreadyBlown =
                    true;


                blowButton.disabled =
                    true;


                blowButton.style.transition =
                    "opacity .5s ease, transform .5s ease";


                blowButton.style.opacity =
                    "0";


                blowButton.style.transform =
                    "translateY(10px)";


                if (wishText) {

                    wishText.style.transition =
                        "opacity .6s ease";

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
                            index * 100
                        );

                    }
                );


                /* EFFECT */

                document.body.classList.add(
                    "blowing-screen"
                );


                /*
                   IMPORTANT:

                   DO NOT START OR RESTART MUSIC HERE.

                   birthday.mp3 is already supposed
                   to be playing from page opening.
                */


                /* CELEBRATION */

                setTimeout(
                    () => {

                        if (
                            celebrationOverlay
                        ) {

                            celebrationOverlay.classList.add(
                                "active"
                            );

                        }

                    },
                    800
                );


                /* CONTINUE BUTTON */

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
                    2800
                );

            }
        );

    }
);