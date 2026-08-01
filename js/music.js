/* =========================================================
   MUSIC CONTROLLER
========================================================= */

(function () {

    const introMusic =
        document.getElementById("introMusic");

    const birthdayMusic =
        document.getElementById("birthdayMusic");

    const memoriesMusic =
        document.getElementById("memoriesMusic");


    const fadeAudio = (
        audio,
        targetVolume,
        duration = 1000
    ) => {

        if (!audio) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {

            const startVolume =
                audio.volume;

            const difference =
                targetVolume - startVolume;

            const start =
                performance.now();


            function step(now) {

                const progress =
                    Math.min(
                        (now - start) / duration,
                        1
                    );

                audio.volume =
                    startVolume +
                    difference * progress;


                if (progress < 1) {

                    requestAnimationFrame(step);

                } else {

                    resolve();

                }

            }

            requestAnimationFrame(step);

        });

    };


    const stopAudio = async (audio) => {

        if (!audio) {
            return;
        }

        await fadeAudio(audio, 0, 700);

        audio.pause();

        audio.currentTime = 0;

    };


    const playAudio = async (
        audio,
        volume = 0.6
    ) => {

        if (!audio) {
            return;
        }

        audio.volume = 0;

        try {

            await audio.play();

            await fadeAudio(
                audio,
                volume,
                1000
            );

        } catch (error) {

            console.log(
                "Audio playback waiting for user interaction."
            );

        }

    };


    window.BirthdayMusic = {

        async playIntro() {

            if (birthdayMusic) {
                await stopAudio(birthdayMusic);
            }

            await playAudio(
                introMusic,
                0.45
            );

        },


        async playBirthday() {

            await stopAudio(introMusic);

            await playAudio(
                birthdayMusic,
                0.65
            );

        },


        async playMemories() {

            await stopAudio(introMusic);
            await stopAudio(birthdayMusic);

            await playAudio(
                memoriesMusic,
                0.35
            );

        }

    };


    /* -----------------------------------------------------
       START INTRO MUSIC AFTER FIRST INTERACTION
    ----------------------------------------------------- */

    if (introMusic) {

        const startMusic =
            () => {

                if (
                    introMusic.paused &&
                    !sessionStorage.getItem(
                        "birthdayIntroPlayed"
                    )
                ) {

                    window.BirthdayMusic.playIntro();

                    sessionStorage.setItem(
                        "birthdayIntroPlayed",
                        "true"
                    );

                }

                document.removeEventListener(
                    "click",
                    startMusic
                );

                document.removeEventListener(
                    "touchstart",
                    startMusic
                );

            };


        document.addEventListener(
            "click",
            startMusic,
            { once: true }
        );

        document.addEventListener(
            "touchstart",
            startMusic,
            { once: true }
        );

    }


})();