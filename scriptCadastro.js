// scriptCadastro.js

Parse.initialize("BAEFn0L1NuWmT3KSiQY7LZX0yFEA0lzQWgSnReeO", "TxYFJkMIjKNzhSujfhx17x1t47xqEEeM5Kdo4KTT");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const nomeUsuarioInput = document.getElementById('nomeUsuarioCadastro');
    const emailInput = document.getElementById('novoUsuario');
    const senhaInput = document.getElementById('novaSenha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const mensagemErro = document.createElement('p'); // Elemento para exibir mensagens de erro

    mensagemErro.style.color = 'red';
    mensagemErro.style.marginTop = '10px';
    mensagemErro.style.textAlign = 'center';

    cadastroForm.parentNode.insertBefore(mensagemErro, cadastroForm); // Adiciona a mensagem de erro antes do formulário

    cadastroForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nomeUsuario = nomeUsuarioInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        mensagemErro.textContent = ''; // Limpa qualquer mensagem de erro anterior

        if (!nomeUsuario) {
            mensagemErro.textContent = 'Por favor, insira um nome de usuário.';
            return;
        }

        if (!email) {
            mensagemErro.textContent = 'Por favor, insira seu email.';
            return;
        }

        if (!senha) {
            mensagemErro.textContent = 'Por favor, insira uma senha.';
            return;
        }

        if (senha !== confirmarSenha) {
            mensagemErro.textContent = 'As senhas não coincidem.';
            return;
        }

        const Usuario = Parse.Object.extend("usuarios");
        const novoUsuario = new Usuario();

        novoUsuario.set("nome", nomeUsuario);
        novoUsuario.set("email", email);
        novoUsuario.set("senha", senha); // Salve a senha (considere a segurança: hashing no cliente ou Cloud Function)

        try {
            const result = await novoUsuario.save();
            console.log('Usuário cadastrado com sucesso na classe "usuarios":', result);
            localStorage.setItem('nomeUsuario', nomeUsuario);
            window.location.href = 'home.html'; // Redirecione para a página principal após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar o usuário na classe "usuarios":', error);
            // Adapte as mensagens de erro conforme as restrições da sua classe "usuarios"
            if (error.message.includes("duplicate value")) {
                if (error.message.includes("nome")) {
                    mensagemErro.textContent = 'Nome de usuário já existe.';
                } else if (error.message.includes("email")) {
                    mensagemErro.textContent = 'Email já existe.';
                } else {
                    mensagemErro.textContent = 'Erro ao cadastrar. Valor duplicado encontrado.';
                }
            } else {
                mensagemErro.textContent = 'Erro ao cadastrar. Por favor, tente novamente.';
            }
        }
    });
});