let currentNoteId = null;
    let currentNoteTitle = '';
    let currentNoteContent = '';
    
    // Parse URL parameters to get note data
    function getNoteFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const title = urlParams.get('title');
        const content = urlParams.get('content');
        
        if (id && title) {
            return { id, title, content: content || '' };
        }
        return null;
    }
    
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
    
    // Initialize the edit page with note data
    function initializeEditPage() {
        const urlNote = getNoteFromURL();
        
        if (urlNote) {
            // Note data from URL
            currentNoteId = urlNote.id;
            currentNoteTitle = urlNote.title;
            currentNoteContent = urlNote.content || '';
            populateForm(currentNoteTitle, currentNoteContent);
            updateNoteInfoBadge(currentNoteTitle);
        } else {
            // Try to get from sessionStorage (alternative method)
            const storedNote = sessionStorage.getItem('noteToEdit');
            if (storedNote) {
                try {
                    const note = JSON.parse(storedNote);
                    currentNoteId = note.id;
                    currentNoteTitle = note.title;
                    currentNoteContent = note.content || '';
                    populateForm(currentNoteTitle, currentNoteContent);
                    updateNoteInfoBadge(currentNoteTitle);
                    sessionStorage.removeItem('noteToEdit');
                } catch(e) {
                    loadDemoNote();
                }
            } else {
                loadDemoNote();
            }
        }
    }
    
    
    // Populate form fields
    function populateForm(title, content) {
        const titleInput = document.getElementById('noteTitle');
        const contentTextarea = document.getElementById('noteContent');
        const oldTitleHidden = document.getElementById('oldTitleHidden');
        
        if (titleInput) titleInput.value = title;
        if (contentTextarea) contentTextarea.value = content;
        if (oldTitleHidden) oldTitleHidden.value = title;
        
        updateCharCount();
        autoResizeTextarea();
    }
    
    // Update the note info badge
    function updateNoteInfoBadge(title) {
        const badge = document.getElementById('noteInfoBadge');
        if (badge) {
            badge.innerHTML = `<i class="fas fa-pen-fancy"></i> Editing: "${title.substring(0, 40)}${title.length > 40 ? '...' : ''}"`;
        }
    }
    
    // Character counter for textarea
    function updateCharCount() {
        const contentTextarea = document.getElementById('noteContent');
        const charCountSpan = document.getElementById('charCount');
        if (contentTextarea && charCountSpan) {
            const length = contentTextarea.value.length;
            charCountSpan.textContent = length;
            if (length > 500) {
                charCountSpan.style.color = '#e67e22';
            } else {
                charCountSpan.style.color = '#c2a07e';
            }
        }
    }
    
    // Auto-resize textarea
    function autoResizeTextarea() {
        const textarea = document.getElementById('noteContent');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 350) + 'px';
        }
    }
    
    // Get current date formatted
    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Update the note in localStorage
    function updateNote(newTitle, newContent) {
        if (!newTitle || newTitle.trim() === '') {
            showToast('✨ Please enter a title for your note', true);
            return false;
        }
        
        if (!newContent || newContent.trim() === '') {
            showToast('📝 Please write something in your note', true);
            return false;
        }
        
        const notes = loadNotesFromStorage();
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        
        if (noteIndex !== -1) {
            // Update existing note
            notes[noteIndex].title = newTitle.trim();
            notes[noteIndex].content = newContent.trim();
            notes[noteIndex].date = getCurrentDate();
            saveNotesToStorage(notes);
            return true;
        } else {
            // If note not found (demo mode), create a new note
            const newNote = {
                id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
                title: newTitle.trim(),
                content: newContent.trim(),
                date: getCurrentDate()
            };
            notes.unshift(newNote);
            saveNotesToStorage(notes);
            currentNoteId = newNote.id;
            return true;
        }
    }
    
    // Handle form submission
    const form = document.getElementById('editNoteForm');
    const updateBtn = document.getElementById('updateBtn');
    const titleInput = document.getElementById('noteTitle');
    const contentTextarea = document.getElementById('noteContent');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            
            const newTitle = titleInput.value;
            const newContent = contentTextarea.value;
            
            // Show loading state on button
            updateBtn.classList.add('btn-loading');
            const originalBtnHTML = updateBtn.innerHTML;
            updateBtn.innerHTML = '<i class="fas fa-spinner"></i> Updating note...';
            
            // Simulate slight delay for aesthetic
            setTimeout(() => {
                const success = updateNote(newTitle, newContent);
                
                updateBtn.classList.remove('btn-loading');
                updateBtn.innerHTML = originalBtnHTML;
                
                if (success) {
                    showToast(`✅ "${newTitle.substring(0, 40)}" has been updated!`, false);
                    
                    // Add a success animation to the card
                    const card = document.querySelector('.edit-card');
                    if (card) {
                        card.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            if (card) card.style.transform = '';
                        }, 300);
                    }
                    
                    // Update the badge with new title
                    updateNoteInfoBadge(newTitle);
                    
                    // Update hidden old title
                    const oldTitleHidden = document.getElementById('oldTitleHidden');
                    if (oldTitleHidden) oldTitleHidden.value = newTitle;
                    
                    // Create subtle confetti effect
                    createConfetti();
                }
            }, 600);
        });
    }
    
    // Simple confetti effect on successful update
    function createConfetti() {
        const colors = ['#ff8a5c', '#ffb46b', '#f39c5e', '#e67e22', '#ffaa77'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '999';
            confetti.style.opacity = '0.8';
            confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti && confetti.remove) confetti.remove();
            }, 2000);
        }
        
        // Add keyframes for falling animation if not exists
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Event listeners for character count and auto-resize
    if (contentTextarea) {
        contentTextarea.addEventListener('input', () => {
            updateCharCount();
            autoResizeTextarea();
        });
    }
    
    if (titleInput) {
        titleInput.addEventListener('input', () => {
            // Optional: live update badge
            const newTitle = titleInput.value;
            if (newTitle) {
                const badge = document.getElementById('noteInfoBadge');
                if (badge) {
                    badge.innerHTML = `<i class="fas fa-pen-fancy"></i> Editing: "${newTitle.substring(0, 40)}${newTitle.length > 40 ? '...' : ''}"`;
                }
            }
        });
    }
    
    // Navigation handlers
    function handleSignOut() {
        showToast("👋 Signing out... See you soon!", false);
        setTimeout(() => {
            alert("You have been signed out. Redirecting to home.");
        }, 600);
    }
    
    function handleProfile() {
        showToast("👤 Redirecting to your profile", false);
        setTimeout(() => {
            alert("🚀 In the full app, you'd be taken to your Profile page.");
        }, 300);
    }
    
    function handleViewNotes() {
        showToast("📋 Redirecting to your notes", false);
        setTimeout(() => {
            alert("📖 In the full app, you'd be taken to your View Notes page.");
        }, 300);
    }
    
    // Attach button events
    document.getElementById('signoutBtn')?.addEventListener('click', handleSignOut);
    document.getElementById('profileBtn')?.addEventListener('click', handleProfile);
    document.getElementById('viewNotesBtn')?.addEventListener('click', handleViewNotes);
    
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
    
    // Add keyboard shortcut (Ctrl+Enter to submit)
    if (contentTextarea) {
        contentTextarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (updateBtn) updateBtn.click();
            }
        });
    }
    
    if (titleInput) {
        titleInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (updateBtn) updateBtn.click();
            }
        });
    }
    
    // Floating hearts on background click (delightful)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.edit-card') || e.target.closest('.top-nav')) return;
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
    initializeEditPage();