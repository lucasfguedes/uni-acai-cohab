
// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../database'); // Seu arquivo de banco de dados

router.post('/', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verifica se usuário já existe
        const usuarioExistente = await db.verificarLogin(email, senha);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const userId = await db.criarUsuario(nome, email, senha);
        res.status(201).json({ id: userId });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;