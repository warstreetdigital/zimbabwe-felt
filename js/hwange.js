/**
 * Hwange Living Encounter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Encounter Data
    const encounters = [
        {
            id: 'elephant',
            name: 'Elephant',
            clue: 'Deep, rhythmic footsteps crush the dry earth nearby...',
            action: 'FOLLOW THE FOOTSTEPS',
            revealImg: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=2000',
            story: '“The elephant remembers every path.”',
            sound: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            hasEyes: false
        },
        {
            id: 'lion',
            name: 'Lion',
            clue: 'A sudden, absolute silence falls over the grass...',
            action: 'REMAIN STILL',
            revealImg: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=2000',
            story: '“The lion waits before it moves.”',
            sound: 'https://assets.mixkit.co/active_storage/sfx/2564/2564-preview.mp3',
            hasEyes: true
        },
        {
            id: 'hyena',
            name: 'Hyena',
            clue: 'A cold, sharp laughter ripples through the shadows...',
            action: 'LISTEN TO THE DARK',
            revealImg: 'https://images.unsplash.com/photo-1590420485404-f86d22b8abf8?auto=format&fit=crop&q=80&w=2000',
            story: '“The hyena hears what fear hides.”',
            sound: 'https://assets.mixkit.co/active_storage/sfx/2562/2562-preview.mp3',
            hasEyes: true
        }
    ];

    let currentEncounterIndex = -1;
    let isEncounterActive = false;
    const system = document.querySelector('.hwange-system');
    const intro = document.querySelector('.hwange-intro');
    const encounterUi = document.querySelector('.encounter-ui');
    const clueText = document.querySelector('.clue-text');
    const actionBtn = document.querySelector('.action-btn');
    const revealLayer = document.querySelector('.reveal-layer');
    const storyText = document.querySelector('.micro-story');
    const tensionPulse = document.querySelector('.tension-pulse');

    // 2. Audio Priority & Environmental Ambiance
    const initAudio = () => {
        if (window.ZimAudio) {
            window.ZimAudio.fade(0.1, 4000); 
        }
    };

    // 3. System Initialization
    const initWild = () => {
        initAudio();
        // Pause before first signal
        setTimeout(triggerEncounterClue, 6000);
    };

    const triggerEncounterClue = () => {
        if (isEncounterActive) return;
        isEncounterActive = true;

        if (intro) intro.classList.add('fade-out');
        
        currentEncounterIndex = (currentEncounterIndex + 1) % encounters.length;
        const current = encounters[currentEncounterIndex];

        // UI Prep
        clueText.innerText = current.clue;
        actionBtn.innerText = current.action;
        tensionPulse.classList.add('active-pulse');

        // Play environmental trigger sound (subtle)
        const triggerAudio = new Audio(current.sound);
        triggerAudio.volume = 0.3;
        triggerAudio.play().catch(e => console.log("Audio prevented"));

        // Wait for the sound to pique interest before showing the action
        setTimeout(() => {
            encounterUi.classList.add('visible');
        }, 3000);
    };

    const resolveEncounter = () => {
        encounterUi.classList.remove('visible');
        tensionPulse.classList.remove('active-pulse');
        
        const current = encounters[currentEncounterIndex];
        
        // Clear reveal layer
        revealLayer.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = current.revealImg;
        img.className = 'animal-reveal';
        revealLayer.appendChild(img);

        // Add eyes if predator
        if (current.hasEyes) {
            const eyes = document.createElement('div');
            eyes.className = 'eyes-overlay';
            eyes.innerHTML = '<div class="eye"></div><div class="eye"></div>';
            revealLayer.appendChild(eyes);
        }

        // Cinematic Reveal sequence
        setTimeout(() => {
            img.classList.add('visible');
            
            // Wait for image to settle before line
            setTimeout(() => {
                storyText.innerText = current.story;
                storyText.classList.add('visible');
            }, 2500);
        }, 100);

        // Reset to wild state after deep immersion
        setTimeout(() => {
            img.classList.remove('visible');
            storyText.classList.remove('visible');
            
            setTimeout(() => {
                revealLayer.innerHTML = '';
                isEncounterActive = false;
                // Deeper pause after an encounter
                setTimeout(triggerEncounterClue, 12000);
            }, 3000);
        }, 12000);
    };

    if (actionBtn) {
        actionBtn.addEventListener('click', resolveEncounter);
    }

    // Start the engine
    initWild();

    // 4. Parallax/Motion
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        const bg = document.querySelector('.env-bg');
        if (bg) {
            bg.style.transform = `scale(1.1) translate(${x * 20}px, ${y * 20}px)`;
        }
    });
});
