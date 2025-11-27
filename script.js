// 🚨 PASSO 1: EDITE ESTA LISTA DE TOKENS!
// Coloque aqui os tokens únicos que você distribuirá para seus alunos.
// Use letras, números e talvez hífens. Ex: 'ALUNO-VIP-123', 'A1B2C3D4'
const VALID_TOKENS = [
    'SEUTOKEN1',
    'SEUTOKEN2',
    'EXEMPLO-DO-ALUNO-VIP',
    'CODIGO-DE-TESTE-42'
    // Adicione mais tokens aqui
];

// Chave usada para armazenar o status de login no navegador.
const ACCESS_KEY = 'vimeo_access_granted';


// =======================================================
// LÓGICA DE LOGIN (Usada em index.html)
// =======================================================

function checkToken() {
    // Verifica se estamos na página de login antes de tentar obter o elemento
    if (document.getElementById('tokenInput')) {
        const tokenInput = document.getElementById('tokenInput').value.trim().toUpperCase();
        const messageElement = document.getElementById('message');

        if (VALID_TOKENS.includes(tokenInput)) {
            // Token válido: Concede acesso e redireciona
            localStorage.setItem(ACCESS_KEY, 'true');
            messageElement.textContent = 'Acesso concedido! Redirecionando...';
            messageElement.style.color = 'green';
            
            // Redireciona após um pequeno atraso para exibir a mensagem de sucesso
            setTimeout(() => {
                window.location.href = 'videos.html';
            }, 500);

        } else {
            // Token inválido
            messageElement.textContent = 'Token inválido ou expirado. Tente novamente.';
            messageElement.style.color = 'red';
            localStorage.removeItem(ACCESS_KEY); // Garante que não haja acesso residual
        }
    }
}


// =======================================================
// LÓGICA DE PROTEÇÃO (Usada em videos.html)
// =======================================================

// Função que verifica se o usuário tem a chave de acesso no localStorage.
function checkAccess() {
    // Executa apenas se estiver na página de vídeos.html
    if (window.location.pathname.endsWith('videos.html') || window.location.pathname.endsWith('videos.html/')) {
        const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';

        if (!hasAccess) {
            // Sem a chave de acesso, redireciona para a página de login.
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    return true; // Se não for a página de vídeos, não faz nada
}


// Função para o botão "Sair"
function logout() {
    localStorage.removeItem(ACCESS_KEY); // Remove a chave de acesso
    window.location.href = 'index.html'; // Redireciona para o login
}

// Garante que a verificação de acesso ocorra assim que a página é carregada (em videos.html)
window.onload = checkAccess;