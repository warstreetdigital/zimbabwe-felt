/**
 * Global Audio Manager for persistent "Enter Zimbabwe" experience.
 */

const THEME_URL = 'https://pub-e81a254724df4bfaa01f780b72af68c4.r2.dev/Zimbabwe/tourism/Enter-Zimbabwe.mp3';

class AudioManager {
    constructor() {
        this.audio = new Audio(THEME_URL);
        this.audio.loop = true;
        this.audio.volume = 0;
        this.fadeInterval = null;
        this.targetVolume = 1.0;
        this.customFadeRequested = false;
        this.triggerSet = false;
        
        // Load state
        const savedPos = localStorage.getItem('zim_audio_pos');
        if (savedPos) {
            this.audio.currentTime = parseFloat(savedPos);
        }

        const isMuted = localStorage.getItem('zim_audio_muted') === 'true';
        this.audio.muted = isMuted;

        // Default to playing on first entry
        let isPlaying = localStorage.getItem('zim_audio_playing');
        if (isPlaying === null) {
            isPlaying = true;
            localStorage.setItem('zim_audio_playing', 'true');
        } else {
            isPlaying = isPlaying === 'true';
        }

        if (isPlaying && !isMuted) {
            this.play();
        }

        // Save state periodically
        setInterval(() => {
            if (this.audio && !this.audio.paused) {
                localStorage.setItem('zim_audio_pos', this.audio.currentTime);
            }
        }, 1000);

        // Always register active fallback triggers to bypass rigid mobile/safari blocks on gesture propagation
        this.setupInteractionTrigger();

        // Update audio button icon on page load once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateIcon(this.audio.muted));
        } else {
            this.updateIcon(this.audio.muted);
        }
    }

    play() {
        if (this.audio.muted) return;
        
        // Always enforce intention to play in memory
        localStorage.setItem('zim_audio_playing', 'true');

        if (!this.audio.paused) {
            return;
        }

        const isStartingFirstTime = (this.audio.volume === 0);

        this.audio.play().then(() => {
            console.log("Audio playing successfully.");
            if (isStartingFirstTime && !this.customFadeRequested) {
                this.fade(this.targetVolume, 2000);
            }
        }).catch(e => {
            console.log("Audio play blocked by browser. Auto-play gesture arming active.");
            this.setupInteractionTrigger();
        });
    }

    pause() {
        this.audio.pause();
        localStorage.setItem('zim_audio_playing', 'false');
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        localStorage.setItem('zim_audio_muted', this.audio.muted);
        this.updateIcon(this.audio.muted);
        
        if (!this.audio.muted) {
            this.play();
        } else {
            if (this.fadeInterval) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
            this.audio.volume = 0;
        }
        return this.audio.muted;
    }

    updateIcon(muted) {
        const icon = document.getElementById('audio-icon');
        if (icon) {
            icon.innerHTML = muted ? 
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>' : 
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
        }
    }

    fade(target, duration, onComplete = null) {
        this.targetVolume = target;
        this.customFadeRequested = true;

        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }

        if (this.audio.muted) {
            if (onComplete) onComplete();
            return;
        }
        
        const initial = this.audio.volume;
        const diff = target - initial;
        if (diff === 0) {
            if (onComplete) onComplete();
            return;
        }

        const interval = 50;
        const steps = duration / interval;
        const stepValue = diff / steps;
        
        let currentStep = 0;
        this.fadeInterval = setInterval(() => {
            currentStep++;
            this.audio.volume = Math.max(0, Math.min(1, initial + (stepValue * currentStep)));
            if (currentStep >= steps) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                this.audio.volume = target;
                if (onComplete) onComplete();
            }
        }, interval);
    }

    setupInteractionTrigger() {
        if (this.triggerSet) return;
        this.triggerSet = true;

        const triggerPlay = () => {
            const isPlaying = localStorage.getItem('zim_audio_playing') === 'true';
            const isMuted = localStorage.getItem('zim_audio_muted') === 'true';
            
            if (isPlaying && !isMuted) {
                if (this.audio.paused) {
                    this.audio.play().then(() => {
                        console.log("Audio playing successfully from gesture trigger.");
                        this.fade(this.targetVolume, 2000);
                        cleanup();
                    }).catch(err => {
                        console.log("Playback retry failed on interaction:", err);
                    });
                } else {
                    cleanup();
                }
            } else {
                cleanup();
            }
        };

        const cleanup = () => {
            window.removeEventListener('click', triggerPlay, { capture: true });
            window.removeEventListener('touchstart', triggerPlay, { capture: true });
            window.removeEventListener('pointerdown', triggerPlay, { capture: true });
            window.removeEventListener('keydown', triggerPlay, { capture: true });
            this.triggerSet = false;
        };

        window.addEventListener('click', triggerPlay, { capture: true });
        window.addEventListener('touchstart', triggerPlay, { capture: true });
        window.addEventListener('pointerdown', triggerPlay, { capture: true });
        window.addEventListener('keydown', triggerPlay, { capture: true });
    }
}

// Singleton pattern
if (!window.ZimAudio) {
    window.ZimAudio = new AudioManager();
}

// Global controls for HTML
window.startZimAudio = () => window.ZimAudio.play();
window.toggleZimMute = () => {
    const muted = window.ZimAudio.toggleMute();
    window.ZimAudio.updateIcon(muted);
};
