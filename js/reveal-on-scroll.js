document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.policy, .news-block, .services-page .service-row');

    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach((target) => target.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.16 });

    targets.forEach((target) => observer.observe(target));

    document.querySelectorAll('[data-about-gallery]').forEach((gallery) => {
        const track = gallery.querySelector('.about-pair-track');
        const dots = gallery.querySelector('.about-pair-dots');
        const slides = Array.from(track.children);
        let currentIndex = 0;
        let startX = 0;

        const updateGallery = (index) => {
            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.querySelectorAll('.about-pair-dot').forEach((dot, dotIndex) => {
                dot.classList.toggle('active', dotIndex === currentIndex);
            });
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.className = 'about-pair-dot' + (index === 0 ? ' active' : '');
            dot.type = 'button';
            dot.setAttribute('aria-label', `画像${index + 1}を表示`);
            dot.addEventListener('click', () => updateGallery(index));
            dots.appendChild(dot);
        });

        let autoSlide = null;
        const startAutoSlide = () => {
            if (window.innerWidth > 768 || autoSlide) return;
            autoSlide = window.setInterval(() => {
                updateGallery(currentIndex + 1 >= slides.length ? 0 : currentIndex + 1);
            }, 3500);
        };
        const stopAutoSlide = () => {
            window.clearInterval(autoSlide);
            autoSlide = null;
        };

        track.addEventListener('touchstart', (event) => {
            stopAutoSlide();
            startX = event.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (event) => {
            const distance = event.changedTouches[0].clientX - startX;
            if (Math.abs(distance) >= 40) {
                updateGallery(currentIndex + (distance < 0 ? 1 : -1));
            }
            startAutoSlide();
        }, { passive: true });

        dots.addEventListener('click', stopAutoSlide);
        startAutoSlide();
    });
});
