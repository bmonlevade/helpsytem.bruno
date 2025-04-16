document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    let mensagemErro = null;

    console.log('DOMContentLoaded executado!');

    if (loginForm) {
        mensagemErro = document.createElement('p');
        mensagemErro.classList.add('erro-login');
        loginForm.parentNode.insertBefore(mensagemErro, loginForm);
        mensagemErro.style.display = 'none';

        loginForm.addEventListener('submit', function(event) {
            console.log('Evento submit acionado!');
            event.preventDefault();
            console.log('preventDefault executado!');

            const email = document.getElementById('usuario').value;
            const senhaDigitada = document.getElementById('senha').value;

            console.log('Usuário digitado:', email);
            console.log('Senha digitada:', senhaDigitada);

            // Inicialize o Parse com suas Application ID e JavaScript Key do Back4App
            Parse.initialize("BAEFn0L1NuWmT3KSiQY7LZX0yFEA0lzQWgSnReeO", "TxYFJkMIjKNzhSujfhx17x1t47xqEEeM5Kdo4KTT");
            Parse.serverURL = 'https://parseapi.back4app.com/';

            const Usuarios = Parse.Object.extend("usuarios");
            const query = new Parse.Query(Usuarios);
            query.equalTo("email", email);

            query.first()
                .then((usuario) => {
                    if (usuario) {
                        const senhaBanco = usuario.get("senha"); // Assumindo que o campo da senha se chama "senha"
                        const nomeUsuario = usuario.get("nome"); // Assumindo que o campo do nome se chama "nome"

                        if (senhaDigitada === senhaBanco) {
                            // Login bem-sucedido
                            localStorage.setItem('nomeUsuario', nomeUsuario);
                            window.location.href = 'home.html';
                        } else {
                            // Senha incorreta
                            console.log('Senha incorreta!');
                            if (mensagemErro) {
                                mensagemErro.textContent = 'E-mail ou senha incorretos. Verifique!';
                                mensagemErro.style.display = 'block';
                                setTimeout(() => {
                                    mensagemErro.style.display = 'none';
                                }, 3000);
                            } else {
                                console.error('Elemento mensagemErro não foi criado!');
                            }
                        }
                    } else {
                        // Usuário não encontrado com esse e-mail
                        console.log('Usuário não encontrado!');
                        if (mensagemErro) {
                            mensagemErro.textContent = 'E-mail ou senha incorretos. Verifique!';
                            mensagemErro.style.display = 'block';
                            setTimeout(() => {
                                mensagemErro.style.display = 'none';
                            }, 3000);
                        } else {
                            console.error('Elemento mensagemErro não foi criado!');
                        }
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar usuário:", error);
                    if (mensagemErro) {
                        mensagemErro.textContent = 'Ocorreu um erro ao tentar fazer login.';
                        mensagemErro.style.display = 'block';
                        setTimeout(() => {
                            mensagemErro.style.display = 'none';
                        }, 3000);
                    } else {
                        console.error('Elemento mensagemErro não foi criado!');
                    }
                });
            return false; // Evita o recarregamento da página
        });
    } else {
        console.error('Elemento loginForm não encontrado!');
    }
});