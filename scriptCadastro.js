// scriptCadastro.js

Parse.initialize("H3GRve4kYM8gv7XXVmXEFW6K7YLw6MIcieiU1OPp", "rcRV7nu2Y6PWMg0DboqC91Evb3z1WvXSA1iogMPD");
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

        const user = new Parse.User();
        user.set("username", nomeUsuario);
        user.set("email", email);
        user.set("password", senha);

        try {
            const newUser = await user.signUp();
            console.log('Usuário cadastrado com sucesso:', newUser);
            localStorage.setItem('nomeUsuario', nomeUsuario);
            window.location.href = 'home.html'; // Redirecione para a página principal após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar o usuário:', error);
            if (error.code === 202) {
                mensagemErro.textContent = 'Nome de usuário já existe.';
            } else if (error.code === 203) {
                mensagemErro.textContent = 'Email já existe.';
            } else {
                mensagemErro.textContent = 'Erro ao cadastrar. Por favor, tente novamente.';
            }
        }
    });
});