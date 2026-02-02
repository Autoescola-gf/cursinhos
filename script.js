// CONFIGURAÇÕES
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec';
const FIRST_ACCESS_KEY = 'vimeo_first_access_date';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const NAME_KEY = 'vimeo_user_name';
const PRESENCE_DATE_KEY = 'lastPresenceDate';

const VIDEO_MAP = {
    'aula1': { title: 'Aula 1: Legislação', embedUrl: 'https://www.dropbox.com/scl/fi/q670pw9onlsoup0uwu9uh/01-Legisla-o-EDIT.mp4?rlkey=fgkfqvnpv2cbeb8ue2garx9j5&st=9eftivl1&raw=1' },
     'aula2': { 
        title: 'Aula 2: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/q2d25lqww46i62osqopdw/02-LEGISLA-O.mp4?rlkey=2lfmybi5ro6pa386s8vt98lbp&st=8tjdt68b&raw=1'
    },
    'aula3': { 
        title: 'Aula 3: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/2v3a9lvtu0hma4ktojjlq/03-LEGISLA-O.mp4?rlkey=5giu774jbf1mmdf2x8v9paqkw&st=ur8l5a4g&raw=1' 
    },
    'aula4': { 
        title: 'Aula 4: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/pc4c6x8cafki0bc8tikhm/04-LEGISLA-O.mp4?rlkey=mzs0ps4nyyb23qm1gqvqtwz78&st=z68vjpbh&raw=1' 
    },

      // SINALIZAÇÃO
    'aula5': { 
        title: 'Aula 5: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/k3w63lrirvstkoi0abfav/05-SINALIZA-O.mp4?rlkey=9yrqojpomtc7ti2wied7sk1wx&st=l7zgv1l9&raw=1' 
    },
    'aula6': { 
        title: 'Aula 6: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/h5k0i6p3qld5s3mlpkq1s/06-SINALIZA-O.mp4?rlkey=tykepxntrqpxjtletnbwr68ra&st=x9g2nly6&raw=1' 
    },
    'aula7': { 
        title: 'Aula 7: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/wdcw32037vhnd4no2koso/07-SINALIZA-O.mp4?rlkey=d3hvj93zwoq400lz2h7eqo7yx&st=t08ph9e1&raw=1' 
    },
    'aula8': { 
        title: 'Aula 8: Sinalização',
        embedUrl: 'https://www.dropbox.com/scl/fi/05cs21an3v96znuyxt1s1/08-SINALIZA-O.mp4?rlkey=jeqagbfl1uu38n0kqy160x8ss&st=nurxqroc&raw=1' 
    },
    
    // Infraçoes e penalidades
    'aula9': {
        title: 'Aula 9: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/va827yqp7a36oj1qvp7hk/09-INFRA-ES.mp4?rlkey=f2m041w9zar4lh04f040f0cvx&st=b2gw1fwn&raw=1' 
    },
    'aula10': { 
        title: 'Aula 10: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/1i96iu1gzdjb2rrw2jq9p/10-INFRA-ES.mp4?rlkey=7xnldn35yxsjgpoqq9i20vsee&st=a6hard5y&raw=1' 
    },
    'aula11': { 
        title: 'Aula 11: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/dfxtfkagy7ekv04vq4y1s/11-INFRA-ES.mp4?rlkey=a9dtcfrkdq2vfje6fyveqf9qj&st=nvmn2agw&raw=1' 
    },
    'aula12': { 
        title: 'Aula 12: Infrações e Penalidades',
        embedUrl: 'https://www.dropbox.com/scl/fi/eyqbltxxfgvomy0t34y7w/12-INFRA-ES.mp4?rlkey=pzr1uhx3aow2t84rxzie6rxby&st=tr535ria&raw=1' 
    },
    
    // Normas e condutas
    'aula13': {
        title: 'Aula 13: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/uhagyy8h8skjb1asg8kng/13-NORMAS.mp4?rlkey=y6l4eqtby3ou7nql3ds095jtw&st=ta33la6d&raw=1' 
    },
    'aula14': { 
        title: 'Aula 14: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/pvgsqlqqniiefkdcw3lqz/14-NORMAS.mp4?rlkey=9x6nc1x0xur0hfjqq9wray905&st=o1na1fay&raw=1' 
    },
    'aula15': { 
        title: 'Aula 15: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/kyiukhe0gi14cvm8eszdw/15-NORMAS.mp4?rlkey=ak3me9abl9h7jc98ppe6rre3e&st=ze8h8lau&raw=1' 
    },
    'aula16': { 
        title: 'Aula 16: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/qwi1zrjjn1sh209jkmzlw/16-NORMAS.mp4?rlkey=f0ozn5z6dx5nmp8duffiv412k&st=ew0srpyq&raw=1' 
    },
    'aula17': { 
        title: 'Aula 17: Normas e condutas',
        embedUrl: 'https://www.dropbox.com/scl/fi/dfxcalvctqn9pyy5rd569/17-NORMAS-QUEST-ES-cut.com.mp4?rlkey=73lpri4slwe24s2w0r4wesp1n&st=4ycp207b&raw=1' 
    },

   // Direção defensiva
    'aula18': {
        title: 'Aula 18: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/9hp1nt9b08546gu1229p7/18-DIRE-O-DEFENSIVA.mp4?rlkey=p2p4gwpnbo3p4nygc12rw8trx&st=cm6lcuqe&raw=1' 
    },
    'aula19': { 
        title: 'Aula 19: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/9ch9zi0xd2w97ybvt9uaj/19-DIRE-O-DEFENSIVA.mp4?rlkey=3n1cjfxc1r0yz1y9i8lui81jh&st=smw9o5kz&raw=1' 
    },
    'aula20': { 
        title: 'Aula 20: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/1nkxoifxczy0cnqe1qths/20-DIRE-O-DEFENSIVA.mp4?rlkey=j43unqxy8brwo8othv05f9xox&st=lmd5b9az&raw=1' 
    },
    'aula21': { 
        title: 'Aula 21: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/wb1s6sdes8h0flnywgekc/21-DIRE-O-DEFENSIVA.mp4?rlkey=whyernmrz11l3h9e488pm39nq&st=z8d2c3po&raw=1' 
    },
    'aula22': { 
        title: 'Aula 22: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/r30gp475xx6628tnqvnxn/22-DIRE-O-DEFENSIVA.mp4?rlkey=vtht8dd2bfcgp0ziv2p4m2jbp&st=o8t0pfu8&raw=1' 
    },
    'aula23': { 
        title: 'Aula 23: Direção Defensiva',
        embedUrl: 'https://www.dropbox.com/scl/fi/bz0chb83omcs3voafx8p3/23-DIRE-O-DEFENSIVA-cut.mp4?rlkey=sle83hwrplsprfsu5dnsm0k7i&st=tj660mie&raw=1' 
    },

    
    // Primeiros Socorros
    'aula24': {
        title: 'Aula 24: Primeiros Socorros',
        embedUrl: 'https://www.dropbox.com/scl/fi/8eh70ydl7nw0b3tkj41qu/24-PRIMEIROS-SOCORROS.mp4?rlkey=4rnirtm44t99owt5rc87m513g&st=gbark4md&raw=1' 
    },
    'aula25': { 
        title: 'Aula 25: Primeiros Socorros',
        embedUrl: 'https://www.dropbox.com/scl/fi/0v4coveq5b7h7etojsvkn/25-PRIMEIROS-SOCORROS.mp4?rlkey=os8eo3z7ansascflh29e1vh1n&st=iq7yopg1&raw=1' 
    },
    'aula26': { 
        title: 'Aula 26: Primeiros Socorros',
        embedUrl: 'https://www.dropbox.com/scl/fi/aqmvod20rt7xhkjqvc54c/26-PRIMEIROS-SOCORROS.mp4?rlkey=jaizi1ifkkd3t3h3lmjefk42a&st=7dbyuhng&raw=1' 
    },
    'aula27': { 
        title: 'Aula 27: Primeiros Socorros',
        embedUrl: 'https://www.dropbox.com/scl/fi/uleso3vy033f6r2r86boh/27-PRIMEIROS-SOCORROS-cut.mp4?rlkey=xdrlfufqidartr4y2jmdjvdsf&st=as8gs13l&raw=1' 
    },  

    

     // Meio Ambiente
    'aula28': {
        title: 'Aula 28: Meio Ambiente',
        embedUrl: 'https://www.dropbox.com/scl/fi/qm2usit08vbn754reepf0/28-MEIO-AMBIENTE.mp4?rlkey=9cy1en3ljg2vaxcoqkzwunpj8&st=q36qwtlw&raw=1' 
    },
    'aula29': { 
        title: 'Aula 29: Meio Ambiente',
        embedUrl: 'https://www.dropbox.com/scl/fi/ze1oxs3ycax4suwnn1bum/29-MEIO-AMBIENTE.mp4?rlkey=ztuin39vu2if216tx52vqv4uz&st=29c5rsji&raw=1' 
    },

     // MECANICA
    'aula30': {
        title: 'Aula 30: Mecânica',
        embedUrl: 'https://www.dropbox.com/scl/fi/tkeuf9l70691ih6u0j7s7/30-MEC-NICA.mp4?rlkey=t0l7d2nnh8haaz3hvo64cxkqk&st=ll8itt8m&raw=1' 
    },
    'aula31': { 
        title: 'Aula 31: Mecânica',
        embedUrl: 'https://www.dropbox.com/scl/fi/oe6nr8sy506vcn722w5oo/31-MEC-NICA.mp4?rlkey=1vdi44d00368aw75afrfy37es&st=v1x7mfzo&raw=1' 
    },
    'aula32': { 
        title: 'Aula 32: Mecânica',
        embedUrl: 'https://www.dropbox.com/scl/fi/s44zst06jes84sjvfc9sd/32-MEC-NICA.mp4?rlkey=rgrtvn7v0zbijbscxav3xx922&st=qifdf215&raw=1' 
    },
    'aula33': { 
        title: 'Aula 33: Mecânica',
        embedUrl: 'https://www.dropbox.com/scl/fi/6121osnobovdbxbs9bx7q/33-MEC-NICA-QUEST-ES-cut.mp4?rlkey=ecr148b6dwz6dkxr2bmr0stsf&st=2c5at6xz&raw=1' 
    },

};

// --- NOVA LÓGICA: 2 EM 2 AULAS POR DIA ---
function isLessonAvailable(id) {
    const num = parseInt(id.replace('aula', ''));
    const diaAtual = getDaysPassed();
    
    let limiteAulas;

    if (diaAtual < 9) {
        limiteAulas = diaAtual * 3;
    } else if (diaAtual === 9) {
        limiteAulas = 17; 
    } else {
        limiteAulas = 19 + ((diaAtual - 9) * 2);
    }
    
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
        showLesson(urlParams.get('lesson') || 'aula13');
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














