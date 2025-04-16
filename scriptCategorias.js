// scriptCategorias.js

Parse.initialize("BAEFn0L1NuWmT3KSiQY7LZX0yFEA0lzQWgSnReeO", "TxYFJkMIjKNzhSujfhx17x1t47xqEEeM5Kdo4KTT");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', function() {
    const botoesCategoria = document.querySelectorAll('.categoria-button');
    const listaUltimasPostagens = document.getElementById('listaUltimasPostagens'); // Certifique-se de que este ID corresponde ao da sua lista

    let categoriaAtiva = 'todos'; // Inicializa com 'todos' para exibir todas as categorias

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
                btn.classList.remove('categoria-button-ativo');
            });

            // Adiciona a classe ativa no botão clicado
            this.classList.add('categoria-button-ativo');
            categoriaAtiva = categoriaSelecionada;
            buscarSolicitacoesPorCategoria(categoriaSelecionada); // Filtra pela categoria selecionada
        });
    });

    // Carregar todas as solicitações inicialmente e marcar o botão "Todas" como ativo (se existir)
    buscarSolicitacoesPorCategoria('todos').then(() => {
        const botaoTodos = Array.from(botoesCategoria).find(botao => botao.dataset.categoria === 'todos');
        if (botaoTodos) {
            botaoTodos.classList.add('categoria-button-ativo');
        } else if (botoesCategoria.length > 0) {
            // Se não houver botão "Todas", marca o primeiro botão como ativo por padrão
            botoesCategoria[0].classList.add('categoria-button-ativo');
            categoriaAtiva = botoesCategoria[0].dataset.categoria;
        }
    });
});