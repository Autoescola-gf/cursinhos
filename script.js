// 🚨 PASSO 1: EDITE ESTA LISTA DE TOKENS!
const VALID_TOKENS = [
    'SEUTOKEN1',
    'SEUTOKEN2',
    'EXEMPLO-DO-ALUNO-VIP',
    'CODIGO-DE-TESTE-42'
    // Adicione mais tokens aqui
];

const ACCESS_KEY = 'vimeo_access_granted';


// =======================================================
// LÓGICA DE LOGIN (Usada em index.html)
// =======================================================

function checkToken() {
    if (document.getElementById('tokenInput')) {
        const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
        const messageElement = document.getElementById('message');

        if (VALID_TOKENS.includes(tokenInput)) {
            localStorage.setItem(ACCESS_KEY, 'true');
            messageElement.textContent = 'Acesso concedido! Redirecionando...';
            messageElement.style.color = 'green';
            
            setTimeout(() => {
                window.location.href = 'videos.html';
            }, 500);

        } else {
            messageElement.textContent = 'Token inválido ou expirado. Tente novamente.';
            messageElement.style.color = 'red';
            localStorage.removeItem(ACCESS_KEY);
        }
    }
}


// =======================================================
// LÓGICA DE PROTEÇÃO E NAVEGAÇÃO (Usada em videos.html)
// =======================================================

// Função que controla a exibição das aulas
function showLesson(lessonId) {
    // 1. Oculta todos os containers de aula
    const allLessons = document.querySelectorAll('.aula-container');
    allLessons.forEach(lesson => {
        lesson.style.display = 'none';
    });

    // 2. Remove o estado 'active' de todos os botões
    const allButtons = document.querySelectorAll('.nav-buttons button');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 3. Exibe a aula solicitada
    const currentLesson = document.getElementById(lessonId);
    if (currentLesson) {
        currentLesson.style.display = 'block';
    }

    // 4. Marca o botão como ativo
    const currentButton = document.getElementById(`btn-${lessonId}`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
}


// Função que verifica se o usuário tem a chave de acesso no localStorage.
function checkAccess() {
    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';

        if (!hasAccess) {
            window.location.href = 'index.html';
            return false;
        }
        
        // ** NOVO: Exibe a primeira aula ao carregar a página **
        // Se a aula1 existir, ela será mostrada por padrão
        if(document.getElementById('aula1')) {
            showLesson('aula1');
        }
        
        return true;
    }
    return true; 
}


function logout() {
    localStorage.removeItem(ACCESS_KEY);
    window.location.href = 'index.html';
}

// Garante que a verificação de acesso ocorra assim que a página é carregada
window.onload = checkAccess;
