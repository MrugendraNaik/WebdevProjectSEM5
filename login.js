 let currentTab = 'signin';

        // Tab switching
        function switchTab(tab) {
            currentTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Update slider
            const slider = document.getElementById('tabSlider');
            if (tab === 'signup') {
                slider.classList.add('signup');
            } else {
                slider.classList.remove('signup');
            }
            
            // Show/hide forms
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(tab + 'Section').classList.add('active');
        }

        // Sign in form handling
        document.getElementById('signinForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = document.getElementById('signinBtn');
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            if (!email || !password) return;
            
            // Add loading state
            button.classList.add('loading');
            button.textContent = 'Signing In';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                button.classList.remove('loading');
                button.classList.add('success');
                button.textContent = 'Welcome Back! 🎵';
                button.disabled = false;
                
                setTimeout(() => {
                    window.location.href = 'landing.html';
                }, 1500);
            }, 2000);
        });

        // Sign up form handling
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = document.getElementById('signupBtn');
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showError(button, 'Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showError(button, 'Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                showError(button, 'Password must be at least 6 characters');
                return;
            }
            
            // Add loading state
            button.classList.add('loading');
            button.textContent = 'Creating Account';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                button.classList.remove('loading');
                button.classList.add('success');
                button.textContent = 'Account Created! 🎉';
                button.disabled = false;
                
                setTimeout(() => {
                    window.location.href = 'landing.html';
                }, 1500);
            }, 2000);
        });

        // Error handling
        function showError(button, message) {
            const originalText = button.textContent;
            button.classList.add('error');
            button.textContent = message;
            
            setTimeout(() => {
                button.classList.remove('error');
                button.textContent = originalText;
            }, 3000);
        }

        // Input validation feedback
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        this.style.borderColor = '#ef4444';
                    } else {
                        this.style.borderColor = '#16a34a';
                    }
                }
                
                if (this.id === 'confirmPassword' && this.value) {
                    const password = document.getElementById('signupPassword').value;
                    if (this.value !== password) {
                        this.style.borderColor = '#ef4444';
                    } else {
                        this.style.borderColor = '#16a34a';
                    }
                }
            });
            
            input.addEventListener('input', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.matches('.form-input')) {
                e.preventDefault();
                const form = e.target.closest('form');
                const inputs = Array.from(form.querySelectorAll('.form-input'));
                const currentIndex = inputs.indexOf(e.target);
                
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                } else {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
// Create animated particles (same as landing page)
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Call it when page loads
window.addEventListener('load', createParticles);
