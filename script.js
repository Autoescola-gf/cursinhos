// =======================================================
// ARQUIVO: script.js
// LÓGICA DE SEGURANÇA E REGISTRO DE PRESENÇA (GOOGLE SHEETS)
// =======================================================

// 🚨 IMPORTANTE: Verifique se este URL é o CORRETO fornecido pelo Sheetdb.io
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/d2cbxsw23rkjz'; 

// Chaves de localStorage para o Timer de Acesso (24h)
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const DURATION_HOURS = 24;

// Chave de localStorage para a Presença Diária
const PRESENCE_DATE_KEY = 'lastPresenceDate'; 

// =======================================================
// 1. FUNÇÕES DE UTILIDADE E AUXILIARES
// =======================================================

/**
 * Formata o CPF (00000000000 -> 000.000.000-00) para manter consistência com o Sheets.
 */
function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '').substring(0, 11);
    if (cpf.length > 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

/**
 * Retorna a data atual no formato YYYY-MM-DD para uso como chave de comparação de presença.
 */
function getCurrentDateKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// =======================================================
// 2. LÓGICA DE LOGIN (Para index.html)
// =======================================================

/**
 * Função de Login: Busca o Token e o CPF na planilha, ativa ou renova o timer de 24h.
 */
async function checkToken() {
    const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
    // Garante que o CPF digitado está formatado antes da busca
    const cpfInput = formatCPF(document.getElementById('cpfInput').value.trim()); 
    
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('loginButton');

    messageElement.textContent = '';
    messageElement.style.color = 'red';
    
    if (cpfInput.length !== 14 || !tokenInput) {
        messageElement.textContent = 'Por favor, preencha o Token e o CPF corretamente.';
        return;
    }

    loginButton.disabled = true;
    messageElement.textContent = 'Verificando acesso...';
    messageElement.style.color = 'gray';

    try {
        // 1. Busca na planilha pelo Token e CPF
        // Sheetdb filtra a busca exatamente pelo par token/cpf
        const searchUrl = `${SHEETDB_API_URL}/search?token=${tokenInput}&cpf=${cpfInput}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data || data.length === 0 || data.length > 1) {
            // Este é o ponto que estava falhando antes. Significa que o par Token/CPF não foi encontrado.
            messageElement.textContent = 'Erro: Token ou CPF inválido. Aluno não encontrado na base.';
            return;
        }

        const alunoData = data[0];
        const agora = Date.now();
        // A planilha armazena a expiração como string, converte para número
        const expiracaoSalva = parseInt(alunoData.expiracao_ms) || 0;
        
        let novaExpiracao;
        let statusMensagem;

        // 2. Lógica do Timer (24h)
        if (agora < expiracaoSalva) {
            // Acesso ainda válido
            statusMensagem = 'Acesso já ativo. Redirecionando...';
            novaExpiracao = expiracaoSalva;
        } else {
            // Acesso expirado ou novo: Renovação por 24 horas
            novaExpiracao = agora + (DURATION_HOURS * 60 * 60 * 1000);
            
            // 3. Atualiza a Planilha com a nova data de expiração
            // Assume que o token é único e usa ele como chave de atualização no Sheetdb
            const updateUrl = `${SHEETDB_API_URL}/token/${tokenInput}`;
            
            await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: { expiracao_ms: novaExpiracao }
                })
            });
            
            statusMensagem = `Acesso renovado por ${DURATION_HOURS} horas! Redirecionando...`;
        }

        // 4. Salva o acesso no localStorage (Chaves de sessão)
        localStorage.setItem(ACCESS_KEY, 'true');
        localStorage.setItem(EXPIRATION_KEY, novaExpiracao);
        localStorage.setItem(CPF_KEY, cpfInput);
        localStorage.setItem(TOKEN_KEY, tokenInput); // Salva o token para uso na presença

        messageElement.textContent = statusMensagem;
        messageElement.style.color = 'green';
        
        setTimeout(() => {
            window.location.href = 'videos.html';
        }, 500);

    } catch (error) {
        console.error("Erro de comunicação com o SheetDB:", error);
        messageElement.textContent = 'Erro de comunicação ou no servidor. Tente novamente mais tarde.';
    } finally {
        loginButton.disabled = false;
    }
}

// =======================================================
// 3. SEGURANÇA E ACESSO (Para videos.html)
// =======================================================

/**
 * Verifica se o usuário tem acesso válido (timer de 24h).
 */
function checkAccess() {
    const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);

    // Se não tiver acesso ou não tiver tempo de expiração salvo
    if (!hasAccess || !expirationTime) {
        window.location.href = 'index.html?expired=no_access';
        return false;
    }

    // Verifica se o tempo expirou
    if (Date.now() > parseInt(expirationTime)) {
        logout(); // Limpa a sessão
        window.location.href = 'index.html?expired=true';
        return false;
    }
    
    // Se o acesso for válido, exibe a primeira aula e verifica a presença
    if(document.getElementById('aula1')) {
        showLesson('aula1');
        verificarStatusPresenca(); // NOVO: Checa o status da presença ao entrar
    }
    
    return true; 
}

/**
 * Encerra a sessão do usuário e redireciona para a página de login.
 */
function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    localStorage.removeItem(CPF_KEY); 
    localStorage.removeItem(TOKEN_KEY);
    // Presença Diária (PRESENCE_DATE_KEY) é mantida para que a marcação diária não possa ser repetida.
    window.location.href = 'index.html';
}


// =======================================================
// 4. REGISTRO DE PRESENÇA (Para videos.html)
// =======================================================

/**
 * Verifica o estado da presença diária (Lida do localStorage).
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
    
    presencaButton.disabled = true;
    presencaButton.textContent = 'Registrando...';
    presencaMessage.textContent = 'Aguarde, enviando dados para o servidor...';
    presencaMessage.style.color = '#0077B5';

    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY); // Usamos o CPF como identificador secundário

    const todayKey = getCurrentDateKey();

    // Re-checa para evitar cliques duplos enquanto a requisição está em andamento
    const lastPresenceDate = localStorage.getItem(PRESENCE_DATE_KEY);
    if (lastPresenceDate === todayKey) {
        verificarStatusPresenca(); 
        return;
    }
    
    // Se o token ou cpf não estiverem salvos, o usuário não está logado
    if (!token || !cpf) {
        presencaMessage.textContent = 'Erro: Falha de autenticação. Tente fazer login novamente.';
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Marcar Presença de Hoje';
        return;
    }

    try {
        // 1. Busca o aluno para obter os dados atuais
        const searchUrl = `${SHEETDB_API_URL}/search?token=${token}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error("Aluno não encontrado na base de dados (SheetDB)");
        }
        
        // 2. Cria o objeto de dados para ATUALIZAR a linha existente com a data de hoje
        const dataToUpdate = {
            'data': {
                'ultima_presenca': todayKey, 
                // Você pode adicionar um contador ou registro de hora se quiser
            }
        };

        // Usa o token como chave para garantir que a linha correta seja atualizada (PATCH)
        const updateUrl = `${SHEETDB_API_URL}/token/${token}`;

        const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        });

        const result = await updateResponse.json();

        if (updateResponse.ok) {
            // Sucesso! Atualiza o localStorage para evitar múltiplos registros
            localStorage.setItem(PRESENCE_DATE_KEY, todayKey);
            
            presencaMessage.textContent = 'Presença registrada com sucesso! Data: ' + todayKey;
            presencaMessage.style.color = '#28a745';
            presencaButton.textContent = 'Presença de Hoje Já Registrada ✅';
            
        } else {
             // Se o Sheetdb falhar, mas a requisição retornar status OK, a mensagem de erro estará em 'result'
            throw new Error(`Erro ao registrar presença: ${result.message || updateResponse.statusText}`);
        }
    } catch (error) {
        console.error('Erro no registro de presença:', error);
        
        presencaMessage.textContent = `Falha ao registrar. Verifique sua conexão. Erro: ${error.message}.`;
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Tentar Registrar Presença Novamente';
    }
}

// =======================================================
// 5. FUNÇÕES DE NAVEGAÇÃO
// =======================================================

// Nota: A função showLesson deve ser definida no HTML, mas incluí ela aqui para o caso de ter sido esquecida.
// Se ela for definida no HTML, esta versão será ignorada, mas garante que o código não quebre.
if (typeof showLesson === 'undefined') {
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
}

// =======================================================
// 6. INICIALIZAÇÃO DA PÁGINA
// =======================================================

/**
 * Função principal que inicializa o estado da página ao carregar.
 */
function initializePage() {
    // Adiciona o formatador de CPF ao campo de input na página de login
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }

    // Lógica específica para a página de aulas (videos.html)
    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        checkAccess();
    }
    
    // Lógica específica para a página de login (index.html)
    else if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        // Se a página for a de login, não faz nada além de formatar o CPF
    }
}

// Chama a função de inicialização assim que o DOM estiver carregado
window.onload = initializePage;
