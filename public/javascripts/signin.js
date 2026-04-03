    const form = document.getElementById('signinForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toastMsg');

    // Helper: show toast message
    function showToastMessage(message, isError = false) {
        toast.textContent = message;
        toast.style.background = isError ? '#b34e3ad9' : '#2e2a24e6';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return emailRegex.test(email);
    }

    // Basic password non-empty check (additional validation)
    function isValidPassword(pwd) {
        return pwd && pwd.trim().length >= 1;
    }

    // Highlight field for error feedback
    function highlightField(field, isValid) {
        if (!isValid) {
            field.style.borderColor = "#e67e22";
            field.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.2)";
        } else {
            field.style.borderColor = "#ffe0c4";
            field.style.boxShadow = "none";
        }
    }

    // Real-time validation style reset / visual feedback
    function validateFieldOnInput() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (username.length >= 2) highlightField(usernameInput, true);
        else if (username.length === 0) highlightField(usernameInput, true);
        
        if (isValidEmail(email)) highlightField(emailInput, true);
        else if (email === "") highlightField(emailInput, true);
        
        if (password.length >= 1) highlightField(passwordInput, true);
        else if (password === "") highlightField(passwordInput, true);
    }

    usernameInput.addEventListener('input', validateFieldOnInput);
    emailInput.addEventListener('input', validateFieldOnInput);
    passwordInput.addEventListener('input', validateFieldOnInput);

    // Add subtle floating effect on focus
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.parentElement.style.transform = 'translateY(-1px)';
            e.target.parentElement.style.transition = 'transform 0.2s';
        });
        input.addEventListener('blur', (e) => {
            e.target.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Form submit handler with validation and smooth animation
    form.addEventListener('submit', async (e) => {

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasError = false;

        // Reset borders
        [usernameInput, emailInput, passwordInput].forEach(inp => {
            inp.style.borderColor = "#ffe0c4";
            inp.style.boxShadow = "none";
        });

        // Validation rules
        if (!username) {
            showToastMessage("✨ Please enter your username", true);
            highlightField(usernameInput, false);
            hasError = true;
        } else if (username.length < 2) {
            showToastMessage("Username must be at least 2 characters", true);
            highlightField(usernameInput, false);
            hasError = true;
        } else if (!email) {
            showToastMessage("📧 Email address is required", true);
            highlightField(emailInput, false);
            hasError = true;
        } else if (!isValidEmail(email)) {
            showToastMessage("Please enter a valid email address", true);
            highlightField(emailInput, false);
            hasError = true;
        } else if (!password) {
            showToastMessage("🔒 Password cannot be empty", true);
            highlightField(passwordInput, false);
            hasError = true;
        } else if (!isValidPassword(password)) {
            showToastMessage("Please enter your password", true);
            highlightField(passwordInput, false);
            hasError = true;
        }

        if (hasError) return;

        // Simulate loading state (aesthetic)
        submitBtn.classList.add('btn-loading');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Signing in...';

        // Simulate network delay (smooth experience)
        setTimeout(() => {
            // For demo purposes, we check if there's any stored user from signup? just for realism.
            // Since it's a frontend demo, we'll simulate successful sign-in.
            // Additional touch: we can check if the user signed up earlier (using localStorage)
            const storedUser = localStorage.getItem('luvtonote_demo_user');
            let welcomeName = username;
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    if (userData.email && userData.email === email) {
                        welcomeName = userData.username || username;
                        showToastMessage(`🍃 Welcome back ${welcomeName}! Redirecting to notes...`, false);
                    } else {
                        showToastMessage(`✅ Signed in successfully! Hello ${username}.`, false);
                    }
                } catch(e) { showToastMessage(`✅ Signed in as ${username}. Glad to see you!`, false); }
            } else {
                showToastMessage(`🎉 Welcome ${username}! Enjoy your notes.`, false);
            }

            // Reset button
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalBtnHTML;

            // Simulate redirect or show a success state
            setTimeout(() => {
                // Reset form optionally or keep, but provide nice feedback
                // In a real app we would redirect to dashboard. Here we just show success again
                showToastMessage(`✨ You're now signed in. Start managing your notes!`, false);
                // Small animation on card
                const card = document.querySelector('.signin-card');
                if (card) {
                    card.style.transform = 'scale(1.01)';
                    setTimeout(() => { if(card) card.style.transform = ''; }, 400);
                }
                // Optionally clear sensitive fields? keep username for demo but just for clarity
                // We don't clear to simulate stay.
            }, 800);
        }, 1200);
    });

    // Anchor tag interactions: "Don't have an account? Sign up" and "Forgot Password?"
    const signupLink = document.getElementById('signupLink');
    const forgotLink = document.getElementById('forgotLink');

    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            showToastMessage("📝 Redirecting to Sign Up page (demo)", false);
            setTimeout(() => {
                // Simulate navigation (show alert / info)
                alert("🚀 In the full version, you'd be taken to the Sign Up page. Create your account and enjoy LuvToNote!");
                // Optional: you can redirect to a mock signup page if needed, but keep demo consistent
            }, 200);
        });
    }

    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToastMessage("🔐 Reset link would be sent to your email (demo flow)", false);
            setTimeout(() => {
                // Gentle prompt for simulation
                const mockEmail = emailInput.value.trim() || "your-email@example.com";
                alert(`✨ Password reset link sent to ${mockEmail} (Demo). Check your inbox to continue.`);
            }, 150);
        });
    }

    // Ripple effect on submit button for extra aesthetic
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
        ripple.style.backgroundColor = 'rgba(255,255,245,0.4)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'transform 0.4s ease-out, opacity 0.6s';
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => {
            ripple.style.transform = 'scale(4)';
            ripple.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (ripple && ripple.remove) ripple.remove();
        }, 500);
    });

    // Small floating heart on body click (just for delight)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.signin-card')) return;
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.color = '#ffaa77';
        heart.style.fontSize = '1.2rem';
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