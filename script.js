
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

// Chave de localStorage para a Presença Diária
const PRESENCE_DATE_KEY = 'lastPresenceDate';

let countdownPresenceInterval = null;
let countdownTokenInterval = null;


// =======================================================
// 🚨 MAPA DE VÍDEOS (INFORMAÇÕES FORNECIDAS PELO USUÁRIO)
// =======================================================
const VIDEO_MAP = {
    // URLs de Vimeo fornecidas
    // LEGISLAÇÃO
    'aula1': { 
        title: 'Aula 1: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/9o814415zdw9mhqgn2bf7/01-LEGISLA-O.mp4?rlkey=p6ztt8mbb8hy2k4edjmdvc1em&st=mhcyzy4t&dl=0'
    },
    'aula2': { 
        title: 'Aula 2: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/ldyz6evyxmgxs8daic9wi/02-LEGISLA-O.mp4?rlkey=cf1btomjkl0e0wq5k9g451819&st=pbb322hc&raw=1'
    },
    'aula3': { 
        title: 'Aula 3: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/mj4xgb1kk6w5gbjbsy5vb/03-LEGISLA-O.mp4?rlkey=49kb0wvhr6aqi31w38ql2yrvz&st=3l4uj8m0&raw=1' 
    },
    'aula4': { 
        title: 'Aula 4: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/dos0tzdmvf78qylfdx8bb/04-LEGISLA-O.mp4?rlkey=ke2dm1itat5p3jt26der72pg8&st=xim554v4&raw=1' 
    },

      // SINALIZAÇÃO
    'aula5': { 
        title: 'Aula 5: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/srykoh773chkf3ieuvyuh/05-SINALIZA-O.mp4?rlkey=iaxh02y2dbv8h0d84wc2a13at&st=57tydwo2&raw=1' 
    },
    
    'aula6': { 
        title: 'Aula 6: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/wrd4t03sp7dj5ymjwpk0z/06-SINALIZA-O.mp4?rlkey=w3384i5co4487osxv5iym87tw&st=ar3r7avb&raw=1' 
    },
    'aula7': { 
        title: 'Aula 7: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/f5dstcsiqh583gise2o7i/07-SINALIZA-O.mp4?rlkey=85vw1dmpuxp0ybw3oa36scsos&st=cmj9rud4&raw=1' 
    },
    'aula8': { 
        title: 'Aula 8: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/6g8g6at1kj4low2aoln0o/08-SINALIZA-O.mp4?rlkey=m2jyacqwop97h2nkopi6zyrr9&st=0i453ie6&raw=1' 
    },
    
    // Infraçoes e penalidades
    'aula9': {
        title: 'Aula 9: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/aptuctp47uvq1s0fdd6we/09-INFRA-ES.mp4?rlkey=7gaxdp3oa7giba8bvptwpc8ri&st=ixunp96n&raw=1' 
    },
    'aula10': { 
        title: 'Aula 10: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/s4y6bv770avosgta4603e/10-INFRA-ES.mp4?rlkey=kp605rhpi364ayhs24d4s3hs7&st=1hq0j0li&raw=1' 
    },
    'aula11': { 
        title: 'Aula 11: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/69bs9nprwyjdhj4lkofgn/11-INFRA-ES.mp4?rlkey=q1ufj79pohytwknsw8ncfidv2&st=v174abb3&raw=1' 
    },
    'aula12': { 
        title: 'Aula 12: Infrações e Penalidades (AULA FALTANDO)',
        embedUrl: '' 
    },
    
    // Normas e condutas
    'aula13': {
        title: 'Aula 13: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/max3ghqx7vdilszdmybcr/13-NORMAS.mp4?rlkey=zm2jta931fmgqn1c94dcuw1vm&st=wdfhabtm&raw=1' 
    },
    'aula14': { 
        title: 'Aula 14: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/fq00c00vjkrua8u5ww0em/14-NORMAS.mp4?rlkey=nhg13uwr1ko8fmmtijp4wp02u&st=yx9dlw6j&raw=1' 
    },
    'aula15': { 
        title: 'Aula 15: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/j9zrb7dw2j1ndelr4gdbq/15-NORMAS.mp4?rlkey=tdbf9pe5ocoggzb5ew2zdx766&st=gfi9wngu&raw=1' 
    },
    'aula16': { 
        title: 'Aula 16: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/1tbhtbnj6pvwholkf56y6/16-NORMAS.mp4?rlkey=9no5xathyftzfqlzh2zr6n9k9&st=npr11qrh&raw=1' 
    },
    'aula17': { 
        title: 'Aula 17: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/fot8ymvzii7ao81uatvv6/17-NORMAS-cut.mp4?rlkey=rbck82vsudt4y4tr9e97dk2t4&st=6doacpdt&raw=1' 
    },
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

    // Ação padrão do doGet: busca o aluno
    const searchUrl = `${SHEETDB_API_URL}?cpf=${cpf}&token=${token}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].nome_aluno) {
            const now = new Date();
            // Define o acesso de 24 horas
            const expirationTime = now.getTime() + (DURATION_HOURS * 60 * 60 * 1000); 

            // Salva dados de acesso no localStorage
            localStorage.setItem(ACCESS_KEY, 'true');
            localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(NAME_KEY, data[0].nome_aluno); 

            // Redireciona para a página de vídeos
            window.location.href = 'videos.html';
        } else {
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
    
    // Verifica se o acesso está concedido e se não expirou
    if (hasAccess === 'true' && expiresAt && now < parseInt(expiresAt)) {
        const expirationAlert = document.getElementById('expiration-alert');
        if(expirationAlert) expirationAlert.style.display = 'none';

        const urlParams = new URLSearchParams(window.location.search);
        // Padrão para aula 13 se nenhuma for especificada
        const lessonId = urlParams.get('lesson') || 'aula13'; 
        
        if(document.getElementById('videoPlayerContainer')) { 
            showLesson(lessonId); 
            verificarStatusPresenca(); 
            iniciarContadorExpiracao(); 
        }

        return true;
    } else {
        logout();
        
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

    // Redireciona para o login se não estiver já na página inicial ou admin
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
            logout(); 
            return;
        }
        
        display.textContent = `⏳ O tempo de acesso expira em: ${formatarTempoRestante(tempoRestante)}`;
    };

    atualizarContador();
    countdownTokenInterval = setInterval(atualizarContador, 1000);
}


// =======================================================
// 4. EMBED DE VÍDEO (showLesson - COM PLAYER NATIVO)
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

    // Player de vídeo nativo (usando as URLs originais)
    const videoCode = `
        <video width="100%" height="100%" controls autoplay>
            <source src="${lesson.url}" type="video/mp4">
            Seu navegador não suporta a tag de vídeo.
        </video>
    `;
    
    playerContainer.innerHTML = videoCode; 

    // Lógica de navegação original
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
    const todayKey = getCurrentDateKey(); 
    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY);
    
    if (!token || !cpf) {
        return false;
    }

    try {
        // Busca os dados do aluno para checar a data salva
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

    const todayKey = getCurrentDateKey(); 
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');
    const catalogButton = document.getElementById('catalogLink');
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
            'token': token,
            'cpf': cpf,
            'nome_aluno': nome, 
            // O Apps Script irá formatar a data corretamente
            'data_registro': todayKey, 
            'hora_registro': currentTimestamp 
        }).toString();

        const logResponse = await fetch(PRESENCE_LOG_API_URL, {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: dataToLogAndUpdate
        });

        const result = await logResponse.json();

        if (logResponse.ok && result.success) { 
            
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

