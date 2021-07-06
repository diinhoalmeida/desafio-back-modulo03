const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_Secret');
const conexao = require('../conexao');

async function validandoToken(req, res, next){
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json("Token não informado.");
    }
    
    try {
        const token = authorization.replace('Bearer', '').trim();

        const usuarioValidado = jwt.verify(token, jwtSecret);

        const queryUsuarioEncontrado = 'SELECT * FROM usuarios WHERE id = $1';
        const { rows, rowCount } = await conexao.query(queryUsuarioEncontrado, [usuarioValidado.id]);

        if (rowCount === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    validandoToken
}