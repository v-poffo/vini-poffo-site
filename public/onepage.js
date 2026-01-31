// Lógica para a página única (One Page) - Versão Refinada
document.addEventListener('DOMContentLoaded', function() {
    const projects = [...siteData.projects];
    let isDesktop = window.innerWidth > 768;

    // --- 1. HERO ---
    function initializeHero() {
        if (isDesktop) {
            renderHeroTitles();
        } else {
            setupMobileHero();
        }
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

    // --- 2. PROJETOS ---
    function renderProjectsCarousel(filter = 'todos') {
        const container = document.getElementById('projectsCarousel');
        if (!container) return;
        container.innerHTML = '';
        
        const filtered = filter === 'todos' ? siteData.projects : siteData.projects.filter(p => p.type === filter);
        
        filtered.forEach((p, i) => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${p.id}`;
            card.className = 'polaroid-card';
            const rot = (i % 2 === 0 ? -1.5 : 1.5) * (Math.random() + 0.5);
            card.style.transform = `rotate(${rot}deg)`;
            
            // Construir overlay técnico (como na página original)
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

    // --- 3. SOBRE & MODAIS ---
    const aboutContent = [
        { id: 1, type: 'text', color: 'green', title: "Vini Poffo", text: "Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Meu trabalho busca questionar narrativas convencionais e criar espaços para novas perspectivas através de uma abordagem artesanal. Cada projeto é atravessado por símbolos, política e afeto.", span: 2 },
        { id: 2, type: 'modal', color: 'blue', title: "Filmes", text: "Desenvolvo filmes autorais que investigam identidade, memória e território.", modal: 'filmesModal' },
        { id: 3, type: 'modal', color: 'blue', title: "Prêmios", text: "Reconhecimentos e prêmios conquistados ao longo da trajetória criativa.", modal: 'premiosModal' },
        { id: 4, type: 'text', color: 'green', title: "Processo Criativo", text: "Me interesso por imagens que carregam tempo. Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê.", span: 2 },
        { id: 5, type: 'modal', color: 'blue', title: "Videoclipes", text: "Direção e roteiro para diversos artistas da cena nacional.", modal: 'videoclipesModal' },
        { id: 6, type: 'modal', color: 'blue', title: "Arte & Cenografia", text: "Direção de arte e cenografia para cinema e publicidade.", modal: 'cenografiaModal' },
        { id: 7, type: 'text', color: 'green', title: "Trajetória", text: "Premiada pela Funarte (2021) e eleita pelo SESC SC (2022) com a melhor obra de Santa Catarina. Meus filmes já percorreram mais de 20 festivais nacionais e internacionais.", span: 2 },
        { id: 8, type: 'text', color: 'green', title: "Visão", text: "O cinema é uma ferramenta de transformação e escuta. Busco em cada frame a delicadeza e a força do que é humano.", span: 2 },
        { id: 9, type: 'text', color: 'green', title: "Cinema Autoral", text: "A produção independente como espaço de liberdade e experimentação estética.", span: 3 },
        { id: 10, type: 'contact', color: 'blue', title: "Vamos Conversar?", text: "Estou aberta a colaborações e novos projetos. Se você busca imagens com intenção, sensibilidade e presença, vamos trocar.", span: 3 }
    ];

    function renderAbout() {
        const grid = document.getElementById('aboutGrid');
        grid.innerHTML = '';
        aboutContent.forEach(c => {
            const card = document.createElement('div');
            card.className = 'flip-card';
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

    // Preencher listas dos modais (Dados simplificados baseados no sobre.html)
    function fillModals() {
        const filmes = [
            { t: "Tem Feito Uns Dias Esquisitos", y: "2025", d: "direção, roteiro e concepção de arte" },
            { t: "(Sub)Urbana", y: "2023", d: "direção e co-roteirista" },
            { t: "No Reflexo do Meu Nome", y: "2022", d: "direção e roteiro" }
        ];
        document.getElementById('filmesList').innerHTML = filmes.map(f => `<div class="modal-item"><span class="modal-item-title">${f.t}</span><span class="modal-item-type">${f.d}</span><div class="modal-item-artists">${f.y}</div></div>`).join('');
        
        const premios = ["5 Prêmios de Melhor Filme", "Prêmio Revelação - Transforma", "SESC SC - Melhor Obra"];
        document.getElementById('premiosList').innerHTML = premios.map(p => `<div class="modal-item"><span class="modal-item-title">${p}</span></div>`).join('');

        const vcs = ["Liniker e Priscila Sena • 2025", "Letrux feat Nouvella • 2025", "Aranha - Letrux • 2024"];
        document.getElementById('videoclipesList').innerHTML = vcs.map(v => `<div class="modal-item"><span class="modal-item-title">${v}</span></div>`).join('');
        
        const ceno = ["CERAVE - Pele Sequinha • 2025", "Nutren - Eu Me Vejo Pro-Idade • 2025", "Voe Azul • 2025"];
        document.getElementById('cenografiaList').innerHTML = ceno.map(c => `<div class="modal-item"><span class="modal-item-title">${c}</span></div>`).join('');
    }

    // Fechar modais
    document.querySelectorAll('.modal-close').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('show'));
    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.classList.remove('show'); };

    // Iniciar
    initializeHero();
    renderProjectsCarousel();
    renderAbout();
    fillModals();
});
