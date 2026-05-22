/**
 * Nyanga Mist Experience Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const NYANGA_AUDIO_URL = 'https://pub-e81a254724df4bfaa01f780b72af68c4.r2.dev/Zimbabwe/Nyanga/WHEN%20THE%20MIST%20WALKS.mp3';
    const nyangaAudio = new Audio(NYANGA_AUDIO_URL);
    let nganoStarted = false; // Using similar flag for state

    // Timeline Assets refined for journey: Prints -> Sacred Path -> Into Mist -> Emerging -> Beyond
    const timeline = [
        { time: 0, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Photo_1_Barefoot_Prints.webp', state: 'mist-heavy' },
        { time: 25, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyanga_Sacred_Path.webp', state: 'mist-parting' },
        { time: 55, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Photo_2_The_Walk_Into_The_Mist.webp', state: 'mist-heavy' },
        { time: 90, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyangani_Mist_Covered_Mountains.webp', state: 'mist-parting' },
        { time: 135, url: 'https://pub-e10a28ca38cf452da437555e0f90e288.r2.dev/Zimbabwe-tourism/Nyanga/Nyanga_Mountain_Pathway.webp', state: 'mist-heavy' },
        { time: 160, url: '', state: 'mist-total' } // Fade to white/mist at end
    ];

    // 1. Initial State
    if (window.ZimAudio) {
        window.ZimAudio.fade(0.15, 3000); // Soft ambient music on arrival
    }

    const startBtn = document.getElementById('enter-mist-btn');
    const intro = document.querySelector('.nyanga-intro');
    const visualsLayer = document.querySelector('.visuals-layer');
    const progressBar = document.querySelector('.ny-progress-bar');
    const controls = document.querySelector('.ny-controls');
    const fog = document.querySelector('.drifting-fog');
    const gateway = document.getElementById('today-gateway');
    const gatewayLink = document.getElementById('gateway-link');
    const transitionOverlay = document.getElementById('transition-overlay');

    // Subtle fog on arrival
    if (fog) fog.style.opacity = "0.15";

    // Metadata for duration
    let audioDuration = 180;
    nyangaAudio.addEventListener('loadedmetadata', () => {
        audioDuration = nyangaAudio.duration;
    });

    // Create image elements (only if url exists)
    timeline.forEach(item => {
        if (!item.url) return;
        const img = document.createElement('img');
        img.src = item.url;
        img.className = 'visual-image';
        img.dataset.time = item.time;
        visualsLayer.appendChild(img);
    });

    const images = document.querySelectorAll('.visual-image');

    const toggleGateway = () => {
        if (!nganoStarted) return;
        
        // Randomly show/hide after a delay
        const shouldShow = Math.random() > 0.5;
        if (shouldShow && !gateway.classList.contains('visible')) {
            gateway.classList.add('visible');
            // Hide after 8 seconds
            setTimeout(() => gateway.classList.remove('visible'), 8000);
        }
    };

    const startExperience = () => {
        if (nganoStarted) return;
        nganoStarted = true;

        startBtn.classList.add('fade-out');
        intro.classList.add('fade-out');
        controls.classList.add('visible');
        if (fog) fog.classList.add('visible');
        visualsLayer.classList.add('fog-active');
        document.body.classList.add('fog-active');

        // Audio Transition
        if (window.ZimAudio) {
            window.ZimAudio.fade(0, 3000);
        }

        nyangaAudio.play().catch(e => console.error("Nyanga play failed:", e));
        
        // Start check for gateway every 20 seconds
        setInterval(toggleGateway, 20000);
        
        // Synchronization Loop
        const syncLoop = () => {
            if (!nganoStarted) return;
            
            const currentTime = nyangaAudio.currentTime;
            
            // Progress Bar
            if (progressBar) {
                const progress = (currentTime / audioDuration) * 100;
                progressBar.style.width = `${progress}%`;
            }

            // Sync Visuals and Atmosphere
            updateAtmosphere(currentTime);

            if (!nyangaAudio.paused && !nyangaAudio.ended) {
                requestAnimationFrame(syncLoop);
            }
        };

        requestAnimationFrame(syncLoop);
    };

    const updateAtmosphere = (currentTime) => {
        let activeIndex = -1;
        
        for (let i = timeline.length - 1; i >= 0; i--) {
            if (currentTime >= timeline[i].time) {
                activeIndex = i;
                break;
            }
        }

        if (activeIndex !== -1) {
            const currentState = timeline[activeIndex];
            
            // Update Fog State
            visualsLayer.classList.remove('mist-heavy', 'mist-parting', 'mist-total');
            document.body.classList.remove('mist-heavy', 'mist-parting', 'mist-total');
            if (currentState.state) {
                visualsLayer.classList.add(currentState.state);
                document.body.classList.add(currentState.state);
            }

            // Update Active Image (Index based is safer than URL string comparison)
            images.forEach((img, idx) => {
                if (idx === activeIndex && currentState.url) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        }
    };

    if (startBtn) {
        startBtn.addEventListener('click', startExperience);
    }

    if (gatewayLink) {
        gatewayLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = gatewayLink.href;
            
            // Atmospheric transition
            transitionOverlay.classList.add('active');
            
            // Fade audio
            nyangaAudio.pause();
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 3000);
        });
    }

    // Ending Transition
    nyangaAudio.onended = () => {
        nganoStarted = false;
        if (controls) controls.classList.remove('visible');
        if (fog) fog.classList.add('thick'); // Custom state if needed

        // Fade out images
        images.forEach(img => img.classList.remove('active'));

        setTimeout(() => {
            if (window.ZimAudio) {
                window.ZimAudio.fade(0.35, 4000);
            }
            startBtn.innerText = "RETURN TO THE MIST";
            startBtn.classList.remove('fade-out');
            intro.classList.remove('fade-out');
        }, 5000);
    };
});
