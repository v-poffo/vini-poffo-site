// Lógica para a página única (One Page) - Versão Final Otimizada
document.addEventListener('DOMContentLoaded', function() {
    const projects = [...siteData.projects];
    let isDesktop = window.innerWidth > 1024;

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
        if (container) {
            container.onscroll = () => {
                const idx = Math.round(container.scrollTop / container.offsetHeight);
                if (projects[idx]) {
                    titleMob.innerHTML = `<div class="project-info"><div class="project-title-large">${projects[idx].title}</div><div class="project-year">${projects[idx].year}</div></div>`;
                }
            };
        }
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
            if (isDesktop) {
                const rot = (Math.random() * 8 - 4).toFixed(1);
                card.style.transform = `rotate(${rot}deg)`;
            }
            
            let overlayText = "";
            if (p.type === 'curta-metragem') {
                const direcao = p.credits?.direcao?.join(' & ') || 'Vini Poffo';
                overlayText = `Curta-metragem ${p.title}, direção e roteiro de ${direcao}`;
                if (p.id === 'debaixo-do-guarda-chuva') overlayText = "Curta-metragem debaixo do guarda-chuva para ser resistência e direção e roteiro de Vini Poffo";
            } else {
                const artista = p.artist || '-';
                overlayText = `Videoclipe de ${p.title}, ${artista}, dirigido por Vini Poffo`;
            }
            
            card.innerHTML = `
                <div class="polaroid-wrapper">
                    <div class="polaroid-image-container">
                        <img src="assets/cartazes/${p.cartazMobile}" class="polaroid-image" loading="lazy">
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

        if (isDesktop) {
            gsap.from(".polaroid-card", {
                scrollTrigger: { trigger: ".projects-onepage", start: "top 80%" },
                y: (i) => (i % 4 === 0 ? 150 : i % 4 === 1 ? -150 : 0),
                x: (i) => (i % 4 === 2 ? 150 : i % 4 === 3 ? -150 : 0),
                opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out",
                onStart: () => {
                    setTimeout(() => {
                        document.querySelectorAll('.polaroid-image').forEach(img => img.classList.add('revealed'));
                    }, 500);
                }
            });
        } else {
            document.querySelectorAll('.polaroid-image').forEach(img => img.classList.add('revealed'));
        }
    }

    // Navegação Carrossel Mobile
    const carouselWrapper = document.getElementById('carouselWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn && nextBtn && carouselWrapper) {
        prevBtn.onclick = () => carouselWrapper.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
        nextBtn.onclick = () => carouselWrapper.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
    }

    // --- SOBRE ---
    const aboutContent = [
        { id: 1, type: 'text', color: 'green', title: "Vini Poffo", text: "Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Me interesso por imagens que carregam tempo.", modal: 'quemSouEuModal', img: "assets/quem-sou-eu/mobile-card-1.png" },
        { id: 2, type: 'modal', color: 'blue', title: "Filmes", modal: 'filmesModal', img: "assets/quem-sou-eu/mobile-card-2.jpg" },
        { id: 3, type: 'modal', color: 'blue', title: "Prêmios", modal: 'premiosModal', img: "assets/quem-sou-eu/mobile-card-3.png" },
        { id: 4, type: 'text', color: 'green', title: "Processo Criativo", text: "Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê.", modal: 'processoCriativoModal', img: "assets/quem-sou-eu/mobile-card-4.png" },
        { id: 5, type: 'modal', color: 'blue', title: "Videoclipes", modal: 'videoclipesModal', img: "assets/quem-sou-eu/mobile-card-5.png" },
        { id: 6, type: 'modal', color: 'blue', title: "Arte & Outros", modal: 'cenografiaModal', img: "assets/quem-sou-eu/mobile-card-6.png" },
        { id: 7, type: 'modal', color: 'blue', title: "Projetos", link: "projetos.html", img: "assets/quem-sou-eu/mobile-card-7.png" },
        { id: 8, type: 'text', color: 'green', title: "Direção", text: "Dirigir, pra mim, é estar presente e atenta aos detalhes, articulando para que conceito e execução caminhem juntos.", modal: 'direcaoModal', img: "assets/quem-sou-eu/mobile-card-8.png" },
        { id: 9, type: 'contact', color: 'blue', title: "Vamos Conversar", text: "Estou aberta a colaborações e novos projetos. Se você busca imagens com intenção, sensibilidade e presença, vamos trocar.", img: "assets/quem-sou-eu/mobile-card-9.png" },
        { id: 10, type: 'contact', color: 'blue', title: "Contato", img: "" }
    ];

    function renderAbout() {
        const grid = document.getElementById('aboutGrid');
        if (!grid) return;
        grid.innerHTML = '';
        aboutContent.forEach((c, i) => {
            if (!isDesktop && i === 9) return;
            if (isDesktop && i === 8 && c.title === "Vamos Conversar") {
                c.title = "Cinema Autoral";
                c.text = "Gosto quando a imagem tem vida própria, quando algo nela continua vibrando depois que termina.";
                c.type = "text";
                c.color = "green";
                delete c.modal;
            }
            
            const card = document.createElement('div');
            card.className = `flip-card clickable`;
            
            const frontStyle = !isDesktop ? `style="background-image: url('${c.img}'); background-attachment: scroll;"` : '';
            
            let backContent = `<h4 class="flip-card-back-title">${c.title}</h4>`;
            if (isDesktop || c.type === 'contact') backContent += `<p class="flip-card-back-text">${c.text || ''}</p>`;
            
            if (c.type === 'contact') {
                backContent += `
                <div class="flip-card-back-cta-buttons">
                    <a href="mailto:projetos@vinipoffo.com" class="flip-card-back-cta-btn">Email</a>
                    <a href="https://instagram.com/poffovini" target="_blank" class="flip-card-back-cta-btn">Instagram</a>
                </div>`;
            }

            card.innerHTML = `<div class="flip-card-inner"><div class="flip-card-front" ${frontStyle}></div><div class="flip-card-back ${c.color}">${backContent}</div></div>`;
            
            card.onclick = () => {
                if (!isDesktop && c.modal) {
                    document.getElementById(c.modal).classList.add('show');
                } else if (c.type === 'modal') {
                    document.getElementById(c.modal).classList.add('show');
                } else if (c.link) {
                    window.location.href = c.link;
                }
            };
            
            grid.appendChild(card);
        });
    }

    function fillModals() {
        const filmes = [
            { t: "Tem Feito Uns Dias Esquisitos", y: "2025", d: "direção, roteiro e concepção de arte", a: "Mostra SESC de Cinema 2025" },
            { t: "O Viajante e a Raposa", y: "2024", d: "direção", a: "" },
            { t: "(Sub)Urbana", y: "2023", d: "direção e co-roteirista", a: "5 prêmios de melhor filme • Prêmio Revelação – IV Transforma Festival" },
            { t: "No Reflexo do Meu Nome", y: "2022", d: "direção e roteiro", a: "Selecionado para mostra SESC de cinema nacional 2023" },
            { t: "Debaixo do Guarda-chuva pra ser Resistência", y: "2021", d: "direção e roteiro", a: "Selecionado em mais de 10 festivais" },
            { t: "Marias", y: "2021", d: "direção", a: "" }
        ];
        document.getElementById('filmesList').innerHTML = filmes.map(f => `<div class="modal-item"><span class="modal-item-title">${f.t}</span><span class="modal-item-type">${f.d}</span><div class="modal-item-artists">${f.y}</div>${f.a ? `<div class="modal-item-awards">${f.a}</div>` : ''}</div>`).join('');
        
        const vcs = [
            { t: "Pote de Ouro", d: "assist. prod. executiva", a: "Liniker • 2025" },
            { t: "Dropar Teu Nome", d: "direção e roteiro", a: "Letrux • 2025" },
            { t: "Aranha", d: "direção e roteiro", a: "Letrux • 2024" },
            { t: "Colapso Invisível", d: "direção e roteiro", a: "YMA • 2023" },
            { t: "Vira Essa Boca pra Cá", d: "direção e roteiro", a: "Letrux feat. Novella • 2022" },
            { t: "Zebulon", d: "direção e roteiro", a: "YMA • 2022" },
            { t: "Antene-se", d: "direção e roteiro", a: "Letrux • 2021" }
        ];
        document.getElementById('videoclipesList').innerHTML = vcs.map(v => `<div class="modal-item"><span class="modal-item-title">${v.t}</span><span class="modal-item-type">${v.d}</span><div class="modal-item-artists">${v.a}</div></div>`).join('');

        const ceno = [
            { t: "Santo", d: "assist. de arte", a: "Curta-metragem • 2025" },
            { t: "Voe Azul", d: "assist. de objetos", a: "Publicidade • 2025" },
            { t: "CERAVE", d: "assist. de arte", a: "Publicidade • 2024" },
            { t: "Nutren", d: "assist. de arte", a: "Publicidade • 2024" },
            { t: "Calma São Paulo", d: "direção de arte", a: "Editorial • 2023" }
        ];
        document.getElementById('cenografiaList').innerHTML = ceno.map(c => `<div class="modal-item"><span class="modal-item-title">${c.t}</span><span class="modal-item-type">${c.d}</span><div class="modal-item-artists">${c.a}</div></div>`).join('');
        
        const premios = [
            { t: "5 Prêmios de Melhor Filme", y: "2023", d: "Festival SESC", a: "(Sub)Urbana" },
            { t: "Prêmio Revelação", y: "2023", d: "Transforma Festival", a: "(Sub)Urbana" },
            { t: "Curta Fest Brasília 2024", y: "2024", d: "Categoria Aranha", a: "Aranha" },
            { t: "Prêmio Catarinense de Cinema", y: "2025", d: "Mostra SESC", a: "Tem Feito Uns Dias Esquisitos" }
        ];
        document.getElementById('premiosList').innerHTML = premios.map(p => `<div class="modal-item"><span class="modal-item-title">${p.t}</span><span class="modal-item-type">${p.d}</span><div class="modal-item-artists">${p.y}</div><div class="modal-item-awards">${p.a}</div></div>`).join('');

        // Textos Mobile
        document.getElementById('quemSouEuText').innerHTML = `<p class="modal-item-text-p">Sou cineasta, diretora criativa e artista, com foco em cinema, videoclipes e projetos publicitários. Me interesso por imagens que carregam tempo.<br><br>Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê.</p>`;
        document.getElementById('processoCriativoText').innerHTML = `<p class="modal-item-text-p">Me interesso por imagens que carregam tempo. Cenários, objetos, corpos e luz estão ali para dizer alguma coisa. Meu processo criativo parte da imagem como sensação. A imagem precisa atravessar o corpo, criar estado e provocar alguma coisa em quem vê. Trabalho com objetos de memória — elementos que carregam vida dentro da obra.</p>`;
        document.getElementById('direcaoText').innerHTML = `<p class="modal-item-text-p">Acredito no cinema e no audiovisual como prática coletiva. Tenho experiência em liderar equipes, dialogar com diferentes departamentos e construir processos colaborativos, respeitando os tempos e as singularidades de cada projeto. Dirigir, pra mim, é estar presente e atenta aos detalhes, articulando para que conceito e execução caminhem juntos.</p>`;
        document.getElementById('cinemaAutoralText').innerHTML = `<p class="modal-item-text-p">Cada filme ou videoclipe é resultado de referências, vivências, observação de corpos, espaços e gestos cotidianos. O cinema se constrói aos poucos, carrega marcas do processo, do tempo e das pessoas envolvidas. Gosto quando a imagem tem vida própria, quando algo nela continua vibrando depois que termina.</p>`;
    }

    document.querySelectorAll('.modal-close').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('show'));
    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.classList.remove('show'); };

    initializeHero();
    renderProjectsCarousel();
    renderAbout();
    fillModals();
});
