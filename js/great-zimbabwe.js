/**
 * Great Zimbabwe Ngano Experience Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const NGANO_AUDIO_URL = 'https://pub-e81a254724df4bfaa01f780b72af68c4.r2.dev/Zimbabwe/Greatzimbabwe/WHEN%20THE%20STONES%20STILL%20SPOKE.mp3';
    const nganoAudio = new Audio(NGANO_AUDIO_URL);
    let nganoStarted = false;

    // Timeline Assets (Seconds : URL)
    const timeline = [
        { time: 0, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Blank.webp' },
        { time: 30, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/KingdomWithoutNoise.webp' },
        { time: 35, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/PatienceHandsMemory.webp' },
        { time: 46, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/FiresBurnsAtNight.webp' },
        { time: 54, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/VoicesOfThePeople.webp' },
        { time: 63, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/ChildrenRunsStonePassages.webp' },
        { time: 68, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/EldersSpokeBesidesFires.webp' },
        { time: 80, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/LeadersProtectsTheKindom.webp' },
        { time: 88, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Footsteps.webp' },
        { time: 98, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Fires.webp' },
        { time: 104, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Blank.webp' },
        { time: 121, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/GreatZimbabwe.webp' },
        { time: 129, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Stones.webp' },
        { time: 141, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/KingdomPhotos.webp' },
        { time: 153, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/OtherShorts.webp' },
        { time: 158, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/FinalMemoryFade.webp' },
        { time: 164, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/greatzimbabwe/Blank.webp' }
    ];

    // 1. Initial State
    if (window.ZimAudio) {
        window.ZimAudio.fade(0.15, 2000); // Fade background music on arrival
    }

    const startBtn = document.getElementById('start-ngano-btn');
    const visualsLayer = document.querySelector('.visuals-layer');
    const progressBar = document.querySelector('.ngano-progress-bar');
    const controls = document.querySelector('.ngano-controls');

    // Create container wrappers inside visuals-layer to ensure nth-of-type counting is correct
    const aurasContainer = document.createElement('div');
    aurasContainer.className = 'auras-container';
    aurasContainer.style.position = 'absolute';
    aurasContainer.style.inset = '0';
    aurasContainer.style.overflow = 'hidden';
    visualsLayer.appendChild(aurasContainer);

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';
    imagesContainer.style.position = 'absolute';
    imagesContainer.style.inset = '0';
    imagesContainer.style.overflow = 'hidden';
    visualsLayer.appendChild(imagesContainer);

    // Create dual layers: a blurred backdrop aura and a sharp contain-style cinematic foreground
    timeline.forEach(item => {
        // Backdrop Aura
        const aura = document.createElement('img');
        aura.src = item.url;
        aura.className = 'visual-aura';
        aura.dataset.time = item.time;
        aurasContainer.appendChild(aura);

        // Foreground Artwork
        const img = document.createElement('img');
        img.src = item.url;
        img.className = 'visual-image';
        img.dataset.time = item.time;
        imagesContainer.appendChild(img);
    });

    const auras = document.querySelectorAll('.visual-aura');
    const images = document.querySelectorAll('.visual-image');

    const startNgano = () => {
        if (nganoStarted) return;
        nganoStarted = true;

        startBtn.classList.add('fade-out');
        controls.classList.add('visible');

        // Audio Transition: Fade out main theme, start ngano
        if (window.ZimAudio) {
            window.ZimAudio.fade(0, 2000, () => {
                // Keep it "playing" state in manager but silent
            });
        }

        nganoAudio.play().catch(e => console.error("Ngano play failed:", e));
        
        // Initial visual
        updateVisuals(0);
        
        // Synchronization Loop
        const syncLoop = () => {
            if (!nganoStarted) return;
            
            const currentTime = nganoAudio.currentTime;
            const duration = nganoAudio.duration || 164; // Fallback to last timestamp
            
            // Progress Bar
            if (progressBar) {
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${progress}%`;
            }

            // Sync Visuals
            updateVisuals(currentTime);

            if (!nganoAudio.paused && !nganoAudio.ended) {
                requestAnimationFrame(syncLoop);
            }
        };

        requestAnimationFrame(syncLoop);
    };

    const updateVisuals = (currentTime) => {
        let activeIndex = -1;
        
        // Find the image that should be active based on time
        for (let i = timeline.length - 1; i >= 0; i--) {
            if (currentTime >= timeline[i].time) {
                activeIndex = i;
                break;
            }
        }

        if (activeIndex !== -1) {
            images.forEach((img, idx) => {
                if (idx === activeIndex) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
            auras.forEach((aura, idx) => {
                if (idx === activeIndex) {
                    aura.classList.add('active');
                } else {
                    aura.classList.remove('active');
                }
            });
        }
    };

    if (startBtn) {
        startBtn.addEventListener('click', startNgano);
    }

    // 2. Cinematic Ember System
    const createEmbers = () => {
        const container = document.querySelector('.ember-container');
        if (!container) return;
        
        const maxEmbers = 16;
        setInterval(() => {
            const currentEmbers = container.children.length;
            if (currentEmbers >= maxEmbers) return;

            const ember = document.createElement('div');
            ember.className = 'ember';
            
            const size = Math.random() * 2 + 1.2; // 1.2px to 3.2px
            const left = Math.random() * 100;
            const duration = Math.random() * 12 + 12; // 12s to 24s
            const delay = Math.random() * 4;
            
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.left = `${left}%`;
            ember.style.bottom = `-10px`;
            ember.style.animationDuration = `${duration}s`;
            ember.style.animationDelay = `${delay}s`;
            
            ember.style.setProperty('--sway-amount', `${Math.random() * 70 - 35}px`);

            container.appendChild(ember);

            setTimeout(() => {
                ember.remove();
            }, (duration + delay) * 1000);
        }, 1300);
    };

    createEmbers();

    // Audio End Transition
    nganoAudio.onended = () => {
        nganoStarted = false;
        controls.classList.remove('visible');
        
        // Hold darkness (last frame is blank)
        setTimeout(() => {
            if (window.ZimAudio) {
                window.ZimAudio.fade(0.35, 3000);
            }
            // Show start button again or finish state?
            // For now, let's keep it in the reflective state.
            startBtn.innerText = "EXPLORE AGAIN";
            startBtn.classList.remove('fade-out');
        }, 3000);
    };
});
