const conexao = require('../conexao.js');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_Secret');

const pwd = securePassword();

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        res.status(404).json('Email e Senha são obrigatórios.');
    }

    try {
        const verificarEmail = "SELECT * FROM usuarios WHERE email = $1";
        const { rows, rowCount } = await conexao.query(verificarEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json('O usuário não está registrado no sistema.');
        }

        const usuario = rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));
        
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(203).json('Senha incorreta.');
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
                    const query = "UPDATE usuarios SET senha = $1 WHERE email = $2";
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
        };

        const token = jwt.sign(
            { id: usuario.id }, 
            jwtSecret, 
            { expiresIn: '1d' });

    const { senha: senhaUsuario, ...dadosUsuario } = usuario;
    return res.send({
        dadosUsuario,
        token
    });

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    login
}