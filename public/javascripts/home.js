  // sample initial notes that showcase the capabilities
  let notesArray = [
    { id: 'n1', title: '✨ Welcome to LuvToNote', content: 'Start creating beautiful notes!' },
    { id: 'n2', title: '📝 Meeting notes', content: 'Discuss UI designs at 3pm' },
    { id: 'n3', title: '💡 Idea spark', content: 'Add voice notes feature later' }
  ];

  // Helper to show toast
  function showToast(message, isError = false) {
    const toast = document.getElementById('toastMsg');
    toast.textContent = message;
    toast.style.background = isError ? '#b34e3ae0' : '#2c2b26e0';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Render notes list (complete with edit + delete)
  function renderNotes() {
    const container = document.getElementById('notesListContainer');
    if (!container) return;
    if (notesArray.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:#b18d6e;">✨ No notes yet. Add your first note above! ✨</div>`;
      return;
    }
    container.innerHTML = notesArray.map(note => `
      <div class="demo-note-item" data-id="${note.id}">
        <div class="note-content">
          <div class="note-title"><strong>${escapeHtml(note.title)}</strong></div>
          <div class="note-preview">${escapeHtml(note.content.substring(0, 60))}${note.content.length > 60 ? '…' : ''}</div>
        </div>
        <div class="demo-actions">
          <button class="edit-btn" data-id="${note.id}" title="Edit note"><i class="fas fa-pen"></i></button>
          <button class="delete-btn" data-id="${note.id}" title="Delete note"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `).join('');

    // Attach event listeners for edit and delete buttons dynamically
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        editNoteById(id);
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        deleteNoteById(id);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
      return c;
    });
  }

  function addNote(title, content = '') {
    if (!title || title.trim() === '') {
      showToast('Please enter a note title!', true);
      return false;
    }
    const newId = 'note_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    notesArray.unshift({ id: newId, title: title.trim(), content: content.trim() || 'Click edit to add details' });
    renderNotes();
    showToast(`✨ "${title.trim()}" added successfully!`);
    return true;
  }

  function editNoteById(id) {
    const note = notesArray.find(n => n.id === id);
    if (!note) return;
    const newTitle = prompt('Edit note title:', note.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      const newContent = prompt('Edit note content:', note.content);
      note.title = newTitle.trim();
      if (newContent !== null) note.content = newContent.trim() || '';
      renderNotes();
      showToast(`✏️ Note updated!`);
    } else if (newTitle !== null && newTitle.trim() === '') {
      showToast('Title cannot be empty', true);
    }
  }

  function deleteNoteById(id) {
    const note = notesArray.find(n => n.id === id);
    if (!note) return;
    if (confirm(`Delete note "${note.title}"?`)) {
      notesArray = notesArray.filter(n => n.id !== id);
      renderNotes();
      showToast(`🗑️ "${note.title}" deleted.`);
    }
  }

  // Add note button handler
  document.getElementById('addNoteBtn')?.addEventListener('click', () => {
    const inputEl = document.getElementById('newNoteInput');
    const titleVal = inputEl.value.trim();
    if (titleVal === "") {
      showToast('Please write a note title first', true);
      return;
    }
    addNote(titleVal, '');
    inputEl.value = '';
  });

  // allow enter key in input
  document.getElementById('newNoteInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('addNoteBtn').click();
    }
  });

  // ---------- Authentication simulation (Signin / Signup with demo state) ----------
  let isLoggedIn = false;   // tracks auth state, influences UI messages

  function updateAuthUI() {
    // just give visual feedback and update button states if needed
    const topSignin = document.getElementById('topSigninBtn');
    const topSignup = document.getElementById('topSignupBtn');
    const centerSignin = document.getElementById('centerSigninBtn');
    const getStarted = document.getElementById('getStartedBtn');
    
    if (isLoggedIn) {
      if(topSignin) topSignin.style.opacity = '0.6';
      if(centerSignin) centerSignin.style.opacity = '0.6';
      if(topSignup) topSignup.style.opacity = '0.6';
      showToast(`✅ You are signed in! Now you can fully manage your notes.`, false);
    } else {
      if(topSignin) topSignin.style.opacity = '1';
      if(centerSignin) centerSignin.style.opacity = '1';
      if(topSignup) topSignup.style.opacity = '1';
      showToast(`👋 Welcome! Sign in or Sign up to start your note journey.`, false);
    }
  }

  function signInAction() {
    if (isLoggedIn) {
      showToast(`Already signed in!`, false);
      return;
    }
    isLoggedIn = true;
    updateAuthUI();
    // add a little animation to hero
    const heroH1 = document.querySelector('.hero h1');
    if(heroH1) heroH1.style.transform = 'scale(1.02)';
    setTimeout(() => { if(heroH1) heroH1.style.transform = ''; }, 300);
  }

  function signUpAction() {
    if (isLoggedIn) {
      showToast(`You are already signed in. Try signing out first (demo mode).`, false);
      return;
    }
    // simulate signup (creates new account and logs in)
    isLoggedIn = true;
    updateAuthUI();
    showToast(`🎉 Account created! You're now signed in. Welcome to LuvToNote!`, false);
    const heroH1 = document.querySelector('.hero h1');
    if(heroH1) heroH1.style.transform = 'scale(1.02)';
    setTimeout(() => { if(heroH1) heroH1.style.transform = ''; }, 300);
  }

  // attach signin/signup buttons
  document.getElementById('topSigninBtn')?.addEventListener('click', signInAction);
  document.getElementById('topSignupBtn')?.addEventListener('click', signUpAction);
  document.getElementById('centerSigninBtn')?.addEventListener('click', signInAction);
  document.getElementById('getStartedBtn')?.addEventListener('click', () => {
    // Get Started: if not logged in, encourage signup/signin, else scroll to notes demo
    if (!isLoggedIn) {
      showToast(`💖 Please Sign In or Sign Up to unlock the full experience!`, true);
      // gentle highlight on signup button
      const signupBtn = document.getElementById('topSignupBtn');
      if(signupBtn) {
        signupBtn.style.transform = 'scale(1.05)';
        setTimeout(() => { if(signupBtn) signupBtn.style.transform = ''; }, 400);
      }
    } else {
      showToast(`🎉 Welcome back! Start by adding or editing notes below ✨`);
      document.querySelector('.preview-notes')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // initial render
  renderNotes();
  // set auth initial (logged out)
  isLoggedIn = false;
  updateAuthUI();

  // Additional effect: add a dynamic pulse to the new signup button on load
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });