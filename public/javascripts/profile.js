
    // Try to load from localStorage (if any data from signup exists)
    const storedUser = localStorage.getItem('luvtonote_demo_user');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            if (userData.username) currentUser.username = userData.username;
            if (userData.email) currentUser.email = userData.email;
            // keep joinDate as preset or generate a friendly one
            if (userData.signedUp) {
                // if signup happened recently, we can set a recent date
                const today = new Date();
                const formatted = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                currentUser.joinDate = formatted;
            }
        } catch(e) {}
    }
    
    // Load notes count from localStorage (shared across pages)
    let globalNotes = [];
    const storedNotes = localStorage.getItem('luvtonote_notes_array');
    if (storedNotes) {
        try {
            globalNotes = JSON.parse(storedNotes);
            currentUser.notesCount = globalNotes.length;
        } catch(e) {}
    } else {
        // if no notes exist, initialize with demo notes for rich preview (but keep count consistent)
        globalNotes = [
            { id: 'demo1', title: 'Welcome to LuvToNote', content: 'Start creating beautiful notes!' },
            { id: 'demo2', title: 'Meeting Ideas', content: 'Discuss new features' }
        ];
        currentUser.notesCount = globalNotes.length;
        localStorage.setItem('luvtonote_notes_array', JSON.stringify(globalNotes));
    }
    
    // Helper to update notes count display and sync with localStorage
    function updateNotesCountDisplay() {
        const storedRefresh = localStorage.getItem('luvtonote_notes_array');
        if (storedRefresh) {
            try {
                const parsed = JSON.parse(storedRefresh);
                currentUser.notesCount = parsed.length;
                document.getElementById('notesCountDisplay').innerText = currentUser.notesCount;
            } catch(e) {}
        } else {
            document.getElementById('notesCountDisplay').innerText = currentUser.notesCount;
        }
    }
    
    // Also listen to storage events in case other tabs modify notes (just for consistency)
    window.addEventListener('storage', (e) => {
        if (e.key === 'luvtonote_notes_array') {
            updateNotesCountDisplay();
        }
    });
    
    // Set UI with dynamic user info
    document.getElementById('usernameDisplay').innerText = currentUser.username;
    document.getElementById('emailDisplay').innerText = currentUser.email;
    document.getElementById('joinDateDisplay').innerText = currentUser.joinDate;
    document.getElementById('notesCountDisplay').innerText = currentUser.notesCount;
    
    // Welcome message dynamic
    const welcomeHeading = document.getElementById('welcomeUser');
    if (welcomeHeading) {
        welcomeHeading.innerHTML = `Welcome back, <span id="usernameDisplay" style="background: linear-gradient(125deg, #dd6b42, #f39c5e); background-clip: text; -webkit-background-clip: text; color: transparent;">${currentUser.username}</span>`;
        // re-fix inner span since we replaced innerHTML
        const nameSpan = document.getElementById('usernameDisplay');
        if (nameSpan && nameSpan.innerText) {
            // already set
        }
    }
    
    // Helper toast
    function showToast(message, isError = false) {
        const toast = document.getElementById('toastMsg');
        toast.textContent = message;
        toast.style.background = isError ? '#b34e3ad9' : '#2e2a24e6';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }
    
    // Button actions (simulate navigation)
    const homeBtn = document.getElementById('homeBtn');
    const signoutBtn = document.getElementById('signoutBtn');
    const createNoteBtn = document.getElementById('createNoteBtn');
    const viewNotesBtn = document.getElementById('viewNotesBtn');
    
    // Home button: redirect to homepage (demo simulation)
    homeBtn.addEventListener('click', () => {
        showToast("🏠 Taking you to the Home page", false);
        setTimeout(() => {
            alert("✨ In the full app, you'd be redirected to the LuvToNote Home page. Enjoy exploring!");
            // optional: window.location.href = "/";
        }, 200);
    });
    
    // Sign Out: clear local demo session and redirect style
    signoutBtn.addEventListener('click', () => {
        showToast("👋 Signing out... See you soon!", false);
        // Simulate signout: clear any user session flag
        localStorage.removeItem('luvtonote_demo_user');
        // Optional: clear notes? not needed, just simulate redirect
        setTimeout(() => {
            alert("You have been signed out. Redirecting to home.");
            // In real app: window.location.href = "/signin";
        }, 800);
    });
    
    // Create Note Button: interactive simulation with notes count increment
    createNoteBtn.addEventListener('click', () => {
        // Simulate creating a new note: prompt for title and increment notes count
        const noteTitle = prompt("✨ Create a new note!\nEnter note title:", "My awesome note");
        if (noteTitle && noteTitle.trim() !== "") {
            // add note to globalNotes array and update localStorage
            const newNote = {
                id: 'note_' + Date.now(),
                title: noteTitle.trim(),
                content: "Click edit to add content"
            };
            globalNotes.unshift(newNote);
            localStorage.setItem('luvtonote_notes_array', JSON.stringify(globalNotes));
            currentUser.notesCount = globalNotes.length;
            document.getElementById('notesCountDisplay').innerText = currentUser.notesCount;
            showToast(`📝 "${noteTitle.trim()}" created! Total notes: ${currentUser.notesCount}`, false);
            // also add a small animation on notes count
            const countSpan = document.getElementById('notesCountDisplay');
            if (countSpan) {
                countSpan.style.transform = 'scale(1.1)';
                setTimeout(() => { if(countSpan) countSpan.style.transform = ''; }, 300);
            }
        } else if (noteTitle !== null && noteTitle.trim() === "") {
            showToast("Note title cannot be empty", true);
        }
    });
    
    // View Notes: show current notes in a nice alert / simulation
    viewNotesBtn.addEventListener('click', () => {
        const storedUpdated = localStorage.getItem('luvtonote_notes_array');
        let notesList = globalNotes;
        if (storedUpdated) {
            try {
                notesList = JSON.parse(storedUpdated);
                currentUser.notesCount = notesList.length;
                document.getElementById('notesCountDisplay').innerText = currentUser.notesCount;
            } catch(e) {}
        }
        if (notesList.length === 0) {
            showToast("📭 No notes yet. Click 'Create Note' to add one!", false);
            return;
        }
        let notesPreview = "📋 Your Notes:\n\n";
        notesList.slice(0, 8).forEach((note, idx) => {
            notesPreview += `${idx+1}. ${note.title.substring(0, 40)}${note.title.length > 40 ? '…' : ''}\n`;
        });
        if (notesList.length > 8) notesPreview += `\n... and ${notesList.length - 8} more.`;
        alert(notesPreview + "\n\n💡 Use the Create button to add more!");
        showToast(`📖 Viewing ${notesList.length} notes.`, false);
    });
    
    // Additional micro-interaction: update notes count if any other changes happen from localStorage
    function syncNotesCount() {
        const freshNotes = localStorage.getItem('luvtonote_notes_array');
        if (freshNotes) {
            try {
                const parsed = JSON.parse(freshNotes);
                document.getElementById('notesCountDisplay').innerText = parsed.length;
                currentUser.notesCount = parsed.length;
            } catch(e) {}
        }
    }
    
    // Ripple effect for all action buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255,255,245,0.4)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.4s ease-out, opacity 0.6s';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
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
    });
    
    // floating hearts on background click (delight)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.profile-card') || e.target.closest('.top-nav')) return;
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
    
    console.log("💜 LuvToNote | Profile ready — manage your creative world");