    const form = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toastMsg');

    function showToastMessage(message, isError = false) {
        toast.textContent = message;
        toast.style.background = isError ? '#b34e3ad9' : '#2e2a24e6';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    // Helper to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return emailRegex.test(email);
    }

    // Helper to validate password strength (min 6 chars for demo, but can be any)
    function isValidPassword(pwd) {
        return pwd.length >= 6;
    }

    // Display inline error or custom messages (simple, friendly)
    function highlightField(field, isValid) {
        if (!isValid) {
            field.style.borderColor = "#e67e22";
            field.style.boxShadow = "0 0 0 2px rgba(230, 126, 34, 0.2)";
        } else {
            field.style.borderColor = "#ffe0c4";
            field.style.boxShadow = "none";
        }
    }

    // Form submit handler with nice animation and feedback
    form.addEventListener('submit', async (e) => {

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasError = false;

        // Reset visual borders
        [usernameInput, emailInput, passwordInput].forEach(inp => {
            inp.style.borderColor = "#ffe0c4";
            inp.style.boxShadow = "none";
        });

        if (!username) {
            showToastMessage("✨ Please enter a username", true);
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
            showToastMessage("Please enter a valid email (e.g., name@example.com)", true);
            highlightField(emailInput, false);
            hasError = true;
        } else if (!password) {
            showToastMessage("🔒 Password cannot be empty", true);
            highlightField(passwordInput, false);
            hasError = true;
        } else if (!isValidPassword(password)) {
            showToastMessage("Password must be at least 6 characters", true);
            highlightField(passwordInput, false);
            hasError = true;
        }

        if (hasError) return;

        // Simulate loading state on button (aesthetic touch)
        submitBtn.classList.add('btn-loading');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Creating account...';

        // Simulate network delay (smooth experience)
        setTimeout(() => {
            // On success: show welcome toast, optionally store demo data in localStorage for "sign in" simulation
            // Since it's a frontend demo, we simulate successful signup.
            // We can store a flag that user just signed up (for style)
            localStorage.setItem('luvtonote_demo_user', JSON.stringify({
                username: username,
                email: email,
                signedUp: true
            }));
            
            // Reset button
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalBtnText;
            
            // Beautiful success message
            showToastMessage(`🎉 Welcome ${username}! Account created successfully. Redirecting...`);
            
            // Slight delay then simulate redirect to home page or dashboard (you can replace with actual redirect)
            setTimeout(() => {
                // For demonstration, we show an alert and could redirect to home, but we'll just reset form optionally
                // In a real scenario you would redirect to /dashboard or /home. Keeping it consistent with the brand
                // Since we are in a demo signup page, we can either reset or show confirmation.
                // But we'll animate a reset and keep the user on signup with a message that they can now sign in.
                form.reset();
                // Show extra "check your inbox" aesthetic note
                showToastMessage(`✅ Account created! You can now sign in with ${email}`, false);
                // highlight signin link gently
                const signinAnchor = document.getElementById('signinLink');
                if (signinAnchor) {
                    signinAnchor.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        if (signinAnchor) signinAnchor.style.transform = '';
                    }, 400);
                }
            }, 1500);
        }, 1000);
    });

    // Real-time inline validation improvement (visual only, adds to aesthetic)
    function validateFieldOnInput() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (username.length >= 2) highlightField(usernameInput, true);
        else if (username.length === 0) highlightField(usernameInput, true);
        
        if (isValidEmail(email)) highlightField(emailInput, true);
        else if (email === "") highlightField(emailInput, true);
        
        if (password.length >= 6) highlightField(passwordInput, true);
        else if (password === "") highlightField(passwordInput, true);
    }

    usernameInput.addEventListener('input', validateFieldOnInput);
    emailInput.addEventListener('input', validateFieldOnInput);
    passwordInput.addEventListener('input', validateFieldOnInput);

    // Add floating label / subtle animation on focus
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

    // Demo: "Already have an account? Sign In" anchor tag has smooth hover effect & log
    const signinLink = document.getElementById('signinLink');
    if (signinLink) {
        signinLink.addEventListener('click', (e) => {
            showToastMessage("✨ Redirecting to Sign In page (demo integration)", false);
            // Simulate navigation: you could replace with actual href="/signin"
            setTimeout(() => {
                // for demonstration, we just reload or could change window.location, but we'll do a nice console and keep consistent with mock
                // Keeping it non-disruptive: open an alert explaining the demo flow.
                // But to respect user expectation, show a friendly message.
                alert("🚀 In the full version, you'd be taken to the Sign In page. Enjoy the demo flow!");
                // Optional: redirect to a mock signin (but we stick to the given spec)
            }, 300);
        });
    }

    // Extra micro interaction: submit button ripple effect on click (visual)
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
    
    // Add a small floating heart decoration on background click (just for fun)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.signup-card')) return;
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