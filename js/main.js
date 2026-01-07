// Funciones principales de navegación

function goToSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Actualizar navegación
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        }
    });

    // Inicializar creador de historias si corresponde
    if (sectionId === 'create-story') {
        setTimeout(() => initStoryCreator(), 100);
    }
}

function openGame(gameType) {
    const modalId = gameType + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }

    // Inicializar juegos específicos
    if (gameType === 'paint') {
        initPaintGame();
    } else if (gameType === 'coloring') {
        initColoringGame();
    } else if (gameType === 'maze') {
        initMazeGame();
    } else if (gameType === 'quiz') {
        initQuizGame();
    }
}

function closeGame(gameType) {
    const modalId = gameType + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Event listeners para navegación
document.addEventListener('DOMContentLoaded', function() {
    // Botones de navegación
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            goToSection(sectionId);
        });
    });

    // Cerrar modal al hacer clic fuera
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Sección inicial
    goToSection('home');
    // Inicializar imagen del título
    initTitleImage();
});

// Manejo de imagen del título: preview, guardar en localStorage y quitar
function initTitleImage() {
    const input = document.getElementById('titleImageInput');
    const preview = document.getElementById('titleImagePreview');
    const removeBtn = document.getElementById('titleImageRemove');

    if (!input || !preview) return;

    // Cargar imagen desde localStorage si existe
    const saved = localStorage.getItem('titleImageData');
    if (saved) {
        preview.src = saved;
        preview.style.display = 'block';
    }

    input.addEventListener('change', function(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const dataUrl = ev.target.result;
            preview.src = dataUrl;
            preview.style.display = 'block';
            try { localStorage.setItem('titleImageData', dataUrl); } catch (err) { console.warn('localStorage lleno o no permitido'); }
        };
        reader.readAsDataURL(file);
    });

    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            preview.src = '';
            preview.style.display = 'none';
            input.value = '';
            localStorage.removeItem('titleImageData');
        });
    }
}
