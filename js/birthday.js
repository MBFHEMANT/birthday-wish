/* =========================================================
   BIRTHDAY EXPERIENCE
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


    blowButton.addEventListener("click", async () => {

        if (alreadyBlown) {
            return;
        }

        alreadyBlown = true;


        /* ---------------------------------------------
           BUTTON
        --------------------------------------------- */

        blowButton.disabled = true;

        blowButton.style.opacity = "0";

        blowButton.style.transform = "translateY(10px)";


        /* ---------------------------------------------
           WISH TEXT
        --------------------------------------------- */

        if (wishText) {

            wishText.style.transition = "600ms ease";

            wishText.style.opacity = "0";

        }


        /* ---------------------------------------------
           CANDLES
        --------------------------------------------- */

        candles.forEach((candle, index) => {

            setTimeout(() => {

                candle.classList.add("blown");

            }, index * 100);

        });


        /* ---------------------------------------------
           BLOW EFFECT
        --------------------------------------------- */

        document.body.classList.add("blowing-screen");


        /* ---------------------------------------------
           MUSIC
        --------------------------------------------- */

        if (window.BirthdayMusic) {

            await window.BirthdayMusic.playBirthday();

        }


        /* ---------------------------------------------
           CELEBRATION
        --------------------------------------------- */

        setTimeout(() => {

            if (celebrationOverlay) {

                celebrationOverlay.classList.add("active");

            }

        }, 800);


        /* ---------------------------------------------
           NEXT PAGE
        --------------------------------------------- */

        setTimeout(() => {

            window.location.href =
                "pages/memories.html";

        }, 6500);

    });

});