// Lógica para a página única (One Page) - Fidelidade Total
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

    // --- PROJETOS ---
    function renderProjectsCarousel(filter = 'todos') {
        const container = document.getElementById('projectsCarousel');
        if (!container) return;
        container.innerHTML = '';
        
        const filtered = filter === 'todos' ? siteData.projects : siteData.projects.filter(p => p.type === filter);
        
        filtered.forEach((p, i) => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${p.id}`;
            card.className = 'polaroid-card';
            const rot = (i % 2 === 0 ? -1.2 : 1.2) * (Math.random() + 0.3);
            card.style.transform = `rotate(${rot}deg)`;
            
            let overlayHTML = `<h4>${p.title.toUpperCase()}</h4>`;
            if (p.type === 'curta-metragem') {
                overlayHTML += `<p><span class="overlay-label">Direção:</span> ${p.credits?.direcao?.join(', ') || 'Vini Poffo'}</p>`;
                overlayHTML += `<p><span class="overlay-label">Roteiro:</span> ${p.credits?.roteiro?.join(', ') || '-'}</p>`;
                if (p.credits?.concepcaoArte) overlayHTML += `<p><span class="overlay-label">Arte:</span> ${p.credits.concepcaoArte.join(', ')}</p>`;
            } else {
                overlayHTML += `<p><span class="overlay-label">Artista:</span> ${p.artist || '-'}</p>`;
                overlayHTML += `<p><span class="overlay-label">Direção:</span> Vini Poffo</p>`;
            }
            
            card.innerHTML = `
                <div class="polaroid-wrapper">
                    <div class="polaroid-image-container">
                        <img src="assets/cartazes/${p.cartazMobile}" class="polaroid-image">
                        <div class="polaroid-overlay">${overlayHTML}</div>
                    </div>
                    <div class="polaroid-label">
                        <h3 class="polaroid-title">${p.title}</h3>
                        <p class="polaroid-year">${p.year}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderProjectsCarousel(btn.dataset.filter);
        };
    });

    // Drag Scroll
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

    // --- SOBRE (TEXTOS LITERAIS DO SOBRE.HTML) ---
    const aboutContent = [
        { id: 1, type: 'text', color: 'green', title: "Vini Poffo", text: "Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Meu trabalho busca questionar narrativas convencionais e criar espaços para novas perspectivas através de uma abordagem artesanal. Cada projeto é atravessado por símbolos, política e afeto. Já tive trabalhos premiados no Brasil e exibidos internacionalmente, sempre mantendo a autenticidade e a profundidade como pilares do processo criativo.", span: 2 },
        { id: 2, type: 'modal', color: 'blue', title: "Filmes", text: "Desenvolvo filmes autorais que investigam identidade, memória e território.", modal: 'filmesModal' },
        { id: 3, type: 'modal', color: 'blue', title: "Prêmios", text: "Reconhecimentos e prêmios conquistados ao longo da trajetória criativa.", modal: 'premiosModal' },
        { id: 4, type: 'text', color: 'green', title: "Processo Criativo", text: "Me interesso por imagens que carregam tempo. Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê. Trabalho com objetos de memória — elementos que carregam vida dentro da obra.", span: 2 },
        { id: 5, type: 'modal', color: 'blue', title: "Videoclipes", text: "Vejo o videoclipe como um espaço de invenção estética, onde imagem, corpo e som constroem narrativas experimentais e com força conceitual.", modal: 'videoclipesModal' },
        { id: 6, type: 'modal', color: 'blue', title: "Arte, Cenografia e Outros", text: "Experiências que ampliam meu olhar sobre o set e fortalecem minha capacidade de construir projetos.", modal: 'cenografiaModal' },
        { id: 7, type: 'text', color: 'green', title: "Direção", text: "Acredito no cinema e no audiovisual como prática coletiva. Tenho experiência em liderar equipes, dialogar com diferentes departamentos e construir processos colaborativos, respeitando os tempos e as singularidades de cada projeto. Dirigir, pra mim, é estar presente e atenta aos detalhes, articulando para que conceito e execução caminhem juntos.", span: 2 },
        { id: 8, type: 'text', color: 'green', title: "Cinema Autoral", text: "Cada filme ou videoclipe é resultado de referências, vivências, observação de corpos, espaços e gestos cotidianos. O cinema se constrói aos poucos, carrega marcas do processo, do tempo e das pessoas envolvidas. Gosto quando a imagem tem vida própria, quando algo nela continua vibrando depois que termina. Penso o set como um espaço vivo, onde imagem, corpo e tempo estão em constante negociação.", span: 2 },
        { id: 9, type: 'contact', color: 'blue', title: "Vamos Conversar?", text: "Estou aberta a colaborações e novos projetos. Se você busca imagens com intenção, sensibilidade e presença, vamos trocar.", span: 2 }
    ];

    function renderAbout() {
        const grid = document.getElementById('aboutGrid');
        grid.innerHTML = '';
        aboutContent.forEach(c => {
            const card = document.createElement('div');
            card.className = `flip-card ${c.type === 'modal' ? 'clickable' : ''}`;
            if (c.span) card.style.gridColumn = `span ${c.span}`;
            
            let backContent = `<h4 class="flip-card-back-title">${c.title}</h4><p class="flip-card-back-text">${c.text}</p>`;
            if (c.type === 'contact') {
                backContent += `<div class="flip-card-back-cta-buttons">
                    <a href="mailto:projetos@vinipoffo.com" class="flip-card-back-cta-btn">Email</a>
                    <a href="https://instagram.com/poffovini" target="_blank" class="flip-card-back-cta-btn">Instagram</a>
                </div>`;
            }

            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front"></div>
                    <div class="flip-card-back ${c.color}">${backContent}</div>
                </div>
            `;
            if (c.type === 'modal') card.onclick = () => document.getElementById(c.modal).classList.add('show');
            grid.appendChild(card);
        });
    }

    function fillModals() {
        // FILMES
        const filmes = [
            { t: "Tem Feito Uns Dias Esquisitos", y: "2025", d: "direção, roteiro e concepção de arte", a: "Mostra SESC de Cinema 2025<br>Prêmio Catarinense de Cinema" },
            { t: "O Viajante e a Raposa", y: "2024", d: "direção" },
            { t: "(Sub)Urbana", y: "2023", d: "direção e co-roteirista", a: "5 prêmios de melhor filme<br>Prêmio Revelação – IV Transforma Festival<br>Exibição em mais de 20 festivais nacionais e internacionais" },
            { t: "No Reflexo do Meu Nome", y: "2022", d: "direção e roteiro", a: "Selecionado para mostra SESC de cinema nacional 2023<br>Mais de 15 festivais nacionais e internacionais" },
            { t: "Debaixo do Guarda-chuva pra ser Resistência", y: "2021", d: "direção e roteiro", a: "Selecionado em mais de 10 festivais" }
        ];
        document.getElementById('filmesList').innerHTML = filmes.map(f => `<div class="modal-item"><span class="modal-item-title">${f.t}</span><span class="modal-item-type">${f.d}</span><div class="modal-item-artists">${f.y}</div>${f.a ? `<div class="modal-item-awards">${f.a}</div>` : ''}</div>`).join('');
        
        // PRÊMIOS
        const premios = [
            { t: "5 Prêmios de Melhor Filme", a: "(Sub)Urbana – Festival SESC" },
            { t: "Prêmio Revelação", a: "Transforma Festival" },
            { t: "Curta Fest Brasília 2024", a: "Categoria Aranha" },
            { t: "SESC SC", a: "No Reflexo do Meu Nome – Reconhecimento Nacional" },
            { t: "Exibições Internacionais", a: "Trabalhos exibidos em festivais internacionais" }
        ];
        document.getElementById('premiosList').innerHTML = premios.map(p => `<div class="modal-item"><span class="modal-item-title">${p.t}</span><div class="modal-item-artists">${p.a}</div></div>`).join('');

        // VIDEOCLIPES
        const vcs = [
            { t: "Pote de Ouro", d: "assist. prod. executiva", a: "Liniker e Priscila Sena • 2025" },
            { t: "Dropar Teu Nome", d: "direção e roteiro", a: "Letrux feat Nouvella • 2025" },
            { t: "Vira Essa Boca Pra Cá", d: "direção e roteiro", a: "Letrux feat Nouvella • 2025" },
            { t: "Aranha", d: "direção e roteiro", a: "Letrux • 2024<br>Melhor videoclipe pelo Curta Fest Brasilia 2024" },
            { t: "Baião de Dois", d: "direção e direção de arte", a: "Aretuza Lovi & Getúlio Abelha • 2022" }
        ];
        document.getElementById('videoclipesList').innerHTML = vcs.map(v => `<div class="modal-item"><span class="modal-item-title">${v.t}</span><span class="modal-item-type">${v.d}</span><div class="modal-item-artists">${v.a}</div></div>`).join('');
        
        // CENOGRAFIA
        const ceno = [
            { t: "Santo", d: "assist. de arte", a: "Curta-metragem • 2025" },
            { t: "CERAVE - Pele Sequinha", d: "assist. de produção de objetos", a: "Publicidade • 2025" },
            { t: "Voe Azul", d: "assist. de objetos", a: "Publicidade • 2025" },
            { t: "Album - Som do Ale", d: "assist. de arte e cenografia", a: "Visualizer • 2025" }
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
