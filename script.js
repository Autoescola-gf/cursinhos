// index.js na sua pasta /functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializa o Admin SDK para acessar o Firestore
admin.initializeApp();
const db = admin.firestore();

// Duração do acesso em milissegundos (24 horas)
const DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Função de back-end para verificar o token e CPF, e gerenciar o timer de 24h.
 * Chamada pelo front-end (index.html).
 */
exports.verificarAcesso = functions.https.onCall(async (data, context) => {
    // 1. Recebe os dados
    const { token, cpf } = data; 
    
    if (!token || !cpf) {
        return { status: 'error', message: 'Token e CPF são obrigatórios.' };
    }
    
    // 2. Tenta buscar o token no Firestore (o ID do documento é o token)
    const docRef = db.collection('alunos').doc(token.toUpperCase());
    const doc = await docRef.get();

    if (!doc.exists) {
        return { status: 'error', message: 'Token inválido.' };
    }

    const alunoData = doc.data();
    const cpfLimpo = cpf.replace(/[^\d]/g, ''); // Remove formatação do CPF

    // 3. Verifica se o CPF fornecido corresponde ao CPF cadastrado
    if (alunoData.cpf.replace(/[^\d]/g, '') !== cpfLimpo) {
        return { status: 'error', message: 'Token e CPF não combinam.' };
    }

    // 4. Verifica a expiração
    const agora = new Date();
    // Converte o campo Firestore (Timestamp) para objeto Date
    const expiraEm = alunoData.acessoExpiracao ? alunoData.acessoExpiracao.toDate() : new Date(0);

    let statusMensagem = '';
    let novaExpiracao;

    if (agora < expiraEm) {
        // Acesso ainda válido
        statusMensagem = 'Acesso ativo. Você já está logado.';
        novaExpiracao = expiraEm; // Mantém a data de expiração existente
    } else {
        // Acesso expirado ou nunca usado: Renovação por 24 horas
        novaExpiracao = new Date(agora.getTime() + DURATION_MS);
        
        // Atualiza o Firestore com a nova data de expiração
        await docRef.update({
            acessoExpiracao: novaExpiracao
        });
        statusMensagem = `Acesso renovado por ${DURATION_MS / 1000 / 60 / 60} horas.`;
    }

    // 5. Retorna o sucesso e a data/hora de expiração para o front-end
    return { 
        status: 'success', 
        message: statusMensagem,
        expiracao: novaExpiracao.getTime() // Retorna como milissegundos para o front-end
    };
});
