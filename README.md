# Vini Poffo - Site de Portfólio Cinematográfico

Site responsivo e minimalista para portfólio de diretor criativo, cinematógrafo e editor.

## Estrutura do Projeto

```
vini-poffo-site/
├── public/
│   ├── index.html           # Página inicial
│   ├── projetos.html        # Página com todos os projetos
│   ├── sobre.html           # Página "Quem Sou Eu"
│   ├── projeto.html         # Página individual de projeto
│   ├── styles.css           # Estilos (preto, branco, verde)
│   ├── script.js            # Interatividade
│   ├── data.js              # Dados dos projetos
│   └── assets/
│       ├── videos/          # Vídeos 15s para home
│       ├── cartazes/        # Cartazes verticais para mobile
│       ├── trailers/        # (para futuro)
│       ├── bastidores/      # (para futuro)
│       └── logo/            # (para futuro)
├── src/
│   └── data.json            # Dados em JSON (referência)
├── package.json
└── README.md
```

## Como Executar Localmente

### Opção 1: Python (Recomendado)
```bash
cd vini-poffo-site
python3 -m http.server 8000 --directory public
```
Acesse: http://localhost:8000

### Opção 2: Node.js (se tiver instalado)
```bash
cd vini-poffo-site/public
npx http-server
```

## Design

- **Cores**: Preto (#000), Branco (#fff), Verde Escuro (#2d5016)
- **Tipografia**: Montserrat (títulos), Inter (corpo)
- **Responsividade**: Desktop (vídeos 15s) + Mobile (cartazes verticais)
- **Filosofia**: Minimalista, clean, moderno

## Adicionar Novos Projetos

1. Adicione o vídeo em `public/assets/videos/`
2. Adicione o cartaz em `public/assets/cartazes/`
3. Edite `public/data.js` e adicione um novo objeto ao array `projects`:

```javascript
{
  id: 9,
  title: "Título do Projeto",
  year: 2025,
  type: "videoclipe", // ou "curta-metragem"
  artist: "Artista",
  videoHome: "nome-do-video.mp4",
  cartazMobile: "nome-do-cartaz.jpg",
  trailerUrl: "https://youtu.be/xxxxx",
  description: "Descrição do projeto"
}
```

## Editar Informações

### Página "Quem Sou Eu"
Edite o arquivo `public/sobre.html` na seção `.sobre-text`

### Contato
Edite `public/data.js`:
- `email`: projetos@vinipoffo.com
- `instagram`: pofovini

## Deploy no Vercel

1. Faça login no GitHub
2. Crie um repositório com os arquivos
3. Conecte ao Vercel (https://vercel.com)
4. Configure o domínio na GoDaddy

## Próximos Passos

- [ ] Adicionar fotos de bastidores
- [ ] Adicionar ficha técnica completa
- [ ] Integrar formulário de contato
- [ ] Adicionar animações ao scroll
- [ ] Implementar dark mode (opcional)

## Suporte

Para dúvidas ou ajustes, entre em contato: projetos@vinipoffo.com
