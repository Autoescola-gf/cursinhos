// 🚨 PASSO 1: EDITE ESTA LISTA DE TOKENS!
// CÓDIGOS ÚNICOS QUE VOCÊ VAI DISTRIBUIR.
const VALID_TOKENS = [
    'SEUTOKEN1',
    'SEUTOKEN2',
    'EXEMPLO-DO-ALUNO-VIP',
    'CODIGO-DE-TESTE-42'
    // Adicione mais tokens aqui
];

// Chaves usadas para armazenar dados no navegador
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const USED_TOKENS_KEY = 'consumed_tokens';
const DURATION_HOURS = 24; // Duração do acesso em horas


// =======================================================
// LÓGICA DE LOGIN (Usada em index.html)
// =======================================================

function checkToken() {
    if (document.getElementById('tokenInput')) {
        const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
        const messageElement = document.getElementById('message');

        // Puxa a lista de tokens já usados do armazenamento local
        let usedTokens = JSON.parse(localStorage.getItem(USED_TOKENS_KEY)) || [];

        // Verifica se o token é válido E se ainda não foi usado (simulação)
        if (VALID_TOKENS.includes(tokenInput) && !usedTokens.includes(tokenInput)) {
            
            // 1. Calcula o tempo de expiração (agora + 24 horas)
            const expirationTime = Date.now() + (DURATION_HOURS * 60 * 60 * 1000);
            
            // 2. Armazena o acesso e a expiração
            localStorage.setItem(ACCESS_KEY, 'true');
            localStorage.setItem(EXPIRATION_KEY, expirationTime);

            // 3. Adiciona o token à lista de tokens usados (simulação de uso único)
            usedTokens.push(tokenInput);
            localStorage.setItem(USED_TOKENS_KEY, JSON.stringify(usedTokens));

            messageElement.textContent = `Acesso concedido por ${DURATION_HOURS} horas! Redirecionando...`;
            messageElement.style.color = 'green';
            
            setTimeout(() => {
                window.location.href = 'videos.html';
            }, 500);

        } else if (usedTokens.includes(tokenInput)) {
             // Token já usado
            messageElement.textContent = 'Este token já foi utilizado e expirou. Por favor, solicite um novo acesso.';
            messageElement.style.color = 'red';
        } else {
            // Token inválido
            messageElement.textContent = 'Token inválido. Tente novamente.';
            messageElement.style.color = 'red';
            localStorage.removeItem(ACCESS_KEY);
        }
    }
}


// =======================================================
// LÓGICA DE PROTEÇÃO, TIMER E NAVEGAÇÃO (Usada em videos.html)
// =======================================================

// Função que controla a exibição das aulas (mantida do código anterior)
function showLesson(lessonId) {
    const allLessons = document.querySelectorAll('.aula-container');
    allLessons.forEach(lesson => lesson.style.display = 'none');

    const allButtons = document.querySelectorAll('.nav-buttons button');
    allButtons.forEach(button => button.classList.remove('active'));

    const currentLesson = document.getElementById(lessonId);
    if (currentLesson) {
        currentLesson.style.display = 'block';
    }

    const currentButton = document.getElementById(`btn-${lessonId}`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
}


// Função que verifica acesso e validade do timer
function checkAccess() {
    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
        const expirationTime = localStorage.getItem(EXPIRATION_KEY);

        // Se o acesso ou o tempo de expiração não existirem, redireciona
        if (!hasAccess || !expirationTime) {
            window.location.href = 'index.html?expired=no_access';
            return false;
        }

        // Verifica se o tempo expirou
        if (Date.now() > parseInt(expirationTime)) {
            logout(); // Limpa as chaves e redireciona
            // Adiciona um parâmetro na URL para exibir mensagem de expiração na tela de login
            window.location.href = 'index.html?expired=true';
            return false;
        }
        
        // Se o acesso for válido, exibe a primeira aula
        if(document.getElementById('aula1')) {
            showLesson('aula1');
        }
        
        return true;
    }
    return true; 
}


function logout() {
    // Remove as chaves de acesso e expiração
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    // IMPORTANTE: Mantém a chave USED_TOKENS_KEY para simular uso único
    window.location.href = 'index.html';
}

// Garante que a ver
