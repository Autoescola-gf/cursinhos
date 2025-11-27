// script.js
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/d2cbxsw23rkjz'; // 🚨 EDITE AQUI
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const CPF_KEY = 'vimeo_user_cpf';
const DURATION_HOURS = 24;


// Funções utilitárias (mantidas do código anterior)
function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '').substring(0, 11);
    if (cpf.length > 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}
window.onload = function() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }
    checkAccess();
};

// =======================================================
// LÓGICA DE LOGIN (CHAMADA À API DO SHEETDB)
// =======================================================

async function checkToken() {
    const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
    const cpfInput = document.getElementById('cpfInput').value.trim();
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('loginButton');

    messageElement.textContent = '';
    messageElement.style.color = 'red';
    
    if (cpfInput.length !== 14 || !tokenInput) {
        messageElement.textContent = 'Por favor, preencha o Token e o CPF corretamente.';
        return;
    }

    loginButton.disabled = true;
    messageElement.textContent = 'Verificando dados...';
    messageElement.style.color = 'gray';

    try {
        // 1. Busca o Token e CPF na planilha (Sheetdb)
        // Busca a linha onde o token e o cpf coincidem. A API do Sheetdb faz o filtro:
        const searchUrl = `${SHEETDB_API_URL}/search?token=${tokenInput}&cpf=${cpfInput}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data || data.length === 0 || data.length > 1) {
            messageElement.textContent = 'Token ou CPF inválido. Tente novamente.';
            return;
        }

        const alunoData = data[0];
        const agora = Date.now();
        const expiracaoSalva = parseInt(alunoData.expiracao_ms) || 0;
        
        let novaExpiracao;
        let statusMensagem;

        // 2. Lógica do Timer
        if (agora < expiracaoSalva) {
            // Acesso ainda válido
            statusMensagem = 'Acesso já ativo. Redirecionando...';
            novaExpiracao = expiracaoSalva;
        } else {
            // Acesso expirado ou novo acesso: Renovação por 24 horas
            novaExpiracao = agora + (DURATION_HOURS * 60 * 60 * 1000);
            
            // 3. Atualiza a Planilha com a nova data de expiração (requer PATCH/PUT)
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

        // 4. Salva o acesso e a nova expiração no localStorage
        localStorage.setItem(ACCESS_KEY, 'true');
        localStorage.setItem(EXPIRATION_KEY, novaExpiracao);
        localStorage.setItem(CPF_KEY, cpfInput);

        messageElement.textContent = statusMensagem;
        messageElement.style.color = 'green';
        
        setTimeout(() => {
            window.location.href = 'videos.html';
        }, 500);

    } catch (error) {
        console.error("Erro ao comunicar com o SheetDB:", error);
        messageElement.textContent = 'Erro de comunicação. Verifique a URL da API ou o status do SheetDB.';
    } finally {
        loginButton.disabled = false;
    }
}


// =======================================================
// LÓGICA DE PROTEÇÃO, TIMER E NAVEGAÇÃO (VIDEOS.HTML)
// =======================================================

// A função showLesson deve ser mantida do código anterior

function checkAccess() {
    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
        const expirationTime = localStorage.getItem(EXPIRATION_KEY);

        if (!hasAccess || !expirationTime) {
            window.location.href = 'index.html?expired=no_access';
            return false;
        }

        // Verifica se o tempo expirou
        if (Date.now() > parseInt(expirationTime)) {
            logout(); 
            window.location.href = 'index.html?expired=true';
            return false;
        }
        
        // Exibe a primeira aula (a função showLesson deve estar em videos.html)
        if(document.getElementById('aula1')) {
            showLesson('aula1');
        }
        
        return true;
    }
    return true; 
}


function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    localStorage.removeItem(CPF_KEY); 
    window.location.href = 'index.html';
}

// Função auxiliar para formatar uma data como AAAA-MM-DD
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// =======================================================
// FUNÇÃO DE PRESENÇA
// =======================================================

async function marcarPresenca() {
    const token = localStorage.getItem('vimeo_access_granted');
    const cpf = localStorage.getItem(CPF_KEY);
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    const todayString = getTodayDateString();

    presencaButton.disabled = true;
    presencaMessage.textContent = 'Registrando...';

    if (!token || !cpf) {
        presencaMessage.textContent = 'Erro: Faça login primeiro.';
        presencaButton.disabled = false;
        return;
    }

    try {
        // 1. Busca os dados atuais do aluno (para ver a última data)
        const searchUrl = `${SHEETDB_API_URL}/search?token=${token}&cpf=${cpf}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            presencaMessage.textContent = 'Erro: Aluno não encontrado na base.';
            presencaButton.disabled = false;
            return;
        }

        const alunoData = data[0];
        const ultimaPresenca = alunoData.ultima_presenca;
        
        // 2. Verifica se a presença já foi marcada hoje
        if (ultimaPresenca === todayString) {
            presencaMessage.textContent = `✅ Presença de hoje (${todayString}) já registrada.`;
            presencaMessage.style.color = 'green';
            presencaButton.disabled = false;
            return;
        }

        // 3. Marca a presença (Atualiza o Sheetdb com a data de hoje)
        const updateUrl = `${SHEETDB_API_URL}/token/${token}`;
        
        await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: { ultima_presenca: todayString }
            })
        });

        presencaMessage.textContent = `✅ Presença de hoje (${todayString}) registrada com sucesso!`;
        presencaMessage.style.color = 'green';

    } catch (error) {
        console.error("Erro ao marcar presença:", error);
        presencaMessage.textContent = '❌ Erro ao registrar. Tente novamente.';
    } finally {
        presencaButton.disabled = false;
    }
}

// =======================================================
// ATUALIZAÇÃO: CHECK ACCESS
// =======================================================

// A função checkAccess deve ser modificada para chamar a lógica de presença ao entrar na página,
// para mostrar o status do dia.

// Substitua a função checkAccess existente por esta (no seu script.js):
/*
async function checkAccess() {
    // ... (Mantém a lógica de verificação de hasAccess e expiração de 24h) ...
    
    // Se o acesso for válido, exibe a primeira aula
    if(document.getElementById('aula1')) {
        showLesson('aula1');
        // NOVO: Verifica o status da presença ao entrar na página
        if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
            await verificarStatusPresenca(); // Chama a função que verifica a presença
        }
    }
    return true; 
}
*/
async function verificarStatusPresenca() {
    const token = localStorage.getItem('vimeo_access_granted');
    const cpf = localStorage.getItem(CPF_KEY);
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    const todayString = getTodayDateString();
    
    // Mostra uma mensagem de carregamento inicial
    presencaMessage.textContent = 'Verificando presença...';
    
    if (!token || !cpf) return; // Não faz nada se não estiver logado

    try {
        const searchUrl = `${SHEETDB_API_URL}/search?token=${token}&cpf=${cpf}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].ultima_presenca === todayString) {
            presencaMessage.textContent = `✅ Presença de hoje (${todayString}) já registrada.`;
            presencaMessage.style.color = 'green';
            presencaButton.disabled = true;
        } else {
            presencaMessage.textContent = '❌ Presença de hoje pendente. Clique no botão acima!';
            presencaMessage.style.color = 'red';
            presencaButton.disabled = false;
        }

    } catch (error) {
        presencaMessage.textContent = 'Erro ao verificar status de presença.';
        presencaButton.disabled = false;
    }
}

