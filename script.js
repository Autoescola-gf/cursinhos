// 🚨 PASSO 1: EDITE ESTA LISTA DE TOKENS!
// CÓDIGOS que você distribuirá. Eles funcionam como senhas.
const VALID_TOKENS = [
    'ALUNO123',
    'AULAVIP99',
    'CODIGO-DE-TESTE'
    // Adicione mais tokens aqui
];

// Chaves usadas para armazenar dados no navegador
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const CPF_KEY = 'vimeo_user_cpf'; // Chave para armazenar o CPF do usuário
const DURATION_HOURS = 24; // Duração do acesso em horas

// =======================================================
// LÓGICA DE LOGIN (Usada em index.html)
// =======================================================

function formatCPF(cpf) {
    // Remove tudo que não for dígito e garante apenas 11 caracteres
    cpf = cpf.replace(/[^\d]/g, '').substring(0, 11);
    // Aplica a máscara: XXX.XXX.XXX-XX
    if (cpf.length > 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

// Event listener para formatar o CPF enquanto o usuário digita
window.onload = function() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        // Aplica a verificação de acesso ao carregar a página (para videos.html)
        checkAccess(); 
        
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    } else {
        // Se não for a página de login, apenas executa a verificação
        checkAccess(); 
    }
};


function checkToken() {
    if (document.getElementById('tokenInput')) {
        const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
        const cpfInput = document.getElementById('cpfInput').value.trim();
        const messageElement = document.getElementById('message');

        // Limpa mensagens anteriores
        messageElement.textContent = '';
        messageElement.style.color = 'red';
        
        // Validação básica do CPF
        if (cpfInput.length !== 14) {
            messageElement.textContent = 'Por favor, insira um CPF válido (11 dígitos).';
            return;
        }

        // 1. Verifica se o token é válido
        if (VALID_TOKENS.includes(tokenInput)) {
            
            // 2. Calcula o tempo de expiração (agora + 24 horas)
            const expirationTime = Date.now() + (DURATION_HOURS * 60 * 60 * 1000);
            
            // 3. Armazena o acesso, o CPF e a expiração
            localStorage.setItem(ACCESS_KEY, 'true');
            localStorage.setItem(EXPIRATION_KEY, expirationTime);
            localStorage.setItem(CPF_KEY, cpfInput); // Salva o CPF vinculado
            
            messageElement.textContent = `Acesso concedido por ${DURATION_HOURS} horas! Redirecionando...`;
            messageElement.style.color = 'green';
            
            setTimeout(() => {
                window.location.href = 'videos.html';
            }, 500);

        } else {
            // Token inválido
            messageElement.textContent = 'Token ou CPF inválido. Tente novamente.';
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
        const userCPF = localStorage.getItem(CPF_KEY); // Obtém o CPF salvo

        // Se o acesso, expiração ou CPF não existirem, redireciona
        if (!hasAccess || !expirationTime || !userCPF) {
            window.location.href = 'index.html?expired=no_access';
            return false;
        }

        // 🚨 Verificação do Timer
        if (Date.now() > parseInt(expirationTime)) {
            logout(); // Limpa as chaves e redireciona
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
    // Remove as chaves de acesso e expiração (mantém o CPF no caso de querer fazer tracking)
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    // Remove o CPF também para forçar um novo login completo se o usuário sair.
    localStorage.removeItem(CPF_KEY); 
    window.location.href = 'index.html';
}
