const conexao = require('../conexao.js');
const securePassword = require('secure-password');

const pwd = securePassword();

const cadastrarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório.');
    }
    if (!nome_loja) {
        return res.status(404).json('O campo Nome da Loja é obrigatório.');
    }
    if (!email) {
        return res.status(404).json('O campo Email é obrigatório.');
    }
    if (!senha) {
        return res.status(404).json('O campo de Senha é obrigatório.');
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const queryConsultaEmail = 'SELECT * FROM usuarios WHERE email = $1';
        const { rowCount: qtdUsuario} = await conexao.query(queryConsultaEmail, [email]);

        if (qtdUsuario > 0) {
            return res.status(400).json('O email cadastrado já existe.');
        }

        const query = 'INSERT INTO usuarios (nome, nome_loja, email, senha) VALUES ($1, $2, $3, $4)';
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, hash]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');

    } catch (error) {
        return res.status(error.message);
    }
}

const obterUsuario = async (req, res) => {
   const { usuario } = req;
   
   return res.status(200).json(usuario);
}

const editarUsuario = async (req, res) => {
    const { usuario } = req;
    const { nome, nome_loja, email, senha } = req.body;
    
    try {
        if (!nome && !nome_loja && !email && !senha) {
            return res.status(400).json('Você deve fornecer os dados para alteração.');
        }
        if (nome) {
            const query = "UPDATE usuarios SET nome = $1 WHERE id = $2";
            const { rowCount } = await conexao.query(query, nome, usuario.id);
            
            if (rowCount === 0) {
                return res.status(400).json("Não foi possível alterar o nome.");
            }
            return res.status(200).json("Nome alterado com sucesso.");
        }
        if (nome_loja) {
            const query = "UPDATE usuarios SET nome_loja = $1 WHERE id = $2";
            const { rowCount } = await conexao.query(query, nome_loja, id);
            
            if (rowCount === 0) {
                return res.status(400).json("Não foi possível alterar o nome da loja.");
            }
            return res.status(200).json("Nome da loja alterada com sucesso.");
        }
        if (email) {
            const query = "UPDATE usuarios SET email = $1 WHERE id = $2";
            const { rowCount } = await conexao.query(query, email, id);
            
            if (rowCount === 0) {
                return res.status(400).json("Não foi possível alterar o email.");
            }
            return res.status(200).json("Email alterado com sucesso.");
        }
        if (senha) {
            const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
            const query = "UPDATE usuarios SET senha = $1 WHERE id = $2";
            const { rowCount } = await conexao.query(query, hash, id);
            
            if (rowCount === 0) {
                return res.status(400).json("Não foi possível alterar a senha.");
            }
            return res.status(200).json("Senha alterada com sucesso.");
        }

    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterUsuario,
    editarUsuario
}