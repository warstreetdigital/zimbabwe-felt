/**
 * Nyanga Today: Cinematic Modern Showcase Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Array of premium modern Nyanga showcases
    const imagesData = [
        {
            url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyangatoday/Nyanga4.jpg',
            title: 'WHERE THE CLOUDS REST',
            subtitle: 'Living amongst the winds, where heaven meets the high green ridges of Zimbabwe.'
        },
        {
            url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyangatoday/Nyanga3.jpg',
            title: 'THE MOUNTAINS STILL BREATHE',
            subtitle: 'Every morning, the granite hills catch the rising sun, whispering tales of renewal.'
        },
        {
            url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyangatoday/Nyanga2.jpg',
            title: 'MORNING LIGHT ABOVE NYANGA',
            subtitle: 'Daybreak washes over the quiet valleys, revealing the lush paths carved by time.'
        },
        {
            url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyangatoday/Nyanga1.jpg',
            title: 'THE SILENCE BETWEEN THE HILLS',
            subtitle: 'A serene beauty that endures—peaceful, contemporary, and forever alive.'
        }
    ];

    let currentIndex = 0;
    let transitionTimer = null;
    let progressStartTime = null;
    const SLIDE_DURATION = 9000; // 9 seconds per slide (long, elegant pacing)
    
    // Elements
    const viewer = document.getElementById('viewer-layer');
    const dotsContainer = document.getElementById('slide-dots');
    const textTitle = document.getElementById('today-title');
    const textSubtitle = document.getElementById('today-subtitle');
    const textIndex = document.getElementById('current-index');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const mistCover = document.getElementById('mist-cover');

    // Fade in body on start
    setTimeout(() => {
        document.body.classList.add('loaded');
        // Resume / raise global music softly to fill the present-day landscape
        if (window.ZimAudio) {
            window.ZimAudio.fade(0.25, 3000);
        }
    }, 100);

    // Initialize HTML Images dynamically
    imagesData.forEach((imgData, idx) => {
        const img = document.createElement('img');
        img.src = imgData.url;
        img.className = 'today-image';
        if (idx === 0) img.classList.add('active');
        viewer.appendChild(img);

        // Create dot indicator
        const dot = document.createElement('button');
        dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
        dot.ariaLabel = `Go to slide ${idx + 1}`;
        dot.addEventListener('click', () => changeToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const activeImages = viewer.querySelectorAll('.today-image');
    const dotElements = dotsContainer.querySelectorAll('.slide-dot');

    // Initial texts
    updateText(0);

    function updateText(index) {
        // Softly slip outward
        textTitle.classList.remove('visible');
        textSubtitle.classList.remove('visible');

        setTimeout(() => {
            textTitle.innerText = imagesData[index].title;
            textSubtitle.innerText = imagesData[index].subtitle;
            textIndex.innerText = `0${index + 1} / 0${imagesData.length}`;

            // Re-apply visible class to glide in gracefully
            textTitle.classList.add('visible');
            textSubtitle.classList.add('visible');
        }, 800);
    }

    function changeToSlide(targetIndex) {
        if (targetIndex === currentIndex) return;

        const previousIndex = currentIndex;
        currentIndex = targetIndex;

        // Manage clean cross-dissolve classes so previous image lingers softly
        activeImages.forEach((img, idx) => {
            img.classList.remove('previous');
            if (idx === previousIndex) {
                img.classList.remove('active');
                img.classList.add('previous');
            } else if (idx === currentIndex) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });

        // Update indicators
        dotElements.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        updateText(currentIndex);
        resetProgressTimer();
    }

    function resetProgressTimer() {
        if (transitionTimer) {
            cancelAnimationFrame(transitionTimer);
        }
        progressStartTime = Date.now();
        tickProgress();
    }

    function tickProgress() {
        const elapsed = Date.now() - progressStartTime;
        const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }

        if (percent >= 100) {
            // Auto transition
            const nextIndex = (currentIndex + 1) % imagesData.length;
            changeToSlide(nextIndex);
        } else {
            transitionTimer = requestAnimationFrame(tickProgress);
        }
    }

    // Controls listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let idx = currentIndex - 1;
            if (idx < 0) idx = imagesData.length - 1;
            changeToSlide(idx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const idx = (currentIndex + 1) % imagesData.length;
            changeToSlide(idx);
        });
    }

    // Return to ancient mist transition handler
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Activate the immersive dark screen cover
            if (mistCover) {
                mistCover.classList.add('active');
            }

            // Fade audio out so return is hauntingly quiet
            if (window.ZimAudio) {
                window.ZimAudio.fade(0, 2000);
            }

            // Redirect back to mystery after the slow fade complete
            setTimeout(() => {
                window.location.href = backBtn.getAttribute('href');
            }, 2500);
        });
    }

    // Start progress loop
    resetProgressTimer();
});
