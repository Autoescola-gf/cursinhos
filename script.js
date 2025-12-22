// =======================================================
// ARQUIVO: script.js - SISTEMA COMPLETO COM LIBERAÇÃO DIÁRIA
// =======================================================

// 🚨 CONFIGURAÇÕES INICIAIS
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec'; 
const PRESENCE_LOG_API_URL = `${SHEETDB_API_URL}?action=marcar_presenca`;

// CHAVES LOCALSTORAGE
const ACCESS_KEY = 'vimeo_access_granted';
const EXPIRATION_KEY = 'access_expires_at';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date'; // Nova: Data de início do curso
const PRESENCE_DATE_KEY = 'lastPresenceDate';
const DURATION_HOURS = 24;

let countdownPresenceInterval = null;
let countdownTokenInterval = null;

// =======================================================
// 🚨 MAPA DE VÍDEOS (33 AULAS)
// =======================================================
const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Introdução à Legislação', embedUrl: '' },
    'aula2': { title: 'Aula 2: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    'aula3': { title: 'Aula 3: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/2v3a9lvtu0hma4ktojjlq/03-LEGISLA-O.mp4?rlkey=5giu774jbf1mmdf2x8v9paqkw&st=ur8l5a4g&raw=1' },
    'aula4': { title: 'Aula 4: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/pc4c6x8cafki0bc8tikhm/04-LEGISLA-O.mp4?rlkey=mzs0ps4nyyb23qm1gqvqtwz78&st=z68vjpbh&raw=1' },
    'aula5': { title: 'Aula 5: Sinalização', embedUrl: 'https://www.dropbox.com/scl/fi/k3w63lrirvstkoi0abfav/05-SINALIZA-O.mp4?rlkey=9yrqojpomtc7ti2wied7sk1wx&st=l7zgv1l9&raw=1' },
    'aula6': { title: 'Aula 6: Sinalização', embedUrl: 'https://www.dropbox.com/scl/fi/h5k0i6p3qld5s3mlpkq1s/06-SINALIZA-O.mp4?rlkey=tykepxntrqpxjtletnbwr68ra&st=x9g2nly6&raw=1' },
    'aula7': { title: 'Aula 7: Sinalização', embedUrl: 'https://www.dropbox.com/scl/fi/wdcw32037vhnd4no2koso/07-SINALIZA-O.mp4?rlkey=d3hvj93zwoq400lz2h7eqo7yx&st=t08ph9e1&raw=1' },
    'aula8': { title: 'Aula 8: Sinalização', embedUrl: 'https://www.dropbox.com/scl/fi/05cs21an3v96znuyxt1s1/08-SINALIZA-O.mp4?rlkey=jeqagbfl1uu38n0kqy160x8ss&st=nurxqroc&raw=1' },
    'aula9': { title: 'Aula 9: Infrações e Penalidades', embedUrl: 'https://www.dropbox.com/scl/fi/va827yqp7a36oj1qvp7hk/09-INFRA-ES.mp4?rlkey=f2m041w9zar4lh04f040f0cvx&st=b2gw1fwn&raw=1' },
    'aula10': { title: 'Aula 10: Infrações e Penalidades', embedUrl: 'https://www.dropbox.com/scl/fi/1i96iu1gzdjb2rrw2jq9p/10-INFRA-ES.mp4?rlkey=7xnldn35yxsjgpoqq9i20vsee&st=a6hard5y&raw=1' },
    'aula11': { title: 'Aula 11: Infrações e Penalidades', embedUrl: 'https://www.dropbox.com/scl/fi/dfxtfkagy7ekv04vq4y1s/11-INFRA-ES.mp4?rlkey=a9dtcfrkdq2vfje6fyveqf9qj&st=nvmn2agw&raw=1' },
    'aula12': { title: 'Aula 12: Infrações e Penalidades', embedUrl: 'https://www.dropbox.com/scl/fi/eyqbltxxfgvomy0t34y7w/12-INFRA-ES.mp4?rlkey=pzr1uhx3aow2t84rxzie6rxby&st=tr535ria&raw=1' },
    'aula13': { title: 'Aula 13: Normas e condutas', embedUrl: 'https://www.dropbox.com/scl/fi/max3ghqx7vdilszdmybcr/13-NORMAS.mp4?rlkey=zm2jta931fmgqn1c94dcuw1vm&st=wdfhabtm&raw=1' },
    'aula14': { title: 'Aula 14: Normas e condutas', embedUrl: 'https://www.dropbox.com/scl/fi/fq00c00vjkrua8u5ww0em/14-NORMAS.mp4?rlkey=nhg13uwr1ko8fmmtijp4wp02u&st=yx9dlw6j&raw=1' },
    'aula15': { title: 'Aula 15: Normas e condutas', embedUrl: 'https://www.dropbox.com/scl/fi/j9zrb7dw2j1ndelr4gdbq/15-NORMAS.mp4?rlkey=tdbf9pe5ocoggzb5ew2zdx766&st=gfi9wngu&raw=1' },
    'aula16': { title: 'Aula 16: Normas e condutas', embedUrl: 'https://www.dropbox.com/scl/fi/1tbhtbnj6pvwholkf56y6/16-NORMAS.mp4?rlkey=9no5xathyftzfqlzh2zr6n9k9&st=npr11qrh&raw=1' },
    'aula17': { title: 'Aula 17: Normas e condutas', embedUrl: 'https://www.dropbox.com/scl/fi/fot8ymvzii7ao81uatvv6/17-NORMAS-cut.mp4?rlkey=rbck82vsudt4y4tr9e97dk2t4&st=6doacpdt&raw=1' },
    'aula18': { title: 'Aula 18: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/9hp1nt9b08546gu1229p7/18-DIRE-O-DEFENSIVA.mp4?rlkey=p2p4gwpnbo3p4nygc12rw8trx&st=cm6lcuqe&raw=1' },
    'aula19': { title: 'Aula 19: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/9ch9zi0xd2w97ybvt9uaj/19-DIRE-O-DEFENSIVA.mp4?rlkey=3n1cjfxc1r0yz1y9i8lui81jh&st=smw9o5kz&raw=1' },
    'aula20': { title: 'Aula 20: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/1nkxoifxczy0cnqe1qths/20-DIRE-O-DEFENSIVA.mp4?rlkey=j43unqxy8brwo8othv05f9xox&st=lmd5b9az&raw=1' },
    'aula21': { title: 'Aula 21: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/wb1s6sdes8h0flnywgekc/21-DIRE-O-DEFENSIVA.mp4?rlkey=whyernmrz11l3h9e488pm39nq&st=z8d2c3po&raw=1' },
    'aula22': { title: 'Aula 22: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/r30gp475xx6628tnqvnxn/22-DIRE-O-DEFENSIVA.mp4?rlkey=vtht8dd2bfcgp0ziv2p4m2jbp&st=o8t0pfu8&raw=1' },
    'aula23': { title: 'Aula 23: Direção Defensiva', embedUrl: 'https://www.dropbox.com/scl/fi/bz0chb83omcs3voafx8p3/23-DIRE-O-DEFENSIVA-cut.mp4?rlkey=sle83hwrplsprfsu5dnsm0k7i&st=tj660mie&raw=1' },
    'aula24': { title: 'Aula 24: Primeiros Socorros', embedUrl: 'https://www.dropbox.com/scl/fi/8eh70ydl7nw0b3tkj41qu/24-PRIMEIROS-SOCORROS.mp4?rlkey=4rnirtm44t99owt5rc87m513g&st=gbark4md&raw=1' },
    'aula25': { title: 'Aula 25: Primeiros Socorros', embedUrl: 'https://www.dropbox.com/scl/fi/0v4coveq5b7h7etojsvkn/25-PRIMEIROS-SOCORROS.mp4?rlkey=os8eo3z7ansascflh29e1vh1n&st=iq7yopg1&raw=1' },
    'aula26': { title: 'Aula 26: Primeiros Socorros', embedUrl: 'https://www.dropbox.com/scl/fi/aqmvod20rt7xhkjqvc54c/26-PRIMEIROS-SOCORROS.mp4?rlkey=jaizi1ifkkd3t3h3lmjefk42a&st=7dbyuhng&raw=1' },
    'aula27': { title: 'Aula 27: Primeiros Socorros', embedUrl: 'https://www.dropbox.com/scl/fi/uleso3vy033f6r2r86boh/27-PRIMEIROS-SOCORROS-cut.mp4?rlkey=xdrlfufqidartr4y2jmdjvdsf&st=as8gs13l&raw=1' },  
    'aula28': { title: 'Aula 28: Meio Ambiente', embedUrl: 'https://www.dropbox.com/scl/fi/b45sf0r74ym7xh81axw0w/28-MEIO-AMBIENTE.mp4?rlkey=4ccmyv257qw25v2nq40g6efyn&st=yps7zupj&raw=1' },
    'aula29': { title: 'Aula 29: Meio Ambiente', embedUrl: 'https://www.dropbox.com/scl/fi/flouxhzn9diksebb5gik1/29-MEIO-AMBIENTE.mp4?rlkey=p3t4fsj7zxiduz3qrrov0mu2i&st=cldbz8p8&raw=1' },
    'aula30': { title: 'Aula 30: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' },
    'aula31': { title: 'Aula 31: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' },
    'aula32': { title: 'Aula 32: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/s44zst06jes84sjvfc9sd/32-MEC-NICA.mp4?rlkey=rgrtvn7v0zbijbscxav3xx922&st=qifdf215&raw=1' },
    'aula33': { title: 'Aula 33: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/6121osnobovdbxbs9bx7q/33-MEC-NICA-QUEST-ES-cut.mp4?rlkey=ecr148b6dwz6dkxr2bmr0stsf&st=2c5at6xz&raw=1' },
};


/**
 * Calcula quanto tempo falta para a próxima aula ser liberada.
 * A próxima aula (dia atual + 1) libera exatamente 24h após o ciclo atual.
 */
function getTimeUntilNextRelease() {
    let firstAccess = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!firstAccess) return 0;

    const startDate = new Date(firstAccess);
    const daysPassed = getDaysPassed(); // Ex: se está no dia 1, a próxima é no dia 2
    
    // A próxima liberação ocorre em: DataInicial + (DiasPassados * 24 horas)
    const nextReleaseDate = new Date(startDate.getTime() + (daysPassed * 24 * 60 * 60 * 1000));
    const now = new Date();
    
    const diff = nextReleaseDate - now;
    return diff > 0 ? diff : 0;
}

/**
 * Formata milissegundos em HH:MM:SS
 */
function formatarTempoRestante(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// =======================================================
// 1. LÓGICA DE LIBERAÇÃO DIÁRIA (NOVO)
// =======================================================

function getDaysPassed() {
    let firstAccess = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!firstAccess) return 1; // Se não houver data, considera dia 1

    const startDate = new Date(firstAccess);
    const today = new Date();
    
    // Zera as horas para comparar apenas os dias
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // Dia 1 no primeiro dia, Dia 2 no segundo, etc.
}

function isLessonAvailable(lessonId) {
    const lessonNumber = parseInt(lessonId.replace('aula', ''));
    const daysAllowed = getDaysPassed();
    return lessonNumber <= daysAllowed;
}

// Função usada pelo Catálogo (Aulas.html)
function redirectToVideo(lessonId) {
    if (isLessonAvailable(lessonId)) {
        window.location.href = `videos.html?lesson=${lessonId}`;
    } else {
        alert("🔒 Esta aula ainda não está liberada. Volte amanhã!");
    }
}

// =======================================================
// 2. FUNÇÕES DE UTILIDADE
// =======================================================

function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '').substring(0, 11);
    if (cpf.length > 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

function abrirLog() { window.location.href = 'Log.html'; }
function abrirAulas() { window.location.href = 'Aulas.html'; }

function getCurrentDateKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function getCurrentTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function formatarTempoRestante(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(seg).padStart(2, '0')}s`;
}

// =======================================================
// 3. LÓGICA DE LOGIN (COM REGISTRO DE DATA INICIAL)
// =======================================================

async function checkToken() {
    const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
    const cpfInput = formatCPF(document.getElementById('cpfInput').value.trim());
    const messageElement = document.getElementById('message');
    const loginButton = document.getElementById('loginButton');

    if (cpfInput.length !== 14 || !tokenInput) {
        messageElement.textContent = 'Preencha o Token e o CPF corretamente.';
        return;
    }

    loginButton.disabled = true;
    messageElement.textContent = 'Verificando acesso...';

    try {
        const response = await fetch(`${SHEETDB_API_URL}?token=${tokenInput}&cpf=${cpfInput}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            messageElement.textContent = 'Erro: Token ou CPF inválido.';
            return;
        }

        const alunoData = data[0];
        const agora = Date.now();
        let novaExpiracao = agora + (DURATION_HOURS * 60 * 60 * 1000);

        // REGISTRA DATA DE PRIMEIRO ACESSO SE NÃO EXISTIR
        if (!localStorage.getItem(FIRST_ACCESS_KEY)) {
            localStorage.setItem(FIRST_ACCESS_KEY, new Date().toISOString());
        }

        // SALVA SESSÃO
        localStorage.setItem(ACCESS_KEY, 'true');
        localStorage.setItem(EXPIRATION_KEY, novaExpiracao);
        localStorage.setItem(CPF_KEY, cpfInput);
        localStorage.setItem(TOKEN_KEY, tokenInput);
        localStorage.setItem(NAME_KEY, alunoData.nome_aluno || 'Aluno');

        window.location.href = 'videos.html';

    } catch (error) {
        messageElement.textContent = 'Erro de conexão.';
    } finally {
        loginButton.disabled = false;
    }
}

// =======================================================
// 4. SEGURANÇA E PLAYER
// =======================================================

function checkAccess() {
    const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);

    if (!hasAccess || Date.now() > parseInt(expirationTime)) {
        logout();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson') || 'aula1';
    
    if (document.getElementById('videoPlayerContainer')) {
        showLesson(lessonId);
        verificarStatusPresenca();
        iniciarContadorExpiracao();
    }
}

function showLesson(lessonId) {
    if (!isLessonAvailable(lessonId)) {
        alert("🔒 Esta aula ainda não está liberada. Siga o cronograma diário!");
        window.location.href = 'Aulas.html';
        return;
    }

    const lessonData = VIDEO_MAP[lessonId];
    const playerContainer = document.getElementById('videoPlayerContainer');
    const titleElement = document.getElementById('lessonTitle');

    if (!lessonData || !playerContainer) return;

    titleElement.textContent = lessonData.title;
    playerContainer.innerHTML = `
        <video controls poster="icon.png" controlsList="nodownload">
            <source src="${lessonData.embedUrl}" type="video/mp4">
            Seu navegador não suporta vídeos.
        </video>
    `;

    // Atualiza botões laterais
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));
    const currentBtn = document.getElementById(`btn-${lessonId}`);
    if (currentBtn) currentBtn.classList.add('active');
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// =======================================================
// 5. PRESENÇA E CONTADORES
// =======================================================

function iniciarContadorExpiracao() {
    const expirationTimeMs = parseInt(localStorage.getItem(EXPIRATION_KEY));
    const display = document.getElementById('tokenExpirationDisplay');
    if (!display) return;

    setInterval(() => {
        const tempoRestante = expirationTimeMs - Date.now();
        if (tempoRestante <= 0) logout();
        display.textContent = `⏳ Acesso expira em: ${formatarTempoRestante(tempoRestante)}`;
    }, 1000);
}

// =======================================================
// LÓGICA DE PRESENÇA COM FEEDBACK VISUAL
// =======================================================

async function marcarPresenca() {
    const btn = document.getElementById('presenceButton'); // Certifique-se que o ID no HTML é este
    
    // 1. Bloqueio imediato e mudança para estado de "Processando"
    btn.disabled = true;
    btn.classList.add('loading');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Processando...';

    const payload = new URLSearchParams({
        token: localStorage.getItem(TOKEN_KEY),
        cpf: localStorage.getItem(CPF_KEY),
        nome_aluno: localStorage.getItem(NAME_KEY),
        data_registro: getCurrentDateKey(),
        hora_registro: getCurrentTimestamp()
    });

    try {
        const resp = await fetch(PRESENCE_LOG_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        });
        
        const result = await resp.json();

        if (result.success) {
            // 2. Sucesso: Grava no navegador e muda para Verde Definitivo
            localStorage.setItem(PRESENCE_DATE_KEY, getCurrentDateKey());
            aplicarEstadoPresencaConcluida(btn);
            alert("Presença registrada com sucesso!");
        } else {
            throw new Error("Erro no servidor");
        }
    } catch (e) {
        // 3. Erro: Libera o botão para tentar novamente
        console.error(e);
        alert('Falha ao registrar presença. Tente novamente.');
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = originalText;
    }
}

// Função auxiliar para aplicar o visual de "Check"
function aplicarEstadoPresencaConcluida(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.classList.remove('loading');
    btn.style.backgroundColor = "#10b981"; // Força o Verde
    btn.textContent = '✅ Presença Confirmada';
}

// Verifica se já marcou hoje ao carregar a página
function verificarStatusPresenca() {
    const lastDate = localStorage.getItem(PRESENCE_DATE_KEY);
    const btn = document.getElementById('presenceButton');
    
    if (lastDate === getCurrentDateKey()) {
        aplicarEstadoPresencaConcluida(btn);
    }
}

// =======================================================
// 6. INICIALIZAÇÃO
// =======================================================

function initializePage() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) cpfInput.addEventListener('input', (e) => e.target.value = formatCPF(e.target.value));

    if (window.location.pathname.includes('videos.html')) {
        checkAccess();
    }
}

window.onload = initializePage;


