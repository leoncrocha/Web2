create DATABASE genshin_impact;

USE genshin_impact;

CREATE TABLE personagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    elemento VARCHAR(255),
    arma VARCHAR(255),
    nivel_ascensao INT,
    vida INT,
    ataque INT,
    defesa INT,
    dano_elemental INT,
    taxa_critica INT,
    dano_critico INT,
    cura INT,
    habilidade_normal VARCHAR(255),
    habilidade_elemental VARCHAR(255),
    explosao_elemental VARCHAR(255)
);

CREATE TABLE personagensAPI (
id INT AUTO_INCREMENT,
    nome VARCHAR(255),
    raridade INT,
    elemento VARCHAR(255),
    arma VARCHAR(255),
    regiao VARCHAR(255),
    descricao TEXT,
    imagem_url VARCHAR(255),
    ataque_base INT,
    defesa_base INT,
    hp_base INT,
    ataque_secundario VARCHAR(255),
    constelacao VARCHAR(255),
    habilidade_normal TEXT,
    habilidade_elemental TEXT,
    explosao_elemental TEXT,
    talentos TEXT,
    constelacoes TEXT,
    PRIMARY KEY (id)
);


INSERT INTO personagens (nome, elemento, arma, nivel_ascensao, vida, ataque, defesa, dano_elemental, taxa_critica, dano_critico, cura, habilidade_normal, habilidade_elemental, explosao_elemental) 
VALUES ('Jean', 'Anemo', 'Espada', 6, 14695, 239, 769, 0, 5, 50, 0, 'Técnica de Favonius', 'Espada do Temporal', 'Brisa de Dandelion');

SELECT * FROM personagens;
SELECT * FROM PersonagensAPI;
