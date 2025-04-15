Parse.initialize("H3GRve4kYM8gv7XXVmXEFW6K7YLw6MIcieiU1OPp", "rcRV7nu2Y6PWMg0DboqC91Evb3z1WvXSA1iogMPD");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', function() {

    const inputPesquisa = document.querySelector('input[type="pesquisa"]');
    const botaoPesquisa = document.querySelector('.btn-pesquisa');
    const listaUltimasPostagens = document.getElementById('listaUltimasPostagens'); // Assumindo que sua lista tem este ID
    const clearIcon = document.querySelector('.clear-icon'); // Adicionei a declaração do clearIcon aqui

    async function buscarUltimasSolicitacoes() {
        const Solicitacao = Parse.Object.extend("solicitacao");
        const query = new Parse.Query(Solicitacao);
        query.descending("createdAt");
        query.limit(10);

        try {
            const results = await query.find();
            exibirSolicitacoes(results);
        } catch (error) {
            console.error("Erro ao buscar as últimas solicitações:", error);
            listaUltimasPostagens.innerHTML = '<li>Erro ao carregar as solicitações.</li>';
        }
    }

    function exibirSolicitacoes(solicitacoes) {
        listaUltimasPostagens.innerHTML = ''; // Limpa a lista

        if (solicitacoes.length > 0) {
            solicitacoes.forEach(solicitacao => {
                const titulo = solicitacao.get("titulo");
                const objectId = solicitacao.id;

                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `resposta.html?id=${objectId}`;
                link.textContent = titulo;
                listItem.appendChild(link);
                listaUltimasPostagens.appendChild(listItem);
            });
        } else {
            listaUltimasPostagens.innerHTML = '<li>Nenhuma solicitação encontrada.</li>';
        }
    }

    async function pesquisarSolicitacoes() {
        console.log('Botão pesquisar clicado!');
        const termoPesquisa = inputPesquisa.value.trim();
        const termoRegex = new RegExp(termoPesquisa, 'i');
    
        const Solicitacao = Parse.Object.extend("solicitacao");
        const Resposta = Parse.Object.extend("Respostas");
    
        const querySolicitacao = new Parse.Query(Solicitacao);
        querySolicitacao.matches("titulo", termoRegex);
    
        const queryConteudoSolicitacao = new Parse.Query(Solicitacao);
        queryConteudoSolicitacao.matches("solicitacao_conteudo", termoRegex);
    
        const queryRespostas = new Parse.Query(Resposta);
        queryRespostas.matches("conteudo_resposta", termoRegex);
        // Assumindo que há um campo na classe "Respostas" que referencia a "solicitacao"
        queryRespostas.include("solicitacao"); // Inclui a solicitação relacionada
    
        try {
            const solicitacoesEncontradas = await Parse.Query.or(querySolicitacao, queryConteudoSolicitacao).find();
            const respostasEncontradas = await queryRespostas.find();
    
            // Extrai as solicitações relacionadas das respostas encontradas
            const solicitacoesDasRespostas = respostasEncontradas.map(resposta => resposta.get("solicitacao")).filter(solicitacao => solicitacao);
    
            // Combina os resultados e remove duplicatas (usando um Set)
            const todasSolicitacoesEncontradas = [...new Set([...solicitacoesEncontradas, ...solicitacoesDasRespostas])];
    
            // Ordena os resultados por data de criação (se necessário)
            todasSolicitacoesEncontradas.sort((a, b) => b.get("createdAt") - a.get("createdAt"));
    
            console.log('Resultados da busca (incluindo respostas):', todasSolicitacoesEncontradas);
            exibirSolicitacoes(todasSolicitacoesEncontradas.slice(0, 10)); // Aplica o limite após combinar
    
        } catch (error) {
            console.error("Erro ao buscar solicitações (incluindo respostas):", error);
            listaUltimasPostagens.innerHTML = '<li>Erro ao realizar a busca.</li>';
        }
    }

    inputPesquisa.addEventListener('input', function() {
        clearIcon.style.display = this.value ? 'block' : 'none';
    });

    clearIcon.addEventListener('click', function() {
        inputPesquisa.value = '';
        clearIcon.style.display = 'none';
        buscarUltimasSolicitacoes(); // Recarrega a lista original
    });

    // Adiciona um ouvinte de evento de clique ao botão de pesquisa
    botaoPesquisa.addEventListener('click', pesquisarSolicitacoes);

    // Carrega as últimas solicitações ao carregar a página
    buscarUltimasSolicitacoes();

});