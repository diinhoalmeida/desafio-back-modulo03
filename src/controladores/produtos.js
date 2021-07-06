const conexao = require('../conexao.js');

const obterProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await conexao.query('SELECT * FROM produtos WHERE id = $1', [id]);

        if (produto.rowCount === 0) {
            return res.status(404).json("Produto não encontrado");
        }

        return res.status(200).json(produto.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
}

const listarProdutos = async (req, res) => {
    try {
        const { rows: produtos } = await conexao.query('SELECT * FROM produtos');

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const cadastrarProduto = async (req, res) => {
    const { id } = req.usuario;
    const { nome, estoque, categoria, preco, descricao, imagem } = req.body;

    if (!nome || !estoque || !preco || !descricao) {
        return res.status(400).json("Necessário preencher todos os campos.");
    }

    try {
        const produto = await conexao.query('INSERT INTO produtos (usuario_id,nome,estoque,categoria,preco,descricao,imagem) VALUES ($1,$2,$3,$4,$5,$6,$7)',
         [id, nome, estoque, categoria, preco, descricao, imagem]);

        if (produto.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o produto');
        }
        return res.status(200).json('Produto cadastrado com sucesso.')
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { id: idProduto } = req.params;
    const { nome, estoque, categoria, preco, descricao, imagem} = req.body;

    try {
        const produto = await conexao.query('SELECT * FROM produtos WHERE id = $1', [idProduto]);

        if (produto.rowCount === 0) {
            return res.status(404).json("Produto não encontrado");
        }

        if (!nome && !estoque && !categoria && !preco && !descricao && !imagem) {
            return res.status(400).json("Informe os campos a serem alterados.");
        }
        
        if(nome){
            const queryNomeAtualizado = `UPDATE produtos SET nome = $1 WHERE id = $2`;
            const nomeAtualizado = await conexao.query(queryNomeAtualizado, [nome, idProduto]);
        
            if (nomeAtualizado.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar o nome do produto.");
            }

        }

        if(estoque){
            const queryEstoqueAtualizado = `UPDATE produtos SET estoque = $1 WHERE id = $2`;
            const estoqueAtualizado = await conexao.query(queryEstoqueAtualizado, [estoque, idProduto]);
        
            if (estoqueAtualizado.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar o estoque do produto.");
            }

        }

        if(categoria){
            const queryCategoriaAtualizada = `UPDATE produtos SET categoria = $1 WHERE id = $2`;
            const categoriaAtualizada = await conexao.query(queryCategoriaAtualizada, [categoria, idProduto]);
        
            if (categoriaAtualizada.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar a categoria do produto.");
            }

        }

        if(preco){
            const queryPrecoAtualizado = `UPDATE produtos SET preco = $1 WHERE id = $2`;
            const precoAtualizado = await conexao.query(queryPrecoAtualizado, [preco, idProduto]);
        
            if (precoAtualizado.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar o preço do produto.");
            }

        }

        if(descricao){
            const queryDescricaoAtualizada = `UPDATE produtos SET descricao = $1 WHERE id = $2`;
            const descricaoAtualizada = await conexao.query(queryDescricaoAtualizada, [descricao, idProduto]);
        
            if (descricaoAtualizada.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar a descrição do produto.");
            }

        }

        if(imagem){
            const queryImagemAtualizada = `UPDATE produtos SET imagem = $1 WHERE id = $2`;
            const imagemAtualizada = await conexao.query(queryImagemAtualizada, [imagem, idProduto]);
        
            if (imagemAtualizada.rowCount === 0) {
                return res.status(404).json("Não foi possível altualizar a imagem do produto.");
            }

        }
    
        return res.status(200).json("Produto atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await conexao.query('SELECT * FROM produtos WHERE id = $1', [id]);

        if (produto.rowCount === 0) {
            return res.status(404).json("Produto não encontrado.");
        }

        const query = 'DELETE FROM produtos WHERE id = $1';
        const produtoExcluido = await conexao.query(query, [id]);

        if (produtoExcluido.rowCount === 0) {
            return res.status(404).json("Não foi possível excluir o produto.");
        }

        return res.status(200).json("Produto excluido.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
}

module.exports = {
    cadastrarProduto,
    obterProduto,
    listarProdutos,
    atualizarProduto,
    excluirProduto
}