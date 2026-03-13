// ... (Mantenha suas configurações iniciais de SHEETDB_API_URL no topo)
const SIMULADO_DATE_KEY = 'last_simulado_date';

// Verifica se pode fazer o simulado (Verifica se a data salva é diferente de hoje)
function podeFazerSimulado() {
    const ultimaData = localStorage.getItem(SIMULADO_DATE_KEY);
    const hoje = new Date().toLocaleDateString();
    return !ultimaData || ultimaData !== hoje;
}

// Salva a data de hoje como a última vez que fez o simulado
function registrarConclusaoSimulado() {
    const hoje = new Date().toLocaleDateString();
    localStorage.setItem(SIMULADO_DATE_KEY, hoje);
}

// Função de navegação para o menu
function abrirSimulados() { 
    if (!podeFazerSimulado()) {
        alert("🔒 Você já realizou um simulado hoje. Tente novamente amanhã!");
        return;
    }
    window.location.href = 'Simulados.html'; 
}
