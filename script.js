let totalHoras = 0;
let totalMinutos = 0;
const horariosAdicionados = []; // Armazena os horários válidos

document.getElementById('horas-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtendo os horários de entrada e saída
    const entrada = document.getElementById('entrada').value;
    const saida = document.getElementById('saida').value;

    if (entrada && saida) {
        // Calculando a diferença de horas
        const { horas, minutos } = calcularHorasTrabalhadas(entrada, saida);
        
        // Adicionando à lista de horários
        const listaHorarios = document.getElementById('lista-horarios');
        const li = document.createElement('li');
        li.textContent = `Entrada: ${entrada} - Saída: ${saida} | Total: ${horas} horas e ${minutos} minutos`;

        // Criando o botão de excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('delete');
        btnExcluir.onclick = function() {
            // Removendo o horário e recalculando o total
            listaHorarios.removeChild(li);
            subtrairHoras(horas, minutos);

            // Removendo o horário do array de horários válidos
            const index = horariosAdicionados.findIndex(item => item.entrada === entrada && item.saida === saida);
            if (index !== -1) {
                horariosAdicionados.splice(index, 1);
            }
        };

        li.appendChild(btnExcluir);
        listaHorarios.appendChild(li);

        // Atualizando o total de horas
        adicionarHoras(horas, minutos);

        // Adicionando o registro ao array de horários válidos
        horariosAdicionados.push({ entrada, saida, horas, minutos });

        // Limpando os campos de entrada e saída
        document.getElementById('entrada').value = '';
        document.getElementById('saida').value = '';

        // Focando no campo de entrada novamente
        document.getElementById('entrada').focus();
    }
});

// Função para calcular a diferença de horas entre entrada e saída
function calcularHorasTrabalhadas(entrada, saida) {
    const [entradaHora, entradaMinuto] = entrada.split(':').map(Number);
    const [saidaHora, saidaMinuto] = saida.split(':').map(Number);

    const minutosEntrada = entradaHora * 60 + entradaMinuto;
    const minutosSaida = saidaHora * 60 + saidaMinuto;

    let diferencaMinutos = minutosSaida - minutosEntrada;

    if (diferencaMinutos < 0) {
        diferencaMinutos += 24 * 60; // Adiciona 24 horas em minutos
    }

    const horas = Math.floor(diferencaMinutos / 60);
    const minutos = diferencaMinutos % 60;

    return { horas, minutos };
}

// Função para adicionar as horas ao total
function adicionarHoras(horasTrabalhadas, minutosTrabalhados) {
    totalHoras += horasTrabalhadas;
    totalMinutos += minutosTrabalhados;

    if (totalMinutos >= 60) {
        totalHoras += Math.floor(totalMinutos / 60);
        totalMinutos = totalMinutos % 60;
    }

    atualizarExibicaoTotal();
}

// Função para subtrair as horas do total
function subtrairHoras(horasTrabalhadas, minutosTrabalhados) {
    totalHoras -= horasTrabalhadas;
    totalMinutos -= minutosTrabalhados;

    if (totalMinutos < 0) {
        totalHoras -= 1;
        totalMinutos += 60;
    }

    atualizarExibicaoTotal();
}

// Função para atualizar a exibição do total de horas
function atualizarExibicaoTotal() {
    document.getElementById('total-horas').textContent = `${totalHoras} horas e ${totalMinutos} minutos`;
}

// Função para exportar a planilha
document.getElementById('exportar-planilha').addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Entrada,Saída,Total de Horas,Total de Minutos\n";

    horariosAdicionados.forEach(function(item) {
        csvContent += `${item.entrada},${item.saida},${item.horas},${item.minutos}\n`;
    });

    csvContent += `,Total de Horas,${totalHoras},Total de Minutos,${totalMinutos}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'horarios_trabalhados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
