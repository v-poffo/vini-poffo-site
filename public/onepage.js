// Lógica para a página única (One Page) - Versão Final Refinada
document.addEventListener('DOMContentLoaded', function() {
    const projects = [...siteData.projects];
    let isDesktop = window.innerWidth > 768;

    // --- HERO ---
    function initializeHero() {
        if (isDesktop) { renderHeroTitles(); } else { setupMobileHero(); }
        updateHeroVideo(0);
    }

    function renderHeroTitles() {
        const list = document.getElementById('projectsList');
        if (!list) return;
        list.innerHTML = '';
        projects.slice(0, 4).forEach((p, i) => {
            const div = document.createElement('div');
            div.className = `project-title ${i === 0 ? 'active' : ''}`;
            div.innerHTML = `<span class="title-text">${p.title.toUpperCase()}</span><span class="title-year">${p.year}</span>`;
            div.onclick = () => rotateHero(i);
            list.appendChild(div);
        });
    }

    function rotateHero(clickedIdx) {
        if (clickedIdx === 0) return;
        for (let i = 0; i < clickedIdx; i++) { projects.push(projects.shift()); }
        renderHeroTitles();
        updateHeroVideo(0);
        gsap.from('.project-title', { opacity: 0, y: 20, stagger: 0.05, duration: 0.3 });
    }

    function updateHeroVideo(idx) {
        const video = document.getElementById('heroVideo');
        if (video && projects[idx]) {
            video.src = `assets/videos/${projects[idx].videoHome}`;
            video.play();
        }
    }

    function setupMobileHero() {
        const items = document.getElementById('carouselItems');
        if (!items) return;
        items.innerHTML = '';
        projects.forEach(p => {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.innerHTML = `<img src="assets/cartazes/${p.cartazMobile}">`;
            items.appendChild(div);
        });
        const titleMob = document.getElementById('heroTitleMobile');
        const container = document.querySelector('.carousel-items');
        container.onscroll = () => {
            const idx = Math.round(container.scrollTop / container.offsetHeight);
            if (projects[idx]) {
                titleMob.innerHTML = `<div class="project-info"><div class="project-title-large">${projects[idx].title}</div><div class="project-year">${projects[idx].year}</div></div>`;
            }
        };
    }

    // --- PROJETOS (ANIMAÇÃO MULTIDIRECIONAL E TEXTOS EXATOS) ---
    function renderProjectsCarousel(filter = 'todos') {
        const container = document.getElementById('projectsCarousel');
        if (!container) return;
        container.innerHTML = '';
        const filtered = filter === 'todos' ? siteData.projects : siteData.projects.filter(p => p.type === filter);
        
        filtered.forEach((p, i) => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${p.id}`;
            card.className = 'polaroid-card';
            const rot = (Math.random() * 8 - 4).toFixed(1);
            card.style.transform = `rotate(${rot}deg)`;
            
            // Textos Técnicos Exatos baseados na página original
            let overlayText = "";
            if (p.type === 'curta-metragem') {
                const direcao = p.credits?.direcao?.join(' & ') || 'Vini Poffo';
                const roteiro = p.credits?.roteiro?.join(' & ') || '-';
                overlayText = `Curta-metragem ${p.title}, direção e roteiro de ${direcao}`;
                if (p.credits?.roteiro && p.credits.roteiro.length > 1) overlayText = `Curta-metragem ${p.title}, direção de ${direcao} e roteiro de ${roteiro}`;
                if (p.credits?.concepcaoArte) overlayText += `, concepção de arte por ${p.credits.concepcaoArte.join(' & ')}`;
                if (p.awards && p.awards.length > 0) overlayText += `. ${p.awards[0]}`;
                
                // Caso específico solicitado
                if (p.id === 'debaixo-do-guarda-chuva') {
                    overlayText = "Curta-metragem debaixo do guarda-chuva para ser resistência e direção e roteiro de Vini Poffo";
                }
            } else {
                const artista = p.artist || '-';
                overlayText = `Videoclipe de ${p.title}, ${artista}, dirigido por Vini Poffo`;
            }
            
            card.innerHTML = `
                <div class="polaroid-wrapper">
                    <div class="polaroid-image-container">
                        <img src="assets/cartazes/${p.cartazMobile}" class="polaroid-image">
                        <div class="polaroid-overlay">
                            <div class="overlay-text">${overlayText}</div>
                        </div>
                    </div>
                    <div class="polaroid-label">
                        <h3 class="polaroid-title">${p.title}</h3>
                        <p class="polaroid-year">${p.year}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Animação de Entrada Multidirecional (GSAP)
        gsap.from(".polaroid-card", {
            scrollTrigger: {
                trigger: ".projects-onepage",
                start: "top 80%",
            },
            y: (i) => {
                const mod = i % 4;
                if (mod === 0) return 150;
                if (mod === 1) return -150;
                return 0;
            },
            x: (i) => {
                const mod = i % 4;
                if (mod === 2) return 150;
                if (mod === 3) return -150;
                return 0;
            },
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => {
                // Após as polaroides se posicionarem, iniciamos a revelação das fotos
                document.querySelectorAll('.polaroid-image').forEach(img => {
                    img.classList.add('revealed');
                });
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderProjectsCarousel(btn.dataset.filter);
        };
    });

    const wrapper = document.getElementById('carouselWrapper');
    let isDown = false, startX, scrollLeft;
    wrapper.onmousedown = (e) => { isDown = true; startX = e.pageX - wrapper.offsetLeft; scrollLeft = wrapper.scrollLeft; };
    wrapper.onmouseleave = () => isDown = false;
    wrapper.onmouseup = () => isDown = false;
    wrapper.onmousemove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    };

    // --- SOBRE (10 CARDS DESKTOP) ---
    const aboutContent = [
        { id: 1, type: 'text', color: 'green', title: "Vini Poffo", text: "Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Meu trabalho busca questionar narrativas convencionais e criar espaços para novas perspectivas através de uma abordagem artesanal. Cada projeto é atravessado por símbolos, política e afeto. Já tive trabalhos premiados no Brasil e exibidos internacionalmente, sempre mantendo a autenticidade e a profundidade como pilares do processo criativo." },
        { id: 2, type: 'modal', color: 'blue', title: "Filmes", text: "Desenvolvo filmes autorais que investigam identidade, memória e território.", modal: 'filmesModal' },
        { id: 3, type: 'modal', color: 'blue', title: "Prêmios", text: "Reconhecimentos e prêmios conquistados ao longo da trajetória criativa.", modal: 'premiosModal' },
        { id: 4, type: 'text', color: 'green', title: "Processo Criativo", text: "Me interesso por imagens que carregam tempo.<br><br>Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê. Trabalho com objetos de memória — elementos que carregam vida dentro da obra." },
        { id: 5, type: 'modal', color: 'blue', title: "Videoclipes", text: "Vejo o videoclipe como um espaço de invenção estética, onde imagem, corpo e som constroem narrativas experimentais e com força conceitual.", modal: 'videoclipesModal' },
        { id: 6, type: 'modal', color: 'blue', title: "Arte, Cenografia e Outros", text: "Experiências que ampliam meu olhar sobre o set e fortalecem minha capacidade de construir projetos.", modal: 'cenografiaModal' },
        { id: 7, type: 'modal', color: 'blue', title: "Projetos", text: "Acesse a galeria completa de trabalhos.", link: "projetos.html" },
        { id: 8, type: 'text', color: 'green', title: "Direção", text: "Acredito no cinema e no audiovisual como prática coletiva. Tenho experiência em liderar equipes, dialogar com diferentes departamentos e construir processos colaborativos, respeitando os tempos e as singularidades de cada projeto. Dirigir, pra mim, é estar presente e atenta aos detalhes, articulando para que conceito e execução caminhem juntos." },
        { id: 9, type: 'text', color: 'green', title: "", text: "Cada filme ou videoclipe é resultado de referências, vivências, observação de corpos, espaços e gestos cotidianos. O cinema se constrói aos poucos, carrega marcas do processo, do tempo e das pessoas envolvidas. Gosto quando a imagem tem vida própria, quando algo nela continua vibrando depois que termina. Penso o set como um espaço vivo, onde imagem, corpo e tempo estão em constante negociação." },
        { id: 10, type: 'contact', color: 'blue', title: "Vamos Conversar?", text: "Estou aberta a colaborações e novos projetos.<br><br>Se você busca imagens com intenção, sensibilidade e presença, vamos trocar." }
    ];

    function renderAbout() {
        const grid = document.getElementById('aboutGrid');
        grid.innerHTML = '';
        aboutContent.forEach(c => {
            const card = document.createElement('div');
            card.className = `flip-card ${c.type === 'modal' || c.type === 'contact' ? 'clickable' : ''}`;
            
            let backContent = (c.title ? `<h4 class="flip-card-back-title">${c.title}</h4>` : '') + `<p class="flip-card-back-text">${c.text}</p>`;
            if (c.type === 'contact') {
                backContent = `<h4 class="flip-card-back-title">${c.title}</h4><p class="flip-card-back-text">${c.text}</p>
                <div class="flip-card-back-cta-buttons">
                    <a href="mailto:projetos@vinipoffo.com" class="flip-card-back-cta-btn">Email</a>
                    <a href="https://instagram.com/poffovini" target="_blank" class="flip-card-back-cta-btn">Instagram</a>
                </div>`;
            }

            card.innerHTML = `<div class="flip-card-inner"><div class="flip-card-front"></div><div class="flip-card-back ${c.color}">${backContent}</div></div>`;
            if (c.type === 'modal') card.onclick = () => document.getElementById(c.modal).classList.add('show');
            if (c.link) card.onclick = () => window.location.href = c.link;
            grid.appendChild(card);
        });
    }

    function fillModals() {
        const filmes = [
            { t: "Tem Feito Uns Dias Esquisitos", y: "2025", d: "direção, roteiro e concepção de arte", a: "Mostra SESC de Cinema 2025<br>Prêmio Catarinense de Cinema" },
            { t: "O Viajante e a Raposa", y: "2024", d: "direção" },
            { t: "(Sub)Urbana", y: "2023", d: "direção e co-roteirista", a: "5 prêmios de melhor filme<br>Prêmio Revelação – IV Transforma Festival<br>Exibição em mais de 20 festivais nacionais e internacionais<br>Prêmio Catarinense de Cinema" },
            { t: "No Reflexo do Meu Nome", y: "2022", d: "direção e roteiro", a: "Selecionado para mostra SESC de cinema nacional 2023, primeiro filme de SC a entrar no circuito<br>Mais de 15 festivais nacionais e internacionais" },
            { t: "Debaixo do Guarda-chuva pra ser Resistência", y: "2021", d: "direção e roteiro", a: "Selecionado em mais de 10 festivais nacionais e internacionais" },
            { t: "Marias", y: "2021", d: "direção" }
        ];
        document.getElementById('filmesList').innerHTML = filmes.map(f => `<div class="modal-item"><span class="modal-item-title">${f.t}</span><span class="modal-item-type">${f.d}</span><div class="modal-item-artists">${f.y}</div>${f.a ? `<div class="modal-item-awards">${f.a}</div>` : ''}</div>`).join('');
        
        const premios = [
            { t: "5 Prêmios de Melhor Filme", a: "(Sub)Urbana – Festival SESC" },
            { t: "Prêmio Revelação", a: "Transforma Festival" },
            { t: "Curta Fest Brasília 2024", a: "Categoria Aranha" },
            { t: "SESC SC", a: "No Reflexo do Meu Nome – Reconhecimento Nacional" },
            { t: "Exibições Internacionais", a: "Trabalhos exibidos em festivais internacionais" },
            { t: "Lei Paulo Gustavo", a: "Contemplado para desenvolvimento de projetos" }
        ];
        document.getElementById('premiosList').innerHTML = premios.map(p => `<div class="modal-item"><span class="modal-item-title">${p.t}</span><div class="modal-item-artists">${p.a}</div></div>`).join('');

        const vcs = [
            { t: "Pote de Ouro", d: "assist. prod. executiva", a: "Liniker e Priscila Sena • 2025" },
            { t: "Dropar Teu Nome", d: "direção e roteiro", a: "Letrux feat Nouvella • 2025", w: "Lançamento pela Noize" },
            { t: "Vira Essa Boca Pra Cá", d: "direção e roteiro", a: "Letrux feat Nouvella • 2025" },
            { t: "Outres de Nós", d: "direção e roteiro", a: "Jesus Lumma • 2025" },
            { t: "Carta Marcada", d: "assist. de produção de objeto", a: "Vitor Kley • 2025" },
            { t: "Aranha", d: "direção e roteiro", a: "Letrux • 2024", w: "Convidado pelo MVF para o festival na Argentina e Colômbia<br>Melhor videoclipe pelo Curta Fest Brasilia 2024" },
            { t: "Barman", d: "assistência de direção", a: "Ananda Paixão • 2023" },
            { t: "No Game", d: "making of", a: "Ananda Paixão • 2023" },
            { t: "Baião de Dois", d: "direção e direção de arte", a: "Aretuza Lovi & Getúlio Abelha • 2022" },
            { t: "Bailão", d: "direção de arte", a: "Gabeu • 2022" },
            { t: "Moços e Moças", d: "direção de arte", a: "Jesus Lumma • 2020" },
            { t: "Ela Terra", d: "direção e roteiro", a: "Malu Maria • 2020" },
            { t: "Sugar Daddy", d: "direção de arte", a: "Gabeu • 2019" },
            { t: "Colapso Invisível", d: "direção de arte", a: "YMA • 2019", w: "Melhor videoclipe - Hits Perdidos 2019" }
        ];
        document.getElementById('videoclipesList').innerHTML = vcs.map(v => `<div class="modal-item"><span class="modal-item-title">${v.t}</span><span class="modal-item-type">${v.d}</span><div class="modal-item-artists">${v.a}</div>${v.w ? `<div class="modal-item-awards">${v.w}</div>` : ''}</div>`).join('');
        
        const ceno = [
            { t: "Santo", d: "assist. de arte", a: "Curta-metragem • Outros • 2025" },
            { t: "CERAVE - Pele Sequinha", d: "assist. de produção de objetos", a: "Publicidade • Outros • 2025" },
            { t: "Nutren - Eu Me Vejo Pro-Idade", d: "assist. de produção de objetos", a: "Publicidade • Outros • 2025" },
            { t: "Voe Azul", d: "assist. de objetos", a: "Publicidade • Outros • 2025" },
            { t: "Album - Som do Ale", d: "assist. de arte e cenografia", a: "Visualizer • Outros • 2025" },
            { t: "DIVA - Calma Sao Paulo", d: "assist. de arte", a: "Editorial • Outros • 2025" },
            { t: "Calma Business - Calma Sao Paulo", d: "assist. de arte", a: "Editorial • Outros • 2024" },
            { t: "Segue o Baile - E! Channel", d: "making of (still) e operação de câmera PTZ", a: "Reality show • Outros • 2024" },
            { t: "Maria Homem", d: "direção e criação de conteúdo", a: "YouTube e Instagram • Outros • 2020 - Atualmente" }
        ];
        document.getElementById('cenografiaList').innerHTML = ceno.map(c => `<div class="modal-item"><span class="modal-item-title">${c.t}</span><span class="modal-item-type">${c.d}</span><div class="modal-item-artists">${c.a}</div></div>`).join('');
    }

    document.querySelectorAll('.modal-close').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('show'));
    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.classList.remove('show'); };

    initializeHero();
    renderProjectsCarousel();
    renderAbout();
    fillModals();
});
