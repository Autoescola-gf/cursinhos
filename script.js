// =======================================================
// ARQUIVO: script.js
// LÓGICA DE SEGURANÇA E REGISTRO DE PRESENÇA
// =======================================================

// 🚨 IMPORTANTE: Substitua 'YOUR_SHEETDB_PRESENCE_URL' pelo URL real da sua API SheetDB para a planilha de Presença.
const SHEETDB_PRESENCE_URL = 'https://sheetdb.io/api/v1/d2cbxsw23rkjz'; 
const EMAIL_STORAGE_KEY = 'loggedInUserEmail';
const PRESENCE_DATE_KEY = 'lastPresenceDate'; // Chave para armazenar a data da última presença no localStorage
const SESSION_KEY = 'isAuthenticated'; // Chave de sessão para controle de login

// =======================================================
// 1. FUNÇÕES DE UTILIDADE E AUXILIARES
// =======================================================

/**
 * Retorna a data atual no formato YYYY-MM-DD para uso como chave de comparação.
 * @returns {string} Data formatada.
 */
function getCurrentDateKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// =======================================================
// 2. FUNÇÕES DE AUTENTICAÇÃO E SEGURANÇA
// (Assumindo que o login ocorreu em index.html e salvou o email e a sessão)
// =======================================================

/**
 * Verifica se o usuário tem acesso (se está logado).
 * Se não estiver, redireciona para a página de login.
 */
function checkAccess() {
    // Verifica tanto a chave de sessão quanto o email
    if (sessionStorage.getItem(SESSION_KEY) !== 'true' || !sessionStorage.getItem(EMAIL_STORAGE_KEY)) {
        alert('Acesso negado. Por favor, faça login.');
        window.location.href = 'index.html';
    }
}

/**
 * Encerra a sessão do usuário e redireciona para a página de login.
 */
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);
    // Não remove o localStorage de Presença, para que o usuário não possa marcar novamente no dia.
    window.location.href = 'index.html';
}

// =======================================================
// 3. FUNÇÕES DE NAVEGAÇÃO
// =======================================================

/**
 * Exibe a aula selecionada e atualiza o estado dos botões.
 * @param {string} lessonId O ID da div da aula a ser mostrada (e.g., 'aula1').
 */
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

// =======================================================
// 4. FUNÇÕES DE REGISTRO DE PRESENÇA
// =======================================================

/**
 * Verifica o estado da presença diária no carregamento da página.
 */
function verificarStatusPresenca() {
    const todayKey = getCurrentDateKey();
    const lastPresenceDate = localStorage.getItem(PRESENCE_DATE_KEY);
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');

    if (lastPresenceDate === todayKey) {
        presencaButton.disabled = true;
        presencaButton.textContent = 'Presença de Hoje Já Registrada ✅';
        presencaMessage.style.color = '#28a745';
        presencaMessage.textContent = `Você registrou sua presença hoje (${todayKey}).`;
    } else {
        presencaButton.disabled = false;
        presencaButton.textContent = 'Marcar Presença de Hoje';
        presencaMessage.style.color = '#000000';
        presencaMessage.textContent = 'Clique para registrar sua presença e frequência no curso.';
    }
}

/**
 * Registra a presença do usuário na planilha via SheetDB.
 */
async function marcarPresenca() {
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    
    // Desabilita o botão para evitar cliques duplos
    presencaButton.disabled = true;
    presencaButton.textContent = 'Registrando...';
    presencaMessage.textContent = 'Aguarde, enviando dados para o servidor...';
    presencaMessage.style.color = '#0077B5';

    const userEmail = sessionStorage.getItem(EMAIL_STORAGE_KEY);
    const todayKey = getCurrentDateKey();

    // Re-checa no caso de alguém tentar burlar o 'verificarStatusPresenca'
    const lastPresenceDate = localStorage.getItem(PRESENCE_DATE_KEY);
    if (lastPresenceDate === todayKey) {
        verificarStatusPresenca(); // Restaura o estado de "Já Registrada"
        return;
    }

    // Cria o objeto de dados para o SheetDB
    const dataToSend = {
        'data': {
            'Email': userEmail, // Coluna 'Email' na planilha
            'Data': todayKey,   // Coluna 'Data' na planilha
            'HoraRegistro': new Date().toLocaleTimeString('pt-BR') // Opcional: Para maior precisão
        }
    };

    try {
        const response = await fetch(SHEETDB_PRESENCE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();

        if (response.ok && result.created) {
            // Sucesso! Atualiza o localStorage para evitar múltiplos registros
            localStorage.setItem(PRESENCE_DATE_KEY, todayKey);
            
            presencaMessage.textContent = 'Presença registrada com sucesso! Data: ' + todayKey;
            presencaMessage.style.color = '#28a745';
            presencaButton.textContent = 'Presença de Hoje Já Registrada ✅';
            
        } else {
            throw new Error(`Erro ao registrar presença: ${result.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro no registro de presença:', error);
        
        presencaMessage.textContent = `Falha ao registrar. Erro: ${error.message}. Tente novamente.`;
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Tentar Registrar Presença Novamente';
    }
}

// =======================================================
// 5. INICIALIZAÇÃO DA PÁGINA
// =======================================================

/**
 * Função principal que inicializa o estado da página ao carregar.
 */
function initializePage() {
    checkAccess();
    verificarStatusPresenca();
    
    // Exibe a primeira aula por padrão ao carregar
    showLesson('aula1'); 
}

// Chama a função de inicialização assim que o DOM estiver carregado
window.onload = initializePage;
