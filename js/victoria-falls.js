/**
 * Victoria Falls Experience Logic - Upgraded with Oral History Audio & Scroll Ducking
 */
document.addEventListener('DOMContentLoaded', () => {
    const STORY_AUDIO_URL = 'https://pub-e81a254724df4bfaa01f780b72af68c4.r2.dev/Zimbabwe/Victoria-Falls/The%20Voice%20of%20Memory%20%E2%80%94%20Victoria%20Falls.mp3';
    const storyAudio = new Audio(STORY_AUDIO_URL);
    let isStoryPlaying = false;

    // 1. Audio Management - Atmospheric Continuity
    const handleInitialAudio = () => {
        if (window.ZimAudio) {
            // "Enter Zimbabwe" continues softly on entry
            window.ZimAudio.fade(0.35, 1500);
            
            // Ensure it's playing if it was paused
            if (window.ZimAudio.audio.paused && localStorage.getItem('zim_audio_playing') === 'true') {
                window.ZimAudio.audio.play().catch(e => console.log("Still blocked"));
            }
        }
    };

    handleInitialAudio();

    // 2. Cinematic Slideshow Logic
    const initSlideshow = () => {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.nav-dot');
        const progressBar = document.getElementById('slideshow-progress-bar');
        if (!slides.length) return;

        let currentSlide = 0;
        const slideCount = slides.length;
        const intervalTime = 6000;
        let startTime = Date.now();

        const updateProgress = () => {
            if (!progressBar) return;
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / intervalTime) * 100, 100);
            progressBar.style.width = `${progress}%`;
            
            if (elapsed >= intervalTime) {
                nextSlide();
            }
            requestAnimationFrame(updateProgress);
        };

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('is-active'));
            dots.forEach(d => d.classList.remove('is-active'));
            slides[index].classList.add('is-active');
            dots[index].classList.add('is-active');
            startTime = Date.now(); // Reset timer for progress bar
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        };

        // Start the progress animation loop
        requestAnimationFrame(updateProgress);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(index);
            });
        });

        // Discovery Marker Interactions
        const markers = document.querySelectorAll('.discovery-marker');
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                marker.classList.toggle('is-active');
                
                // Change icon based on state
                const icon = marker.querySelector('.marker-icon');
                if (icon) {
                    icon.innerText = marker.classList.contains('is-active') ? '×' : '+';
                }
            });
        });

        // Close all markers when clicking away or changing slide
        document.addEventListener('click', () => {
            markers.forEach(m => {
                m.classList.remove('is-active');
                const icon = m.querySelector('.marker-icon');
                if (icon) icon.innerText = '+';
            });
        });
    };

    initSlideshow();

    // 3. Oral Story Interaction (Real Playback)
    const storyBtn = document.getElementById('play-story-btn');
    const storyLabel = document.querySelector('.oral-history-container .label-gold');
    
    if (storyBtn) {
        storyBtn.addEventListener('click', () => {
            if (!isStoryPlaying) {
                playStory();
            } else {
                pauseStory();
            }
        });
    }

    const playStory = () => {
        isStoryPlaying = true;
        storyBtn.classList.add('is-playing');
        storyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        
        if (storyLabel) {
            storyLabel.innerText = "STORY UNFOLDING...";
            storyLabel.style.color = "#D4AF37";
        }

        // Duck the main theme completely for oral focus
        if (window.ZimAudio) {
            window.ZimAudio.fade(0, 1000);
        }

        storyAudio.play().catch(e => console.error("Playback failed:", e));
    };

    const pauseStory = () => {
        isStoryPlaying = false;
        storyBtn.classList.remove('is-playing');
        storyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        
        if (storyLabel) {
            storyLabel.innerText = "THE VOICE OF MEMORY";
        }

        storyAudio.pause();

        // Restore ambient background gently if not in "story-only" zone
        if (window.ZimAudio) {
            const container = document.querySelector('.snap-container');
            if (container) {
                const scrollHeight = container.scrollHeight - container.clientHeight;
                const scrolled = container.scrollTop;
                const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
                const targetBgVolume = Math.max(0.05, 0.35 * (1 - (progress * 0.8)));
                window.ZimAudio.fade(targetBgVolume, 1500);
            }
        }
    };

    storyAudio.onended = () => {
        pauseStory();
    };

    // 4. Scroll-Based Atmosphere & Parallax
    const container = document.querySelector('.snap-container');
    if (container) {
        container.addEventListener('scroll', () => {
            const scrolled = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
            
            // Dynamic Volume Ducking (from 0.35 down as we scroll deeper)
            if (window.ZimAudio && !isStoryPlaying) {
                const targetVolume = Math.max(0.05, 0.35 * (1 - (progress * 0.8)));
                window.ZimAudio.audio.volume = targetVolume;
            }

            // Visual Depth
            const heroImg = document.querySelector('.hero-parallax');
            if (heroImg) {
                heroImg.style.transform = `scale(1.15) translateY(${scrolled * 0.25}px)`;
            }

            const mist = document.querySelector('.mist-layer');
            const rain = document.querySelector('.falling-mist');
            if (mist) mist.style.transform = `translateY(${scrolled * 0.4}px)`;
            if (rain) rain.style.transform = `translateY(${scrolled * 0.6}px)`;
        });
    }
});
