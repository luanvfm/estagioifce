let solicBruto;

// Usando fetch para obter o conteúdo do JSON
fetch('tiposdesolicitacao.json')
  .then(response => response.json())
  .then(data => {
    solicBruto = data;
  })
  .catch(error => console.error('Erro ao carregar o JSON:', error));

let selectedSolicitacoes = {};
let inputValueCache = {};


function search() {
  const searchText = document.getElementById('searchText');
  const searchTerm = searchText.value.toLowerCase();
  
  const solicitacoesContainer = document.getElementById('solicitacoesContainer');
  solicitacoesContainer.innerHTML = '';
  
  solicBruto.forEach(solicitacao => {
    if (solicitacao.nome.toLowerCase().includes(searchTerm) || solicitacao.tipo.toLowerCase().includes(searchTerm)) {
      addSolicitacaoToContainer(solicitacao);
    }
  });
  
  // Adiciona as solicitações selecionadas no topo da lista
  Object.keys(selectedSolicitacoes).forEach(tipo => {
    if (!solicitacoesContainer.querySelector(`#${tipo}`)) {
      const solicitacao = solicBruto.find(s => s.tipo === tipo);
      if (solicitacao) {
        addSolicitacaoToContainer(solicitacao);
      }
    }
  });
}

document.querySelector("#searchText").addEventListener("keydown", (e) => {
  if (e.key == 'Enter') {
    search();
  }
});

function addSolicitacaoToContainer(solicitacao) {
  const solicitacoesContainer = document.getElementById('solicitacoesContainer');
  const tipo = solicitacao.tipo;
  
  const solicitacaoDiv = document.createElement('div');
  solicitacaoDiv.innerHTML = `
  <div class="solicheader">
  <div>
  <input type="checkbox" id="${tipo}" onclick="toggleSelection('${tipo}')" ${selectedSolicitacoes[tipo] ? 'checked' : ''}>
        <label for="${tipo}">${solicitacao.nome}</label>
      </div>
      <img src="images/seta.svg" onclick="expand('${tipo}'); rotate('exp${tipo}');" class="exp${tipo}">
    </div>
    <div class="solicInput" id="${tipo}Content" style="display: none;">
      <input type="text" id="${tipo}Input" placeholder="Digite aqui..." 
        value="${inputValueCache[tipo] || ''}" oninput="enableCheckbox('${tipo}'); updateInputValue('${tipo}')">
    </div>
  `;

  solicitacoesContainer.appendChild(solicitacaoDiv);
  enableCheckbox(tipo);
}

function rotate(elem) {
  let x = document.querySelector(`.${elem}`);
  x.classList.toggle("rotate");
}

function enableCheckbox(tipo) {
  const checkbox = document.getElementById(tipo);
  const input = document.getElementById(`${tipo}Input`);

  if (input) { // Verifica se o input existe
    if (input.value.trim() !== '') {
      checkbox.disabled = false;
    } else {
      checkbox.disabled = true;
      checkbox.checked = false;
    }
  }
}

function toggleSelection(tipo) {
  const checkbox = document.getElementById(tipo);

  if (checkbox.checked) {
    selectedSolicitacoes[tipo] = true;
  } else {
    delete selectedSolicitacoes[tipo];
  }
}

function expand(tipo) {
  const contentDiv = document.getElementById(`${tipo}Content`);
  contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
}

function updateInputValue(tipo) {
  const input = document.getElementById(`${tipo}Input`);
  inputValueCache[tipo] = input.value;
}

// Enviar email
function submitSolicitacoes() {
  let emailBody = 'Solicitações selecionadas:<br><br>';

  Object.keys(selectedSolicitacoes).forEach(tipo => {
    const solicitacao = solicBruto.find(s => s.tipo === tipo);
    const nome = solicitacao ? solicitacao.nome : 'Não encontrado';
    const inputValue = inputValueCache[tipo] || 'Não preenchido';

    emailBody += `${nome}: ${inputValue}<br>`;
  });
  let emailTo = false;
  switch (document.querySelector("#setorMenu").value) {
    case "1":
      emailTo = "nustenil@ifce.edu.br";
      break;
    // TODO: adicionar os outros emails
    case "5":
      emailTo = "luanventurafm29@gmail.com";
      break;
    default:
      alert("Selecione um destino!");
  }
  if (emailTo)
  {
    if (Object.keys(selectedSolicitacoes).length > 0) {
      Email.send({
        SecureToken: "57e3ec1f-ff52-4e88-b9e6-93e867c733c9",
        To: emailTo,
        From: "luanventuracontato@gmail.com",
        Subject: "Solicitação",
        Body: emailBody,
    })
        .then(function (message) {
            alert(`Email enviado para ${emailTo}:\n\n${emailBody}`)
        });
    } else {
      alert('Nenhuma solicitação selecionada.');
    }
  }
}

// Animação quando a caixa de pesquisa está em foco

function hideWelcome() {
  let texto = document.querySelector(".bemvindo");
  let searchBox = document.querySelector(".searchBox");
  let solicitacoesContainer = document.querySelector("#solicitacoesContainer");
  let submitButton = document.querySelector(".submit");
  let setorBox = document.querySelector(".setorBox");
  if (!texto.classList.contains("hide")) {
    texto.classList.add("hide");
    searchBox.classList.add("move");
    solicitacoesContainer.classList.add("move");
    submitButton.classList.add("move");
    setorBox.classList.add("move");
  }
}