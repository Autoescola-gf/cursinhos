// =======================================================
// ARQUIVO: script.js - CORREÇÃO FINAL DE COMUNICAÇÃO POST + EMBED VÍDEO
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
        embedUrl: 'https://www.dropbox.com/scl/fi/9o814415zdw9mhqgn2bf7/01-LEGISLA-O.mp4?rlkey=p6ztt8mbb8hy2k4edjmdvc1em&st=dy9xf97h&raw=1'
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
        embedUrl: 'https://www.dropbox.com/scl/fi/srykoh773chkf3ieuvyuh/13-SINALIZA-O.mp4?rlkey=iaxh02y2dbv8h0d84wc2a13at&st=48vmou9s&raw=1' 
    },
    
    'aula6': { 
        title: 'Aula 6: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/wrd4t03sp7dj5ymjwpk0z/14-SINALIZA-O.mp4?rlkey=w3384i5co4487osxv5iym87tw&st=8m820y1q&raw=1' 
    },
    'aula7': { 
        title: 'Aula 7: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/f5dstcsiqh583gise2o7i/15-SINALIZA-O.mp4?rlkey=85vw1dmpuxp0ybw3oa36scsos&st=xedqqlzj&raw=1' 
    },
    'aula8': { 
        title: 'Aula 8: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/6g8g6at1kj4low2aoln0o/16-SINALIZA-O.mp4?rlkey=m2jyacqwop97h2nkopi6zyrr9&st=f6re8zhc&raw=1' 
    },
    
    // Infraçoes e penalidades
    'aula9': {
        title: 'Aula 9: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/nhomlzazqe5e11rnz0i27/19-NORMAS.mp4?rlkey=vtzip44vho3a002flg9vpefh1&st=go9am7fw&raw=1' 
    },
    'aula10': { 
        title: 'Aula 10: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/qm9nfcikean3vygexzmae/20-NORMAS.mp4?rlkey=l5mvdndtgmkz1q61fmh8srz7i&st=0otwaiqr&raw=1' 
    },
    'aula11': { 
        title: 'Aula 11: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/dm7jio99x38t5krxf3mf7/21-NORMAS.mp4?rlkey=fw5qpxbj5n3s3gdcwx4n83r9f&st=0h49t4p8&raw=1' 
    },
    'aula12': { 
        title: 'Aula 12: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/hwja871n5mkaaal5wsmx2/22-NORMAS.mp4?rlkey=jd5zzc9gea63z24rvc0fzuq24&st=gjdie2bo&raw=1' 
    },
    
    // Normas e condutas
    'aula13': {
        title: 'Aula 13: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/nhomlzazqe5e11rnz0i27/19-NORMAS.mp4?rlkey=vtzip44vho3a002flg9vpefh1&st=go9am7fw&raw=1' 
    },
    'aula14': { 
        title: 'Aula 14: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/qm9nfcikean3vygexzmae/20-NORMAS.mp4?rlkey=l5mvdndtgmkz1q61fmh8srz7i&st=0otwaiqr&raw=1' 
    },
    'aula15': { 
        title: 'Aula 15: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/dm7jio99x38t5krxf3mf7/21-NORMAS.mp4?rlkey=fw5qpxbj5n3s3gdcwx4n83r9f&st=0h49t4p8&raw=1' 
    },
    'aula16': { 
        title: 'Aula 16: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/1zkcqa9nktmw58o0bvkn9/22-NORMAS.mp4?rlkey=8ns52inrwe4iosiis6j3iou1k&st=drh0ql3y&raw=1' 
    },
    'aula17': { 
        title: 'Aula 17: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/h9oujsj6c0m7pq0h3tqlf/23-NORMAS-cortado.mp4?rlkey=ape0ablkvzuofey95c8l72cjg&st=dcwwthpw&raw=1' 
    },
};


// =======================================================
// 1. FUNÇÕES DE UTILIDADE E AUXILIARES (Inclui abrirLog e abrirAulas)
// =======================================================

function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '').substring(0, 11);
    if (cpf.length > 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

function abrirLog() {           
    // Redireciona para a página de Log (relatório de presença)
    window.location.href = 'Log.html';
}

function abrirAulas() {    
    // Redireciona para o nome do arquivo do catálogo de aulas
    window.location.href = 'Aulas.html'; 
}

function getCurrentDateKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function calcularTempoParaMeiaNoite() {
    const agora = new Date();
    const proximaMeiaNoite = new Date(agora);

    proximaMeiaNoite.setDate(agora.getDate() + 1);
    proximaMeiaNoite.setHours(0, 0, 0, 0);

    const tempoRestante = proximaMeiaNoite.getTime() - agora.getTime();

    return Math.max(0, tempoRestante);
}

function formatarTempoRestante(milissegundos) {
    const totalSegundos = Math.floor(milissegundos / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`;
}

// =======================================================
// 2. LÓGICA DE LOGIN (checkToken - Sem alterações estruturais)
// =======================================================

async function checkToken() {
    const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
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
        // 1. Busca na planilha pelo Token e CPF (Apps Script - doGet)
        const searchUrl = `${SHEETDB_API_URL}?token=${tokenInput}&cpf=${cpfInput}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data || data.length === 0 || data.length > 1) {
            messageElement.textContent = 'Erro: Token ou CPF inválido. Aluno não encontrado na base.';
            return;
        }

        const alunoData = data[0];
        const alunoNome = alunoData.nome_aluno || 'Aluno Não Nomeado'; 
        
        const agora = Date.now();
        const expiracaoSalva = parseInt(alunoData.expiracao_ms) || 0; 

        let novaExpiracao;
        let statusMensagem;

        // 2. Lógica do Timer (24h)
        if (agora < expiracaoSalva) {
            statusMensagem = 'Acesso já ativo. Redirecionando...';
            novaExpiracao = expiracaoSalva;
        } else {
            novaExpiracao = agora + (DURATION_HOURS * 60 * 60 * 1000);

            // 3. Atualiza a Planilha com a nova data de expiração (POST ADAPTADO PARA FORM DATA)
            const updateUrl = `${SHEETDB_API_URL}?action=update_expiration`;
            
            // Criando payload URL-encoded
            const updatePayload = new URLSearchParams({
                token: tokenInput,
                cpf: cpfInput,
                expiracao_ms: novaExpiracao 
            }).toString();

            await fetch(updateUrl, {
                method: 'POST', 
                // 🚨 CORREÇÃO: Define o Content-Type para garantir a leitura pelo Apps Script
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                body: updatePayload // Enviando como form data
            });

            statusMensagem = `Acesso renovado por ${DURATION_HOURS} horas! Redirecionando...`;
        }

        // 4. Salva o acesso no localStorage (Chaves de sessão)
        localStorage.setItem(ACCESS_KEY, 'true');
        localStorage.setItem(EXPIRATION_KEY, novaExpiracao);
        localStorage.setItem(CPF_KEY, cpfInput);
        localStorage.setItem(TOKEN_KEY, tokenInput);
        localStorage.setItem(NAME_KEY, alunoNome);

        messageElement.textContent = statusMensagem;
        messageElement.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'videos.html';
        }, 500);

    } catch (error) {
        console.error("Erro de comunicação com a API (Apps Script):", error);
        messageElement.textContent = 'Erro de comunicação ou no servidor. Tente novamente mais tarde.';
    } finally {
        loginButton.disabled = false;
    }
}

// =======================================================
// 3. SEGURANÇA E ACESSO (checkAccess - MODIFICADA)
// =======================================================

function checkAccess() {
    const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);

    if (!hasAccess || !expirationTime) {
        window.location.href = 'index.html?expired=no_access';
        return false;
    }

    if (Date.now() > parseInt(expirationTime)) {
        logout(); 
        window.location.href = 'index.html?expired=true';
        return false;
    }

    // Obter o ID da aula da URL (lesson=aulaX)
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson') || 'aula1'; // Padrão para aula1
    
    // Inicia a renderização do conteúdo apenas se estivermos em videos.html
    // 🚨 CORREÇÃO: Usando o novo ID do contêiner principal para verificar
    if(document.getElementById('videoPlayerContainer')) { 
        showLesson(lessonId); // Carrega a aula específica (ou aula1)
        verificarStatusPresenca();
        iniciarContadorExpiracao(); 
    }

    return true;
}

function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    localStorage.removeItem(CPF_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(PRESENCE_DATE_KEY); // Limpa o status de presença ao sair

    if (countdownPresenceInterval !== null) {
        clearInterval(countdownPresenceInterval);
        countdownPresenceInterval = null;
    }
    if (countdownTokenInterval !== null) {
        clearInterval(countdownTokenInterval);
        countdownTokenInterval = null;
    }

    window.location.href = 'index.html';
}

// =======================================================
// 4. CONTADOR DE EXPIRAÇÃO DE TOKEN (Sem alterações estruturais)
// =======================================================

function iniciarContadorExpiracao() {
    if (countdownTokenInterval !== null) {
        clearInterval(countdownTokenInterval);
        countdownTokenInterval = null;
    }

    const expirationTimeMs = parseInt(localStorage.getItem(EXPIRATION_KEY));
    const displayElement = document.getElementById('tokenExpirationDisplay');

    if (!displayElement) return;

    if (!expirationTimeMs || (expirationTimeMs - Date.now()) <= 0) {
        displayElement.textContent = '❌ Sessão expirada. Faça login novamente.';
        displayElement.style.color = 'red';
        return;
    }

    const atualizarContador = () => {
        const agora = Date.now();
        const tempoRestante = expirationTimeMs - agora;

        if (tempoRestante <= 0) {
            clearInterval(countdownTokenInterval);
            countdownTokenInterval = null;
            displayElement.textContent = '❌ Seu acesso expirou!';
            checkAccess();
            return;
        }

        displayElement.style.color = '#0077B5';
        displayElement.textContent = `⏳ Seu acesso expira em: ${formatarTempoRestante(tempoRestante)}`;
    };

    atualizarContador();
    countdownTokenInterval = setInterval(atualizarContador, 1000);
}


// =======================================================
// 5. REGISTRO DE PRESENÇA (marcarPresenca - Sem alterações estruturais)
// =======================================================

function verificarStatusPresenca() {
    if (countdownPresenceInterval !== null) {
        clearInterval(countdownPresenceInterval);
        countdownPresenceInterval = null;
    }

    const todayKey = getCurrentDateKey();
    const lastPresenceDate = localStorage.getItem(PRESENCE_DATE_KEY);
    const presencaButton = document.getElementById('presencaButton');
    const presencaMessage = document.getElementById('presencaMessage');

    if (lastPresenceDate === todayKey) {
        presencaButton.disabled = true;
        presencaButton.textContent = 'Presença de Hoje Já Registrada ✅';

        const atualizarContador = () => {
            const tempoRestante = calcularTempoParaMeiaNoite();

            if (tempoRestante <= 0) {
                clearInterval(countdownPresenceInterval);
                countdownPresenceInterval = null;
                verificarStatusPresenca();
                return;
            }
        };

        atualizarContador();
        countdownPresenceInterval = setInterval(atualizarContador, 1000);

    } else {
        presencaButton.disabled = false;
        presencaButton.textContent = 'Marcar Presença de Hoje';
        presencaMessage.style.color = '#ccc';
        presencaMessage.textContent = 'Clique para registrar sua presença e frequência no curso.';
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

    const todayKey = getCurrentDateKey();
    
    const lastPresenceDate = localStorage.getItem(PRESENCE_DATE_KEY);
    if (lastPresenceDate === todayKey) {
        verificarStatusPresenca();
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
        const currentTimestamp = getCurrentTimestamp();

        // =============================================================
        // PASSO ÚNICO: ATUALIZA PRINCIPAL E INSERE O LOG (POST ADAPTADO)
        // =============================================================
        
        // Criando payload URL-encoded (Form Data)
        const dataToLogAndUpdate = new URLSearchParams({
            // Campos usados pelo Apps Script para identificar a linha e para o Log/Update
            'token': token,
            'cpf': cpf,
            'nome_aluno': nome, 
            'data_registro': todayKey, 
            'ultima_presenca': todayKey, 
            'hora_registro': currentTimestamp 
        }).toString();

        // Usa a URL com a action 'marcar_presenca'
        const logResponse = await fetch(PRESENCE_LOG_API_URL, {
            method: 'POST', 
            // 🚨 CORREÇÃO: Define o Content-Type para garantir a leitura pelo Apps Script
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: dataToLogAndUpdate // Enviando como form data
        });

        const result = await logResponse.json();

        if (logResponse.ok && result.success) { 
            localStorage.setItem(PRESENCE_DATE_KEY, todayKey);
            verificarStatusPresenca();
            presencaMessage.style.color = '#901090';
            presencaMessage.textContent = `✅ Presença registrada com sucesso! ${currentTimestamp}`;
            
        } else {
            throw new Error(`Erro ao registrar presença: ${result.message || 'Erro de rede ou servidor.'}`);
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
// 6. FUNÇÕES DE NAVEGAÇÃO (CORRIGIDA)
// =======================================================

function showLesson(lessonId) {
    // 1. Lógica para incorporação do vídeo
    const lessonData = VIDEO_MAP[lessonId];
    // 🚨 CORREÇÃO: Agora buscando o ID do contêiner principal para garantir o CSS responsivo
    const playerContainer = document.getElementById('videoPlayerContainer'); 
    const titleElement = document.getElementById('lessonTitle');
    
    // Fallback: se a aula não for encontrada...
    if (!lessonData || !playerContainer || !titleElement) {
        console.error("Dados da aula ou contêiner não encontrados para:", lessonId);
        playerContainer.innerHTML = '<p style="color: red; text-align: center; padding: 50px;">Erro: Conteúdo da aula não encontrado.</p>';
        titleElement.textContent = 'Aula Não Encontrada';
        return;
    }

    // 2. Atualiza o título da aula
    titleElement.textContent = lessonData.title;

    // 3. Cria e injeta o código HTML do player de vídeo nativo (MP4)
    const videoCode = `
        <video controls poster="img/poster-aula.jpg" controlsList="nodownload" preload="preload">
            poster="favicon.ico"  <-- 🚨 AQUI ESTÁ A MUDANÇA
            <source src="${lessonData.embedUrl}" type="video/mp4">
            Seu navegador não suporta a tag de vídeo.
        </video>
    `;
    // 4. Injeta o HTML no container do player
    // 🚨 ATUALIZAÇÃO: Use o novo código do player nativo
    playerContainer.innerHTML = videoCode; 

    // 5. Lógica de navegação original (Habilitar o botão da aula atual)
    const allButtons = document.querySelectorAll('.nav-buttons button');
    allButtons.forEach(button => button.classList.remove('active'));

    const currentButton = document.getElementById(`btn-${lessonId}`);
    if (currentButton) {
        currentButton.classList.add('active');
    }

    // 6. Adiciona funcionalidade de clique ao botão de catálogo (se não estiver lá)
    const catalogLink = document.getElementById('catalogLink');
    if (catalogLink) {
        catalogLink.onclick = abrirAulas;
    }
}

// =======================================================
// 7. INICIALIZAÇÃO DA PÁGINA (Sem alterações estruturais)
// =======================================================

function initializePage() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }

    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        checkAccess();
    }
}

window.onload = initializePage;



















