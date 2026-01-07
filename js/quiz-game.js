// Juego del Quiz con niveles y banco extendido

const QUIZ_BANK = {
    easy: [
        { question: '¿Cuántos colores tiene un semáforo (sin contar flechas)?', options: ['2','3','4','5'], correct: 1 },
        { question: '¿Qué animal dice "miau"?', options: ['Perro','Gato','Vaca','Pato'], correct: 1 },
        { question: '¿Cuál de estos es un número par?', options: ['3','7','8','9'], correct: 2 },
        { question: '¿De qué color es el cielo en un día claro?', options: ['Verde','Azul','Rojo','Negro'], correct: 1 },
        { question: '¿Qué fruta es roja por fuera y muchas veces roja por dentro?', options: ['Plátano','Manzana','Uva','Limón'], correct: 1 }
    ],
    medium: [
        { question: '¿Cuál es el animal más grande del mundo?', options: ['Elefante','Ballena azul','Jirafa','Rinoceronte'], correct: 1 },
        { question: '¿Cuántos colores tiene un arcoíris?', options: ['5','6','7','8'], correct: 2 },
        { question: '¿En qué planeta vivimos?', options: ['Marte','Venus','Tierra','Júpiter'], correct: 2 },
        { question: '¿Cuál es la capital de Francia?', options: ['Lyon','Marsella','París','Toulouse'], correct: 2 },
        { question: '¿Cuántas patas tiene una araña?', options: ['6','8','10','12'], correct: 1 },
        { question: '¿Qué animal es la mascota de Disney?', options: ['Pato Donald','Mickey Mouse','Goofy','Pluto'], correct: 1 },
        { question: '¿De qué árbol vienen las manzanas?', options: ['Cerezo','Naranjo','Manzano','Peral'], correct: 2 }
    ],
    hard: [
        { question: '¿Qué gas respiramos principalmente?', options: ['Dióxido de carbono','Oxígeno','Nitrógeno','Hidrógeno'], correct: 1 },
        { question: '¿Cuál es la capital de Japón?', options: ['Kioto','Osaka','Tokio','Hiroshima'], correct: 2 },
        { question: '¿Cuál es la fórmula del agua?', options: ['CO2','H2O','O2','NaCl'], correct: 1 },
        { question: '¿Qué parte de la planta produce semillas?', options: ['Raíz','Hoja','Flor','Tallo'], correct: 2 },
        { question: '¿Cuál es el continente más grande?', options: ['África','Asia','Europa','América'], correct: 1 },
        { question: '¿Cuál es la velocidad aproximada del sonido en el aire (m/s)?', options: ['340','100','50','10'], correct: 0 }
    ]
};

let quizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswer = null;
let quizTotalQuestions = 10;

function initQuizGame() {
    const diff = document.getElementById('quizDifficultySelect')?.value || 'medium';
    // Construir preguntas mezcladas según nivel
    let pool = [];
    if (diff === 'easy') pool = QUIZ_BANK.easy.slice();
    else if (diff === 'hard') pool = QUIZ_BANK.hard.slice();
    else pool = QUIZ_BANK.medium.slice();

    // Añadir algo de mezcla y combinación para más variedad
    if (diff === 'medium') pool = pool.concat(QUIZ_BANK.easy.slice());
    if (diff === 'hard') pool = pool.concat(QUIZ_BANK.medium.slice(), QUIZ_BANK.easy.slice());

    pool = shuffleArray(pool);
    quizQuestions = pool.slice(0, Math.max(5, quizTotalQuestions));
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quizTotal').textContent = quizQuestions.length;
    displayQuestion();
}

function displayQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    const question = quizQuestions[currentQuestionIndex];
    
    // Actualizar números
    document.getElementById('quizNumber').textContent = (currentQuestionIndex + 1);
    document.getElementById('quizScore').textContent = quizScore;
    
    let html = `
        <div class="quiz-question">
            <h3>${question.question}</h3>
            <div class="quiz-options">
    `;
    
    question.options.forEach((option, index) => {
        html += `
            <button class="quiz-option" onclick="selectAnswer(${index})">
                ${option}
            </button>
        `;
    });
    
    html += `
            </div>
            <button class="btn-secondary quiz-button" onclick="nextQuestion()" style="display:none;" id="nextBtn">
                Siguiente Pregunta →
            </button>
        </div>
    `;
    
    quizContainer.innerHTML = html;
}

function selectAnswer(index) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    
    // Mostrar todas las respuestas
    options.forEach((option, i) => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
        
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === index) {
            option.classList.add('incorrect');
        }
    });
    
    // Contar aciertos
    if (index === question.correct) {
        quizScore++;
        document.getElementById('quizScore').textContent = quizScore;
    }
    
    // Mostrar botón siguiente
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const quizContainer = document.getElementById('quizContainer');
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = '¡EXCELENTE! ¡Respondiste todas las preguntas correctamente!';
        emoji = '🌟⭐⭐⭐';
    } else if (percentage >= 80) {
        message = '¡MUY BIEN! ¡Lo hiciste genial!';
        emoji = '🎉👏';
    } else if (percentage >= 60) {
        message = '¡BIEN HECHO! ¡Deberías intentarlo de nuevo!';
        emoji = '😊👍';
    } else {
        message = '¡No te desanimes! Intenta de nuevo para mejorar.';
        emoji = '💪🔄';
    }
    
    let html = `
        <div class="quiz-question" style="text-align: center;">
            <h2>${emoji}</h2>
            <h3>${message}</h3>
            <p style="font-size: 1.5em; font-weight: bold; color: #667eea; margin: 20px 0;">
                Puntuación: ${quizScore}/${quizQuestions.length} (${percentage}%)
            </p>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button class="btn-secondary quiz-button" onclick="restartQuiz()">🔄 Jugar de Nuevo</button>
                <button class="btn-secondary quiz-button" onclick="initQuizGame()">🏁 Cambiar Nivel / Volver</button>
            </div>
        </div>
    `;
    
    quizContainer.innerHTML = html;
}

function restartQuiz() {
    initQuizGame();
}

// Utilidades
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
