// =======================================================
// CONFIGURAÇÕES E MAPEAMENTO DE VÍDEOS
// =======================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbyZkAwC19qf7Lu5vT3lhS7QN03KJcr4weoU6NYLbbzcD17bbLiAh3C51vXoPvISeR40/exec'; // 🚨 COLE AQUI O LINK DO DEPLOY

const NAME_KEY = 'vimeo_user_name';
const CPF_KEY = 'vimeo_user_cpf';
const TOKEN_KEY = 'vimeo_user_token';
const FIRST_ACCESS_KEY = 'vimeo_first_access';

const VIDEO_MAP = {
    'aula1': { 
        title: 'Aula 1: Legislação',
        embedUrl: 'https://www.dropbox.com/scl/fi/bwmtelaaeqio6x0rgw07y/01-LEGISLA-O.mp4?rlkey=z8kaw1fnqyed87pjnz5w1sdwe&st=gaxy4q0f&raw=1'
    },
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
        embedUrl: 'https://www.dropbox.com/scl/fi/b45sf0r74ym7xh81axw0w/28-MEIO-AMBIENTE.mp4?rlkey=4ccmyv257qw25v2nq40g6efyn&st=yps7zupj&raw=1' 
    },
    'aula29': { 
        title: 'Aula 29: Meio Ambiente',
        embedUrl: 'https://www.dropbox.com/scl/fi/flouxhzn9diksebb5gik1/29-MEIO-AMBIENTE.mp4?rlkey=p3t4fsj7zxiduz3qrrov0mu2i&st=cldbz8p8&raw=1' 
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

