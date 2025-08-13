        // Create animated particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
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

        // Billing toggle functionality
        const billingToggle = document.getElementById('billingToggle');
        const monthlyLabel = document.getElementById('monthlyLabel');
        const yearlyLabel = document.getElementById('yearlyLabel');
        const priceAmounts = document.querySelectorAll('.price-amount');
        const yearlyPrices = document.querySelectorAll('.yearly-price');

        let isYearly = false;

        billingToggle.addEventListener('click', () => {
            isYearly = !isYearly;
            billingToggle.classList.toggle('active');
            
            if (isYearly) {
                monthlyLabel.classList.remove('active');
                yearlyLabel.classList.add('active');
                
                // Update prices for yearly
                priceAmounts[0].textContent = '119'; // Harmony yearly
                priceAmounts[1].textContent = '239'; // Symphony yearly
                
                // Show original monthly prices
                yearlyPrices.forEach(price => {
                    price.style.display = 'inline';
                });
                
                // Update period text
                document.querySelectorAll('.plan-period').forEach(period => {
                    if (!period.textContent.includes('forever')) {
                        period.textContent = 'per month (billed yearly)';
                    }
                });
                
            } else {
                monthlyLabel.classList.add('active');
                yearlyLabel.classList.remove('active');
                
                // Update prices for monthly
                priceAmounts[0].textContent = '149'; // Harmony monthly
                priceAmounts[1].textContent = '299'; // Symphony monthly
                
                // Hide original monthly prices
                yearlyPrices.forEach(price => {
                    price.style.display = 'none';
                });
                
                // Update period text
                document.querySelectorAll('.plan-period').forEach(period => {
                    if (!period.textContent.includes('forever')) {
                        period.textContent = 'per month';
                    }
                });
            }
        });

        // FAQ toggle functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });

        // Plan selection functionality
        document.querySelectorAll('.select-plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planName = e.target.closest('.pricing-card').querySelector('.plan-name').textContent;
                alert(`You selected the ${planName} plan! Redirecting to checkout...`);
                // Here you would typically redirect to your payment processor
            });
        });

        // Initialize particles
        window.addEventListener('load', createParticles);

        // Add hover effects to pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = card.classList.contains('popular') ? 
                    'translateY(-10px) scale(1.07)' : 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.classList.contains('popular') ? 
                    'scale(1.05)' : 'scale(1)';
            });
        });
