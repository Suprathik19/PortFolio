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
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeForm();
    addScrollEffects();
    handleBackToTopVisibility(); // Initialize back-to-top button state
    initializeSubtitleRotation(); // Rotate job titles
    createFallingSnowballs(); // Add falling snowballs to hero
    initializeSkillInteractions(); // animate and wire skill filters/search
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
    
    if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
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
    setupProjectFlipCards();
}

// Wrap each .project-card inner content with flip-card structure and wire click


function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = isDarkMode 
            ? 'rgba(10, 10, 10, 0.9)' 
            : 'rgba(255, 255, 255, 0.9)';
    } else {
        navbar.style.background = isDarkMode 
            ? 'rgba(10, 10, 10, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)';
    }
}

// Button Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            setDarkMode(e.matches);
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
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
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
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
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
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
    const subtitleWrapper = document.querySelector('.hero-subtitle');
    const typedEl = document.getElementById('typed-text');
    if (!subtitleWrapper || !typedEl) return;

    /*
      Easy-to-edit variables:
      - texts: array of strings to type (edit as needed)
      - typingDelay: ms between typing each char
      - erasingDelay: ms between erasing each char
      - newTextDelay: ms to wait after a full word is typed
    */
    const texts = ['Web developer']; // <-- edit this array to change typed text(s)
    const typingDelay = 80;    // typing speed (ms)
    const erasingDelay = 40;   // erasing speed (ms)
    const newTextDelay = 1600; // pause after word is typed (ms)

    let textIndex = 0;
    let charIndex = 0;

    // Start with an empty element
    typedEl.textContent = '';

    // Type characters one by one
    function type() {
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
    setTimeout(type, 500);
}

// Falling snowball particles
function createFallingSnowballs() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const snowballContainer = document.createElement('div');
    snowballContainer.className = 'snowballs-container';
    heroSection.appendChild(snowballContainer);

    // Create 5-8 falling snowballs
    const snowballCount = 6 + Math.random() * 3;
    
    for (let i = 0; i < snowballCount; i++) {
        const snowball = document.createElement('div');
        snowball.className = 'snowball';
        
        // Random size
        const size = 8 + Math.random() * 16;
        snowball.style.width = size + 'px';
        snowball.style.height = size + 'px';
        
        // Random horizontal position
        snowball.style.left = Math.random() * 100 + '%';
        
        // Random animation duration (falling speed)
        const duration = 8 + Math.random() * 6;
        snowball.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 3;
        snowball.style.animationDelay = delay + 's';
        
        snowballContainer.appendChild(snowball);
    }
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleDarkMode,
        scrollToSection,
        downloadResume,
        handleSubmit,
        toggleMobileMenu,
        scrollToTop,
        initializeSubtitleRotation,
        createFallingSnowballs
    };
}

console.log('🚀 Portfolio JavaScript loaded successfully!');