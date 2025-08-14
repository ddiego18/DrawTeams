const jogadorInput = document.getElementById('jogador-input');
const pontuacaoInput = document.getElementById('pontuacao-input');
const adicionarBtn = document.getElementById('adicionar-btn');
const listaJogadoresUl = document.getElementById('lista-jogadores');
const limparSorteioBtn = document.getElementById('limpar-sorteio-btn');
const tempoPartidaInput = document.getElementById('tempo-partida-input');
const alarmeAudio = document.getElementById('alarme-audio');
const goleiroCheckbox = document.getElementById('goleiro-checkbox');

const jogadoresPorEquipeInput = document.getElementById('jogadores-por-equipe-input');
const sortearBtn = document.getElementById('sortear-btn');
const equipesSorteadasDiv = document.getElementById('equipes-sorteadas');

const cronometroDisplay = document.getElementById('cronometro-display');
const iniciarBtn = document.getElementById('iniciar-btn');
const pausarBtn = document.getElementById('pausar-btn');
const zerarBtn = document.getElementById('zerar-btn');

let jogadores = [
    { nome: 'Adeilson', pontuacao: 1, isGoleiro: false },
    { nome: 'Baiano', pontuacao: 1, isGoleiro: false },
    { nome: 'Bruno', pontuacao: 1, isGoleiro: false },
    { nome: 'Charlison', pontuacao: 1, isGoleiro: false },
    { nome: 'Ci', pontuacao: 1, isGoleiro: false },
    { nome: 'Demerson', pontuacao: 1, isGoleiro: false },
    { nome: 'Denilson', pontuacao: 1, isGoleiro: false },
    { nome: 'Diego', pontuacao: 1, isGoleiro: true },
    { nome: 'Lucas', pontuacao: 1, isGoleiro: true },
    { nome: 'Lukinhas', pontuacao: 1, isGoleiro: false },
    { nome: 'Markin', pontuacao: 1, isGoleiro: false },
    { nome: 'Matheus', pontuacao: 1, isGoleiro: false },
    { nome: 'Matheus Lima', pontuacao: 1, isGoleiro: false },
    { nome: 'Pedrinho', pontuacao: 1, isGoleiro: false },
    { nome: 'Ricardo', pontuacao: 1, isGoleiro: false },
    { nome: 'Rodrigo (Tinin)', pontuacao: 1, isGoleiro: false },
    { nome: 'Rodrigo Barreto', pontuacao: 1, isGoleiro: false },
    { nome: 'Samuel', pontuacao: 1, isGoleiro: false },
    { nome: 'Victor', pontuacao: 1, isGoleiro: false },
    { nome: 'Willian', pontuacao: 1, isGoleiro: false },
    { nome: 'Willian goleiro', pontuacao: 1, isGoleiro: true },
    { nome: 'Zuntão', pontuacao: 1, isGoleiro: false }
];

let cronometroInterval;
let segundos = 0;
let minutos = 0;
let cronometroRodando = false;
jogadoresPorEquipeInput.value = 5;

atualizarListaJogadores();

function adicionarJogador() {
    const nomeJogador = jogadorInput.value.trim();
    const pontuacaoJogador = parseInt(pontuacaoInput.value);
    const ehGoleiro = goleiroCheckbox.checked;

    if (nomeJogador && !isNaN(pontuacaoJogador)) {
        jogadores.push({ nome: nomeJogador, pontuacao: pontuacaoJogador, isGoleiro: ehGoleiro });
        jogadorInput.value = '';
        pontuacaoInput.value = 1;
        goleiroCheckbox.checked = false;
        atualizarListaJogadores();
    } else {
        alert("Por favor, digite o nome e uma pontuação válida para o jogador.");
    }
}

function limparSorteio() {
    equipesSorteadasDiv.innerHTML = '';
}

function atualizarListaJogadores() {
    listaJogadoresUl.innerHTML = '';
    jogadores.sort((a, b) => b.isGoleiro - a.isGoleiro || a.nome.localeCompare(b.nome));
    
    jogadores.forEach((jogador, index) => {
        const li = document.createElement('li');
        const nomeSpan = document.createElement('span');
        nomeSpan.textContent = `${jogador.nome} (Pontuação: ${jogador.pontuacao})`;
        nomeSpan.classList.add('player-name');

        if (jogador.isGoleiro) {
            const goleiroSpan = document.createElement('span');
            goleiroSpan.textContent = '(G)';
            goleiroSpan.classList.add('goleiro-indicator');
            nomeSpan.appendChild(goleiroSpan);
        }
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.classList.add('edit-btn');
        
        const excluirBtn = document.createElement('button');
        excluirBtn.textContent = 'X';
        excluirBtn.classList.add('excluir-btn');

        li.appendChild(editBtn);
        li.appendChild(excluirBtn);
        li.appendChild(nomeSpan);
        listaJogadoresUl.appendChild(li);
    });
}

function excluirJogador(index) {
    jogadores.splice(index, 1);
    atualizarListaJogadores();
}

function sortearEquipes() {
    const jogadoresPorEquipe = parseInt(jogadoresPorEquipeInput.value);
    if (isNaN(jogadoresPorEquipe) || jogadoresPorEquipe < 2) { /* ... */ return; }

    const goleiros = jogadores.filter(j => j.isGoleiro);
    const jogadoresDeLinha = jogadores.filter(j => !j.isGoleiro);

    goleiros.sort((a, b) => b.pontuacao - a.pontuacao);
    jogadoresDeLinha.sort((a, b) => b.pontuacao - a.pontuacao);

    const numEquipes = Math.floor(jogadores.length / jogadoresPorEquipe);
    if (numEquipes === 0) {
        alert("Não há jogadores suficientes para formar nenhuma equipe completa.");
        return;
    }
    const equipes = Array.from({ length: numEquipes }, (_, i) => ({
        nome: `Equipe ${i + 1}`,
        jogadores: [],
        pontuacaoTotal: 0
    }));

    goleiros.forEach((goleiro, index) => {
        if (index < numEquipes) { 
            equipes[index].jogadores.push(goleiro);
            equipes[index].pontuacaoTotal += goleiro.pontuacao;
        }
    });

    let indiceJogadorDeLinha = 0;
    let preenchendo = true;
    while (preenchendo) {
        let jogadoresAdicionadosNestaVolta = 0;

        for (let i = 0; i < numEquipes; i++) {
            if (equipes[i].jogadores.length < jogadoresPorEquipe && indiceJogadorDeLinha < jogadoresDeLinha.length) {
                const jogador = jogadoresDeLinha[indiceJogadorDeLinha++];
                equipes[i].jogadores.push(jogador);
                equipes[i].pontuacaoTotal += jogador.pontuacao;
                jogadoresAdicionadosNestaVolta++;
            }
        }

        for (let i = numEquipes - 1; i >= 0; i--) {
            if (equipes[i].jogadores.length < jogadoresPorEquipe && indiceJogadorDeLinha < jogadoresDeLinha.length) {
                const jogador = jogadoresDeLinha[indiceJogadorDeLinha++];
                equipes[i].jogadores.push(jogador);
                equipes[i].pontuacaoTotal += jogador.pontuacao;
                jogadoresAdicionadosNestaVolta++;
            }
        }
        
        if (jogadoresAdicionadosNestaVolta === 0) {
            preenchendo = false;
        }
    }
    
    const jogadoresAlocados = equipes.reduce((acc, equipe) => acc + equipe.jogadores.length, 0);
    const todosOsOrdenados = [...goleiros, ...jogadoresDeLinha];
    
    const jogadoresRestantes = jogadores.filter(j => 
        !equipes.some(e => e.jogadores.some(p => p.nome === j.nome))
    );

    if (jogadoresRestantes.length > 0) {
        equipes.push({
            nome: "Sobrando",
            jogadores: jogadoresRestantes,
            pontuacaoTotal: jogadoresRestantes.reduce((soma, j) => soma + j.pontuacao, 0)
        });
    }

    exibirEquipes(equipes);
}

function exibirEquipes(equipes) {
    equipesSorteadasDiv.innerHTML = '';

    equipes.forEach(equipe => {
        const divEquipe = document.createElement('div');
        divEquipe.classList.add('equipe');
        const h3 = document.createElement('h3');
        h3.textContent = `${equipe.nome} (Total: ${equipe.pontuacaoTotal})`;
        divEquipe.appendChild(h3);
        const ul = document.createElement('ul');
        equipe.jogadores.forEach(jogador => {
            const li = document.createElement('li');
            li.textContent = `${jogador.nome} (${jogador.pontuacao})`;
            ul.appendChild(li);
        });
        divEquipe.appendChild(ul);
        equipesSorteadasDiv.appendChild(divEquipe);
    });
}

function formatarTempo(valor) { return valor < 10 ? `0${valor}` : valor; }
function atualizarDisplay() { cronometroDisplay.textContent = `${formatarTempo(minutos)}:${formatarTempo(segundos)}`; }

function iniciarCronometro() {
    if (!cronometroRodando) {
        tempoAlarme = parseInt(tempoPartidaInput.value);

        if (isNaN(tempoAlarme) || tempoAlarme <= 0) {
            alert("Por favor, defina um tempo de partida válido.");
            return;
        }

        cronometroRodando = true;
        cronometroInterval = setInterval(() => {
            segundos++;
            if (segundos === 60) {
                segundos = 0;
                minutos++;
            }
            atualizarDisplay();

            if (minutos >= tempoAlarme) {
                alarmeAudio.play();
                cronometroDisplay.classList.add('alarme-ativo');
                clearInterval(cronometroInterval);
                cronometroRodando = false;
            }
        }, 1000);
    }
}

function pausarCronometro() {
    clearInterval(cronometroInterval);
    cronometroRodando = false;
    alarmeAudio.pause();
    alarmeAudio.currentTime = 0;
}

function zerarCronometro() {
    pausarCronometro();
    segundos = 0;
    minutos = 0;
    atualizarDisplay();

    cronometroDisplay.classList.remove('alarme-ativo');
    alarmeAudio.pause();
    alarmeAudio.currentTime = 0;
}

adicionarBtn.addEventListener('click', adicionarJogador);
sortearBtn.addEventListener('click', sortearEquipes);
limparSorteioBtn.addEventListener('click', limparSorteio);
iniciarBtn.addEventListener('click', iniciarCronometro);
pausarBtn.addEventListener('click', pausarCronometro);
zerarBtn.addEventListener('click', zerarCronometro);

listaJogadoresUl.addEventListener('click', (event) => {
    const targetButton = event.target.closest('button');
    if (!targetButton) return;

    const li = targetButton.closest('li');
    const index = Array.from(listaJogadoresUl.children).indexOf(li);

    if (targetButton.classList.contains('excluir-btn')) {
        excluirJogador(index);
        return;
    }

    if (targetButton.classList.contains('edit-btn')) {
        const nameSpan = li.querySelector('.player-name');
        const jogadorAtual = jogadores[index];

        li.querySelector('.edit-btn').style.display = 'none';
        li.querySelector('.excluir-btn').style.display = 'none';

        const inputNome = document.createElement('input');
        inputNome.type = 'text';
        inputNome.value = jogadorAtual.nome;
        inputNome.classList.add('edit-input');

        const inputPontuacao = document.createElement('input');
        inputPontuacao.type = 'number';
        inputPontuacao.value = jogadorAtual.pontuacao;
        inputPontuacao.min = 1;
        inputPontuacao.max = 10;
        inputPontuacao.classList.add('edit-input');

        const btnSalvar = document.createElement('button');
        btnSalvar.textContent = 'Salvar';
        btnSalvar.classList.add('salvar-btn');

        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.classList.add('cancelar-btn');
        
        nameSpan.innerHTML = ''; 
        nameSpan.appendChild(inputNome);
        nameSpan.appendChild(inputPontuacao);
        nameSpan.appendChild(btnSalvar);
        nameSpan.appendChild(btnCancelar);
        inputNome.focus();
    }

    if (targetButton.classList.contains('salvar-btn')) {
        const inputNome = li.querySelector('.edit-input[type="text"]');
        const inputPontuacao = li.querySelector('.edit-input[type="number"]');
        
        const novoNome = inputNome.value.trim();
        const novaPontuacao = parseInt(inputPontuacao.value);

        if (novoNome && !isNaN(novaPontuacao)) {
            jogadores[index] = { nome: novoNome, pontuacao: novaPontuacao };
        }
        atualizarListaJogadores();
    }

    if (targetButton.classList.contains('cancelar-btn')) {
        atualizarListaJogadores();
    }
});