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

// DOM elements
const themeIcon = document.getElementById('theme-icon');
const successMessage = document.getElementById('success-message');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeForm();
    addScrollEffects();
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
    if (!contactForm) return;
    
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
    
    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    resetForm();
    
    isSubmitting = false;
    updateSubmitButton(false);
    
    // Hide success message after 3 seconds
    setTimeout(hideSuccessMessage, 3000);
}

function updateSubmitButton(submitting) {
    const submitButton = contactForm.querySelector('.form-submit');
    const buttonText = submitButton.querySelector('span');
    
    if (submitting) {
        submitButton.disabled = true;
        buttonText.textContent = 'Sending...';
    } else {
        submitButton.disabled = false;
        buttonText.textContent = 'Send Message';
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
    const resumeContent = `ALEX JOHNSON
Electrical & Computer Engineering Student

CONTACT INFORMATION
Email: suprathik973@email.com
LinkedIn: /in/mentasuprathik
GitHub: @alexjohnson

EDUCATION
Bachelor of Science in Electronics & Communication Engineering
University Name | Expected Graduation: 2027
GPA: 9.3/10

TECHNICAL SKILLS
Programming: Python, C/C++, Java, JavaScript, TypeScript, VHDL, Assembly
Web Development: React, Node.js, Express, HTML/CSS, REST APIs, MongoDB, PostgreSQL
Embedded Systems: Arduino, Raspberry Pi, STM32, FPGA, Microcontrollers
Tools: Git, Docker, Linux, MATLAB, Simulink, KiCad, Altium Designer, AWS

PROJECTS
• Smart Home IoT System - ESP32, React, Node.js, MQTT, MongoDB
• Digital Signal Processing Filter - VHDL, MATLAB, FPGA, Xilinx
• Full-Stack Web Application - React, Express.js, PostgreSQL, JWT
• Autonomous Line-Following Robot - Python, OpenCV, Raspberry Pi

CERTIFICATIONS
• Embedded Systems Design - Maven Silicon (july 2025)
• Oracle Cloud Infrastructure 2025 Generative AI Professional (August 2025)
• C Certification - Applogic Computer Institute (June-Aug 2023)
• Python Certification - Applogic Computer Institute (May-June 2023)

ACHIEVEMENTS
• First Place - UI/UX Design Competition, VIT University (Feb 2024)
• First Place - Code Sprint Challenge, CSI Chapter VIT-AP (Nov 2023)
• 100+ Coding Problems Solved
• 15+ Projects Completed
• 3 Internships

EXPERIENCE
Software Engineering Intern | Tech Company | Summer 2023
• Developed embedded software for IoT devices
• Collaborated on full-stack web applications
• Implemented signal processing algorithms

This is a sample resume. Please replace with actual content.`;
    
    try {
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'Alex_Johnson_Resume.txt';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(url);
        
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
}

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

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleDarkMode,
        scrollToSection,
        downloadResume,
        handleSubmit
    };
}

console.log('🚀 Portfolio JavaScript loaded successfully!');