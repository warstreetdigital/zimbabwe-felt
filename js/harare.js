/**
 * Harare Urban Memory Experience Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const stories = {
        'before-the-lights': {
            title: 'BEFORE MEIKLES BECAME MEIKLES...',
            content: '“What stood here before the city learned luxury?” This corner already carried Harare’s footsteps before the hotel lights arrived. A nostalgic sanctuary that knew the value of a slow, unspoken elegance.',
            image: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Harare/Stories_About_Harare_Cover.webp'
        },
        'city-kept-building': {
            title: 'BEFORE THE GLASS TOWERS...',
            content: '“This city was already dreaming upward.” This space carried another Harare before the skyline changed. In the steel and ambition of the vertical climb, we found a resilience that refused to stop.',
            image: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Harare/Enter_Harare_Cover_Optimized.webp'
        },
        'after-dark': {
            title: 'AFTER THE STREETLIGHTS WAKE UP',
            content: '“The city changes once the music starts breathing.” Movement becomes the language of the night—red taillights drifting like fireflies through a pulse that remembers everything the day forgot.',
            image: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Harare/Enter_Harare_Cover_Optimized.webp'
        }
    };

    const destinationsView = document.getElementById('destinations-view');
    const storiesView = document.getElementById('stories-view');
    const storiesTrigger = document.getElementById('stories-trigger');
    const backToDestinations = document.querySelector('.back-to-destinations');
    
    const intro = document.querySelector('.harare-intro');
    const overlay = document.querySelector('.story-overlay');
    const overlayTitle = overlay.querySelector('h2');
    const overlayContent = overlay.querySelector('p');
    const closeBtn = document.querySelector('.close-story');
    const memoryLayer = document.querySelector('.city-memory-layer');
    
    const galleryTrigger = document.getElementById('gallery-trigger');
    const galleryUI = document.getElementById('gallery-ui');
    const closeGalleryBtn = document.querySelector('.close-gallery');

    // 1. Initial State
    const urbanAmbience = new Audio('https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3'); 
    urbanAmbience.loop = true;
    urbanAmbience.volume = 0;

    const playAmbience = () => {
        const isMuted = localStorage.getItem('zim_audio_muted') === 'true';
        if (isMuted) return;
        
        urbanAmbience.play().then(() => {
            let vol = 0;
            const fadeIn = setInterval(() => {
                vol += 0.05;
                urbanAmbience.volume = Math.min(0.2, vol);
                if (vol >= 0.2) clearInterval(fadeIn);
            }, 200);
            cleanupAmbienceTrigger();
        }).catch(e => {
            console.log("Ambient audio play blocked. Armed gesture bypass.");
        });
    };

    const triggerAmbienceEvent = () => {
        const isMuted = localStorage.getItem('zim_audio_muted') === 'true';
        if (!isMuted && urbanAmbience.paused) {
            playAmbience();
        } else {
            cleanupAmbienceTrigger();
        }
    };

    const cleanupAmbienceTrigger = () => {
        window.removeEventListener('click', triggerAmbienceEvent, { capture: true });
        window.removeEventListener('touchstart', triggerAmbienceEvent, { capture: true });
        window.removeEventListener('pointerdown', triggerAmbienceEvent, { capture: true });
        window.removeEventListener('scroll', triggerAmbienceEvent, { capture: true });
    };

    if (window.ZimAudio) {
        window.ZimAudio.fade(0.1, 4000); 
        playAmbience();
        
        // Setup interaction fallbacks for local Harare ambience as well
        window.addEventListener('click', triggerAmbienceEvent, { capture: true });
        window.addEventListener('touchstart', triggerAmbienceEvent, { capture: true });
        window.addEventListener('pointerdown', triggerAmbienceEvent, { capture: true });
        window.addEventListener('scroll', triggerAmbienceEvent, { capture: true });
    }

    // 2. Navigation Handlers (Locked with Cinematic Feedback)
    const feedbackOverlay = document.getElementById('locked-feedback');
    const feedbackCat = document.getElementById('feedback-cat');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackDesc = document.getElementById('feedback-desc');
    const closeFeedbackBtn = feedbackOverlay ? feedbackOverlay.querySelector('.close-feedback') : null;

    function showFeedback(titleText, descText, catText) {
        if (!feedbackOverlay) return;
        feedbackTitle.innerText = titleText;
        feedbackDesc.innerText = descText;
        feedbackCat.innerText = catText || "EVOLVING PORTAL";
        feedbackOverlay.classList.add('active');
        if (window.ZimAudio) window.ZimAudio.fade(0.04, 800);
    }

    if (closeFeedbackBtn) {
        closeFeedbackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            feedbackOverlay.classList.remove('active');
            if (window.ZimAudio) window.ZimAudio.fade(0.15, 1200);
        });
    }

    if (feedbackOverlay) {
        feedbackOverlay.addEventListener('click', (e) => {
            if (e.target === feedbackOverlay) {
                feedbackOverlay.classList.remove('active');
                if (window.ZimAudio) window.ZimAudio.fade(0.15, 1200);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && feedbackOverlay && feedbackOverlay.classList.contains('active')) {
            feedbackOverlay.classList.remove('active');
            if (window.ZimAudio) window.ZimAudio.fade(0.15, 1200);
        }
    });

    if (storiesTrigger) {
        storiesTrigger.addEventListener('click', () => {
            showFeedback(
                "“THE STREETS ARE STILL SPEAKING…”",
                "Some Harare memories are slowly being restored. Return to this space soon to hear their full voice.",
                "PORTAL 02 — STORIES RESTORING"
            );
        });
    }

    if (backToDestinations) {
        backToDestinations.addEventListener('click', () => {
            storiesView.style.display = 'none';
            destinationsView.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Story Card Activation
    document.querySelectorAll('.cinematic-story-card').forEach(card => {
        const playBtn = card.querySelector('.play-memory-btn');
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = card.dataset.story;
            const story = stories[id];
            
            // Activate Card Visuals
            document.querySelectorAll('.cinematic-story-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            if (story) {
                setTimeout(() => {
                    overlayTitle.innerText = story.title;
                    overlayContent.innerText = story.content;
                    overlay.classList.add('active');
                    
                    if (memoryLayer) {
                        memoryLayer.classList.add('active');
                    }
                    if (window.ZimAudio) window.ZimAudio.fade(0.05, 1000);
                }, 800);
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        if (memoryLayer) memoryLayer.classList.remove('active');
        document.querySelectorAll('.cinematic-story-card').forEach(c => c.classList.remove('active'));
        
        if (window.ZimAudio) window.ZimAudio.fade(0.15, 2000);
    });

    // 4. Gallery Logic (Locked with Cinematic Feedback)
    if (galleryTrigger) {
        galleryTrigger.addEventListener('click', () => {
            showFeedback(
                "“THE GALLERY LIGHTS ARE STILL WARMING UP…”",
                "New canvases are still arriving from the city. The walls are still collecting Harare.",
                "PORTAL 03 — GALLERY EVOLVING"
            );
        });
    }

    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryUI.classList.remove('active');
            if (window.ZimAudio) window.ZimAudio.fade(0.15, 2000);
        });
    }

    // 3. Ambient Urban Motion
    const createLightStreak = () => {
        const streaks = document.querySelector('.urban-lights');
        if (!streaks) return;

        const streak = document.createElement('div');
        streak.className = 'light-streak';
        
        // Randomize placement and speed
        const startLeft = Math.random() * 100;
        const duration = Math.random() * 4 + 4;
        const colorVariation = Math.random() > 0.5 ? 'var(--hr-red)' : 'var(--hr-yellow)';
        
        streak.style.left = `${startLeft}vw`;
        streak.style.top = `${Math.random() * 100}vh`;
        streak.style.width = `${Math.random() * 40 + 20}vw`;
        streak.style.background = `linear-gradient(90deg, transparent, ${colorVariation}, transparent)`;
        streak.style.animationDuration = `${duration}s`;
        
        streaks.appendChild(streak);
        
        setTimeout(() => streak.remove(), duration * 1000);
    };

    // More frequent streaks for city pulse
    setInterval(createLightStreak, 2000);
});
