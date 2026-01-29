// Dados dos projetos
const siteData = {
  site: {
    title: "Vini Poffo",
    description: "Diretor criativo, cinematógrafo e editor",
    email: "projetos@vinipoffo.com",
    instagram: "pofovini",
    about: "Vini Poffo trabalha com direção criativa e cinema. Atua principalmente com videoclipes, filmes autorais, cenografia e projetos interdisciplinares. Já teve trabalhos premiados no Brasil e exibidos internacionalmente. Seu processo é artesanal e atravessado por símbolos, política e afeto.\n\nPremiada pela Funarte (2021) com o videoarte Parte de Mim e eleito pelo SESC SC em 2022 com o seu primeiro curta No Reflexo do Meu Nome, melhor obra de Santa Catarina. Seu segundo filme, (Sub)Urbana, percorreu mais de 20 festivais nacionais e internacionais, conquistando cinco prêmios de melhor filme, incluindo o Prêmio Revelação no IV Transforma Festival e atualmente esta disponível pelo Itaú Play. Em 2025 lançou seu curta Tem Feito Uns Dias Esquisitos. Dirigiu mais de 10 videoclipes, incluindo Colapso Invisível de YMA e Aranha de Letrux."
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
      id: 8,
      title: "De baixo do guarda-chuva pra ser resistência",
      year: 2021,
      type: "curta-metragem",
      artist: "Curta-metragem",
      videoHome: "debaixo_portfolio_video.mp4",
      cartazMobile: "guarda-chuva-cartaz.jpg",
      trailerUrl: "https://youtu.be/AyPNvaZ1kRM",
      description: "Curta-metragem De Baixo do Guarda-chuva pra Ser Resistência, direção e roteiro de Vini Poffo."
    }
  ]
};
