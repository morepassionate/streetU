 

const re = /\S+@\S+\.\S+/;

const nextErrors = {};

const validateEmail = (txt) => {
    if (!txt) return nextErrors.email = "Obrigatório informar o email !";
    if (!re.test(txt)) return nextErrors.email = "Insira um e-mail válido !";
    if (txt && re.test(txt)) return nextErrors.email = true;
}

const validateSenha = (txt) => {
    if (!txt) return nextErrors.senha = "Obrigatório informar a senha !";
    if (txt.length < 5) return nextErrors.senha = "Senha precisa de no mínimo de 6 caracteres !";
    if (txt && txt.length) return nextErrors.senha = true;
}

const validateConfirmationSenha = (txt, senha) => {
    if (!txt) return nextErrors.confirmSenha = "Obrigatório informar a mesma senha !";
    if (txt.length < 5) return nextErrors.confirmSenha = "Senha precisa de no mínimo de 6 caracteres !";
    if (txt !== senha) return nextErrors.confirmSenha = "As senhas não coincidem!";
    if (txt && txt.length && txt === senha) return nextErrors.confirmSenha = true;
}

const validateNome = (txt) => {
    if (!txt) return nextErrors.nome = "Obrigatório informar o nome !";
    if (txt.length < 4) return nextErrors.nome = "Insira seu nome completo, por favor !";
    if (txt && txt.length) return nextErrors.nome = true;
}

const validateCelular = (txt) => {
    if (!txt) return nextErrors.celular = "Obrigatório informar o número !";
    if (txt) return nextErrors.celular = true;
}  
