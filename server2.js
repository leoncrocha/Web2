 // Importando os módulos necessários
const express = require('express');
const axios = require('axios');
const path = require('path');

// Inicializando o Express
const app = express();

app.use(express.json()); 
app.use(express.static('public')) // ativar o css 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/inicial.html'));
});

// Rota para buscar os dados da api
app.get('/api/characters', async (req, res) => {
    try {
        // Obtenha os dados da API
        const response = await axios.get('https://api.genshin.dev/characters/ayaka');
        const character = response.data;

        console.log(character); // Imprima os dados da API para verificar a estrutura

        res.json(character); // Envie os dados para a página HTML
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao buscar os dados.');
    }
});

app.listen(300, () => {
    console.log(`Servidor 2 rodando em http://localhost:${300}`);
}); 