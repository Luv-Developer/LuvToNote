    const form = document.getElementById('forgotForm');
    const emailInput = document.getElementById('recoveryEmail');
    const submitBtn = document.getElementById('recoverBtn');
    const toast = document.getElementById('toastMsg');

    // Helper: show toast notification
    function showToastMessage(message, isError = false) {
        toast.textContent = message;
        toast.style.background = isError ? '#b34e3ad9' : '#2e2a24e6';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Email validation (robust)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return emailRegex.test(email);
    }

    // Real-time input styling for better UX
    function validateEmailOnInput() {
        const email = emailInput.value.trim();
        if (email === "") {
            emailInput.style.borderColor = "#ffe0c4";
            emailInput.style.boxShadow = "none";
        } else if (isValidEmail(email)) {
            emailInput.style.borderColor = "#ffa86a";
            emailInput.style.boxShadow = "0 0 0 2px rgba(255, 140, 80, 0.15)";
        } else {
            emailInput.style.borderColor = "#e67e22";
            emailInput.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.15)";
        }
    }

    emailInput.addEventListener('input', validateEmailOnInput);
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.style.borderColor = "#e67e22";
            emailInput.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.2)";
        } else if (email && isValidEmail(email)) {
            emailInput.style.borderColor = "#a5d6a5";
            emailInput.style.boxShadow = "0 0 0 2px rgba(100, 180, 100, 0.1)";
        }
    });

    // Add subtle floating effect on input focus
    const inputWrapper = document.querySelector('.input-group');
    if (inputWrapper) {
        emailInput.addEventListener('focus', () => {
            inputWrapper.style.transform = 'translateY(-1px)';
            inputWrapper.style.transition = 'transform 0.2s';
        });
        emailInput.addEventListener('blur', () => {
            inputWrapper.style.transform = 'translateY(0)';
        });
    }

    // Form submit handler with validation and animation
    form.addEventListener('submit', async (e) => {

        const email = emailInput.value.trim();

        // Reset border style
        emailInput.style.borderColor = "#ffe0c4";
        emailInput.style.boxShadow = "none";

        // Validation
        if (!email) {
            showToastMessage("📧 Please enter your email address", true);
            emailInput.style.borderColor = "#e67e22";
            emailInput.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.2)";
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showToastMessage("❌ Please enter a valid email address (e.g., name@example.com)", true);
            emailInput.style.borderColor = "#e67e22";
            emailInput.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.2)";
            emailInput.focus();
            return;
        }

        // Show loading state on button
        submitBtn.classList.add('btn-loading');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending link...';

        // Simulate network request (aesthetic delay)
        setTimeout(() => {
            // Successful recovery simulation
            // We can also store a flag that a reset was requested (demo only)
            // Additional: check if email exists in localStorage from signup demo (just for extra personalization)
            let customMessage = `✨ Recovery link sent to ${email}. Check your inbox.`;
            const storedUser = localStorage.getItem('luvtonote_demo_user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    if (userData.email && userData.email.toLowerCase() === email.toLowerCase()) {
                        customMessage = `🔐 Hey ${userData.username || 'there'}! We've sent a password reset link to ${email}. Follow the instructions.`;
                    }
                } catch(e) {}
            }
            
            showToastMessage(customMessage, false);
            
            // Reset button state
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalBtnHTML;
            
            // Animate card to show success
            const card = document.querySelector('.recovery-card');
            if (card) {
                card.style.transform = 'scale(1.01)';
                setTimeout(() => { if(card) card.style.transform = ''; }, 400);
            }
            
            // Optionally clear the field after success? not mandatory, but friendly
            // we keep the email for reference, but add a subtle highlight
            emailInput.style.borderColor = "#a5d6a5";
            emailInput.style.boxShadow = "0 0 0 2px rgba(100, 180, 100, 0.2)";
            
            // Optional: simulate redirect after 2 seconds? not needed but keeps smooth.
            setTimeout(() => {
                // Show final reminder to check spam folder
                showToastMessage(`💡 Didn't receive? Check your spam folder.`, false);
            }, 2000);
        }, 1500);
    });

    // "Back to Sign In" link handling with smooth toast
    const backLink = document.getElementById('backToSignin');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            showToastMessage("↩️ Returning to Sign In page", false);
            setTimeout(() => {
                // Demo navigation: alert to indicate flow (since no actual routing)
                alert("🔐 In the full version, you'd be redirected to the Sign In page. Enjoy LuvToNote!");
                // optional: you could simulate redirect: window.location.href = "/signin";
            }, 200);
        });
    }

    // Ripple effect on submit button for extra delight
    submitBtn.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255,255,245,0.5)';
        ripple.style.pointerEvents = 'none';
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => {
            if (ripple && ripple.remove) ripple.remove();
        }, 500);
    });

    // Extra: floating hearts on background click (just like the previous aesthetic)
    document.body.addEventListener('click', (e) => {
        // Prevent if clicking inside form card (avoid overkill)
        if (e.target.closest('.recovery-card')) return;
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.color = '#ffaa77';
        heart.style.fontSize = '1.1rem';
        heart.style.pointerEvents = 'none';
        heart.style.opacity = '0.7';
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.transition = 'all 0.6s ease';
        heart.style.zIndex = '999';
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.style.transform = 'translate(-50%, -50%) scale(1.5)';
            heart.style.opacity = '0';
        }, 10);
        setTimeout(() => heart.remove(), 700);
    });
    
    // Add a nice greeting in console (just for fun)
    console.log("💙 LuvToNote | Password Recovery — Secure & loving design");