// scriptCategorias.js

Parse.initialize("H3GRve4kYM8gv7XXVmXEFW6K7YLw6MIcieiU1OPp", "rcRV7nu2Y6PWMg0DboqC91Evb3z1WvXSA1iogMPD");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', function() {
    const botoesCategoria = document.querySelectorAll('.categoria-button');
    const listaUltimasPostagens = document.getElementById('listaUltimasPostagens'); // Certifique-se de que este ID corresponde ao da sua lista

    let categoriaAtiva = null; // Para rastrear a categoria ativa

    async function buscarSolicitacoesPorCategoria(categoria) {
        console.log('Categoria para buscar:', categoria); // <--- LOG 1: Verificar a categoria que está sendo passada para a função
    
        const Solicitacao = Parse.Object.extend("solicitacao");
        const query = new Parse.Query(Solicitacao);
    
        if (categoria !== 'todos') {
            query.equalTo("categoria", categoria); // Usando o nome correto do campo
            console.log('Query com filtro de categoria:', categoria); // <--- LOG 2: Confirmar que o filtro está sendo aplicado
        } else {
            console.log('Query para todas as categorias'); // <--- LOG 3: Confirmar que não há filtro para "todos"
        }
    
        query.descending("createdAt");
        query.limit(10); // Você pode ajustar o limite conforme necessário
    
        try {
            const results = await query.find();
            console.log('Resultados da busca por categoria:', results); // <--- LOG 4: Ver os resultados da query
            exibirSolicitacoes(results);
        } catch (error) {
            console.error("Erro ao buscar solicitações por categoria:", error);
            listaUltimasPostagens.innerHTML = '<li>Erro ao filtrar as solicitações.</li>';
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
            listaUltimasPostagens.innerHTML = '<li>Nenhuma solicitação encontrada para esta categoria.</li>';
        }
    }

    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault();

            const categoriaSelecionada = this.dataset.categoria; // Pega o valor do atributo data-categoria

            // Remove a classe ativa de qualquer outro botão
            botoesCategoria.forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('categoria-button-ativo');
                }
            });

            // Adiciona/remove a classe ativa no botão clicado
            if (this.classList.contains('categoria-button-ativo') && categoriaAtiva === categoriaSelecionada) {
                this.classList.remove('categoria-button-ativo');
                categoriaAtiva = null; // Desativa o filtro
                buscarSolicitacoesPorCategoria('todos'); // Exibe todas as solicitações
            } else {
                this.classList.add('categoria-button-ativo');
                categoriaAtiva = categoriaSelecionada;
                buscarSolicitacoesPorCategoria(categoriaSelecionada); // Filtra pela categoria selecionada
            }
        });
    });

    // Carregar todas as solicitações inicialmente
    buscarSolicitacoesPorCategoria('todos');
});