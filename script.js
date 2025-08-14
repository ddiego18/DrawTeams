const jogadorInput = document.getElementById('jogador-input');
const adicionarBtn = document.getElementById('adicionar-btn');
const listaJogadoresUl = document.getElementById('lista-jogadores');
const limparSorteioBtn = document.getElementById('limpar-sorteio-btn');
const tempoPartidaInput = document.getElementById('tempo-partida-input');
const alarmeAudio = document.getElementById('alarme-audio');

const jogadoresPorEquipeInput = document.getElementById('jogadores-por-equipe-input');
const sortearBtn = document.getElementById('sortear-btn');
const equipesSorteadasDiv = document.getElementById('equipes-sorteadas');

const cronometroDisplay = document.getElementById('cronometro-display');
const iniciarBtn = document.getElementById('iniciar-btn');
const pausarBtn = document.getElementById('pausar-btn');
const zerarBtn = document.getElementById('zerar-btn');

let jogadores = ['Diego', 'Demerson', 'Denilson', 'Matheus', 'Lucas', 'Bruno', 'Baiano', 'Pedrinho', 'Likinhas', 'Ci', 'Adeilson', 'Matheus Lima', 'Victor', 'Willian', 'Charlison', 'Zuntão', 'Rodrigo Barreto', 'Rodrigo', 'Samuel', 'Willian goleiro', 'Markin'];
let cronometroInterval;
let segundos = 0;
let minutos = 0;
let cronometroRodando = false;
jogadoresPorEquipeInput.value = 4;

atualizarListaJogadores();

function adicionarJogador() {
    const nomeJogador = jogadorInput.value.trim();
    
    if (nomeJogador) {
        jogadores.push(nomeJogador);
        jogadorInput.value = '';
        atualizarListaJogadores();
    } else {
        alert("Por favor, digite o nome do jogador.");
    }
}

function limparSorteio() {
    equipesSorteadasDiv.innerHTML = '';
}

function atualizarListaJogadores() {
    listaJogadoresUl.innerHTML = ''; 
    jogadores.forEach((jogador, index) => {
        const li = document.createElement('li');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.dataset.index = index;

        const excluirBtn = document.createElement('button');
        excluirBtn.textContent = 'X';
        excluirBtn.classList.add('excluir-btn');
        excluirBtn.dataset.index = index;
        
        const nomeSpan = document.createElement('span');
        nomeSpan.textContent = jogador;
        nomeSpan.classList.add('player-name');
        
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

    if (isNaN(jogadoresPorEquipe) || jogadoresPorEquipe < 2) {
        alert("Por favor, insira um número de jogadores por equipe válido (pelo menos 2).");
        return;
    }
    
    if (jogadores.length < jogadoresPorEquipe) {
        alert("Não há jogadores suficientes para formar sequer uma equipe completa.");
        return;
    }

    const jogadoresEmbaralhados = [...jogadores];
    for (let i = jogadoresEmbaralhados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jogadoresEmbaralhados[i], jogadoresEmbaralhados[j]] = [jogadoresEmbaralhados[j], jogadoresEmbaralhados[i]];
    }

    const equipes = [];
    let jogadoresAlocados = 0;

    const numEquipesCompletas = Math.floor(jogadores.length / jogadoresPorEquipe);
    for (let i = 0; i < numEquipesCompletas; i++) {
        const time = jogadoresEmbaralhados.slice(jogadoresAlocados, jogadoresAlocados + jogadoresPorEquipe);
        equipes.push(time);
        jogadoresAlocados += jogadoresPorEquipe;
    }

    const jogadoresRestantes = jogadores.length % jogadoresPorEquipe;
    if (jogadoresRestantes > 0) {
        const timeRestante = jogadoresEmbaralhados.slice(jogadoresAlocados);
        equipes.push(timeRestante);
    }

    exibirEquipes(equipes);
}

function exibirEquipes(equipes) {
    equipesSorteadasDiv.innerHTML = '';

    equipes.forEach((equipe, index) => {
        const divEquipe = document.createElement('div');
        divEquipe.classList.add('equipe');
        const h3 = document.createElement('h3');
        h3.textContent = `Equipe ${index + 1}`;
        divEquipe.appendChild(h3);
        const ul = document.createElement('ul');
        equipe.forEach(jogador => {
            const li = document.createElement('li');
            li.textContent = jogador;
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
        cronometroInterval = setInterval(() => {
            segundos++;
            if (segundos === 60) { segundos = 0; minutos++; }
            atualizarDisplay();
        }, 1000);
        cronometroRodando = true;
    }
}

listaJogadoresUl.addEventListener('click', (event) => {
    const targetButton = event.target.closest('button');

    if (!targetButton) {
        return;
    }
    
    const index = parseInt(targetButton.dataset.index);

    if (targetButton.classList.contains('excluir-btn')) {
        excluirJogador(index);
    }

    if (targetButton.classList.contains('edit-btn')) {
        const li = targetButton.closest('li');
        const nameSpan = li.querySelector('.player-name');

        const nomeAtual = jogadores[index];
        const input = document.createElement('input');
        input.type = 'text';
        input.value = nomeAtual;
        input.classList.add('edit-input');

        nameSpan.replaceWith(input);
        input.focus();

        const salvarEdicao = () => {
            const novoNome = input.value.trim();
            if (novoNome) {
                jogadores[index] = novoNome;
            }
            atualizarListaJogadores();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                salvarEdicao();
            } else if (e.key === 'Escape') {
                atualizarListaJogadores();
            }
        });
        input.addEventListener('blur', salvarEdicao);
    }
});

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
iniciarBtn.addEventListener('click', iniciarCronometro);
pausarBtn.addEventListener('click', pausarCronometro);
zerarBtn.addEventListener('click', zerarCronometro);
limparSorteioBtn.addEventListener('click', limparSorteio);