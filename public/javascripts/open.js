    let currentNote = null;
    let currentNoteId = null;
    
    // Load notes from localStorage
    function loadNotesFromStorage() {
        const stored = localStorage.getItem('luvtonote_notes_html_data');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch(e) {
                return [];
            }
        }
        return [];
    }
    
    // Save notes to localStorage
    function saveNotesToStorage(notes) {
        localStorage.setItem('luvtonote_notes_html_data', JSON.stringify(notes));
    }
    
    // Get note from URL parameters
    function getNoteFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const title = urlParams.get('title');
        const content = urlParams.get('content');
        const date = urlParams.get('date');
        
        if (id) {
            return { id, title: title || '', content: content || '', date: date || '' };
        }
        return null;
    }
    
    // Load note from localStorage by ID
    function loadNoteById(id) {
        const notes = loadNotesFromStorage();
        const note = notes.find(n => n.id === id);
        if (note) {
            return note;
        }
        return null;
    }
    
    // Display note on the page
    function displayNote(note) {
        if (!note) {
            showErrorState();
            return;
        }
        
        currentNote = note;
        currentNoteId = note.id;
        
        const titleElement = document.getElementById('noteTitle');
        const dateElement = document.querySelector('#noteDate span');
        const contentElement = document.getElementById('noteContent');
        
        if (titleElement) {
            titleElement.textContent = note.title || 'Untitled Note';
        }
        
        if (dateElement) {
            dateElement.textContent = `created on: ${note.date || getCurrentDate()}`;
        }
        
        if (contentElement) {
            contentElement.textContent = note.content || 'No content available for this note.';
        }
        
        // Add fade-in animation for content
        const card = document.querySelector('.open-card');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeSlideUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
            }, 10);
        }
    }
    
    // Show error state when note not found
    function showErrorState() {
        const titleElement = document.getElementById('noteTitle');
        const dateElement = document.querySelector('#noteDate span');
        const contentElement = document.getElementById('noteContent');
        
        if (titleElement) {
            titleElement.textContent = 'Note Not Found';
        }
        
        if (dateElement) {
            dateElement.textContent = 'created on: --';
        }
        
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-search"></i>
                    <h3>Note not found</h3>
                    <p>The note you're looking for doesn't exist or has been deleted.</p>
                </div>
            `;
        }
        
        // Disable edit and delete buttons
        const editBtn = document.getElementById('editNoteBtn');
        const deleteBtn = document.getElementById('deleteNoteBtn');
        if (editBtn) editBtn.disabled = true;
        if (deleteBtn) deleteBtn.disabled = true;
    }
    
    // Get current date formatted
    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Initialize the page
    function initializeOpenPage() {
        const urlNote = getNoteFromURL();
        
        if (urlNote && urlNote.id) {
            // Try to find note in localStorage first
            const storedNote = loadNoteById(urlNote.id);
            if (storedNote) {
                displayNote(storedNote);
            } else if (urlNote.title) {
                // Use URL data as fallback
                displayNote({
                    id: urlNote.id,
                    title: urlNote.title,
                    content: urlNote.content || 'No content available.',
                    date: urlNote.date || getCurrentDate()
                });
            } else {
                showErrorState();
            }
        } else {
            // Try to get from sessionStorage (alternative method)
            const storedNote = sessionStorage.getItem('noteToOpen');
            if (storedNote) {
                try {
                    const note = JSON.parse(storedNote);
                    displayNote(note);
                    sessionStorage.removeItem('noteToOpen');
                } catch(e) {
                    showErrorState();
                }
            } else {
                // Load demo note for preview
                showDemoNote();
            }
        }
    }
    
    
    // Navigation handlers
    function handleSignOut() {
        showToast("👋 Signing out... See you soon!", false);
    }
    
    function handleProfile() {
        showToast("👤 Redirecting to your profile", false);
    }
    
    function handleViewNotes() {
        showToast("📋 Redirecting to your notes", false);
        setTimeout(() => {
            alert("📖 In the full app, you'd be taken to your View Notes page.");
        }, 300);
    }
    
    function handleBackToView() {
        showToast("📋 Returning to notes list", false);
        setTimeout(() => {
            alert("📖 In the full app, you'd be taken back to your View Notes page.");
        }, 300);
    }
    
    // Toast helper
    function showToast(message, isError = false) {
        const toast = document.getElementById('toastMsg');
        toast.textContent = message;
        toast.style.background = isError ? '#b34e3ad9' : '#2e2a24e6';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }
    
    // Attach button events
    document.getElementById('signoutBtn')?.addEventListener('click', handleSignOut);
    document.getElementById('profileBtn')?.addEventListener('click', handleProfile);
    document.getElementById('viewNotesBtn')?.addEventListener('click', handleViewNotes);
    document.getElementById('editNoteBtn')?.addEventListener('click', editCurrentNote);
    document.getElementById('deleteNoteBtn')?.addEventListener('click', deleteCurrentNote);
    document.getElementById('backToViewBtn')?.addEventListener('click', handleBackToView);
    
    // Add ripple effect to all buttons
    function addRipple(btn) {
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
    }
    
    document.querySelectorAll('button').forEach(btn => addRipple(btn));
    
    // Floating hearts on background click (delightful)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.open-card') || e.target.closest('.top-nav')) return;
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
    
    // Initialize the page
    initializeOpenPage();
    