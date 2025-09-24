// Portfolio JavaScript - Gonçalo Arezes
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupMagneticEffects();
        this.setupContactForm();
        this.setupCVDownload();
        this.setupScrollReveal();
        this.setupParallax();
    }

    // Navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navIndicator = document.getElementById('nav-indicator');
        const sections = document.querySelectorAll('.section');
        
        // Smooth scroll to sections
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle scroll-to buttons
        document.querySelectorAll('[data-scroll-to]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-scroll-to');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation state on scroll
        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 100;
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                    this.updateNavIndicator(link, navIndicator);
                }
            });
        };

        // Initial nav update
        updateActiveNav();
        
        // Update on scroll with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveNav, 10);
        });
    }

    updateNavIndicator(activeLink, indicator) {
        if (activeLink && indicator) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = activeLink.closest('.nav-container').getBoundingClientRect();
            
            indicator.style.left = `${linkRect.left - navRect.left}px`;
            indicator.style.width = `${linkRect.width}px`;
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .experience-item, .project-card');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Magnetic hover effects
    setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                
                this.addMagneticEffect(e.target);
            });

            element.addEventListener('mouseleave', (e) => {
                this.removeMagneticEffect(e.target);
            });
        });
    }

    addMagneticEffect(element) {
        element.addEventListener('mousemove', this.handleMagneticMove.bind(this));
    }

    removeMagneticEffect(element) {
        element.removeEventListener('mousemove', this.handleMagneticMove.bind(this));
        element.style.transform = '';
    }

    handleMagneticMove(e) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const element = e.target;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-2px)`;
    }

    // Contact form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const formMessage = document.getElementById('form-message');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    website: formData.get('website') // Honeypot
                };

                // Check honeypot
                if (data.website) {
                    this.showFormMessage('Spam detected. Please try again.', 'error');
                    return;
                }

                // Validate required fields
                if (!data.name || !data.email || !data.message) {
                    this.showFormMessage('Please fill in all required fields.', 'error');
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    this.showFormMessage('Please enter a valid email address.', 'error');
                    return;
                }

                // Show loading state
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'flex';

                try {
                    // Simulate API call
                    await this.simulateFormSubmission(data);
                    
                    this.showFormMessage(
                        'Thank you for your message! I\'ll get back to you soon.',
                        'success'
                    );
                    form.reset();
                } catch (error) {
                    this.showFormMessage(
                        'Sorry, there was an error sending your message. Please try emailing me directly.',
                        'error'
                    );
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'block';
                    btnLoading.style.display = 'none';
                }
            });
        }
    }

    async simulateFormSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data for demonstration
        console.log('Form submission:', data);
        
        // In a real application, you would send this to your API:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Simulated error'));
        }
    }

    showFormMessage(message, type) {
        const formMessage = document.getElementById('form-message');
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // CV Download functionality
    setupCVDownload() {
        const cvButtons = document.querySelectorAll('.cv-download');
        
        cvButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadCV();
            });
        });
    }

    downloadCV() {
        // In a real application, this would link to an actual PDF file
        // For demo purposes, we'll create a placeholder PDF content
        const cvData = this.generateCVContent();
        
        const blob = new Blob([cvData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Goncalo_Arezes_CV.txt';
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show feedback
        this.showDownloadFeedback();
    }

    generateCVContent() {
        return `
GONÇALO AREZES
AI Research Intern & MSc AI Student
Email: goncaloarezes@gmail.com
Phone: +351 919 875 023
Location: Porto, Portugal

PROFILE
Dynamic and results-oriented engineer with a strong foundation in Artificial Intelligence, electrical, and computer engineering. Demonstrated adaptability through international study, showcasing independence and cultural competence. A proactive problem-solver skilled in Python and a range of development tools, committed to excellence and innovation in fast-paced, collaborative environments.

EDUCATION
Master in Artificial Intelligence (2024 – Present)
Maastricht University, Netherlands
- Data Mining, Intelligent Search & Games, Advanced Concepts in Machine Learning
- Network Science, Agents and Multi-Agent Systems, Explainable AI
- Computer Vision, Autonomous Robotic Systems

Bachelor's Degree in Electrical and Computer Engineering (2021 – 2024)
Faculdade de Engenharia da Universidade do Porto (FEUP), Portugal
- Solid foundation in electrical engineering and computer science, with numerous hands-on projects

EXPERIENCE
AI Research Intern (Sep 2025 – Present)
CEiiA (Centre of Engineering and Product Development), Porto, Portugal
- Developing AI-driven pipelines for Earth Observation (EO) data
- Enhancing annotation workflows through pre-annotation, active learning, and semi-automated segmentation strategies

Internship (Feb 2024 – Jul 2024)
iServices Lab, Porto, Portugal
- Optimized electrotechnical systems, improving diagnostic efficiency of repair workflows
- Repaired and tested diverse hardware/software components

SKILLS
Programming: Python (Pandas, NumPy, Scikit-Learn, Matplotlib), C/C++, C#
Data & ML: Model training, Data Preprocessing, Network Analysis, NLP
Tools: Git, Jupyter Notebook, Google Colab, Anaconda, Visual Studio Code
AI Platforms: ChatGPT, Perplexity, Claude, DeepSeek, Manus
Software: Gephi, Figma, LT Spice, Microsoft Office

LANGUAGES
Portuguese (Native), English (C1 - IELTS Band 7)
        `;
    }

    showDownloadFeedback() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        notification.textContent = 'CV downloaded successfully!';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Scroll reveal animations
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.section-header, .hero-content > *');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('fade-in-up');
            revealObserver.observe(el);
        });
    }

    // Subtle parallax effect
    setupParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const heroParticles = document.querySelector('.hero-particles');
        
        if (heroParticles) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrolled = window.pageYOffset;
                    const speed = scrolled * 0.5;
                    
                    heroParticles.style.transform = `translateY(${speed}px)`;
                }, 10);
            });
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Analytics tracking (placeholder for Plausible or Google Analytics)
function trackEvent(eventName, eventData = {}) {
    // Plausible tracking
    if (window.plausible) {
        window.plausible(eventName, { props: eventData });
    }
    
    // Google Analytics tracking
    if (window.gtag) {
        window.gtag('event', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Track user interactions
document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
        if (target.classList.contains('cv-download')) {
            trackEvent('CV Download');
        } else if (target.classList.contains('nav-link')) {
            trackEvent('Navigation', { section: target.textContent });
        } else if (target.type === 'submit') {
            trackEvent('Contact Form Submit');
        }
    }
});

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
};

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', preloadCriticalResources);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Add keyboard navigation styles
const keyboardStyles = document.createElement('style');
keyboardStyles.textContent = `
    body:not(.using-keyboard) *:focus {
        outline: none;
    }
    
    .using-keyboard *:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardStyles);