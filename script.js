// CONFIGURAÇÕES
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const PRESENCE_DATE_KEY = 'lastPresenceDate';

const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/bwmtelaaeqio6x0rgw07y/01-LEGISLA-O.mp4?rlkey=z8kaw1fnqyed87pjnz5w1sdwe&st=02dcglya&raw=1' },
    'aula2': { title: 'Aula 2: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    'aula3': { title: 'Aula 3: Legislação', embedUrl: '...' },
    'aula4': { title: 'Aula 4: Legislação', embedUrl: '...' },
    'aula30': { title: 'Aula 30: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' },
    'aula31': { title: 'Aula 31: Mecânica', embedUrl: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' }
};

// --- NOVA LÓGICA: 2 EM 2 AULAS POR DIA ---
function isLessonAvailable(id) {
    const num = parseInt(id.replace('aula', ''));
    const diaAtual = getDaysPassed();
    
    const limiteAulas = diaAtual * 2;
    
    if (num >= 30 && diaAtual < 3) return false; 

    return num <= limiteAulas;
}

function getDaysPassed() {
    let start = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!start) return 1;
    const diff = new Date() - new Date(start);
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function getTimeUntilNextRelease() {
    let start = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!start) return 0;
    const nextDate = new Date(new Date(start).getTime() + (getDaysPassed() * 24 * 60 * 60 * 1000));
    return nextDate - new Date();
}

function formatarTempoRestante(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
}

// --- MÁSCARA CPF ---
function formatCPF(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

// --- INICIALIZAÇÃO ---
function initializePage() {
    const cpfInput = document.getElementById('cpfInput');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => { e.target.value = formatCPF(e.target.value); });
    }

    // EXIBE O NOME DO ALUNO NO HEADER (Se o elemento existir no HTML)
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) {
        nameDisplay.innerText = localStorage.getItem(NAME_KEY) || "Aluno";
    }

    if(window.location.pathname.includes('videos.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        showLesson(urlParams.get('lesson') || 'aula1');
        verificarStatusPresenca();
        if (typeof updateSidebarLocks === "function") updateSidebarLocks();
    }
}

async function checkToken() {
    const token = document.getElementById('tokenInput').value.trim();
    const cpf = document.getElementById('cpfInput').value.trim();
    const msg = document.getElementById('message');
    
    try {
        const resp = await fetch(`${SHEETDB_API_URL}?token=${token}&cpf=${cpf}`);
        const data = await resp.json();
        
        if(data.length > 0) {
            const aluno = data[0];
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(NAME_KEY, aluno.nome_aluno);
            
            // SINCRONIZA A DATA DE INÍCIO COM A PLANILHA
            // Se a planilha já tiver data_inicio, usamos ela. Se não, usamos a de agora.
            const dataInicio = aluno.data_inicio || new Date().toISOString();
            localStorage.setItem(FIRST_ACCESS_KEY, dataInicio);
            
            window.location.href = 'videos.html';
        } else { msg.innerText = "Dados inválidos."; }
    } catch(e) { msg.innerText = "Erro de conexão."; }
}

function showLesson(id) {
    if(!isLessonAvailable(id)) { alert("Esta aula será libertada nos próximos dias!"); return; }
    const aula = VIDEO_MAP[id];
    if(!aula) return;
    document.getElementById('lessonTitle').innerText = aula.title;
    document.getElementById('videoPlayerContainer').innerHTML = `<video controls autoplay style="width:100%; height:auto;"><source src="${aula.embedUrl}" type="video/mp4"></video>`;
    document.querySelectorAll('.nav-buttons button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${id}`)?.classList.add('active');
}

async function marcarPresenca() {
    const btn = document.getElementById('presenceButton');
    btn.disabled = true; btn.textContent = '⏳...';
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
    } catch (e) { btn.disabled = false; btn.textContent = 'Erro!'; }
}

function verificarStatusPresenca() {
    const btn = document.getElementById('presenceButton');
    if(btn && localStorage.getItem(PRESENCE_DATE_KEY) === new Date().toLocaleDateString()) {
        btn.disabled = true; btn.textContent = '✅ Presença OK'; btn.style.background = '#10b981';
    }
}

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
function abrirAulas() { window.location.href = 'Aulas.html'; }
function abrirLogs() { window.location.href = 'Log.html'; }
function redirectToVideo(id) { window.location.href = `videos.html?lesson=${id}`; }
window.onload = initializePage;
