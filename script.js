// =======================================================
// CONFIGURAÇÕES E BANCO DE DADOS
// =======================================================
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const PRESENCE_DATE_KEY = 'lastPresenceDate';

const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/bwmtelaaeqio6x0rgw07y/01-LEGISLA-O.mp4?rlkey=z8kaw1fnqyed87pjnz5w1sdwe&st=02dcglya&raw=1' },
    'aula2': { title: 'Aula 2: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    'aula30': { title: 'Aula 30: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' },
    'aula31': { title: 'Aula 31: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' },
    'aula32': { title: 'Aula 32: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/s44zst06jes84sjvfc9sd/32-MEC-NICA.mp4?rlkey=rgrtvn7v0zbijbscxav3xx922&st=qifdf215&raw=1' },
    'aula33': { title: 'Aula 33: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/6121osnobovdbxbs9bx7q/33-MEC-NICA-QUEST-ES-cut.mp4?rlkey=ecr148b6dwz6dkxr2bmr0stsf&st=2c5at6xz&raw=1' }
};

// --- FUNÇÃO DE MÁSCARA CPF ---
function formatCPF(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

// --- LÓGICA DE TEMPO E LIBERAÇÃO ---
function getDaysPassed() {
    let start = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!start) return 1;
    const diff = new Date() - new Date(start);
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function getTimeUntilNextRelease() {
    let start = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!start) return 0;
    // Libera a próxima aula 24h após o início do dia atual
    const nextDate = new Date(new Date(start).getTime() + (getDaysPassed() * 24 * 60 * 60 * 1000));
    return nextDate - new Date();
}

function isLessonAvailable(id) {
    const num = parseInt(id.replace('aula', ''));
    // Se for aula 1 ou 2, libera conforme o dia. Se for mecânica (30+), libera após dia 3 por exemplo.
    if (num >= 30) return getDaysPassed() >= 3; 
    return num <= getDaysPassed();
}

function formatarTempoRestante(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
}

// --- LOGIN ---
async function checkToken() {
    const token = document.getElementById('tokenInput').value.trim();
    const cpf = document.getElementById('cpfInput').value.trim();
    const msg = document.getElementById('message');

    if(!token || !cpf) { msg.innerText = "Preencha todos os campos."; return; }

    try {
        msg.innerText = "Autenticando...";
        const resp = await fetch(`${SHEETDB_API_URL}?token=${token}&cpf=${cpf}`);
        const data = await resp.json();

        if(data && data.length > 0) {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(NAME_KEY, data[0].nome_aluno);
            if(!localStorage.getItem(FIRST_ACCESS_KEY)) {
                localStorage.setItem(FIRST_ACCESS_KEY, new Date().toISOString());
            }
            window.location.href = 'videos.html';
        } else {
            msg.innerText = "Dados não encontrados ou incorretos.";
        }
    } catch(e) {
        msg.innerText = "Erro ao conectar com o servidor.";
    }
}

// --- PRESENÇA ---
async function marcarPresenca() {
    const btn = document.getElementById('presenceButton');
    if(!btn || btn.disabled) return;

    btn.disabled = true;
    btn.innerHTML = "⏳ Gravando...";
    btn.style.background = "#64748b";

    try {
        const payload = new URLSearchParams({
            token: localStorage.getItem(TOKEN_KEY),
            cpf: localStorage.getItem(CPF_KEY),
            nome_aluno: localStorage.getItem(NAME_KEY),
            data_registro: new Date().toLocaleDateString(),
            action: 'marcar_presenca'
        });

        await fetch(SHEETDB_API_URL, { method: 'POST', body: payload });
        localStorage.setItem(PRESENCE_DATE_KEY, new Date().toLocaleDateString());
        verificarStatusPresenca();
        alert("Presença registrada com sucesso!");
    } catch (e) {
        btn.disabled = false;
        btn.innerHTML = "📍 Marcar Presença";
        btn.style.background = "#3b82f6";
        alert("Erro ao salvar. Tente novamente.");
    }
}

function verificarStatusPresenca() {
    const btn = document.getElementById('presenceButton');
    if(btn && localStorage.getItem(PRESENCE_DATE_KEY) === new Date().toLocaleDateString()) {
        btn.disabled = true;
        btn.innerHTML = '✅ Presença Confirmada';
        btn.style.background = '#10b981';
        btn.style.cursor = 'not-allowed';
    }
}

// --- INICIALIZAÇÃO ---
function initializePage() {
    // Configura máscara de CPF se o campo existir
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }

    // Lógica para a página de vídeos
    if(window.location.pathname.includes('videos.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson') || 'aula1';
        showLesson(lessonId);
        verificarStatusPresenca();
    }
}

function showLesson(id) {
    const aula = VIDEO_MAP[id];
    if(!aula) return;
    document.getElementById('lessonTitle').innerText = aula.title;
    document.getElementById('videoPlayerContainer').innerHTML = `
        <video controls autoplay style="width:100%; height:100%; border-radius:12px;">
            <source src="${aula.embedUrl}" type="video/mp4">
        </video>`;
}

function redirectToVideo(id) { window.location.href = `videos.html?lesson=${id}`; }
function logout() { localStorage.clear(); window.location.href = 'index.html'; }
function abrirAulas() { window.location.href = 'Aulas.html'; }
function abrirLogs() { window.location.href = 'Logs.html'; }

window.onload = initializePage;

