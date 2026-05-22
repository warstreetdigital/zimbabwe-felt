document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-full');
    
    // Intersection Observer for Active State
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            } else {
                // Keep the state for a smoother exit animation or remove it
                // entry.target.classList.remove('is-active');
            }
        });
    }, {
        threshold: 0.5 // Trigger when half of the section is visible
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Parallax Effect on Scroll
    const container = document.querySelector('.snap-container');
    if (container) {
        container.addEventListener('scroll', () => {
            const scrolled = container.scrollTop;
            
            sections.forEach(section => {
                if (section.classList.contains('is-active')) {
                    const content = section.querySelector('.section-content');
                    if (content) {
                        // Subtle parallax for content
                        const offset = (scrolled - section.offsetTop) * 0.15;
                        content.style.transform = `translateY(${offset}px)`;
                    }
                    
                    const bg = section.querySelector('.bg-image');
                    if (bg) {
                        // Subtle parallax for background
                        const bgOffset = (scrolled - section.offsetTop) * 0.05;
                        bg.style.transform = `scale(1.1) translateY(${bgOffset}px)`;
                    }
                }
            });
        });
    }
});
