// CONFIGURAÇÕES
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbzDsMX4UoWyWRoQzUHhMqkhL0z9U6Ho208WuMXcmraqojsgn8vGzBEX5GVa-vq403Vy/exec';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const PRESENCE_DATE_KEY = 'lastPresenceDate';
const SIMULADO_DATE_KEY = 'last_simulado_date'; // Chave para controle do simulado

const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
    'aula2': { title: 'Aula 2: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1' },
    'aula3': { title: 'Aula 3: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/0zcl569j2f8v6968y6n2q/03-LEGISLA-O.mp4?rlkey=v6c9v3h1q9v6v9v6v9v6v9v6v&raw=1' },
    'aula4': { title: 'Aula 4: Sinalização', embedUrl: 'https://www.dropbox.com/scl/fi/0zcl569j2f8v6968y6n2q/04-SINALIZACAO.mp4?rlkey=v6c9v3h1q9v6v9v6v9v6v9v6v&raw=1' }
    // Adicione as demais aulas conforme seu catálogo
};

// --- LÓGICA DE BLOQUEIO DE AULAS (2 POR DIA) ---

function getFirstAccessDate() {
    let date = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!date) {
        date = new Date().toISOString();
        localStorage.setItem(FIRST_ACCESS_KEY, date);
    }
    return new Date(date);
}

function getDaysSinceFirstAccess() {
    const firstAccess = getFirstAccessDate();
    const now = new Date();
    const diffTime = Math.abs(now - firstAccess);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function isLessonAvailable(lessonId) {
    const lessonNumber = parseInt(lessonId.replace('aula', ''));
    const daysSinceAccess = getDaysSinceFirstAccess();
    // Libera 2 aulas por dia (Dia 0: 1,2 | Dia 1: 3,4 | etc)
    const maxAvailable = (daysSinceAccess + 1) * 2;
    return lessonNumber <= maxAvailable;
}

function getTimeUntilNextRelease() {
    const firstAccess = getFirstAccessDate();
    const now = new Date();
    const daysSince = getDaysSinceFirstAccess();
    const nextReleaseDate = new Date(firstAccess);
    nextReleaseDate.setDate(firstAccess.getDate() + daysSince + 1);
    return nextReleaseDate - now;
}

function formatarTempoRestante(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// --- LÓGICA DO SIMULADO (1 POR DIA) ---

function podeFazerSimulado() {
    const ultimaData = localStorage.getItem(SIMULADO_DATE_KEY);
    const hoje = new Date().toLocaleDateString();
    return !ultimaData || ultimaData !== hoje;
}

function registrarConclusaoSimulado() {
    const hoje = new Date().toLocaleDateString();
    localStorage.setItem(SIMULADO_DATE_KEY, hoje);
}

function abrirSimulados() { 
    if (!podeFazerSimulado()) {
        alert("🔒 Você já realizou um simulado hoje. O sistema libera um novo teste a cada 24 horas.");
        return;
    }
    window.location.href = 'Simulados.html'; 
}

// --- FUNÇÕES DE NAVEGAÇÃO E INTERFACE ---

function logout() { 
    localStorage.clear(); 
    window.location.href = 'index.html'; 
}

function abrirAulas() { window.location.href = 'Aulas.html'; }

function redirectToVideo(id) {
    if (isLessonAvailable(id)) {
        window.location.href = `videos.html?aula=${id}`;
    } else {
        alert("🔒 Esta aula ainda não foi liberada.");
    }
}

async function marcarPresenca() {
    const btn = document.getElementById('presenceButton');
    if (!btn) return;

    btn.disabled = true; 
    btn.textContent = '⏳ Gravando...';
    
    try {
        const payload = new URLSearchParams({
            token: localStorage.getItem(TOKEN_KEY),
            cpf: localStorage.getItem(CPF_KEY),
            nome_aluno: localStorage.getItem(NAME_KEY),
            data_registro: new Date().toLocaleDateString(),
            action: 'marcar_presenca'
        });

        await fetch(SHEETDB_API_URL, { 
            method: 'POST', 
            body: payload,
            mode: 'no-cors' // Ajuste dependendo do seu Google Script
        });

        localStorage.setItem(PRESENCE_DATE_KEY, new Date().toLocaleDateString());
        verificarStatusPresenca();
    } catch (e) { 
        console.error(e);
        btn.disabled = false; 
        btn.textContent = 'Erro ao marcar!'; 
    }
}

function verificarStatusPresenca() {
    const btn = document.getElementById('presenceButton');
    if(btn && localStorage.getItem(PRESENCE_DATE_KEY) === new Date().toLocaleDateString()) {
        btn.disabled = true; 
        btn.textContent = '✅ Presença OK'; 
        btn.style.background = '#10b981';
    }
}

// Inicialização global (opcional)
document.addEventListener('DOMContentLoaded', () => {
    verificarStatusPresenca();
});
