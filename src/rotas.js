const express = require('express');
const usuarios = require('./controladores/usuarios.js');
const login = require('./controladores/login.js');
const produtos = require('./controladores/produtos.js');
const validandoToken = require('./filtro/validacaoToken.js');

const rotas = express();
rotas.use(validandoToken);

//PRODUTOS
rotas.delete('/produtos:id', produtos.excluirProduto);
rotas.put('/produtos:id', produtos.atualizarProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.get('/produtos:id', produtos.obterProduto);
rotas.get('/produtos', produtos.listarProdutos);

//USUARIO
rotas.get('/perfil', usuarios.obterUsuario);
rotas.put('/perfil', usuarios.editarUsuario);
rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.post('/login', login.login)

module.exports = rotas;