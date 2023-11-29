 // Importando os módulos necessários
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch'); // Adicionado para fazer a solicitação HTTP
const translate = require('@vitalets/google-translate-api'); // Adicionado para traduzir os dados

// Inicializando o Express
const app = express();

app.use(express.json()); 
app.use(express.static('public')) // ativar o css 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/inicial.html'));
});

// Criando a conexão com o banco de dados
const connection = mysql.createConnection({
   host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'genshin_impact'
});

// Conectando ao banco de dados
connection.connect((err) => {
    if(err) throw err;
    console.log('Conexão com o MySQL estabelecida');
});

// Configurando o body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para o cadastro de personagem
app.post('/inserir', (req, res) => {
    const { nome, elemento, arma, ascensao, vida, ataque, defesa, danoElemental, taxaCritica, danoCritico, cura, habilidadeNormal, habilidadeElemental, explosaoElemental } = req.body;

    // Verificar se o personagem já existe
    connection.query('SELECT * FROM personagens WHERE nome = ?', [nome], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao verificar o nome do personagem' });
        }

        // Se o personagem já existir, retornar uma mensagem de erro
        if (result.length > 0) {
            return res.status(400).json({ message: 'Personagem já existe' });
        }

        // Se o personagem não existir, inserir o novo personagem
connection.query('INSERT INTO personagens (nome, elemento, arma, nivel_ascensao, vida, ataque, defesa, dano_elemental, taxa_critica, dano_critico, cura, habilidade_normal, habilidade_elemental, explosao_elemental) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nome, elemento, arma, ascensao, vida, ataque, defesa, danoElemental, taxaCritica, danoCritico, cura, habilidadeNormal, habilidadeElemental, explosaoElemental], (err, result) => {
    if (err) {
        return res.status(500).json({ message: 'Erro ao inserir' });
    } else{
        return res.status(200).json({ message: 'Personagem cadastrado com sucesso', insertId: result.insertId });
    }
});
        
    });
});

// Rota para buscar dados
app.get('/mostrar',(req, res) => {
    connection.query('SELECT * FROM personagens ORDER BY nome ', (err, results)=>{
        if(err){
            return res.status(500).json({message: 'Erro ao buscar dados'});
        }
        res.json(results);
    });
});

// Rota para buscar os dados da api etentativa não usada
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


// Função auxiliar para traduzir um texto para o português
async function traduzirEnglesPortuguese(text) {
    try {
        const res = await translate(text, {from: 'en', to: 'pt'});
        return res.text;
    } catch (err) {
        console.error('Erro ao traduzir', err);
        return text;
    }
}

 // Rota para inserir dados da API no banco de dados
app.get('/inserirDadosAPI', async (req, res) => {
    try {
        const response = await fetch('https://genshinlist.com/api/characters');
        const data = await response.json();
        for (const character of data) {
            const nome = await traduzirEnglesPortuguese(character.name);
            // Verificar se o personagem já existe
            connection.query('SELECT * FROM personagens WHERE nome = ?', [nome], async (err, result) => {
                if (err) {
                    console.log('Erro ao verificar o nome do personagem', err);
                }
                // Se o personagem não existir, inserir o novo personagem
                if (result.length === 0) {
                    const elemento = await translateToPortuguese(character.element);
                    const arma = await translateToPortuguese(character.weapon);
                    const ascensao = await translateToPortuguese(character.ascension);
                    const vida = await translateToPortuguese(character.health);
                    const ataque = await translateToPortuguese(character.attack);
                    const defesa = await translateToPortuguese(character.defense);
                    const danoElemental = await translateToPortuguese(character.elementalDamage);
                    const taxaCritica = await translateToPortuguese(character.critRate);
                    const danoCritico = await translateToPortuguese(character.critDamage);
                    const cura = await translateToPortuguese(character.healing);
                    const habilidadeNormal = await translateToPortuguese(character.normalAbility);
                    const habilidadeElemental = await translateToPortuguese(character.elementalAbility);
                    const explosaoElemental = await translateToPortuguese(character.elementalBurst);
                    connection.query('INSERT INTO personagens (nome, elemento, arma, nivel_ascensao, vida, ataque, defesa, dano_elemental, taxa_critica, dano_critico, cura, habilidade_normal, habilidade_elemental, explosao_elemental) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nome, elemento, arma, ascensao, vida, ataque, defesa, danoElemental, taxaCritica, danoCritico, cura, habilidadeNormal, habilidadeElemental, explosaoElemental], (err, result) => {
                        if (err) {
                            console.log('Erro ao inserir', err);
                        } else {
                            console.log('Inserido com sucesso', result.insertId);
                           
                        }
                    });
                }
            });
        }
        res.json({ message: 'Dados da API inseridos com sucesso' });
    } catch (err) {
        console.log('Erro ao buscar dados da API', err);
        res.status(500).json({ message: 'Erro ao buscar dados da API' });
    }
});

// Rota para inserir os dados da api direto no banco
app.get('/inserirDadosAPIBanco', async (req, res) => {
    try {
        // Obtenha os dados da API
        const response = await axios.get('https://api.genshin.dev/characters');
        const characters = response.data;
  
        // Insira os dados no banco de dados
        const connection = await pool.getConnection(); // Alterado para pool.getConnection()
        for (const character of characters) {
            // Verificar se o personagem já existe
            const [rows] = await connection.query('SELECT * FROM personagensAPI WHERE nome = ?', [character.name]);
            // Se o personagem não existir, inserir o novo personagem
            if (rows.length === 0) {
                await connection.query(
                    'INSERT INTO personagensAPI (nome, raridade, elemento, arma, regiao, descricao, imagem_url, ataque_base, defesa_base, hp_base, ataque_secundario, constelacao, habilidade_normal, habilidade_elemental, explosao_elemental, talentos, constelacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [character.name, character.rarity, character.element, character.weapon, character.region, character.description, character.image_url, character.base_attack, character.base_defense, character.base_hp, character.secondary_attack, character.constellation, character.normal_attack, character.elemental_skill, character.elemental_burst, character.talents, character.constellations]
                );
            }
        }
        connection.release(); // Libera a conexão
  
        res.send('Dados inseridos com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao inserir os dados.');
    }
});

  
/* Rota para deletar personagens com visão elemental nula
app.get('/deletarVisaoElementalNula', (req, res) => {
    connection.query('DELETE FROM personagens WHERE visao_elemental IS NULL', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deletar personagens' });
        }
        res.json({ message: 'Personagens deletados com sucesso', affectedRows: result.affectedRows });
    });
});*/


// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
