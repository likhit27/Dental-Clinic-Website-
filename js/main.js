document.addEventListener('DOMContentLoaded', () => {

    /* --- Tabs Functionality --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = `tab-${btn.dataset.tab}`;
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    /* --- Accordion Functionality --- */
    const accordionBtns = document.querySelectorAll('.accordion-btn');

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active state of button
            this.classList.toggle('active');

            // Toggle active state of the panel
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                // If it's open, close it
                panel.style.maxHeight = null;
            } else {
                // If it's closed, open it
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
            
            // Optional: Close other open panels
            accordionBtns.forEach(otherBtn => {
                if (otherBtn !== this && otherBtn.classList.contains('active')) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

    /* --- Appointment Form Functionality --- */
    const appointmentForm = document.getElementById('appointment-form');
    const dateInput = document.getElementById('date');
    const formSuccess = document.getElementById('form-success');

    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const data = {
                firstName: document.getElementById('fname').value.trim(),
                lastName:  document.getElementById('lname').value.trim(),
                phone:     document.getElementById('phone').value.trim(),
                email:     document.getElementById('email').value.trim(),
                date:      document.getElementById('date').value,
                time:      document.getElementById('time').value,
                service:   document.getElementById('service').value,
                message:   document.getElementById('message').value.trim(),
            };

            try {
                const res = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (res.ok) {
                    formSuccess.classList.remove('hidden');
                    appointmentForm.reset();
                    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
                } else {
                    const err = await res.json();
                    alert('Something went wrong: ' + (err.error || 'Please try again.'));
                }
            } catch (networkErr) {
                alert('Network error. Please check your connection and try again.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    /* --- Navbar & Smooth Scroll Logic --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinksContainer) {
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });

        // Close mobile menu on click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('open')) {
                    navLinksContainer.classList.remove('open');
                }
            });
        });
    }

    // Highlighting active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // 70 is the navbar height, so 80 is a good threshold
                if (window.scrollY >= (sectionTop - 80)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

});