/* =========================================================
   HMT BIRTHDAY EXPERIENCE
   GLOBAL MUSIC ENGINE
   FINAL MUSIC SYSTEM
========================================================= */

(function () {

    "use strict";


    /* ---------------------------------------------------------
       DETECT PAGE
    --------------------------------------------------------- */

    const path =
        window.location.pathname.toLowerCase();

    const isRootPage =
        !path.includes("/pages/");

    const pagePrefix =
        isRootPage ? "" : "../";


    /* ---------------------------------------------------------
       AUDIO PATHS
    --------------------------------------------------------- */

    const AUDIO_PATHS = {

        birthday:
            pagePrefix +
            "assets/music/birthday.mp3",

        memories:
            pagePrefix +
            "assets/music/memories.mp3",

        intro:
            pagePrefix +
            "assets/music/intro.mp3"

    };


    /* ---------------------------------------------------------
       CREATE / GET AUDIO
    --------------------------------------------------------- */

    function getAudio(
        id,
        src,
        loop = false
    ) {

        let audio =
            document.getElementById(id);


        if (!audio) {

            audio =
                document.createElement("audio");

            audio.id = id;

            audio.preload = "auto";

            audio.loop = loop;

            audio.setAttribute(
                "playsinline",
                ""
            );

            audio.style.display =
                "none";

            const source =
                document.createElement("source");

            source.src = src;

            source.type =
                "audio/mpeg";

            audio.appendChild(source);

            document.body.appendChild(
                audio
            );

        }


        audio.loop = loop;

        return audio;

    }


    /* ---------------------------------------------------------
       AUDIO OBJECTS
    --------------------------------------------------------- */

    const birthdayMusic =
        getAudio(
            "birthdayMusic",
            AUDIO_PATHS.birthday,
            true
        );


    const memoriesMusic =
        getAudio(
            "memoriesMusic",
            AUDIO_PATHS.memories,
            true
        );


    const introMusic =
        getAudio(
            "introMusic",
            AUDIO_PATHS.intro,
            true
        );


    /* ---------------------------------------------------------
       VOLUMES
    --------------------------------------------------------- */

    const VOLUME = {

        birthday: 0.65,

        memories: 0.38,

        intro: 0.48

    };


    /* ---------------------------------------------------------
       STORAGE
    --------------------------------------------------------- */

    const MEMORY_TIME_KEY =
        "hmt_memories_time";

    const MEMORY_ACTIVE_KEY =
        "hmt_memories_active";

    const BIRTHDAY_ACTIVE_KEY =
        "hmt_birthday_active";


    /* ---------------------------------------------------------
   SAFE PLAY
--------------------------------------------------------- */

async function safePlay(
    audio,
    volume
) {

    if (!audio) {
        return false;
    }


    try {

        audio.volume =
            volume;


        /*
           Make sure the browser knows the
           audio element should be played inline.
        */

        audio.setAttribute(
            "playsinline",
            ""
        );


        audio.setAttribute(
            "webkit-playsinline",
            ""
        );


        const playPromise =
            audio.play();


        /*
           Some older browsers don't return
           a Promise from play().
        */

        if (
            playPromise !== undefined
        ) {

            await playPromise;

        }


        return true;

    }

    catch (error) {

        console.log(
            "Birthday music waiting for user interaction:",
            error
        );


        return false;

    }

}

    /* ---------------------------------------------------------
       FADE OUT
    --------------------------------------------------------- */

    function fadeOut(
        audio,
        duration = 500
    ) {

        if (
            !audio ||
            audio.paused
        ) {

            return Promise.resolve();

        }


        return new Promise(resolve => {

            const startingVolume =
                audio.volume;

            const startedAt =
                performance.now();


            function animate(now) {

                const progress =
                    Math.min(
                        (now - startedAt) /
                        duration,
                        1
                    );


                audio.volume =
                    startingVolume *
                    (1 - progress);


                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                } else {

                    audio.pause();

                    audio.volume =
                        startingVolume;

                    resolve();

                }

            }


            requestAnimationFrame(
                animate
            );

        });

    }


    /* ---------------------------------------------------------
       FADE IN
    --------------------------------------------------------- */

    function fadeIn(
        audio,
        targetVolume,
        duration = 800
    ) {

        if (!audio) {

            return Promise.resolve();

        }


        audio.volume = 0;


        return new Promise(resolve => {

            const startedAt =
                performance.now();


            function animate(now) {

                const progress =
                    Math.min(
                        (now - startedAt) /
                        duration,
                        1
                    );


                audio.volume =
                    targetVolume *
                    progress;


                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                } else {

                    resolve();

                }

            }


            requestAnimationFrame(
                animate
            );

        });

    }


    /* ---------------------------------------------------------
       STOP AUDIO
    --------------------------------------------------------- */

    async function stopAudio(
        audio,
        reset = false
    ) {

        if (!audio) {

            return;

        }


        await fadeOut(
            audio,
            450
        );


        audio.pause();


        if (reset) {

            try {

                audio.currentTime = 0;

            } catch (error) {}

        }

    }


    /* ---------------------------------------------------------
       SAVE MEMORY POSITION
    --------------------------------------------------------- */

    function saveMemoryPosition() {

        if (!memoriesMusic) {

            return;

        }


        try {

            sessionStorage.setItem(
                MEMORY_TIME_KEY,
                String(
                    memoriesMusic.currentTime
                )
            );

        } catch (error) {}

    }


    /* ---------------------------------------------------------
       RESTORE MEMORY POSITION
    --------------------------------------------------------- */

    function restoreMemoryPosition() {

        if (!memoriesMusic) {

            return;

        }


        try {

            const saved =
                sessionStorage.getItem(
                    MEMORY_TIME_KEY
                );


            if (
                saved !== null &&
                !Number.isNaN(
                    Number(saved)
                )
            ) {

                memoriesMusic.currentTime =
                    Number(saved);

            }

        } catch (error) {}

    }


    /* ---------------------------------------------------------
       BIRTHDAY MUSIC
    --------------------------------------------------------- */

    async function playBirthday() {

        /*
           Birthday music must NOT be restarted
           if it is already playing.
        */

        if (
            !birthdayMusic.paused
        ) {

            return true;

        }


        await stopAudio(
            memoriesMusic,
            false
        );


        await stopAudio(
            introMusic,
            true
        );


        birthdayMusic.loop =
            true;


        const played =
            await safePlay(
                birthdayMusic,
                VOLUME.birthday
            );


        if (played) {

            sessionStorage.setItem(
                BIRTHDAY_ACTIVE_KEY,
                "true"
            );

        }


        return played;

    }


    /* ---------------------------------------------------------
       MEMORIES MUSIC
    --------------------------------------------------------- */

    async function playMemories() {

        /*
           Already playing?
           DO NOT RESTART IT.
        */

        if (
            !memoriesMusic.paused
        ) {

            return true;

        }


        await stopAudio(
            birthdayMusic,
            false
        );


        await stopAudio(
            introMusic,
            true
        );


        restoreMemoryPosition();


        memoriesMusic.loop =
            true;


        const played =
            await safePlay(
                memoriesMusic,
                VOLUME.memories
            );


        if (played) {

            sessionStorage.setItem(
                MEMORY_ACTIVE_KEY,
                "true"
            );

        }


        return played;

    }


    /* ---------------------------------------------------------
       RESUME MEMORIES
    --------------------------------------------------------- */

    async function resumeMemories() {

        if (!memoriesMusic) {

            return false;

        }


        restoreMemoryPosition();


        memoriesMusic.loop =
            true;


        const played =
            await safePlay(
                memoriesMusic,
                VOLUME.memories
            );


        if (played) {

            sessionStorage.setItem(
                MEMORY_ACTIVE_KEY,
                "true"
            );

        }


        return played;

    }


    /* ---------------------------------------------------------
       DEVELOPER / HMT MUSIC
    --------------------------------------------------------- */

    async function playDeveloperMusic() {

        /*
           Save exact memories position
           before stopping it.
        */

        saveMemoryPosition();


        if (
            memoriesMusic &&
            !memoriesMusic.paused
        ) {

            await fadeOut(
                memoriesMusic,
                450
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


        introMusic.loop =
            true;


        const played =
            await safePlay(
                introMusic,
                VOLUME.intro
            );


        /*
           If autoplay is blocked here, the HMT
           button itself was already a user click,
           so this should normally succeed.
        */

        if (!played) {

            try {

                await introMusic.play();

            } catch (error) {}

        }


        return played;

    }


    /* ---------------------------------------------------------
       CLOSE DEVELOPER
    --------------------------------------------------------- */

    async function closeDeveloperMusic() {

        await stopAudio(
            introMusic,
            true
        );


        /*
           Always restore memories after HMT.
        */

        restoreMemoryPosition();


        await resumeMemories();

    }


 /* ---------------------------------------------------------
   START BIRTHDAY ON ROOT PAGE
--------------------------------------------------------- */

async function startRootMusic() {

    if (!isRootPage) {
        return;
    }


    /*
       =====================================================
       FIRST ATTEMPT
       =====================================================

       Desktop browsers may allow this immediately.

       Mobile browsers may reject it because there has
       not yet been a user interaction.
    */

    birthdayMusic.loop = true;

    birthdayMusic.volume =
        VOLUME.birthday;


    try {

        const firstAttempt =
            birthdayMusic.play();

        if (
            firstAttempt !== undefined
        ) {

            await firstAttempt;

        }


        /*
           If it worked, clean up the other
           possible music sources.
        */

        sessionStorage.setItem(
            BIRTHDAY_ACTIVE_KEY,
            "true"
        );


        await stopAudio(
            memoriesMusic,
            false
        );


        await stopAudio(
            introMusic,
            true
        );


        return true;

    }

    catch (error) {

        /*
           Mobile browser blocked autoplay.

           THIS IS NORMAL.

           We now wait for the user's first
           real interaction.
        */

        console.log(
            "Birthday autoplay blocked. Waiting for user interaction."
        );

    }


    /* =====================================================
       MOBILE UNLOCK
       ===================================================== */

    let unlocked = false;


    const unlockBirthday =
        () => {

            if (unlocked) {
                return;
            }


            unlocked = true;


            /*
               =================================================
               VERY IMPORTANT

               DO NOT await anything before play().

               play() must happen directly inside the
               user gesture.
               =================================================
            */

            birthdayMusic.loop = true;

            birthdayMusic.volume =
                VOLUME.birthday;


            const playPromise =
                birthdayMusic.play();


            if (
                playPromise !== undefined
            ) {

                playPromise
                    .then(() => {

                        sessionStorage.setItem(
                            BIRTHDAY_ACTIVE_KEY,
                            "true"
                        );


                        /*
                           Only AFTER birthday has successfully
                           started do we clean up the other audio.
                        */

                        stopAudio(
                            memoriesMusic,
                            false
                        );


                        stopAudio(
                            introMusic,
                            true
                        );

                    })
                    .catch(error => {

                        console.log(
                            "Birthday music could not start:",
                            error
                        );


                        /*
                           Allow another interaction to
                           try again.
                        */

                        unlocked = false;

                    });

            }

        };


    /* =====================================================
       LISTEN FOR REAL MOBILE GESTURE
       ===================================================== */

    document.addEventListener(
        "touchstart",
        unlockBirthday,
        {
            once: true,
            passive: true
        }
    );


    document.addEventListener(
        "pointerdown",
        unlockBirthday,
        {
            once: true,
            passive: true
        }
    );


    document.addEventListener(
        "click",
        unlockBirthday,
        {
            once: true
        }
    );


    document.addEventListener(
        "keydown",
        unlockBirthday,
        {
            once: true
        }
    );


    return false;

}


        /*
           touchstart
           ----------
           Fallback for older mobile browsers.
        */

        document.addEventListener(
            "touchstart",
            unlockBirthdayMusic,
            {
                once: true,
                passive: true
            }
        );


        /*
           click
           -----
           Additional fallback.
        */

        document.addEventListener(
            "click",
            unlockBirthdayMusic,
            {
                once: true
            }
        );


        /*
           Keyboard fallback for desktop.
        */

        document.addEventListener(
            "keydown",
            unlockBirthdayMusic,
            {
                once: true
            }
        );

    }

}


    /* ---------------------------------------------------------
       START MEMORIES ON INNER PAGES
    --------------------------------------------------------- */

    async function startInnerPageMusic() {

        if (isRootPage) {

            return;

        }


        /*
           Every chapter is now responsible for
           continuing memories.mp3.

           This is why music.js MUST be loaded
           on every chapter.
        */

        const played =
            await resumeMemories();


        /*
           Browser fallback.

           The visitor has normally arrived here
           by clicking a chapter button, so this
           gives the browser another valid gesture.
        */

        if (!played) {

            const retry =
                async () => {

                    await resumeMemories();

                    removeRetry();

                };


            document.addEventListener(
                "pointerdown",
                retry,
                {
                    once: true,
                    passive: true
                }
            );


            document.addEventListener(
                "keydown",
                retry,
                {
                    once: true
                }
            );


            function removeRetry() {

                document.removeEventListener(
                    "pointerdown",
                    retry
                );

                document.removeEventListener(
                    "keydown",
                    retry
                );

            }

        }

    }


    /* ---------------------------------------------------------
       SAVE MUSIC BEFORE PAGE CHANGE
    --------------------------------------------------------- */

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "a[href]"
                );


            if (!link) {

                return;

            }


            const href =
                link.getAttribute("href");


            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("http")
            ) {

                return;

            }


            if (
                !memoriesMusic.paused
            ) {

                saveMemoryPosition();

            }

        },
        true
    );


    /* ---------------------------------------------------------
       SAVE PERIODICALLY
    --------------------------------------------------------- */

    setInterval(
        () => {

            if (
                memoriesMusic &&
                !memoriesMusic.paused
            ) {

                saveMemoryPosition();

            }

        },
        1000
    );


    /* ---------------------------------------------------------
       SAVE BEFORE LEAVING
    --------------------------------------------------------- */

    window.addEventListener(
        "pagehide",
        saveMemoryPosition
    );


    window.addEventListener(
        "beforeunload",
        saveMemoryPosition
    );


    /* ---------------------------------------------------------
       INITIALIZE
    --------------------------------------------------------- */

    if (isRootPage) {

        window.addEventListener(
            "load",
            () => {

                setTimeout(
                    startRootMusic,
                    150
                );

            }
        );

    } else {

        window.addEventListener(
            "load",
            () => {

                setTimeout(
                    startInnerPageMusic,
                    100
                );

            }
        );

    }


    /* ---------------------------------------------------------
       PUBLIC API
    --------------------------------------------------------- */

    window.BirthdayMusic = {

        playBirthday,

        playMemories,

        resumeMemories,

        playDeveloperMusic,

        closeDeveloperMusic,

        saveMemoryPosition,

        stopBirthday:
            () =>
                stopAudio(
                    birthdayMusic,
                    false
                ),

        stopMemories:
            () => {

                saveMemoryPosition();

                return stopAudio(
                    memoriesMusic,
                    false
                );

            }

    };

})();