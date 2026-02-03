// Dados dos projetos
const siteData = {
  site: {
    title: "Vini Poffo",
    description: "Diretor criativo, cinematógrafo e editor",
    email: "projetos@vinipoffo.com",
    instagram: "pofovini",
    about: "Vini Poffo trabalha com direção criativa e cinema. Atua principalmente com videoclipes, filmes autorais, cenografia e projetos interdisciplinares. Já teve trabalhos premiados no Brasil e exibidos internacionalmente. Seu processo é artesanal e atravessado por símbolos, política e afeto.\n\nPremiada pela Funarte (2021) com o videoarte Parte de Mim e eleito pelo SESC SC em 2022 com o seu primeiro curta No Reflexo do Meu Nome, melhor obra de Santa Catarina. Seu segundo filme, (Sub)Urbana, percorreu mais de 20 festivais nacionais e internacionais, conquistando cinco prêmios de melhor filme, incluindo o Prêmio Revelação no IV Transforma Festival e atualmente esta disponível pelo Itaú Play. Em 2025 lançou seu curta Tem Feito Uns Dias Esquisitos. Dirigiu mais de 10 videoclipes, incluindo Colapso Invisível de YMA e Aranha de Letrux.",
    aboutCards: [
        { id: 1, title: "Vini Poffo", text: "Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Meu trabalho busca questionar narrativas convencionais e criar espaços para novas perspectivas através de uma abordagem artesanal. Cada projeto é atravessado por símbolos, política e afeto. Já tive trabalhos premiados no Brasil e exibidos internacionalmente, sempre mantendo a autenticidade e a profundidade como pilares do processo criativo.", color: "green" },
        { id: 2, title: "Filmes", text: "Desenvolvo filmes autorais que investigam identidade, memória e território.", color: "blue", type: "modal", modal: "filmesModal" },
        { id: 3, title: "Prêmios", text: "Reconhecimentos e prêmios conquistados ao longo da trajetória criativa.", color: "blue", type: "modal", modal: "premiosModal" },
        { id: 4, title: "Processo Criativo", text: "Me interesso por imagens que carregam tempo. Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê. Trabalho com objetos de memória — elementos que carregam vida dentro da obra.", color: "green" },
        { id: 5, title: "Videoclipes", text: "Vejo o videoclipe como um espaço de invenção estética, onde imagem, corpo e som constroem narrativas experimentais e com força conceitual.", color: "blue", type: "modal", modal: "videoclipesModal" },
        { id: 6, title: "Arte, Cenografia e Outros", text: "Experiências que ampliam meu olhar sobre o set e fortalecem minha capacidade de construir projetos.", color: "blue", type: "modal", modal: "cenografiaModal" },
        { id: 7, title: "Projetos", text: "Explore meu portfólio completo.", color: "blue", link: "projetos.html" },
        { id: 8, title: "Direção", text: "Acredito no cinema e no audiovisual como prática coletiva. Tenho experiência em liderar equipes, dialogar com diferentes departamentos e construir processos colaborativos, respeitando os tempos e as singularidades de cada projeto. Dirigir, pra mim, é estar presente e atenta aos detalhes, articulando para que conceito e execução caminhem juntos.", color: "green" },
        { id: 9, title: "Cinema Autoral", text: "Cada filme ou videoclipe é resultado de referências, vivências, observação de corpos, espaços e gestos cotidianos. O cinema se constrói aos poucos, carrega marcas do processo, do tempo e das pessoas envolvidas. Gosto quando a imagem tem vida própria, quando algo nela continua vibrando depois que termina. Penso o set como um espaço vivo, onde imagem, corpo e tempo estão em constante negociação. Gosto de estar próxima do processo, acompanhando cada detalhe, porque é ali que a magia acontece.", color: "green", type: "text" },
        { id: 10, title: "Vamos Conversar", text: "Estou aberta a colaborações e novos projetos. Se você busca imagens com intenção, sensibilidade e presença, vamos trocar.", color: "blue", type: "contact" }
    ],
    modals: {
        filmes: [
            { t: "Tem Feito Uns Dias Esquisitos", y: "2025", d: "direção, roteiro e concepção de arte", a: "Mostra SESC de Cinema 2025<br>Prêmio Catarinense de Cinema" },
            { t: "O Viajante e a Raposa", y: "2024", d: "direção", a: "" },
            { t: "(Sub)Urbana", y: "2023", d: "direção e co-roteirista", a: "5 prêmios de melhor filme<br>Prêmio Revelação – IV Transforma Festival<br>Em mais de 20 festivais nacionais e internacionais<br>Prêmio Catarinense de Cinema" },
            { t: "No Reflexo do Meu Nome", y: "2022", d: "direção e roteiro", a: "Melhor obra de Santa Catarina – SESC SC 2022<br>Em mais de 15 festivais nacionais e internacionais" },
            { t: "De baixo do guarda-chuva pra ser resistência", y: "2021", d: "direção e roteiro", a: "" },
            { t: "Parte de Mim", y: "2021", d: "direção, roteiro e montagem", a: "Prêmio Respirarte Funarte 2021" }
        ],
        premios: [
            { t: "Prêmio Catarinense de Cinema", y: "2024", d: "Produção de curta-metragem", a: "" },
            { t: "Mostra SESC de Cinema", y: "2024", d: "Seleção Estadual", a: "" },
            { t: "IV Transforma Festival", y: "2023", d: "Prêmio Revelação", a: "" },
            { t: "SESC SC", y: "2022", d: "Melhor Obra de Santa Catarina", a: "" },
            { t: "Prêmio Respirarte Funarte", y: "2021", d: "Videoarte", a: "" },
            { t: "Prêmio Catarinense de Cinema", y: "2019", d: "Produção de curta-metragem", a: "" }
        ],
        videoclipes: [
            { t: "Vira essa boca pra cá", y: "2025", d: "Letrux feat Nouvella", a: "" },
            { t: "Dropar teu nome", y: "2025", d: "Letrux feat Nouvella", a: "" },
            { t: "Outres de Nós", y: "2025", d: "Jesus Lumma feat Dandara Manoela", a: "" },
            { t: "Aranha", y: "2024", d: "Letrux", a: "Melhor videoclipe – Curta Fest Brasília 2024<br>MVF Argentina e Colômbia" },
            { t: "Baião de Dois", y: "2022", d: "Aretuza Lovi feat Getúlio Abelha", a: "" },
            { t: "Ela Terra", y: "2020", d: "Malu Maria", a: "" },
            { t: "Sugar Daddy", y: "2019", d: "Gabeu", a: "" },
            { t: "Colapso Invisível", y: "2019", d: "YMA", a: "" }
        ],
        cenografia: [
            { t: "Cenografia e Direção de Arte", y: "2019-2025", d: "Diversos projetos", a: "Atuação em mais de 15 sets de filmagem" }
        ]
    }
  },
  projects: [
    {
      id: 3,
      title: "Tem feito uns dias esquisitos",
      year: 2025,
      type: "curta-metragem",
      artist: "",
      videoHome: "tfde_portfolio_video.mp4",
      cartazMobile: "dias-esquisitos-cartaz.png",
      trailerUrl: "https://youtu.be/VoZ8e76yASQ?si=T5BxmH5B-QIwLYRr",
      description: "Direção de Vini Poffo e Luana Skibinski. Roteiro de Zalu Amorim e Vini Poffo. Concepção de arte. Premiada pela Mostra SESC de Cinema 2025 e Prêmio Catarinense de Cinema.",
      duracao: "25 minutos",
      credits: {
        elenco: ["Leonardo Lima", "Rafaella Narciso", "Bernardo Araújo", "Guy Lima", "Tayla Evangelista", "Berna Sant'Anna", "Ana Miranda"],
        direcao: ["Vini Poffo", "Luana Skibinski"],
        roteiro: ["Zalu Amorim", "Vini Poffo"],
        preparacaoElenco: ["Mar Rosa"],
        direcaoFotografia: ["Jaque Kogus"],
        operadoraCamera: ["Millena Rosado"],
        concepcaoArte: ["Luan Baeta", "Matheus De Luca", "Vini Poffo"],
        direcaoArte: ["Matheus De Luca"],
        design: ["Alice Costa"],
        direcaoSom: ["Gabu"],
        trilhaSonora: ["YMA", "Fernando Rischbieter"],
        producaoExecutiva: ["Ive Machado"],
        controller: ["Lari Reimerer"],
        direcaoProducao: ["Adriana Perdiz"],
        makingOf: ["Anita Poffo"],
        fotografiaStill: ["Ligia Ferreira"],
        producao: ["Sufe"],
        apoio: "Contemplado pela Lei Paulo Gustavo"
      }
    },
    {
      id: 1,
      title: "Vira essa boca pra cá",
      year: 2025,
      type: "videoclipe",
      artist: "Letrux feat Nouvella",
      videoHome: "vira essa boca_portfolio_video.mp4",
      cartazMobile: "vira-boca-cartaz.jpg",
      trailerUrl: "https://youtu.be/UuH-i5Qx21Y?si=-8I7cTjI7gVP49Bn",
      description: "Videoclipe de Vira essa boca pra cá - Letrux feat Nouvella, dirigido por Vini Poffo."
    },
    {
      id: 2,
      title: "Dropar teu nome",
      year: 2025,
      type: "videoclipe",
      artist: "Letrux feat Nouvella",
      videoHome: "dropar_portfolio_video.mp4",
      cartazMobile: "dropar-nome-cartaz.jpg",
      trailerUrl: "https://youtu.be/PUFx8Z9AEtU?si=e1YZrPLZMNTh92JV",
      description: "Videoclipe de Dropar teu nome - Letrux feat Nouvela, dirigido por Vini Poffo. Lançamento pela Noize."
    },
    {
      id: 4,
      title: "Outres de Nós",
      year: 2025,
      type: "videoclipe",
      artist: "Jesus Lumma feat Dandara Manoela",
      videoHome: "outres_portfolio_video.mp4",
      cartazMobile: "outres-nos-cartaz.png",
      trailerUrl: "https://youtu.be/w2uoe7uvmQQ?si=4vmcp7Dq3mBHq9o_",
      description: "Videoclipe de Outres de Nós da artista Jesus Lumma feat Dandara Manoela, dirigido por Vini Poffo."
    },
    {
      id: 5,
      title: "Aranha",
      year: 2024,
      type: "videoclipe",
      artist: "Letrux",
      videoHome: "aranha_portfolio_video.mp4",
      cartazMobile: "aranha-cartaz.png",
      trailerUrl: "https://www.youtube.com/watch?v=b-a2mUsEfOE",
      description: "Videoclipe de Aranha, dirigido por Sillas H e  Vini Poffo. Melhor videoclipe pelo Curta Fest Brasilia 2024. Convidado pelo MVF para o festival na Argentina e Colômbia"
    },
    {
      id: 6,
      title: "(sub)urbana",
      year: 2023,
      type: "curta-metragem",
      artist: "Curta-metragem",
      videoHome: "suburbana_portfolio_video.mp4",
      cartazMobile: "suburbana-cartaz.png",
      trailerUrl: "https://vimeo.com/820330742?fl=pl&fe=sh",
      description: "Curta-metragem (Sub)Urbana, direção de Vini Poffo, roteiro de Egon Zek. Conquistou 5 prêmios de melhor filme, incluindo Prêmio Revelação no IV Transforma Festival. Percorreu mais de 20 festivais nacionais e internacionais. Disponível no Itaú Play."
    },
    {
      id: 7,
      title: "No reflexo do meu nome",
      year: 2023,
      type: "curta-metragem",
      artist: "Curta-metragem",
      videoHome: "noreflexo_portfolio_video.mp4",
      cartazMobile: "reflexo-nome-cartaz.png",
      trailerUrl: "https://vimeo.com/820329509?fl=pl&fe=sh",
      description: "Curta-metragem No Reflexo do Meu Nome, direção e roteiro de Vini Poffo e Sillas H. Eleito pelo SESC SC em 2023 como melhor obra de Santa Catarina e selecionado para mostra nacional. Exibido em mais de 15 festivais nacionais e internacionais."
    },
    {
      id: 9,
      title: "Baião de Dois",
      year: 2022,
      type: "videoclipe",
      artist: "Aretuza Lovi feat Getúlio Abelha",
      videoHome: "",
      heroImage: "baiaodedois-hero.png",
      cartazMobile: "baiaodedois.png",
      trailerUrl: "https://www.youtube.com/watch?v=mghtmrhDQRc",
      description: "Baião de Dois celebra a cultura nordestina com cores vibrantes e estética camp. Direção compartilhada com Sillas H, criando um universo visual que mistura tradição e contemporaneidade.",
      credits: {
        direcao: ["Sillas H", "Vini Poffo"],
        roteiro: ["Sillas H", "Vini Poffo"],
        direcaoFotografia: ["Millena Rosado"],
        assistenciaProducao: ["Gaba"],
        montagem: ["Diego Lomac"],
        fx: ["Diego Lomac"],
        colorizacao: ["Diego Lomac"],
        beauty: ["Rudson Motta"],
        managerAretuza: ["Paulo Marani"],
        stylistAretuza: ["Paulo Gallo"],
        managerGetulio: ["Gutie"],
        produtoraGetulio: ["Letícia Tomás"],
        stylistGetulio: ["Danton Brandon"],
        composicao: ["Aretuza Lovi", "Keveny"],
        producaoMusical: ["Noize Men", "Rafael Paiola", "Judaz"],
        master: ["Rafael Phyre"]
      }
    },
    {
      id: 8,
      title: "De baixo do guarda-chuva pra ser resistência",
      year: 2021,
      type: "curta-metragem",
      artist: "Curta-metragem",
      videoHome: "debaixo_portfolio_video.mp4",
      cartazMobile: "guarda-chuva-cartaz.jpg",
      trailerUrl: "https://youtu.be/AyPNvaZ1kRM",
      description: "Curta-metragem De Baixo do Guarda-chuva pra Ser Resistência, direção e roteiro de Vini Poffo."
    },
    {
      id: 10,
      title: "Ela Terra",
      year: 2020,
      type: "videoclipe",
      artist: "Malu Maria",
      videoHome: "",
      heroImage: "elaterra-hero.jpg",
      cartazMobile: "elaterra.png",
      trailerUrl: "https://youtu.be/TqI9Gvqxt_k?si=m7Xq4hi90XlYW14P",
      description: "Ela Terra é uma celebração da conexão feminina com a natureza. Direção, roteiro, arte, fotografia e montagem por Vini Poffo e Sillas H, com narração da poeta indígena Marcia Kambeba.",
      credits: {
        direcao: ["Sillas H", "Vini Poffo"],
        roteiro: ["Vini Poffo", "Sillas H"],
        arte: ["Vini Poffo", "Sillas H"],
        fotografia: ["Vini Poffo", "Sillas H"],
        montagem: ["Vini Poffo", "Sillas H"],
        producao: ["Isabela Sucher"],
        figurinoNinfas: ["Rosilene Poffo"],
        figurinoSatira: ["Bruna Emme"],
        textoNarracao: ["Marcia Kambeba"],
        elenco: ["Malu Maria", "Larrisa Rodrigues", "Polyana Brustolin", "Luiza Mattos", "May Garcilazo", "Thuanny Paes", "Giulia Galliano", "Paola Polix"]
      }
    },
    {
      id: 11,
      title: "Sugar Daddy",
      year: 2019,
      type: "videoclipe",
      artist: "Gabeu",
      videoHome: "",
      heroImage: "sugardaddy-hero.jpg",
      cartazMobile: "sugardaddy.jpg",
      trailerUrl: "https://youtu.be/PZVaOifIHAM?si=AlyYmDJxLn7Htkan",
      description: "Videoclipe de Sugar Daddy, de Gabeu. Direção de arte e montagem por Vini Poffo, em colaboração com Sillas H e o Coletivo SUFE. Uma narrativa visual que explora identidade e estética queer.",
      credits: {
        direcaoGeral: ["Sillas H / Coletivo SUFE"],
        escritoPor: ["Gabeu", "Sillas H", "Welli Navida"],
        assistenciaDirecao: ["Vernieri"],
        direcaoArte: ["Vini Poffo"],
        direcaoFotografia: ["Diego Lomac"],
        montagem: ["Sillas H", "Vini Poffo"],
        colorizacao: ["Sillas H", "Vini Poffo"],
        producao: ["Emy Sigma"],
        assessoria: ["Welli Navida / Nanica Assessoria"],
        beauty: ["Pieles"]
      }
    },
    {
      id: 12,
      title: "Colapso Invisível",
      year: 2019,
      type: "videoclipe",
      artist: "YMA",
      videoHome: "",
      heroImage: "colapsoinvisivel-hero.png",
      cartazMobile: "colapsoinvisivel.png",
      trailerUrl: "https://youtu.be/_Un_DsgNMCc?si=5pbANIlC2DdTSdWF",
      description: "Colapso Invisível explora ansiedade e surrealismo através de cenários oníricos e composições visuais intensas. Direção de arte que transforma o caos interno em estética.",
      credits: {
        direcaoGeral: ["Sillas H", "YMA"],
        roteiro: ["YMA", "Sillas H"],
        direcaoFotografia: ["Gu011", "Diego Lomac"],
        colorizacao: ["SUFE / Olhapina"],
        montagem: ["SUFE / Olhapina"],
        direcaoArte: ["Vini Poffo", "Anuro", "Cacau Francisco"],
        producaoGeral: ["Isabela Sucher", "Emy Sigma"],
        beleza: ["Peca Lderaromua"],
        figurinos: ["Plagio", "Korshi"],
        trilhas: ["Dreg Me", "Instagordo"],
        coreografia: ["Fae Stevan"],
        design: ["Made in Jonny", "Truta Lucas"]
      }
    }
  ]
};
