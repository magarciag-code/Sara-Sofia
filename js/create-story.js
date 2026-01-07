// Juego de Crear tu Propia Historia

const EMOJI_LIBRARY = [
    '🌟', '✨', '🎉', '🎊', '🎈', '🎁', '🎭', '🎪',
    '🐉', '🦄', '🦋', '🐝', '🦅', '🦁', '🐯', '🐺',
    '🧚', '🧙', '👑', '🗝️', '💎', '💍', '🏰', '🏯',
    '🌸', '🌹', '🌺', '🌻', '🌈', '⛅', '🌙', '☀️',
    '❤️', '💚', '💙', '💛', '💜', '🖤', '✨', '⭐',
    '🚀', '🛸', '🌌', '🪐', '🌍', '🗺️', '⚔️', '🛡️',
    '🍕', '🍰', '🎂', '🍪', '🍭', '🍬', '🍫', '🍦'
];

function initStoryCreator() {
    createEmojiPalette();
    loadAllUserStories();
}

function createEmojiPalette() {
    const palette = document.getElementById('emojiPalette');
    if (!palette) return;
    
    palette.innerHTML = '';
    EMOJI_LIBRARY.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.type = 'button';
        btn.onclick = (e) => {
            e.preventDefault();
            insertEmoji(emoji);
        };
        palette.appendChild(btn);
    });
}

function insertEmoji(emoji) {
    const textarea = document.getElementById('storyContent');
    if (!textarea) return;
    
    // Insertar emoji en la posición del cursor
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + emoji + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
}

function saveUserStory() {
    const title = document.getElementById('storyTitle')?.value || 'Mi Historia';
    const content = document.getElementById('storyContent')?.value || '';
    
    if (!content.trim()) {
        alert('Por favor escribe algo en tu historia antes de guardar.');
        return;
    }
    
    const story = {
        id: Date.now(),
        title: title || 'Mi Historia',
        content: content,
        savedAt: new Date().toLocaleString('es-ES')
    };
    
    try {
        // Obtener historias existentes
        let allStories = getAllStoriesFromLocalStorage();
        // Añadir o actualizar historia
        allStories.push(story);
        // Guardar todas las historias
        localStorage.setItem('userCreatedStories', JSON.stringify(allStories));
        alert('¡Historia guardada exitosamente!');
        
        // Limpiar formulario
        document.getElementById('storyTitle').value = '';
        document.getElementById('storyContent').value = '';
        
        // Recargar vista de historias
        loadAllUserStories();
    } catch (err) {
        alert('Error al guardar la historia. localStorage podría estar lleno.');
        console.error(err);
    }
}

function getAllStoriesFromLocalStorage() {
    try {
        const saved = localStorage.getItem('userCreatedStories');
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        console.error('Error al leer historias:', err);
        return [];
    }
}

function loadAllUserStories() {
    const stories = getAllStoriesFromLocalStorage();
    const container = document.getElementById('savedStoriesContainer');
    
    if (!container) return;
    
    if (stories.length === 0) {
        container.innerHTML = '<p style="width: 100%; text-align: center; color: #999;">Tus historias guardadas aparecerán aquí como botones</p>';
        return;
    }
    
    container.innerHTML = '';
    stories.forEach((story, index) => {
        const storyBtn = document.createElement('div');
        storyBtn.className = 'story-button-card';
        storyBtn.id = `story-${story.id}`;
        
        storyBtn.innerHTML = `
            <div style="flex: 1;">
                <h4 style="margin: 0 0 8px 0; color: #f5576c;">${story.title}</h4>
                <p style="margin: 0; font-size: 0.9em; color: #999;">Guardada: ${story.savedAt}</p>
            </div>
            <div style="display: flex; gap: 6px;">
                <button class="btn-story-view" onclick="viewStory(${story.id})">👁️ Ver</button>
                <button class="btn-story-delete" onclick="deleteStory(${story.id})">🗑️</button>
            </div>
        `;
        
        container.appendChild(storyBtn);
    });
}

function viewStory(storyId) {
    const stories = getAllStoriesFromLocalStorage();
    const story = stories.find(s => s.id === storyId);
    
    if (story) {
        // Cargar historia en el editor
        document.getElementById('storyTitle').value = story.title;
        document.getElementById('storyContent').value = story.content;
        // Scroll al formulario
        window.scrollTo(0, 0);
    }
}

function deleteStory(storyId) {
    if (confirm('¿Estás seguro de que quieres borrar esta historia? Esta acción no se puede deshacer.')) {
        try {
            let allStories = getAllStoriesFromLocalStorage();
            allStories = allStories.filter(s => s.id !== storyId);
            localStorage.setItem('userCreatedStories', JSON.stringify(allStories));
            
            // Remover botón del DOM
            const storyBtn = document.getElementById(`story-${storyId}`);
            if (storyBtn) {
                storyBtn.style.transition = 'opacity 0.3s ease';
                storyBtn.style.opacity = '0';
                setTimeout(() => storyBtn.remove(), 300);
            }
            
            // Recargar vista
            loadAllUserStories();
        } catch (err) {
            alert('Error al borrar la historia.');
            console.error(err);
        }
    }
}

function clearStoryForm() {
    if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
        document.getElementById('storyTitle').value = '';
        document.getElementById('storyContent').value = '';
    }
}
