// CONFIGURAÇÕES
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date';
const EXPIRATION_KEY = 'access_expires_at';
const ACCESS_KEY = 'vimeo_access_granted';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const PRESENCE_DATE_KEY = 'lastPresenceDate';

const VIDEO_MAP = {
    'aula1': { title: 'Introdução', embedUrl: '' },
    'aula2': { title: 'Legislação II', embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    'aula30': { title: 'Mecânica I', embedUrl: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' },
    'aula31': { title: 'Mecânica II', embedUrl: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' },
    'aula32': { title: 'Mecânica III', embedUrl: 'https://www.dropbox.com/scl/fi/s44zst06jes84sjvfc9sd/32-MEC-NICA.mp4?rlkey=rgrtvn7v0zbijbscxav3xx922&st=qifdf215&raw=1' },
    'aula33': { title: 'Mecânica IV', embedUrl: 'https://www.dropbox.com/scl/fi/6121osnobovdbxbs9bx7q/33-MEC-NICA-QUEST-ES-cut.mp4?rlkey=ecr148b6dwz6dkxr2bmr0stsf&st=2c5at6xz&raw=1' }
};

// 1. LÓGICA DE TEMPO
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

function isLessonAvailable(id) {
    return parseInt(id.replace('aula', '')) <= getDaysPassed();
}

function formatarTempoRestante(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
}

// 2. PRESENÇA
async function marcarPresenca() {
    const btn = document.getElementById('presenceButton');
    btn.disabled = true; btn.classList.add('loading'); btn.textContent = '⏳ Gravando...';

    try {
        const payload = new URLSearchParams({
            token: localStorage.getItem(TOKEN_KEY),
            cpf: localStorage.getItem(CPF_KEY),
            nome_aluno: localStorage.getItem(NAME_KEY),
            data_registro: new Date().toLocaleDateString(),
            action: 'marcar_presenca'
        });
        const resp = await fetch(SHEETDB_API_URL, { method: 'POST', body: payload });
        const res = await resp.json();
        if(res.success) {
            localStorage.setItem(PRESENCE_DATE_KEY, new Date().toLocaleDateString());
            verificarStatusPresenca();
        }
    } catch (e) { btn.disabled = false; btn.textContent = 'Tentar Novamente'; }
}

function verificarStatusPresenca() {
    if(localStorage.getItem(PRESENCE_DATE_KEY) === new Date().toLocaleDateString()) {
        const btn = document.getElementById('presenceButton');
        if(btn) { btn.disabled = true; btn.textContent = '✅ Presença Confirmada'; btn.style.background = '#10b981'; }
    }
}

// 3. LOGIN & PLAYER
async function checkToken() {
    const token = document.getElementById('tokenInput').value.trim();
    const cpf = document.getElementById('cpfInput').value.trim();
    try {
        const resp = await fetch(`${SHEETDB_API_URL}?token=${token}&cpf=${cpf}`);
        const data = await resp.json();
        if(data.length > 0) {
            localStorage.setItem(ACCESS_KEY, 'true');
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(NAME_KEY, data[0].nome_aluno);
            localStorage.setItem(EXPIRATION_KEY, Date.now() + 86400000);
            if(!localStorage.getItem(FIRST_ACCESS_KEY)) localStorage.setItem(FIRST_ACCESS_KEY, new Date().toISOString());
            window.location.href = 'videos.html';
        } else { document.getElementById('message').innerText = "Dados inválidos."; }
    } catch(e) { document.getElementById('message').innerText = "Erro de conexão."; }
}

function showLesson(id) {
    if(!isLessonAvailable(id)) { alert("Bloqueado!"); return; }
    const aula = VIDEO_MAP[id];
    document.getElementById('lessonTitle').innerText = aula.title;
    document.getElementById('videoPlayerContainer').innerHTML = `<video controls poster="icon.png"><source src="${aula.embedUrl}" type="video/mp4"></video>`;
    document.querySelectorAll('.nav-buttons button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${id}`)?.classList.add('active');
}

function initializePage() {
    if(window.location.pathname.includes('videos.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        showLesson(urlParams.get('lesson') || 'aula1');
        verificarStatusPresenca();
    }
}

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
function abrirAulas() { window.location.href = 'Aulas.html'; }
function formatCPF(v){ v=v.replace(/\D/g,""); v=v.replace(/(\d{3})(\d)/,"$1.$2"); v=v.replace(/(\d{3})(\d)/,"$1.$2"); v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); return v; }
