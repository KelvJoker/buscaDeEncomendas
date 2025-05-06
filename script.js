document.getElementById("buscar-button").onclick = buscar;

const API_URL = "https://script.google.com/macros/s/AKfycbwke2O_yZ48dfK7hqpSQO33ZaRxav2fVXtKDP8S0Sl36GE6QxlZpvIelp1EOf-xxOU_/exec";

function buscar() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome || nome.length < 3) {
    document.getElementById('resultado').innerHTML = "<p class='no-results'>Por favor, digite ao menos 3 caracteres.</p>";
    return;
  }

  fetch(`${API_URL}?nome=${encodeURIComponent(nome)}`)
    .then(response => response.json())
    .then(dados => mostrarResultado(dados))
    .catch(error => {
      console.error('Erro:', error);
      document.getElementById('resultado').innerHTML = "<p class='no-results'>Erro ao buscar dados.</p>";
    });
}

function mostrarResultado(dados) {
  const div = document.getElementById('resultado');

  if (!dados || !Array.isArray(dados)) {
    div.innerHTML = `<p class="no-results">Nenhuma encomenda encontrada com esse nome.</p>`;
    return;
  }

  if (dados.length === 0) {
    div.innerHTML = `<p class="no-results">Nenhuma encomenda encontrada com esse nome.</p>`;
    return;
  }

  let html = "<table><thead><tr><th>Nome</th><th>Data</th><th>Status</th></tr></thead><tbody>";
  dados.forEach(item => {
    const status = substituirStatus(item.status);
    const statusClass = getStatusClass(status);
    const formattedDate = formatarData(item.data);

    html += `<tr>
      <td data-label="Nome">${item.nome}</td>
      <td data-label="Data">${formattedDate}</td>
      <td data-label="Status" class="status-cell ${statusClass}">${status}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  div.innerHTML = html;
}

function formatarData(data) {
  const dateObj = new Date(data);
  const dia = String(dateObj.getDate()).padStart(2, '0');
  const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
  const ano = String(dateObj.getFullYear()).slice(-2);
  return `${dia}/${mes}/${ano}`;
}

function substituirStatus(status) {
  if (status.toLowerCase().includes("pendente")) return "Nos Correios";
  return status;
}

function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("entregue")) return 'entregue';
  if (statusLower.includes("nos correios")) return 'noscorreios';
  if (statusLower.includes("volto") || statusLower.includes("voltou")) return 'volto';
  return '';
}