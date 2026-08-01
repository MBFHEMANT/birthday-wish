/* =========================================================
   HMT BIRTHDAY EXPERIENCE
   GLOBAL MUSIC CONTROLLER
   FINAL VERSION
========================================================= */

(function () {

    const STORAGE_KEY = "hmtBirthdayMusicState";

    let birthdayMusic = document.getElementById("birthdayMusic");
    let memoriesMusic = document.getElementById("memoriesMusic");
    let introMusic = document.getElementById("introMusic");

    const isRootPage =
        !window.location.pathname.includes("/pages/");

    const assetPrefix = isRootPage ? "" : "../";

    /* ---------------------------------------------------------
       CREATE MISSING AUDIO ELEMENTS
    --------------------------------------------------------- */

    function createAudioIfMissing(id, src, loop = false) {

        let audio = document.getElementById(id);

        if (audio) {
            return audio;
        }

        audio = document.createElement("audio");

        audio.id = id;
        audio.preload = "auto";
        audio.loop = loop;

        const source = document.createElement("source");
        source.src = assetPrefix + src;
        source.type = "audio/mpeg";

        audio.appendChild(source);
        document.body.appendChild(audio);

        return audio;
    }


    /* ---------------------------------------------------------
       AUDIO ELEMENTS
    --------------------------------------------------------- */

    if (!birthdayMusic && isRootPage) {
        birthdayMusic = createAudioIfMissing(
            "birthdayMusic",
            "assets/music/birthday.mp3"
        );
    }

    if (!memoriesMusic && !isRootPage) {
        memoriesMusic = createAudioIfMissing(
            "memoriesMusic",
            "assets/music/memories.mp3",
            true
        );
    }

    if (!introMusic) {
        introMusic = createAudioIfMissing(
            "introMusic",
            "assets/music/intro.mp3"
        );
    }


    /* ---------------------------------------------------------
       VOLUME
    --------------------------------------------------------- */

    const BIRTHDAY_VOLUME = 0.65;
    const MEMORIES_VOLUME = 0.38;
    const INTRO_VOLUME = 0.48;


    /* ---------------------------------------------------------
       FADE
    --------------------------------------------------------- */

    function fadeAudio(audio, targetVolume, duration = 700) {

        if (!audio) {
            return Promise.resolve();
        }

        return new Promise(resolve => {

            const startVolume = audio.volume;
            const difference = targetVolume - startVolume;
            const startTime = performance.now();

            function step(now) {

                const progress =
                    Math.min(
                        (now - startTime) / duration,
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

    }


    /* ---------------------------------------------------------
       STOP
    --------------------------------------------------------- */

    async function stopAudio(audio, reset = true) {

        if (!audio) {
            return;
        }

        try {

            await fadeAudio(
                audio,
                0,
                500
            );

        } catch (error) {}

        audio.pause();

        if (reset) {
            audio.currentTime = 0;
        }

    }


    /* ---------------------------------------------------------
       PLAY
    --------------------------------------------------------- */

    async function playAudio(audio, volume) {

        if (!audio) {
            return false;
        }

        audio.volume = 0;

        try {

            await audio.play();

            await fadeAudio(
                audio,
                volume,
                900
            );

            return true;

        } catch (error) {

            return false;

        }

    }


    /* ---------------------------------------------------------
       SAVE MEMORY MUSIC POSITION
    --------------------------------------------------------- */

    function saveMemoriesPosition() {

        if (!memoriesMusic) {
            return;
        }

        try {

            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    currentTime: memoriesMusic.currentTime,
                    wasPlaying: !memoriesMusic.paused
                })
            );

        } catch (error) {}

    }


    /* ---------------------------------------------------------
       GET SAVED POSITION
    --------------------------------------------------------- */

    function getSavedMemoriesPosition() {

        try {

            const data =
                sessionStorage.getItem(
                    STORAGE_KEY
                );

            if (!data) {
                return null;
            }

            return JSON.parse(data);

        } catch (error) {

            return null;

        }

    }


    /* ---------------------------------------------------------
       RESTORE MEMORY POSITION
    --------------------------------------------------------- */

    function restoreMemoriesPosition() {

        if (!memoriesMusic) {
            return;
        }

        const saved =
            getSavedMemoriesPosition();

        if (
            saved &&
            typeof saved.currentTime === "number"
        ) {

            try {

                memoriesMusic.currentTime =
                    saved.currentTime;

            } catch (error) {}

        }

    }


    /* ---------------------------------------------------------
       BIRTHDAY MUSIC
    --------------------------------------------------------- */

    async function playBirthday() {

        if (!birthdayMusic) {
            return;
        }

        await stopAudio(
            introMusic,
            true
        );

        await stopAudio(
            memoriesMusic,
            false
        );

        birthdayMusic.loop = true;

        await playAudio(
            birthdayMusic,
            BIRTHDAY_VOLUME
        );

    }


    /* ---------------------------------------------------------
       MEMORIES MUSIC
    --------------------------------------------------------- */

    async function playMemories() {

        if (!memoriesMusic) {
            return;
        }

        await stopAudio(
            birthdayMusic,
            false
        );

        await stopAudio(
            introMusic,
            true
        );

        restoreMemoriesPosition();

        memoriesMusic.loop = true;

        await playAudio(
            memoriesMusic,
            MEMORIES_VOLUME
        );

    }


    /* ---------------------------------------------------------
       RESUME MEMORIES
    --------------------------------------------------------- */

    async function resumeMemories() {

        if (!memoriesMusic) {
            return;
        }

        restoreMemoriesPosition();

        memoriesMusic.loop = true;

        await playAudio(
            memoriesMusic,
            MEMORIES_VOLUME
        );

    }


    /* ---------------------------------------------------------
       DEVELOPER MUSIC
    --------------------------------------------------------- */

    async function playDeveloperMusic() {

        saveMemoriesPosition();

        if (memoriesMusic) {

            await fadeAudio(
                memoriesMusic,
                0,
                500
            );

            memoriesMusic.pause();

        }

        await stopAudio(
            birthdayMusic,
            false
        );

        await stopAudio(
            introMusic,
            true
        );

        await playAudio(
            introMusic,
            INTRO_VOLUME
        );

    }


    /* ---------------------------------------------------------
       CLOSE DEVELOPER MUSIC
    --------------------------------------------------------- */

    async function closeDeveloperMusic() {

        await stopAudio(
            introMusic,
            true
        );

        if (memoriesMusic) {

            restoreMemoriesPosition();

            memoriesMusic.loop = true;

            await playAudio(
                memoriesMusic,
                MEMORIES_VOLUME
            );

        }

    }


    /* ---------------------------------------------------------
       FIRST INTERACTION FALLBACK
    --------------------------------------------------------- */

    function tryStartBirthdayMusic() {

        if (!isRootPage) {
            return;
        }

        if (
            birthdayMusic &&
            birthdayMusic.paused
        ) {

            playBirthday();

        }

    }


    /* ---------------------------------------------------------
       ROOT PAGE: START BIRTHDAY MUSIC
    --------------------------------------------------------- */

    if (isRootPage) {

        window.addEventListener(
            "load",
            () => {

                setTimeout(
                    () => {

                        playBirthday();

                    },
                    250
                );

            }
        );


        document.addEventListener(
            "pointerdown",
            tryStartBirthdayMusic,
            { once: true }
        );


        document.addEventListener(
            "keydown",
            tryStartBirthdayMusic,
            { once: true }
        );

    }


    /* ---------------------------------------------------------
       INNER PAGES: RESTORE MEMORIES MUSIC
    --------------------------------------------------------- */

    if (!isRootPage) {

        window.addEventListener(
            "load",
            () => {

                setTimeout(
                    () => {

                        resumeMemories();

                    },
                    250
                );

            }
        );


        document.addEventListener(
            "pointerdown",
            () => {

                if (
                    memoriesMusic &&
                    memoriesMusic.paused
                ) {

                    resumeMemories();

                }

            },
            { once: true }
        );

    }


    /* ---------------------------------------------------------
       SAVE BEFORE LEAVING PAGE
    --------------------------------------------------------- */

    window.addEventListener(
        "beforeunload",
        saveMemoriesPosition
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState === "hidden"
            ) {

                saveMemoriesPosition();

            }

        }
    );


    /* ---------------------------------------------------------
       PUBLIC API
    --------------------------------------------------------- */

    window.BirthdayMusic = {

        playBirthday,

        playMemories,

        resumeMemories,

        playDeveloperMusic,

        closeDeveloperMusic,

        saveMemoriesPosition,

        stopBirthday: async function () {

            await stopAudio(
                birthdayMusic,
                false
            );

        },

        stopMemories: async function () {

            saveMemoriesPosition();

            await stopAudio(
                memoriesMusic,
                false
            );

        }

    };

})();