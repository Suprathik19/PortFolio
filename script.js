// Portfolio JavaScript - Alex Johnson ECE Portfolio

// State management
let isDarkMode = false;
let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
};
let isSubmitting = false;

// DOM elements (resolve on DOMContentLoaded to avoid null refs)
const themeIcon = document.getElementById('theme-icon');
let successMessage = null;
let contactForm = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeDarkMode();
    initializeForm();
    addScrollEffects();
    handleBackToTopVisibility(); // Initialize back-to-top button state
    initializeSubtitleRotation(); // Rotate job titles
    initParticleNetwork(); // Add interactive particle network
    initTiltEffect(); // Add 3D tilt to cards
    initCyberHudSkills(); // Cyber-HUD Animated Skills
    // initializeSkillInteractions(); // Legacy skills disabled
});

// Dark Mode Functionality
function initializeDarkMode() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setDarkMode(shouldBeDark);
}

function toggleDarkMode() {
    const newDarkMode = !isDarkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');

    // Trigger spin animation on theme icon
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.classList.add('spin');
        setTimeout(() => {
            icon.classList.remove('spin');
        }, 600);
    }
}

function setDarkMode(dark) {
    isDarkMode = dark;
    document.documentElement.classList.add('theme-switching');

    if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
    }

    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Force navbar update immediately
    handleNavbarScroll();

    window.dispatchEvent(new CustomEvent('portfolio-theme-change', {
        detail: { dark }
    }));

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('theme-switching');
        });
    });
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form Handling
function initializeForm() {
    // Query DOM elements now
    contactForm = document.getElementById('contact-form');
    successMessage = document.getElementById('success-message');

    if (!contactForm) {
        console.warn('Contact form not found in DOM.');
        return;
    }

    // Verify EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not found. Make sure the script is loaded.');
        if (successMessage) {
            successMessage.innerHTML = '<p style="color: var(--destructive);">Email service not available. Please contact directly.</p>';
            successMessage.classList.remove('hidden');
        }
        return;
    }

    // Initialize EmailJS (public key provided)
    try {
        emailjs.init("0Iyp6MUC2BWqAeqHT");
        console.log('EmailJS initialized');
    } catch (e) {
        console.error('EmailJS init error', e);
    }

    // Add event listeners to form inputs
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });

    // Add form submit listener
    contactForm.addEventListener('submit', handleSubmit);
}

function handleInputChange(event) {
    const { name, value } = event.target;
    formData[name] = value;
}

async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    isSubmitting = true;
    updateSubmitButton(true);

    try {
        // Send email using EmailJS
        console.log('Sending email via EmailJS...', formData);
        const response = await emailjs.send(
            "service_dovx5kq",      // Service ID (provided)
            "template_olljntb",     // Template ID (updated as requested)
            {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_email: "suprathik973@email.com"  // Your email
            }
        );
        console.log('EmailJS response:', response);

        // EmailJS returns an object; treat status 200 or successful promise as success
        if (!response || response.status === 200 || response.text === 'OK') {
            if (successMessage) {
                successMessage.innerHTML = '<p>Message sent successfully! I\'ll get back to you soon.</p>';
                successMessage.classList.remove('hidden');
            } else {
                showSuccessMessage();
            }
            resetForm();

            // Hide success message after 3 seconds
            setTimeout(hideSuccessMessage, 3000);
        } else {
            console.warn('Unexpected EmailJS response', response);
            throw new Error('Unexpected email service response');
        }
    } catch (error) {
        console.error('Email send failed:', error);
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.innerHTML = '<p style="color: var(--destructive);">Failed to send message. Please try again or contact directly.</p>';
            successMessage.classList.remove('hidden');
            setTimeout(hideSuccessMessage, 4000);
        }
    } finally {
        isSubmitting = false;
        updateSubmitButton(false);
    }
}

function updateSubmitButton(submitting) {
    const submitButton = contactForm.querySelector('.form-submit');
    const buttonText = submitButton.querySelector('span');

    if (submitting) {
        submitButton.disabled = true;
        buttonText.textContent = 'Sending...';
        submitButton.classList.add('loading');
    } else {
        submitButton.disabled = false;
        buttonText.textContent = 'Send Message';
        submitButton.classList.remove('loading');
    }
}

function showSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }
}

function hideSuccessMessage() {
    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}

function resetForm() {
    if (contactForm) {
        contactForm.reset();
    }
    formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
}

// Resume Download
function downloadResume() {
    try {
        // Path to your uploaded resume file
        const resumePath = "SuprathikResume.pdf"; // keep this file in your project folder

        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Menta_Suprathik_Resume.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Resume download initiated');
    } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Sorry, there was an error downloading the resume. Please try again.');
    }
}

// Scroll Effects and Animations
function addScrollEffects() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.achievement-card, .skill-card, .certification-card, .project-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add navbar background on scroll
    window.addEventListener('scroll', handleNavbarScroll);

    // Add flip-card wrappers for project cards to enable backside animations
    // setupProjectFlipCards();
}

// Wrap each .project-card inner content with flip-card structure and wire click


function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const isScrolled = window.scrollY > 50;
    
    if (isScrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Button Hover Effects
document.addEventListener('DOMContentLoaded', function () {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Smooth page load animation
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            setDarkMode(e.matches);
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function (event) {
    // ESC to close any modals or reset form focus
    if (event.key === 'Escape') {
        document.activeElement.blur();
    }

    // Enter on buttons
    if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
        event.target.click();
    }
});

// Performance optimization: Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        // Handle any resize-specific logic here
        console.log('Window resized');
    }, 250);
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    }
}

/* Skills: animated proficiency bars, filters and search */
function initializeSkillInteractions() {
    setupSkillFiltersAndSearch();
    animateSkillBars();
    animateRadialCharts();
}

function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    if (!fills || fills.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const target = parseInt(fill.getAttribute('data-target') || '0', 10);
                // animate width
                requestAnimationFrame(() => {
                    fill.style.width = target + '%';
                });

                // animate number label if present
                const li = fill.closest('li');
                if (li) {
                    const levelLabel = li.querySelector('.skill-level');
                    if (levelLabel) {
                        // count up animation
                        let start = 0;
                        const duration = 900;
                        const startTime = performance.now();
                        function tick(now) {
                            const elapsed = now - startTime;
                            const t = Math.min(1, elapsed / duration);
                            const current = Math.round(start + (target - start) * t);
                            levelLabel.textContent = current + '%';
                            if (t < 1) requestAnimationFrame(tick);
                        }
                        requestAnimationFrame(tick);
                    }
                }

                obs.unobserve(fill);
            }
        });
    }, { threshold: 0.2 });

    fills.forEach(f => {
        // ensure initial zero width
        f.style.width = '0%';
        observer.observe(f);
    });
}

function setupSkillFiltersAndSearch() {
    const filterButtons = document.querySelectorAll('.skill-filter');
    const searchInput = document.getElementById('skill-search');
    const toggleView = document.getElementById('toggle-skill-view');
    const skillsGrid = document.getElementById('skills-grid');

    function applyFilter(filter) {
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach(card => {
            const cat = card.getAttribute('data-category') || '';
            if (filter === 'all' || cat === filter) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.getAttribute('data-filter');
            applyFilter(f);
        });
    });

    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const q = (e.target.value || '').toLowerCase().trim();
                const items = document.querySelectorAll('.skill-list li');
                items.forEach(li => {
                    const name = (li.querySelector('.skill-name')?.textContent || '').toLowerCase();
                    li.style.display = name.indexOf(q) !== -1 ? '' : 'none';
                });
            }, 150);
        });
    }

    if (toggleView && skillsGrid) {
        toggleView.addEventListener('click', () => {
            // Toggle between list and radial views
            const skillsSection = document.querySelector('.skills-section');
            if (skillsSection) {
                const isRadial = skillsSection.classList.toggle('radial-view');
                toggleView.textContent = isRadial ? 'List View' : 'Radial View';
            } else {
                skillsGrid.classList.toggle('list-view');
                toggleView.textContent = skillsGrid.classList.contains('list-view') ? 'Grid View' : 'List View';
            }
            // ensure radial charts animate when shown
            if (skillsSection && skillsSection.classList.contains('radial-view')) {
                animateRadialCharts();
            }
        });
    }
}

/* Radial charts animation */
function animateRadialCharts() {
    const radials = document.querySelectorAll('.radial-skill');
    if (!radials || radials.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const progress = el.querySelector('.radial-progress');
                const percentLabel = el.querySelector('.radial-percent');
                const target = parseInt(progress?.getAttribute('data-percentage') || el.getAttribute('data-percent') || '0', 10);

                if (progress) {
                    const r = parseFloat(progress.getAttribute('r')) || 32;
                    const circumference = 2 * Math.PI * r;
                    // set stroke-dasharray in case different radius
                    progress.style.strokeDasharray = circumference;
                    // animate to the correct offset
                    const offset = Math.round(circumference * (1 - target / 100) * 1000) / 1000;
                    // apply with a small timeout to ensure CSS transition
                    requestAnimationFrame(() => {
                        progress.style.strokeDashoffset = offset;
                    });
                }

                if (percentLabel) {
                    // count up animation
                    const duration = 900;
                    const startTime = performance.now();
                    function tick(now) {
                        const elapsed = now - startTime;
                        const t = Math.min(1, elapsed / duration);
                        const current = Math.round(target * t);
                        percentLabel.textContent = current + '%';
                        if (t < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                }

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    radials.forEach(r => {
        // ensure initial offset (full circle hidden)
        const progress = r.querySelector('.radial-progress');
        if (progress) {
            const rr = parseFloat(progress.getAttribute('r')) || 32;
            const circ = 2 * Math.PI * rr;
            progress.style.strokeDasharray = circ;
            progress.style.strokeDashoffset = circ;
        }
        observer.observe(r);
    });
}

// Close mobile menu when a link is clicked
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            const hamburger = document.querySelector('.hamburger-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            if (hamburger && mobileMenu) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });
});

// Back to Top Button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide back-to-top button on scroll
function handleBackToTopVisibility() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

window.addEventListener('scroll', handleBackToTopVisibility);

// Animate achievement counters when they come into view
function animateCounters() {
    const achievementNumbers = document.querySelectorAll('.achievement-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counting')) {
                entry.target.classList.add('counting');
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    achievementNumbers.forEach(number => {
        counterObserver.observe(number);
    });
}

// Call animate counters on page load
document.addEventListener('DOMContentLoaded', animateCounters);

// Animated subtitle rotation
// Typing animation for the hero subtitle.
// Replaces the simple rotation with a letter-by-letter typing effect.
function initializeSubtitleRotation() {
    console.log('Initializing subtitle rotation...');
    const subtitleWrapper = document.querySelector('.hero-subtitle');
    const typedEl = document.getElementById('typed-text');

    if (!subtitleWrapper || !typedEl) {
        console.error('Subtitle elements not found:', { wrapper: !!subtitleWrapper, el: !!typedEl });
        return;
    }

    /*
      Easy-to-edit variables:
      - texts: array of strings to type (edit as needed)
      - typingDelay: ms between typing each char
      - erasingDelay: ms between erasing each char
      - newTextDelay: ms to wait after a full word is typed
    */
    const texts = ['Web Developer', 'Embedded System Enthusiast', 'AI Explorer']; // Updated: added user requested titles
    const typingDelay = 80;    // typing speed (ms)
    const erasingDelay = 40;   // erasing speed (ms)
    const newTextDelay = 1600; // pause after word is typed (ms)

    let textIndex = 0;
    let charIndex = 0;

    // Start with an empty element if we are animating
    // Note: We leave default text in HTML for SEO/Fallbacks, but clear it here to start animation
    typedEl.textContent = '';

    // Type characters one by one
    function type() {
        // Safety check
        if (!texts || !texts.length) return;

        const currentText = texts[textIndex];
        if (charIndex < currentText.length) {
            typedEl.textContent += currentText.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            // Full text typed — wait then erase
            setTimeout(erase, newTextDelay);
        }
    }

    // Erase characters one by one
    function erase() {
        if (charIndex > 0) {
            const currentText = texts[textIndex];
            typedEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            // Move to next text (loop)
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, typingDelay + 150);
        }
    }

    // Kick off typing after a short delay
    console.log('Starting typing animation loop');
    setTimeout(type, 500);
}


// Interactive Particle Network
function initParticleNetwork() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const mouseDistance = 200;

    // Mouse tracking
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize handling
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = isDarkMode ? 'rgba(139, 92, 246, ' : 'rgba(99, 102, 241, '; // violet/indigo base
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction (Repulsion + Connectivity)
            if (mouse.x != null) {
                const checkedPx = this.x - mouse.x;
                const checkedPy = this.y - mouse.y;
                const distance = Math.sqrt(checkedPx * checkedPx + checkedPy * checkedPy);

                // Repulsion (Push particles away slightly)
                if (distance < mouseDistance) {
                    const forceDirectionX = checkedPx / distance;
                    const forceDirectionY = checkedPy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 5; // Increased push strength
                    const directionY = forceDirectionY * force * 5;

                    this.vx += directionX * 0.1;
                    this.vy += directionY * 0.1;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.5)';
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect particles to each other
            for (let j = index; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = p.color + (opacity * 0.2) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect particles to Mouse (Interactive Neural Link)
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / mouseDistance);
                    ctx.strokeStyle = isDarkMode ? 'rgba(0, 255, 255, ' + opacity * 0.5 + ')' : 'rgba(139, 92, 246, ' + opacity * 0.5 + ')'; // Cyan/Violet link
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// 3D Tilt Effect for Cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .skill-card, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// Cyber-HUD Skills Animation
function initCyberHudSkills() {
    const skillsSection = document.querySelector('.cyber-hud-skills');
    if (!skillsSection) return;

    const progressBars = document.querySelectorAll('.hud-progress-fill');
    const percentTexts = document.querySelectorAll('.hud-percent');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);

    function animateSkills() {
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            // Reset to 0 first
            bar.style.width = '0%';

            // Artificial delay for "system boot" feel
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });

        percentTexts.forEach(text => {
            const target = parseInt(text.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 1500; // ms
            const stepTime = Math.abs(Math.floor(duration / target));

            const timer = setInterval(() => {
                current += 1;
                text.textContent = current + "%";
                if (current >= target) {
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }
}

// Project Filtering
function filterProjects(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    // Update Buttons
    buttons.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter Logic
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 50);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Expose these to global scope so HTML onclick can assign them
window.filterProjects = filterProjects;

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initParticleNetwork,
        initTiltEffect,
        initCyberHudSkills,
        filterProjects
    };
}

// ============================================================
//  DYNAMIC PORTFOLIO RENDERER
//  Reads from PortfolioData (portfolio-data.js + localStorage)
//  and renders all sections. Called on DOMContentLoaded.
// ============================================================

function initDynamicPortfolio() {
  const data = PortfolioData.load();
  renderStats(data.stats);
  renderEducation(data.education);
  renderSkills(data.skills);
  renderCertifications(data.certifications);
  renderProjects(data.projects);

  // Listen for cross-tab updates from admin panel
  window.addEventListener('storage', function(e) {
    if (e.key === 'suprathik_portfolio_data') {
      const fresh = PortfolioData.load();
      renderStats(fresh.stats);
      renderEducation(fresh.education);
      renderSkills(fresh.skills);
      renderCertifications(fresh.certifications);
      renderProjects(fresh.projects);
      // Re-init animated skills
      setTimeout(initCyberHudSkills, 100);
    }
  });
}

function renderStats(stats) {
  const map = {
    'stat-cgpa': stats.cgpa,
    'stat-projects': stats.projects,
    'stat-problems': stats.problems,
    'stat-certifications': stats.certifications,
    'stat-internships': stats.internships
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
  // Update education CGPA display too
  const eduCgpa = document.getElementById('edu-cgpa-display');
  if (eduCgpa) eduCgpa.textContent = 'CGPA: ' + stats.cgpa + '/10';
}

function renderEducation(education) {
  const container = document.getElementById('education-content');
  if (!container) return;

  container.innerHTML = education.map(edu => `
    <div class="education-card">
      <div class="education-main">
        <div class="education-degree">
          <h3 class="degree-title">${escHtml(edu.degree)}</h3>
          <p class="university-name">${escHtml(edu.institution)}</p>
          <div class="education-meta">
            <span class="education-duration">
              <i class="fas fa-calendar-alt"></i>
              ${escHtml(edu.years)}
            </span>
            <span class="education-gpa">
              <i class="fas fa-star"></i>
              ${escHtml(edu.grade)}
            </span>
          </div>
        </div>
        <div class="education-icon">
          <i class="${escHtml(edu.icon)}"></i>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSkills(skills) {
  const container = document.getElementById('skills-hud');
  if (!container) return;

  container.innerHTML = skills.map(cat => `
    <div class="hud-category">
      <h3 class="hud-category-title"><i class="${escHtml(cat.icon)}"></i> ${escHtml(cat.category)}</h3>
      <div class="hud-skill-group">
        ${cat.items.map(sk => `
          <div class="hud-skill">
            <div class="hud-skill-info">
              <span class="hud-skill-name">${escHtml(sk.name)}</span>
              <span class="hud-percent" data-target="${sk.pct}">0%</span>
            </div>
            <div class="hud-progress-container">
              <div class="hud-progress-fill" data-width="${sk.pct}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Re-run the animation
  setTimeout(initCyberHudSkills, 50);
}

function renderCertifications(certifications) {
  const container = document.getElementById('certification-cards');
  if (!container) return;

  container.innerHTML = certifications.map(cert => `
    <div class="cert-card" style="opacity:1;transform:translateY(0);transition:opacity 0.6s,transform 0.6s;">
      <div class="cert-icon">
        <i class="${escHtml(cert.icon)}"></i>
      </div>
      <div class="cert-content">
        <h3 class="cert-title">${escHtml(cert.name)}</h3>
        <p class="cert-issuer">${escHtml(cert.issuer)}</p>
        <p class="cert-date">${escHtml(cert.date)}</p>
        <p class="cert-description">${escHtml(cert.description)}</p>
      </div>
    </div>
  `).join('');
}

function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = projects.map(proj => `
    <div class="project-card" data-category="${escHtml(proj.category)}"
         style="opacity:1;transform:translateY(0);transition:opacity 0.6s,transform 0.6s;">
      <div class="project-header">
        <h3 class="project-title">${escHtml(proj.name)}</h3>
        <a href="${escHtml(proj.github || '#')}" class="btn-neon-sm" target="_blank" aria-label="View Project">
          <i class="fas fa-code-branch"></i> Code
        </a>
      </div>
      <p class="project-description">${escHtml(proj.description)}</p>
      <div class="project-tech">
        ${proj.tech.map(t => `<span class="tech-badge">${escHtml(t)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  // Re-wire tilt and filter
  initTiltEffect();
  // Restore active filter
  filterProjects('all');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', initDynamicPortfolio);
