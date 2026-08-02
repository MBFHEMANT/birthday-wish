/* =========================================================
   HMT BIRTHDAY EXPERIENCE
   GLOBAL MUSIC ENGINE
   FINAL STABLE VERSION
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       PAGE DETECTION
    ===================================================== */

    const path =
        window.location.pathname.toLowerCase();


    const isRootPage =
        !path.includes("/pages/");


    /*
       ROOT:
       /index.html
       /


       INNER:
       /pages/memories.html
       /pages/journey.html
       /pages/gallery.html
       /pages/final.html
    */

    const pagePrefix =
        isRootPage
            ? ""
            : "../";


    /* =====================================================
       AUDIO PATHS
    ===================================================== */

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


    console.log(
        "HMT Music Engine:",
        isRootPage
            ? "ROOT PAGE"
            : "INNER PAGE"
    );

    console.log(
        "Birthday:",
        AUDIO_PATHS.birthday
    );

    console.log(
        "Memories:",
        AUDIO_PATHS.memories
    );

    console.log(
        "Intro:",
        AUDIO_PATHS.intro
    );


    /* =====================================================
       VOLUME
    ===================================================== */

    const VOLUME = {

        birthday: 0.65,

        /*
           Increased from the old 0.38
           as requested.
        */

        memories: 0.99,

        intro: 0.48

    };


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const MEMORY_TIME_KEY =
        "hmt_memories_time";


    const MEMORY_ACTIVE_KEY =
        "hmt_memories_active";


    const BIRTHDAY_ACTIVE_KEY =
        "hmt_birthday_active";


    /* =====================================================
       CREATE AUDIO ELEMENT
    ===================================================== */

    function createAudio(
        id,
        src,
        loop
    ) {

        let audio =
            document.getElementById(id);


        /*
           If another script/page already created it,
           use that element.
        */

        if (!audio) {

            audio =
                document.createElement(
                    "audio"
                );

            audio.id = id;

            audio.preload = "auto";

            audio.setAttribute(
                "playsinline",
                ""
            );

            audio.setAttribute(
                "webkit-playsinline",
                ""
            );

            audio.style.display =
                "none";


            document.body.appendChild(
                audio
            );

        }


        audio.loop =
            loop;


        /*
           IMPORTANT:
           Set src directly.

           This is more reliable than dynamically
           creating a <source> element on some
           mobile browsers.
        */

        if (
            !audio.src ||
            !audio.src.includes(
                src
            )
        ) {

            audio.src = src;

        }


        audio.preload =
            "auto";


        audio.setAttribute(
            "playsinline",
            ""
        );


        audio.setAttribute(
            "webkit-playsinline",
            ""
        );


        return audio;

    }


    /* =====================================================
       AUDIO OBJECTS
    ===================================================== */

    const birthdayMusic =
        createAudio(
            "birthdayMusic",
            AUDIO_PATHS.birthday,
            true
        );


    const memoriesMusic =
        createAudio(
            "memoriesMusic",
            AUDIO_PATHS.memories,
            true
        );


    const introMusic =
        createAudio(
            "introMusic",
            AUDIO_PATHS.intro,
            true
        );


    /* =====================================================
       AUDIO ERROR DEBUGGING
    ===================================================== */

    [
        birthdayMusic,
        memoriesMusic,
        introMusic

    ].forEach(audio => {

        if (!audio) {
            return;
        }


        audio.addEventListener(
            "error",
            () => {

                console.error(
                    "HMT AUDIO ERROR:",
                    audio.id,
                    audio.src,
                    audio.error
                );

            }
        );


        audio.addEventListener(
            "canplay",
            () => {

                console.log(
                    "HMT AUDIO READY:",
                    audio.id
                );

            }
        );

    });


    /* =====================================================
       MEMORY POSITION
    ===================================================== */

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

        }

        catch (error) {

            console.warn(
                "Could not save memory position."
            );

        }

    }


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
                saved !== null
            ) {

                const time =
                    Number(saved);


                if (
                    Number.isFinite(
                        time
                    ) &&
                    time >= 0
                ) {

                    memoriesMusic.currentTime =
                        time;

                }

            }

        }

        catch (error) {

            console.warn(
                "Could not restore memory position."
            );

        }

    }


    /* =====================================================
       HARD STOP
    ===================================================== */

    function hardStop(
        audio,
        reset = false
    ) {

        if (!audio) {
            return;
        }


        try {

            audio.pause();

        }

        catch (error) {}


        if (reset) {

            try {

                audio.currentTime =
                    0;

            }

            catch (error) {}

        }

    }


    /* =====================================================
       FADE OUT
    ===================================================== */

    function fadeOut(
        audio,
        duration = 450
    ) {

        if (
            !audio ||
            audio.paused
        ) {

            return Promise.resolve();

        }


        const startVolume =
            audio.volume;


        if (
            startVolume <= 0
        ) {

            hardStop(audio);

            return Promise.resolve();

        }


        return new Promise(
            resolve => {

                const started =
                    performance.now();


                function animate(
                    now
                ) {

                    const progress =
                        Math.min(
                            (
                                now -
                                started
                            ) /
                            duration,
                            1
                        );


                    audio.volume =
                        startVolume *
                        (
                            1 -
                            progress
                        );


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            animate
                        );

                    }

                    else {

                        hardStop(
                            audio
                        );


                        audio.volume =
                            startVolume;


                        resolve();

                    }

                }


                requestAnimationFrame(
                    animate
                );

            }
        );

    }


    /* =====================================================
       FADE IN
    ===================================================== */

    function fadeIn(
        audio,
        targetVolume,
        duration = 700
    ) {

        if (!audio) {

            return Promise.resolve();

        }


        audio.volume =
            0;


        return new Promise(
            resolve => {

                const started =
                    performance.now();


                function animate(
                    now
                ) {

                    const progress =
                        Math.min(
                            (
                                now -
                                started
                            ) /
                            duration,
                            1
                        );


                    audio.volume =
                        targetVolume *
                        progress;


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            animate
                        );

                    }

                    else {

                        audio.volume =
                            targetVolume;


                        resolve();

                    }

                }


                requestAnimationFrame(
                    animate
                );

            }
        );

    }


    /* =====================================================
       PLAY IMMEDIATELY
       
       IMPORTANT:
       There is NO await before audio.play().
       
       This is what makes it compatible with a
       real mobile user gesture.
    ===================================================== */

    function playImmediately(
        audio,
        volume
    ) {

        if (!audio) {

            return false;

        }


        audio.loop =
            true;


        audio.volume =
            volume;


        audio.muted =
            false;


        try {

            const promise =
                audio.play();


            /*
               play() returns a Promise
               in modern browsers.
            */

            if (
                promise &&
                typeof promise.then ===
                    "function"
            ) {

                promise
                    .then(() => {

                        console.log(
                            "HMT MUSIC PLAYING:",
                            audio.id
                        );

                    })
                    .catch(error => {

                        console.warn(
                            "HMT MUSIC BLOCKED:",
                            audio.id,
                            error
                        );

                    });

            }


            return true;

        }

        catch (error) {

            console.warn(
                "HMT MUSIC PLAY ERROR:",
                audio.id,
                error
            );


            return false;

        }

    }


    /* =====================================================
       STOP ALL EXCEPT
    ===================================================== */

    function stopOtherMusic(
        except
    ) {

        if (
            birthdayMusic !== except
        ) {

            hardStop(
                birthdayMusic
            );

        }


        if (
            memoriesMusic !== except
        ) {

            hardStop(
                memoriesMusic
            );

        }


        if (
            introMusic !== except
        ) {

            hardStop(
                introMusic,
                true
            );

        }

    }


    /* =====================================================
       PLAY BIRTHDAY
    ===================================================== */

    function playBirthday() {

        if (
            !birthdayMusic
        ) {

            return false;

        }


        /*
           If birthday is already playing,
           DO NOT restart it.
        */

        if (
            !birthdayMusic.paused
        ) {

            return true;

        }


        /*
           CRITICAL:

           Play birthday FIRST.

           Do not await anything before this.

           This function can be called directly
           from the Blow Candle button.
        */

        birthdayMusic.loop =
            true;


        birthdayMusic.volume =
            VOLUME.birthday;


        const started =
            playImmediately(
                birthdayMusic,
                VOLUME.birthday
            );


        if (!started) {

            return false;

        }


        /*
           Once play() has been requested,
           stop the other tracks.

           We don't wait for these operations
           before calling play().
        */

        hardStop(
            memoriesMusic
        );


        hardStop(
            introMusic,
            true
        );


        try {

            sessionStorage.setItem(
                BIRTHDAY_ACTIVE_KEY,
                "true"
            );

        }

        catch (error) {}


        return true;

    }


    /* =====================================================
       PLAY MEMORIES
    ===================================================== */

    function playMemories() {

        if (
            !memoriesMusic
        ) {

            return false;

        }


        if (
            !memoriesMusic.paused
        ) {

            return true;

        }


        restoreMemoryPosition();


        memoriesMusic.loop =
            true;


        memoriesMusic.volume =
            VOLUME.memories;


        /*
           Start memories immediately.

           This function is normally called after
           a user action on the chapter.
        */

        const started =
            playImmediately(
                memoriesMusic,
                VOLUME.memories
            );


        if (!started) {

            return false;

        }


        hardStop(
            birthdayMusic
        );


        hardStop(
            introMusic,
            true
        );


        try {

            sessionStorage.setItem(
                MEMORY_ACTIVE_KEY,
                "true"
            );

        }

        catch (error) {}


        return true;

    }


    /* =====================================================
       RESUME MEMORIES
    ===================================================== */

    function resumeMemories() {

        if (
            !memoriesMusic
        ) {

            return false;

        }


        restoreMemoryPosition();


        memoriesMusic.loop =
            true;


        memoriesMusic.volume =
            VOLUME.memories;


        const started =
            playImmediately(
                memoriesMusic,
                VOLUME.memories
            );


        if (started) {

            hardStop(
                birthdayMusic
            );


            hardStop(
                introMusic,
                true
            );


            try {

                sessionStorage.setItem(
                    MEMORY_ACTIVE_KEY,
                    "true"
                );

            }

            catch (error) {}

        }


        return started;

    }


    /* =====================================================
       DEVELOPER / HMT MUSIC
    ===================================================== */

    function playDeveloperMusic() {

        /*
           Save memories before stopping it.
        */

        saveMemoryPosition();


        /*
           IMPORTANT:

           HMT button is itself a user gesture.

           Therefore intro.play() must happen
           immediately.
        */

        introMusic.loop =
            true;


        introMusic.volume =
            VOLUME.intro;


        const started =
            playImmediately(
                introMusic,
                VOLUME.intro
            );


        /*
           After requesting intro playback,
           stop memories and birthday.
        */

        hardStop(
            memoriesMusic
        );


        hardStop(
            birthdayMusic
        );


        hardStop(
            introMusic
        );


        /*
           The line above would stop intro again,
           so immediately restart it.

           This restart is synchronous and remains
           inside this function.
        */

        introMusic.loop =
            true;


        introMusic.volume =
            VOLUME.intro;


        try {

            introMusic.play();

        }

        catch (error) {}


        return started;

    }


    /* =====================================================
       BETTER DEVELOPER MUSIC VERSION
       
       Override the function above with a direct,
       clean implementation.
    ===================================================== */

    function startDeveloperMusic() {

        saveMemoryPosition();


        /*
           Don't perform asynchronous fading here.

           The HMT button is a user gesture.
        */

        hardStop(
            birthdayMusic
        );


        hardStop(
            memoriesMusic
        );


        introMusic.loop =
            true;


        introMusic.volume =
            VOLUME.intro;


        try {

            const promise =
                introMusic.play();


            if (
                promise &&
                promise.catch
            ) {

                promise.catch(
                    error => {

                        console.warn(
                            "HMT intro blocked:",
                            error
                        );

                    }
                );

            }

        }

        catch (error) {

            console.warn(
                "HMT intro error:",
                error
            );

        }


        return true;

    }


    /* =====================================================
       CLOSE DEVELOPER
    ===================================================== */

    function closeDeveloperMusic() {

        hardStop(
            introMusic,
            true
        );


        restoreMemoryPosition();


        /*
           On desktop this can resume immediately.
           On mobile, if the browser requires a gesture,
           the next interaction will resume it.
        */

        if (
            memoriesMusic
        ) {

            memoriesMusic.loop =
                true;


            memoriesMusic.volume =
                VOLUME.memories;


            const promise =
                memoriesMusic.play();


            if (
                promise &&
                promise.catch
            ) {

                promise.catch(
                    () => {

                        console.log(
                            "Memories waiting for user interaction."
                        );

                    }
                );

            }

        }

    }


    /* =====================================================
       ROOT PAGE — BIRTHDAY AUTOPLAY
    ===================================================== */

    function attemptBirthdayAutoplay() {

        if (!isRootPage) {

            return;

        }


        birthdayMusic.loop =
            true;


        birthdayMusic.volume =
            VOLUME.birthday;


        /*
           Desktop:
           this will normally work.

           Mobile:
           browser may reject it.
        */

        try {

            const promise =
                birthdayMusic.play();


            if (
                promise &&
                promise.catch
            ) {

                promise
                    .then(() => {

                        console.log(
                            "Birthday autoplay succeeded."
                        );


                        try {

                            sessionStorage.setItem(
                                BIRTHDAY_ACTIVE_KEY,
                                "true"
                            );

                        }

                        catch (error) {}

                    })
                    .catch(
                        () => {

                            console.log(
                                "Birthday autoplay blocked. Waiting for first touch."
                            );

                        }
                    );

            }

        }

        catch (error) {

            console.log(
                "Birthday autoplay blocked."
            );

        }

    }


    /* =====================================================
       MOBILE BIRTHDAY UNLOCK
    ===================================================== */

    let birthdayUnlockDone =
        false;


    function unlockBirthdayFromGesture() {

        if (
            birthdayUnlockDone
        ) {

            return;

        }


        if (
            !isRootPage
        ) {

            return;

        }


        /*
           If already playing,
           nothing needs to happen.
        */

        if (
            !birthdayMusic.paused
        ) {

            birthdayUnlockDone =
                true;


            removeBirthdayUnlockListeners();

            return;

        }


        /*
           CRITICAL:

           The FIRST thing done inside the
           touch/click handler is audio.play().

           No await.
           No fade.
           No stopAudio.
        */

        birthdayMusic.loop =
            true;


        birthdayMusic.volume =
            VOLUME.birthday;


        try {

            const promise =
                birthdayMusic.play();


            if (
                promise &&
                promise.then
            ) {

                promise
                    .then(() => {

                        birthdayUnlockDone =
                            true;


                        removeBirthdayUnlockListeners();


                        try {

                            sessionStorage.setItem(
                                BIRTHDAY_ACTIVE_KEY,
                                "true"
                            );

                        }

                        catch (error) {}


                        /*
                           Only now clean other audio.
                        */

                        hardStop(
                            memoriesMusic
                        );


                        hardStop(
                            introMusic,
                            true
                        );

                    })
                    .catch(
                        error => {

                            console.warn(
                                "Birthday unlock failed:",
                                error
                            );


                            /*
                               Allow another touch.
                            */

                            birthdayUnlockDone =
                                false;

                        }
                    );

            }

            else {

                birthdayUnlockDone =
                    true;


                removeBirthdayUnlockListeners();

            }

        }

        catch (error) {

            console.warn(
                "Birthday unlock error:",
                error
            );

        }

    }


    function removeBirthdayUnlockListeners() {

        document.removeEventListener(
            "pointerdown",
            unlockBirthdayFromGesture
        );


        document.removeEventListener(
            "touchstart",
            unlockBirthdayFromGesture
        );


        document.removeEventListener(
            "click",
            unlockBirthdayFromGesture
        );

    }


    /* =====================================================
       INNER PAGE MEMORY START
    ===================================================== */

    function attemptMemoriesAutoplay() {

        if (
            isRootPage
        ) {

            return;

        }


        restoreMemoryPosition();


        memoriesMusic.loop =
            true;


        memoriesMusic.volume =
            VOLUME.memories;


        try {

            const promise =
                memoriesMusic.play();


            if (
                promise &&
                promise.catch
            ) {

                promise.catch(
                    () => {

                        console.log(
                            "Memories autoplay blocked. Waiting for interaction."
                        );

                    }
                );

            }

        }

        catch (error) {

            console.log(
                "Memories autoplay blocked."
            );

        }

    }


    /* =====================================================
       INNER PAGE MOBILE UNLOCK
    ===================================================== */

    let memoriesUnlockDone =
        false;


    function unlockMemoriesFromGesture() {

        if (
            isRootPage
        ) {

            return;

        }


        if (
            memoriesUnlockDone
        ) {

            return;

        }


        if (
            !memoriesMusic.paused
        ) {

            memoriesUnlockDone =
                true;


            removeMemoriesUnlockListeners();

            return;

        }


        /*
           Direct play() inside the gesture.
        */

        memoriesMusic.loop =
            true;


        memoriesMusic.volume =
            VOLUME.memories;


        restoreMemoryPosition();


        try {

            const promise =
                memoriesMusic.play();


            if (
                promise &&
                promise.then
            ) {

                promise
                    .then(() => {

                        memoriesUnlockDone =
                            true;


                        removeMemoriesUnlockListeners();


                        hardStop(
                            birthdayMusic
                        );


                        hardStop(
                            introMusic,
                            true
                        );

                    })
                    .catch(
                        () => {

                            memoriesUnlockDone =
                                false;

                        }
                    );

            }

            else {

                memoriesUnlockDone =
                    true;


                removeMemoriesUnlockListeners();

            }

        }

        catch (error) {}

    }


    function removeMemoriesUnlockListeners() {

        document.removeEventListener(
            "pointerdown",
            unlockMemoriesFromGesture
        );


        document.removeEventListener(
            "touchstart",
            unlockMemoriesFromGesture
        );


        document.removeEventListener(
            "click",
            unlockMemoriesFromGesture
        );

    }


    /* =====================================================
       SAVE MEMORY BEFORE NAVIGATION
    ===================================================== */

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
                link.getAttribute(
                    "href"
                );


            if (!href) {
                return;
            }


            if (
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:")
            ) {

                return;

            }


            if (
                memoriesMusic &&
                !memoriesMusic.paused
            ) {

                saveMemoryPosition();

            }

        },
        true
    );


    /* =====================================================
       SAVE MEMORY PERIODICALLY
    ===================================================== */

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


    /* =====================================================
       SAVE BEFORE LEAVING
    ===================================================== */

    window.addEventListener(
        "pagehide",
        saveMemoryPosition
    );


    window.addEventListener(
        "beforeunload",
        saveMemoryPosition
    );


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    window.addEventListener(
        "load",
        () => {

            if (isRootPage) {

                /*
                   Give the browser a moment to
                   finish loading the page.
                */

                setTimeout(
                    attemptBirthdayAutoplay,
                    150
                );


                /*
                   Mobile fallback.

                   IMPORTANT:
                   These handlers call play()
                   DIRECTLY.
                */

                document.addEventListener(
                    "pointerdown",
                    unlockBirthdayFromGesture,
                    {
                        passive: true
                    }
                );


                document.addEventListener(
                    "touchstart",
                    unlockBirthdayFromGesture,
                    {
                        passive: true
                    }
                );


                document.addEventListener(
                    "click",
                    unlockBirthdayFromGesture
                );

            }

            else {

                /*
                   Try memories automatically.
                */

                setTimeout(
                    attemptMemoriesAutoplay,
                    100
                );


                /*
                   If mobile blocks it,
                   first interaction unlocks it.
                */

                document.addEventListener(
                    "pointerdown",
                    unlockMemoriesFromGesture,
                    {
                        passive: true
                    }
                );


                document.addEventListener(
                    "touchstart",
                    unlockMemoriesFromGesture,
                    {
                        passive: true
                    }
                );


                document.addEventListener(
                    "click",
                    unlockMemoriesFromGesture
                );

            }

        }
    );


    /* =====================================================
       PUBLIC API
       
       These names are required by birthday.js,
       developer.js and the other pages.
    ===================================================== */

    window.BirthdayMusic = {

        playBirthday:
            playBirthday,


        playMemories:
            playMemories,


        resumeMemories:
            resumeMemories,


        playDeveloperMusic:
            startDeveloperMusic,


        closeDeveloperMusic:
            closeDeveloperMusic,


        saveMemoryPosition:
            saveMemoryPosition,


        stopBirthday:
            () => {

                hardStop(
                    birthdayMusic
                );

            },


        stopMemories:
            () => {

                saveMemoryPosition();

                hardStop(
                    memoriesMusic
                );

            }

    };


    /* =====================================================
       READY MESSAGE
    ===================================================== */

    console.log(
        "HMT Music Engine loaded successfully."
    );


})();