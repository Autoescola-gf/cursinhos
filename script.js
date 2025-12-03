// =======================================================
// ARQUIVO: script.js - VERSÃO FINAL CORRIGIDA (Cross-Device)
// =======================================================

// 🚨 IMPORTANTE: Mantenha sua URL de Apps Script aqui
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec'; 

// URL para a ação de Marcar Presença (POST com action no Apps Script)
const PRESENCE_LOG_API_URL = `${SHEETDB_API_URL}?action=marcar_presenca`;

// Chaves de localStorage para o Timer de Acesso (24h)
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const DURATION_HOURS = 24;

// 🚨 REMOVENDO: Chave de localStorage para a Presença Diária (Não é mais usada - Agora é Cross-Device via Apps Script)
// const PRESENCE_DATE_KEY = 'lastPresenceDate'; 

let countdownPresenceInterval = null;
let countdownTokenInterval = null;


// =======================================================
// 🚨 MAPA DE VÍDEOS (INFORMAÇÕES FORNECIDAS PELO USUÁRIO)
// =======================================================
const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Primeiros Socorros (Video 1)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula2': { title: 'Aula 2: Primeiros Socorros (Video 2)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula3': { title: 'Aula 3: Primeiros Socorros (Video 3)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula4': { title: 'Aula 4: Primeiros Socorros (Video 4)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula5': { title: 'Aula 5: Primeiros Socorros (Video 5)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula6': { title: 'Aula 6: Direção Defensiva (Video 1)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula7': { title: 'Aula 7: Direção Defensiva (Video 2)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula8': { title: 'Aula 8: Direção Defensiva (Video 3)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula9': { title: 'Aula 9: Infrações e Penalidades (Video 1)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula10': { title: 'Aula 10: Infrações e Penalidades (Video 2)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula11': { title: 'Aula 11: Infrações e Penalidades (Video 3)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula12': { title: 'Aula 12: Infrações e Penalidades (Video 4)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula13': { title: 'Aula 13: Normas e condutas (Video 1)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula14': { title: 'Aula 14: Normas e condutas (Video 2)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula15': { title: 'Aula 15: Normas e condutas (Video 3)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula16': { title: 'Aula 16: Normas e condutas (Video 4)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
    'aula17': { title: 'Aula 17: Normas e condutas (Video 5)', url: 'https://player.vimeo.com/video/941783856?h=f41551c6c6' },
};


// =======================================================
// 1. FUNÇÕES DE UTILIDADE
// =======================================================

function getCurrentDateKey() {
    // Retorna a data no formato YYYY-MM-DD para comparação no servidor
    return new Date().toISOString().split('T')[0];
}

function getCurrentTimestamp() {
    const now = new Date();
    // Formato HH:MM:SS
    return now.toLocaleTimeString('pt-BR', { hour12: false });
}

function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for dígito
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

function calcularTempoParaMeiaNoite() {
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(agora.getDate() + 1);
    amanha.setHours(0, 0, 0, 0); // Meia-noite de amanhã
    return amanha.getTime() - agora.getTime(); // Tempo em milissegundos
}

function formatarTempoRestante(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

// =======================================================
// 2. AUTENTICAÇÃO (checkToken)
// =======================================================

async function checkToken() {
    const cpfInput = document.getElementById('cpfInput');
    const tokenInput = document.getElementById('tokenInput');
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('loginButton');

    const cpf = cpfInput.value.replace(/\D/g, '');
    const token = tokenInput.value.trim();

    messageElement.textContent = '';
    
    if (cpf.length !== 11 || !token) {
        messageElement.textContent = 'Por favor, preencha o CPF completo e o token.';
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Verificando...';

    // O Apps Script (doGet) recebe o CPF e o Token e retorna [ { data_aluno } ] se válido ou [ ] se inválido.
    const searchUrl = `${SHEETDB_API_URL}?cpf=${cpf}&token=${token}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        // Verifica se o Apps Script retornou sucesso (array com dados)
        if (data && data.length > 0 && data[0].nome_aluno) {
            const now = new Date();
            const expirationTime = now.getTime() + (DURATION_HOURS * 60 * 60 * 1000); // 24 horas

            // Salva dados de acesso no localStorage
            localStorage.setItem(ACCESS_KEY, 'true');
            localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(NAME_KEY, data[0].nome_aluno); // Salva o nome do aluno

            // Redireciona para a página de vídeos
            window.location.href = 'videos.html';
        } else {
            // O Apps Script retornou [] ou objeto de erro
            messageElement.textContent = 'CPF ou Token inválidos. Tente novamente.';
        }
    } catch (error) {
        console.error('Erro de acesso:', error);
        messageElement.textContent = 'Erro de comunicação com o servidor. Tente novamente.';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Acessar Aulas';
    }
}


// =======================================================
// 3. SEGURANÇA E ACESSO (checkAccess)
// =======================================================

function checkAccess() {
    const hasAccess = localStorage.getItem(ACCESS_KEY);
    const expiresAt = localStorage.getItem(EXPIRATION_KEY);
    const now = new Date().getTime();
    
    // Verifica se há acesso e se não expirou (timer de 24h)
    if (hasAccess === 'true' && expiresAt && now < parseInt(expiresAt)) {
        // Se o token estiver ativo, esconde o alerta e inicia o contador
        const expirationAlert = document.getElementById('expiration-alert');
        if(expirationAlert) expirationAlert.style.display = 'none';

        // Obter o ID da aula da URL (lesson=aulaX)
        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson') || 'aula13'; // Padrão para aula13
        
        // Inicia a renderização do conteúdo apenas se estivermos em videos.html
        if(document.getElementById('videoPlayerContainer')) { 
            showLesson(lessonId); // Carrega a aula específica (ou aula13)
            verificarStatusPresenca(); // CHAMA A FUNÇÃO DE VERIFICAÇÃO ATUALIZADA (Cross-Device)
            iniciarContadorExpiracao(); 
        }

        return true;
    } else {
        // Se não tiver acesso ou expirou, limpa tudo e volta para o login
        logout();
        
        // Exibe o alerta apenas na página de login
        const expirationAlert = document.getElementById('expiration-alert');
        if(expirationAlert) expirationAlert.style.display = 'block';
        return false;
    }
}

function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    localStorage.removeItem(CPF_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
    
    if (countdownPresenceInterval !== null) {
        clearInterval(countdownPresenceInterval);
        countdownPresenceInterval = null;
    }
    if (countdownTokenInterval !== null) {
        clearInterval(countdownTokenInterval);
        countdownTokenInterval = null;
    }

    if (window.location.pathname.includes('videos.html') || window.location.pathname.includes('Aulas.html')) {
         window.location.href = 'index.html';
    }
}

function iniciarContadorExpiracao() {
    const display = document.getElementById('tokenExpirationDisplay');
    if (!display) return;
    
    const expiresAt = parseInt(localStorage.getItem(EXPIRATION_KEY));

    const atualizarContador = () => {
        const tempoRestante = expiresAt - new Date().getTime();

        if (tempoRestante <= 0) {
            clearInterval(countdownTokenInterval);
            logout(); // Expira e desloga
            return;
        }
        
        display.textContent = `⏳ O tempo de acesso expira em: ${formatarTempoRestante(tempoRestante)}`;
    };

    atualizarContador();
    countdownTokenInterval = setInterval(atualizarContador, 1000);
}


// =======================================================
// 4. EMBED DE VÍDEO (showLesson)
// =======================================================

function showLesson(lessonId) {
    const lesson = VIDEO_MAP[lessonId];
    const playerContainer = document.getElementById('videoPlayerContainer');
    const lessonTitle = document.getElementById('lessonTitle');
    
    if (!lesson) {
        lessonTitle.textContent = 'Aula Não Encontrada.';
        playerContainer.innerHTML = '<p style="color: red;">O ID da aula é inválido.</p>';
        return;
    }

    lessonTitle.textContent = lesson.title;

    // Usa um iframe VIMEO
    const videoCode = `
        <iframe src="${lesson.url}&title=0&byline=0&portrait=0"
                width="100%" height="100%" frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture" allowfullscreen>
        </iframe>
    `;
    
    playerContainer.innerHTML = videoCode; 

    // Lógica de navegação original (Habilitar o botão da aula atual)
    const allButtons = document.querySelectorAll('.nav-buttons button');
    allButtons.forEach(button => button.classList.remove('active'));

    const currentButton = document.getElementById(`btn-${lessonId}`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
}


// =======================================================
// 5. REGISTRO DE PRESENÇA (marcarPresenca e verificarStatusPresenca - CORRIGIDAS)
// =======================================================

/**
 * Verifica se a presença de hoje está marcada no servidor (Cross-Device).
 */
async function isPresenceMarked() {
    // 🚨 AQUI, ESTAMOS ESPERANDO O FORMATO YYYY-MM-DD
    const todayKey = getCurrentDateKey(); 
    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY);
    
    if (!token || !cpf) {
        return false;
    }

    try {
        const searchUrl = `${SHEETDB_API_URL}?token=${token}&cpf=${cpf}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        const alunoData = data[0] || {};
        const ultimaPresencaSalva = alunoData.ultima_presenca; 

        // Retorna true se a data salva no servidor for igual à data de hoje (YYYY-MM-DD)
        return ultimaPresencaSalva === todayKey; 
        
    } catch (error) {
        console.error("Erro ao verificar status de presença (isPresenceMarked):", error);
        return false; 
    }
}


async function verificarStatusPresenca() {
    if (countdownPresenceInterval !== null) {
        clearInterval(countdownPresenceInterval);
        countdownPresenceInterval = null;
    }

    // 🚨 AQUI, ESTAMOS ESPERANDO O FORMATO YYYY-MM-DD
    const todayKey = getCurrentDateKey(); 
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    const catalogButton = document.getElementById('btn-catalogo');
    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY);
    
    // Inicia o botão desabilitado e com mensagem de verificação
    presencaButton.disabled = true;
    presencaButton.textContent = 'Verificando status de presença...';
    presencaMessage.textContent = ''; 
    if (catalogButton) {
        catalogButton.disabled = true;
        catalogButton.textContent = 'Catálogo Completo de Aulas (Verificando...)';
    }


    if (!token || !cpf) {
        presencaMessage.textContent = 'Erro: Falha na autenticação.';
        presencaMessage.style.color = '#dc3545';
        presencaButton.textContent = 'Erro de Acesso';
        if (catalogButton) catalogButton.textContent = 'Erro de Acesso';
        return;
    }
    
    try {
        // Consulta a planilha para o status da última presença
        const searchUrl = `${SHEETDB_API_URL}?token=${token}&cpf=${cpf}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        const alunoData = data[0] || {};
        const ultimaPresencaSalva = alunoData.ultima_presenca; 

        if (ultimaPresencaSalva === todayKey) {
            // Presença de hoje JÁ registrada
            presencaButton.disabled = true;
            presencaButton.textContent = 'Presença de Hoje Já Registrada ✅';
            presencaMessage.style.color = '#28a745';
            presencaMessage.textContent = 'Sua presença para hoje foi confirmada na base de dados!';
            
            // Habilita o botão do Catálogo
            if (catalogButton) {
                catalogButton.disabled = false;
                catalogButton.textContent = 'Catálogo Completo de Aulas';
            }
            
            // Inicia o contador para a próxima meia-noite (reiniciar o status)
            const atualizarContador = () => {
                const tempoRestante = calcularTempoParaMeiaNoite();

                if (tempoRestante <= 0) {
                    clearInterval(countdownPresenceInterval);
                    countdownPresenceInterval = null;
                    verificarStatusPresenca(); // Re-verifica
                    return;
                }
                
                presencaButton.textContent = `Próximo registro em: ${formatarTempoRestante(tempoRestante)}`;
            };

            atualizarContador();
            countdownPresenceInterval = setInterval(atualizarContador, 1000);

        } else {
            // Presença NÃO registrada para hoje
            presencaButton.disabled = false;
            presencaButton.textContent = 'Marcar Presença de Hoje';
            presencaMessage.style.color = '#ccc';
            presencaMessage.textContent = 'Clique para registrar sua presença e frequência no curso.';
            
            // Desabilita o botão do Catálogo
            if (catalogButton) {
                catalogButton.disabled = true;
                catalogButton.textContent = 'Catálogo Completo de Aulas (Marque Presença)';
            }
        }
        
    } catch (error) {
        console.error("Erro ao verificar status de presença:", error);
        presencaMessage.textContent = 'Falha ao verificar o status. Tente novamente.';
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Tentar Novamente';
        if (catalogButton) catalogButton.textContent = 'Tentar Novamente';
    }
}


async function marcarPresenca() {
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    
    presencaButton.disabled = true;
    presencaButton.textContent = 'Registrando...';
    presencaMessage.textContent = 'Aguarde, enviando dados para o servidor...';
    presencaMessage.style.color = '#0077B5';

    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY);
    const nome = localStorage.getItem(NAME_KEY); 
    
    // Verifica se já está marcada antes de enviar
    if (await isPresenceMarked()) {
        presencaMessage.textContent = 'Presença já registrada para hoje. Status atualizado.';
        presencaMessage.style.color = '#28a745';
        verificarStatusPresenca(); // Atualiza o display do botão
        return; 
    }

    if (!token || !cpf || !nome) { 
        presencaMessage.textContent = 'Erro: Falha de autenticação. Tente fazer login novamente.';
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Marcar Presença de Hoje';
        return;
    }

    try {
        const todayKey = getCurrentDateKey(); 
        const currentTimestamp = getCurrentTimestamp();

        // Criando payload URL-encoded (Form Data)
        const dataToLogAndUpdate = new URLSearchParams({
            // token, cpf, e nome são usados pelo Apps Script para buscar o aluno
            'token': token,
            'cpf': cpf,
            'nome_aluno': nome, 
            // data_registro e hora_registro são para o Log (o Apps Script vai sobrescrever data_registro)
            'data_registro': todayKey, 
            'hora_registro': currentTimestamp 
            // O campo 'ultima_presenca' é definido e formatado PELO Apps Script agora.
        }).toString();

        // Usa a URL com a action 'marcar_presenca'
        const logResponse = await fetch(PRESENCE_LOG_API_URL, {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: dataToLogAndUpdate
        });

        const result = await logResponse.json();

        if (logResponse.ok && result.success) { 
            
            // Chama a verificação para ATUALIZAR O STATUS
            await verificarStatusPresenca(); 
            
            presencaMessage.style.color = '#901090';
            presencaMessage.textContent = `✅ Presença registrada com sucesso!`;
            
        } else {
            throw new Error(`Erro ao registrar presença: ${result.message || 'Erro de rede ou servidor.'}`);
        }
    } catch (error) {
        console.error('Erro no registro de presença:', error);

        presencaMessage.textContent = `Falha ao registrar. Erro: ${error.message}.`;
        presencaMessage.style.color = '#dc3545';
        presencaButton.disabled = false;
        presencaButton.textContent = 'Tentar Registrar Presença Novamente';
    }
}

// =======================================================
// 6. FUNÇÕES DE NAVEGAÇÃO
// =======================================================

function redirectToVideo(lessonId) {
    window.location.href = `videos.html?lesson=${lessonId}`;
}

async function abrirAulas() {
    const presenceStatus = await isPresenceMarked();
    
    if (presenceStatus) {
        window.location.href = 'Aulas.html';
    } else {
        alert('Você deve marcar sua presença diária antes de acessar o Catálogo Completo de Aulas.');
    }
}


// =======================================================
// 7. INICIALIZAÇÃO DA PÁGINA
// =======================================================

function initializePage() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }

    // Garante que o usuário seja verificado ao carregar videos.html ou index.html
    checkAccess(); 
}

document.addEventListener('DOMContentLoaded', initializePage);
