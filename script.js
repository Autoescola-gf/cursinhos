// =======================================================
// CONFIGURAÇÕES E MAPEAMENTO DE VÍDEOS
// =======================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec'; // 🚨 COLE AQUI O LINK DO DEPLOY

const NAME_KEY = 'vimeo_user_name';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const FIRST_ACCESS_KEY = 'vimeo_first_access';

const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Legislação', url: 'https://player.vimeo.com/video/ID_VIMEO' },
    'aula2': { title: 'Aula 2: Legislação', url: 'https://player.vimeo.com/video/ID_VIMEO' },
    'aula3': { title: 'Aula 3: Legislação', url: 'https://player.vimeo.com/video/ID_VIMEO' },
    'aula4': { title: 'Aula 4: Legislação', url: 'https://player.vimeo.com/video/ID_VIMEO' },
    // Adicione as outras aulas seguindo este padrão...
};

// =======================================================
// LÓGICA DE TEMPO E LIBERAÇÃO (2 AULAS POR DIA)
// =======================================================

function getDaysPassed() {
    const firstAccess = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!firstAccess) return 1;

    const start = new Date(firstAccess);
    const now = new Date();
    
    // Diferença em milissegundos convertida para dias inteiros
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // Dia 0 = Dia 1 de curso
}

function getTimeUntilNextRelease() {
    const firstAccess = localStorage.getItem(FIRST_ACCESS_KEY);
    if (!firstAccess) return 0;

    const start = new Date(firstAccess);
    const now = new Date();
    const diaAtual = getDaysPassed();

    // A próxima liberação ocorre exatamente a cada 24h do primeiro acesso
    const nextRelease = new Date(start.getTime() + (diaAtual * 24 * 60 * 60 * 1000));
    return nextRelease - now;
}

function formatarTempoRestante(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function isLessonAvailable(id) {
    const num = parseInt(id.replace('aula', ''));
    const diaAtual = getDaysPassed();
    // REGRA: 2 aulas por dia
    const limite = diaAtual * 2;
    return num <= limite;
}

// =======================================================
// LOGIN E SINCRONIZAÇÃO
// =======================================================

async function checkToken() {
    const token = document.getElementById('tokenInput').value.trim();
    const cpf = document.getElementById('cpfInput').value.trim();
    const btn = document.getElementById('loginButton');
    const msg = document.getElementById('message');

    if (!token || !cpf) {
        msg.innerText = "Preencha todos os campos!";
        return;
    }

    btn.disabled = true;
    btn.innerText = "Validando...";

    try {
        const response = await fetch(`${API_URL}?token=${token}&cpf=${cpf}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const aluno = data[0];
            
            // Salva dados no Navegador
            localStorage.setItem(NAME_KEY, aluno.nome_aluno);
            localStorage.setItem(CPF_KEY, cpf);
            localStorage.setItem(TOKEN_KEY, token);
            
            // SINCRONIZA DATA DE INÍCIO DA PLANILHA
            if (aluno.data_inicio) {
                localStorage.setItem(FIRST_ACCESS_KEY, aluno.data_inicio);
            }

            window.location.href = 'videos.html';
        } else {
            msg.innerText = "Token ou CPF inválidos!";
            btn.disabled = false;
            btn.innerText = "Entrar na Plataforma";
        }
    } catch (e) {
        msg.innerText = "Erro ao conectar com o servidor.";
        btn.disabled = false;
        btn.innerText = "Entrar na Plataforma";
    }
}

// =======================================================
// FUNÇÕES DA ÁREA DE VÍDEOS
// =======================================================

function initializePage() {
    // Exibe o nome do aluno se o elemento existir
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) {
        nameDisplay.innerText = localStorage.getItem(NAME_KEY) || "Aluno";
    }

    // Se estiver na página de vídeos, carrega a última aula ou a primeira
    if (window.location.pathname.includes('videos.html')) {
        const params = new URLSearchParams(window.location.search);
        const aulaId = params.get('aula') || 'aula1';
        showLesson(aulaId);
    }
}

function showLesson(id) {
    if (!isLessonAvailable(id)) {
        alert("Esta aula ainda não foi liberada para você!");
        return;
    }

    const lesson = VIDEO_MAP[id];
    if (!lesson) return;

    // Atualiza Título e Iframe
    document.getElementById('lessonTitle').innerText = lesson.title;
    const container = document.getElementById('videoPlayerContainer');
    container.innerHTML = `<iframe src="${lesson.url}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;"></iframe>`;

    // Marca botão ativo na barra lateral
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${id}`);
    if (activeBtn) activeBtn.classList.add('active');
}

function redirectToVideo(id) {
    window.location.href = `videos.html?aula=${id}`;
}

async function marcarPresenca() {
    const btn = document.getElementById('presenceButton');
    const token = localStorage.getItem(TOKEN_KEY);
    const cpf = localStorage.getItem(CPF_KEY);
    const nome = localStorage.getItem(NAME_KEY);

    btn.disabled = true;
    btn.innerText = "⌛ Registrando...";

    try {
        const url = `${API_URL}?action=marcar_presenca&token=${token}&cpf=${cpf}&nome_aluno=${encodeURIComponent(nome)}`;
        const response = await fetch(url, { method: 'POST' });
        const res = await response.json();

        if (res.success) {
            btn.innerText = "✅ Presença Confirmada";
            alert("Presença registrada com sucesso!");
        }
    } catch (e) {
        alert("Erro ao registrar presença.");
        btn.disabled = false;
        btn.innerText = "📍 Marcar Presença";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
