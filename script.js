// CONFIGURAÇÕES (Mantenha sua URL de API)
const SHEETDB_API_URL = 'https://script.google.com/macros/s/AKfycbzDsMX4UoWyWRoQzUHhMqkhL0z9U6Ho208WuMXcmraqojsgn8vGzBEX5GVa-vq403Vy/exec'; 
const SIMULADO_DATE_KEY = 'last_simulado_date';
const CPF_KEY = 'vimeo_user_cpf';
const NAME_KEY = 'vimeo_user_name';

// ... (Mantenha suas funções de VIDEO_MAP e cronômetro aqui)

async function podeFazerSimuladoPelaDatabase() {
    const cpf = localStorage.getItem(CPF_KEY);
    try {
        const resp = await fetch(`${SHEETDB_API_URL}?action=verificar_disponibilidade_simulado&cpf=${cpf}`);
        return await resp.json();
    } catch (e) {
        // Fallback local se a rede falhar
        return localStorage.getItem(SIMULADO_DATE_KEY) !== new Date().toLocaleDateString();
    }
}

async function abrirSimulados() { 
    const disponivel = await podeFazerSimuladoPelaDatabase();
    if (!disponivel) {
        alert("🔒 Você já realizou um simulado hoje. O sistema libera um novo teste a cada 24 horas.");
        return;
    }
    window.location.href = 'Simulados.html'; 
}

async function salvarSimuladoNoBanco(acertos, total) {
    const payload = new URLSearchParams({
        nome_aluno: localStorage.getItem(NAME_KEY),
        cpf: localStorage.getItem(CPF_KEY),
        acertos: acertos,
        total_questoes: total,
        action: 'registrar_simulado'
    });
    // Salva local para feedback imediato
    localStorage.setItem(SIMULADO_DATE_KEY, new Date().toLocaleDateString());
    try {
        await fetch(SHEETDB_API_URL, { method: 'POST', body: payload, mode: 'no-cors' });
    } catch (e) { console.error("Erro ao salvar simulado"); }
}
