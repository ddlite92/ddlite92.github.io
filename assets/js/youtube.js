// Smooth scrolling for navigation (your existing code)
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate offset for fixed navbar
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// YouTube slider functionality (new code)
document.addEventListener('DOMContentLoaded', function() {
    // Select slider elements
    const slider = document.querySelector('.slider');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    // Only initialize slider if elements exist on page
    if (slider && leftArrow && rightArrow) {
        // How much to scroll on each click (matches your card width + margin)
        const scrollAmount = 500; // Adjust this value as needed
        
        // Left arrow click handler
        leftArrow.addEventListener('click', function() {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Right arrow click handler
        rightArrow.addEventListener('click', function() {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Optional: Keyboard arrow key support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });

        // Optional: Touch/swipe support for mobile
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.scrollBehavior = 'auto'; // Disable smooth scrolling during drag
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth'; // Re-enable smooth scrolling
        });

        slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Adjust multiplier for faster/slower dragging
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});