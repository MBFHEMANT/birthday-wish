/* =========================================================
   PHOTO GALLERY
   Supports 200+ images
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (
        !document.body.classList.contains(
            "gallery-page"
        )
    ) {
        return;
    }


    const gallery =
        document.getElementById(
            "photoGallery"
        );

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const lightboxClose =
        document.getElementById(
            "lightboxClose"
        );

    const lightboxPrev =
        document.getElementById(
            "lightboxPrev"
        );

    const lightboxNext =
        document.getElementById(
            "lightboxNext"
        );

    const lightboxCounter =
        document.getElementById(
            "lightboxCounter"
        );


    /* -----------------------------------------------------
       CONFIGURATION
    ----------------------------------------------------- */

    const TOTAL_PHOTOS = 200;

    const PHOTO_FOLDER =
        "../assets/photos/gallery/";


    let currentImage = 0;


    /* -----------------------------------------------------
       GENERATE GALLERY
    ----------------------------------------------------- */

    for (
        let i = 1;
        i <= TOTAL_PHOTOS;
        i++
    ) {

        const item =
            document.createElement("div");

        item.className =
            "gallery-item";


        const image =
            document.createElement("img");


        const number =
            String(i).padStart(3, "0");


        image.src =
            `${PHOTO_FOLDER}photo-${number}.jpg`;


        image.alt =
            `Memory ${i}`;


        image.loading =
            i < 10
                ? "eager"
                : "lazy";


        image.decoding =
            "async";


        image.onerror = () => {

            item.remove();

        };


        item.appendChild(image);

        gallery.appendChild(item);


        item.addEventListener(
            "click",
            () => {

                currentImage = i - 1;

                openLightbox();

            }
        );

    }


    /* -----------------------------------------------------
       LIGHTBOX
    ----------------------------------------------------- */

    function openLightbox() {

        updateLightbox();

        lightbox.classList.add(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    function updateLightbox() {

        const number =
            String(
                currentImage + 1
            ).padStart(3, "0");


        lightboxImage.src =
            `${PHOTO_FOLDER}photo-${number}.jpg`;


        lightboxCounter.textContent =
            `${String(currentImage + 1).padStart(2, "0")} / ${TOTAL_PHOTOS}`;

    }


    function nextImage() {

        currentImage++;

        if (
            currentImage >=
            TOTAL_PHOTOS
        ) {

            currentImage = 0;

        }

        updateLightbox();

    }


    function previousImage() {

        currentImage--;

        if (
            currentImage < 0
        ) {

            currentImage =
                TOTAL_PHOTOS - 1;

        }

        updateLightbox();

    }


    /* -----------------------------------------------------
       BUTTONS
    ----------------------------------------------------- */

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    lightboxNext.addEventListener(
        "click",
        nextImage
    );


    lightboxPrev.addEventListener(
        "click",
        previousImage
    );


    /* -----------------------------------------------------
       CLICK OUTSIDE
    ----------------------------------------------------- */

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* -----------------------------------------------------
       KEYBOARD
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousImage();

            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }

        }
    );


    /* -----------------------------------------------------
       TOUCH SWIPE
    ----------------------------------------------------- */

    let touchStartX = 0;

    let touchEndX = 0;


    lightbox.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            const difference =
                touchStartX -
                touchEndX;


            if (
                Math.abs(difference) < 50
            ) {

                return;

            }


            if (
                difference > 0
            ) {

                nextImage();

            } else {

                previousImage();

            }

        },
        {
            passive: true
        }
    );

});