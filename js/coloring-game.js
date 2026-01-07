// Juego de Colorear Animales - Galería Dinámica con paleta y canvas de pintura

let animals = [];
let currentAnimalIndex = 0;

// Pintura
let currentColor = '#FF0000';
let brushSize = 8;
let isPainting = false;
let coloringCanvas = null;
let coloringCtx = null;
let baseImage = null;

// Cargar imágenes conocidas en la carpeta (lista generada previamente)
async function loadAnimalsFromFolder() {
    try {
        const imageFiles = [
            'imagenes/descarga (1).png',
            'imagenes/descarga (1).jpg',
            'imagenes/descarga (2).png',
            'imagenes/descarga (2).jpg',
            'imagenes/descarga (3).png',
            'imagenes/descarga (3).jpg',
            'imagenes/descarga (4).png',
            'imagenes/descarga (4).jpg',
            'imagenes/descarga (5).png',
            'imagenes/descarga (6).png',
            'imagenes/descarga (7).png',
            'imagenes/descarga (8).png',
            'imagenes/descarga (9).png',
            'imagenes/descarga (10).png',
            'imagenes/descarga.png',
            'imagenes/descarga.jpg',
            'imagenes/images (1).png',
            'imagenes/images (1).jpg',
            'imagenes/images (2).png',
            'imagenes/images (2).jpg',
            'imagenes/images (3).png',
            'imagenes/images (3).jpg',
            'imagenes/images (4).png',
            'imagenes/images.png',
            'imagenes/images.jpg'
        ];

        animals = imageFiles.map((path, i) => ({
            name: `Imagen ${i + 1}`,
            image: path,
            fileName: path.split('/')[1].replace(/\.(png|jpg|jpeg)$/i, ''),
            index: i
        }));

        console.log(`✓ Se cargaron ${animals.length} imágenes para colorear`);
        return animals;
    } catch (error) {
        console.error('Error cargando imágenes:', error);
        animals = createDefaultAnimals();
        return animals;
    }
}

function createDefaultAnimals() {
    return [
        { name: 'Imagen 1', image: 'imagenes/descarga (1).png', index: 0 },
        { name: 'Imagen 2', image: 'imagenes/descarga (2).png', index: 1 },
        { name: 'Imagen 3', image: 'imagenes/descarga (3).png', index: 2 }
    ];
}

function initColoringGame() {
    if (animals.length === 0) {
        loadAnimalsFromFolder();
    }

    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    animals.forEach((animal, index) => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.innerHTML = `
            <img src="${animal.image}" alt="${animal.name}" class="animal-card-image" onerror="this.style.backgroundColor='#f0f0f0'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.textContent='Imagen no encontrada';">
            <div class="animal-card-name">${animal.name}</div>
        `;
        card.addEventListener('click', () => selectAnimal(index));
        galleryGrid.appendChild(card);
    });

    // Inicializar select (opcional)
    const select = document.getElementById('coloringImageSelect');
    if (select) {
        select.innerHTML = '<option value="">-- Selecciona una imagen --</option>' +
            animals.map((a, i) => `<option value="${i}">${a.name}</option>`).join('');
        select.addEventListener('change', function() {
            const val = parseInt(this.value, 10);
            if (!isNaN(val)) selectAnimal(val);
        });
    }

    // Preparar paleta (una vez)
    setupColorPalette();
}

function selectAnimal(index) {
    currentAnimalIndex = index;

    const cards = document.querySelectorAll('.animal-card');
    cards.forEach((card, i) => {
        card.classList.toggle('selected', i === index);
    });

    document.getElementById('animalsGallery').style.display = 'none';
    document.getElementById('coloringGame').style.display = 'flex';

    loadAnimalImage(index);
}

function setupColorPalette() {
    const presets = ['#000000','#ffffff','#ff0000','#ff9800','#ffd600','#4caf50','#2196f3','#9c27b0','#e91e63','#795548'];
    const palette = document.getElementById('colorPalette');
    if (!palette) return;

    palette.innerHTML = '';
    presets.forEach(c => {
        const sw = document.createElement('div');
        sw.className = 'color-swatch';
        sw.style.background = c;
        sw.title = c;
        sw.addEventListener('click', () => {
            currentColor = c;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            sw.classList.add('selected');
            const colorPicker = document.getElementById('colorPicker');
            if (colorPicker) colorPicker.value = c;
        });
        palette.appendChild(sw);
    });

    // seleccionar el primero
    const first = palette.querySelector('.color-swatch');
    if (first) first.classList.add('selected');

    // color picker y tamaño de pincel
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.value = currentColor;
        colorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        });
    }

    const brushRange = document.getElementById('brushSizeColoring');
    if (brushRange) {
        brushSize = parseInt(brushRange.value, 10) || brushSize;
        brushRange.addEventListener('input', (e) => {
            brushSize = parseInt(e.target.value, 10) || 1;
        });
    }
}

function loadAnimalImage(index) {
    const animal = animals[index];
    let imageContainer = document.getElementById('coloringImageContainer');
    if (!imageContainer) {
        imageContainer = document.createElement('div');
        imageContainer.id = 'coloringImageContainer';
        imageContainer.style.position = 'relative';
        imageContainer.style.display = 'flex';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.alignItems = 'center';
        const gameDiv = document.getElementById('coloringGame');
        gameDiv.appendChild(imageContainer);
    }

    // Crear imagen base
    imageContainer.innerHTML = '';
    baseImage = document.createElement('img');
    baseImage.src = animal.image;
    baseImage.alt = animal.name;
    baseImage.className = 'coloring-image';
    baseImage.style.maxWidth = '600px';
    baseImage.style.maxHeight = '500px';
    baseImage.style.border = '3px solid #667eea';
    baseImage.style.borderRadius = '10px';
    baseImage.style.background = 'white';

    imageContainer.appendChild(baseImage);

    // Cuando la imagen carga, crear el canvas y dibujarla
    baseImage.onload = function() {
        // Crear o reutilizar canvas
        if (!coloringCanvas) {
            coloringCanvas = document.createElement('canvas');
            coloringCanvas.id = 'coloringCanvas';
            coloringCanvas.style.position = 'absolute';
            coloringCanvas.style.left = '50%';
            coloringCanvas.style.top = '50%';
            coloringCanvas.style.transform = 'translate(-50%, -50%)';
            coloringCanvas.style.borderRadius = '10px';
            imageContainer.appendChild(coloringCanvas);
        }

        // Ajustar tamaño del canvas a la resolución real de la imagen
        coloringCanvas.width = baseImage.naturalWidth;
        coloringCanvas.height = baseImage.naturalHeight;

        // Ajustar estilo (tamaño mostrado) para que coincida con la imagen visible
        coloringCanvas.style.width = baseImage.clientWidth + 'px';
        coloringCanvas.style.height = baseImage.clientHeight + 'px';

        coloringCtx = coloringCanvas.getContext('2d');

        // Dibujar la imagen como fondo del canvas
        coloringCtx.clearRect(0,0,coloringCanvas.width, coloringCanvas.height);
        coloringCtx.drawImage(baseImage, 0, 0, coloringCanvas.width, coloringCanvas.height);

        // Preparar eventos de pintura
        setupPaintingEvents();

        // Actualizar título
        document.getElementById('coloringTitle').textContent = `Coloreando: ${animal.name}`;
    };

    baseImage.onerror = function() {
        imageContainer.innerHTML = '<p>Imagen no encontrada</p>';
    };
}

function setupPaintingEvents() {
    if (!coloringCanvas) return;

    // Evitar duplicar listeners
    coloringCanvas.onpointerdown = (e) => startPainting(e);
    coloringCanvas.onpointermove = (e) => drawPointer(e);
    coloringCanvas.onpointerup = (e) => stopPainting(e);
    coloringCanvas.onpointerleave = (e) => stopPainting(e);

    // Soporte táctil: pointer events ya cubren touch
}

function getCanvasCoords(evt) {
    const rect = coloringCanvas.getBoundingClientRect();
    const scaleX = coloringCanvas.width / rect.width;
    const scaleY = coloringCanvas.height / rect.height;
    const x = (evt.clientX - rect.left) * scaleX;
    const y = (evt.clientY - rect.top) * scaleY;
    return { x, y };
}

function startPainting(e) {
    isPainting = true;
    coloringCtx.lineCap = 'round';
    coloringCtx.lineJoin = 'round';
    coloringCtx.strokeStyle = currentColor;
    coloringCtx.lineWidth = brushSize;
    const { x, y } = getCanvasCoords(e);
    coloringCtx.beginPath();
    coloringCtx.moveTo(x, y);
}

function drawPointer(e) {
    if (!isPainting) return;
    coloringCtx.strokeStyle = currentColor;
    coloringCtx.lineWidth = brushSize;
    const { x, y } = getCanvasCoords(e);
    coloringCtx.lineTo(x, y);
    coloringCtx.stroke();
}

function stopPainting(e) {
    if (!isPainting) return;
    isPainting = false;
    coloringCtx.closePath();
}

function resetColoring() {
    if (!coloringCanvas || !baseImage) {
        loadAnimalImage(currentAnimalIndex);
        return;
    }

    // Redibujar la imagen base en el canvas (limpia la pintura)
    coloringCtx.clearRect(0, 0, coloringCanvas.width, coloringCanvas.height);
    coloringCtx.drawImage(baseImage, 0, 0, coloringCanvas.width, coloringCanvas.height);
}

function backToGallery() {
    document.getElementById('animalsGallery').style.display = 'block';
    document.getElementById('coloringGame').style.display = 'none';

    // Limpiar selección
    document.querySelectorAll('.animal-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Opcional: liberar canvas
    if (coloringCanvas) {
        coloringCanvas.remove();
        coloringCanvas = null;
        coloringCtx = null;
        baseImage = null;
    }
}

function downloadColoring() {
    try {
        const animal = animals[currentAnimalIndex];

        if (coloringCanvas) {
            const link = document.createElement('a');
            const fecha = new Date().toLocaleString('es-ES').replace(/[\/,: ]/g, '_');
            link.download = `${animal.name}_${fecha}.png`;
            link.href = coloringCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('¡Imagen descargada exitosamente!');
            return;
        }

        // Fallback: si no hay canvas, intentar descargar la imagen original
        const imageElement = document.querySelector('.coloring-image');
        if (!imageElement) {
            alert('No hay imagen para descargar. Por favor selecciona una imagen.');
            return;
        }

        const canvas = document.createElement('canvas');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            const fecha = new Date().toLocaleString('es-ES').replace(/[\/,: ]/g, '_');
            link.download = `${animal.name}_${fecha}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('¡Imagen descargada exitosamente!');
        };
        img.onerror = function() {
            alert('Error al procesar la imagen. Por favor intenta de nuevo.');
        };
        img.src = document.querySelector('.coloring-image').src;
    } catch (e) {
        console.error('Error en downloadColoring:', e);
        alert('Error inesperado al descargar la imagen.');
    }
}
