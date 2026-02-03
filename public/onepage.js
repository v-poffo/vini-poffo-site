// Lógica para a página única (One Page) - Versão Final Otimizada
document.addEventListener('DOMContentLoaded', function() {
    // Filtrar apenas projetos com vídeo de capa e ordenar por ano (mais recente primeiro)
    const projects = [...siteData.projects].filter(p => p.videoHome && p.videoHome !== '').sort((a, b) => b.year - a.year);
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
        projects.slice(0, 3).forEach((p, i) => {
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
            video.loop = false; // Desabilitar loop para detectar fim
            video.play();
            
            // Auto-rotação quando vídeo terminar
            video.onended = () => {
                projects.push(projects.shift());
                renderHeroTitles();
                updateHeroVideo(0);
            };
        }
    }

    function setupMobileHero() {
        const inside = document.getElementById('heroTitleInsideMobile');
        const outside = document.getElementById('heroTitleOutsideMobile');
        
        if (inside && projects[0]) {
            inside.innerHTML = `<span class="title-text">${projects[0].title.toUpperCase()}</span><span class="title-year">${projects[0].year}</span>`;
        }
        
        if (outside && projects[1]) {
            outside.innerHTML = `<span class="title-text">${projects[1].title.toUpperCase()}</span><span class="title-year">${projects[1].year}</span>`;
        }
        
        const outsideContainer = document.querySelector('.hero-title-outside-mobile');
        if (outsideContainer) {
            outsideContainer.onclick = () => rotateHeroMobile();
        }
        
        updateHeroVideoMobile(0);
    }

    function rotateHeroMobile() {
        projects.push(projects.shift());
        setupMobileHero();
    }

    function updateHeroVideoMobile(idx) {
        const video = document.getElementById('heroVideoMobile');
        if (video && projects[idx]) {
            video.src = `assets/videos/${projects[idx].videoHome}`;
            video.loop = false; // Desabilitar loop para detectar fim
            video.play();
            
            // Auto-rotação quando vídeo terminar
            video.onended = () => {
                rotateHeroMobile();
            };
        }
    }

    // --- PROJETOS ---
    function renderProjectsCarousel(filter = 'todos') {
        const container = document.getElementById('projectsCarousel');
        if (!container) return;
        container.innerHTML = '';
        const filtered = (filter === 'todos' ? siteData.projects : siteData.projects.filter(p => p.type === filter)).sort((a, b) => b.year - a.year);
        
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
    const aboutContent = siteData.site.aboutCards;

    function renderAbout() {
        const grid = document.getElementById('aboutGrid');
        if (!grid) return;
        grid.innerHTML = '';
        
        // No mobile: substituir card 9 (Cinema Autoral) por card 10 (Vamos Conversar)
        let cardsToRender = aboutContent;
        if (!isDesktop) {
            cardsToRender = aboutContent.map((card, idx) => {
                if (idx === 8) return aboutContent[9]; // Card 9 vira "Vamos Conversar"
                if (idx === 9) return null; // Card 10 não renderiza
                return card;
            }).filter(c => c !== null);
        }
        
        cardsToRender.forEach((c, i) => {
            const card = document.createElement('div');
            const isClickable = (c.type === 'modal' && c.modal) || c.link;
            card.className = isClickable ? 'flip-card clickable' : 'flip-card';
            
            const frontStyle = !isDesktop ? `style="background-image: url('${c.img}'); background-attachment: scroll;"` : '';
            
            let backContent = `<h4 class="flip-card-back-title">${c.title}</h4>`;
            if (isDesktop || c.type === 'contact') backContent += `<p class="flip-card-back-text">${c.text || ''}</p>`;
            
            if (c.type === 'contact') {
                backContent += `
                <div class="flip-card-back-cta-buttons">
                    <a href="mailto:projetos@vinipoffo.com" class="flip-card-back-cta-btn">Me mande um email</a>
                    <a href="https://instagram.com/poffovini" target="_blank" class="flip-card-back-cta-btn">Me siga no Instagram</a>
                </div>`;
            }

            card.innerHTML = `<div class="flip-card-inner"><div class="flip-card-front" ${frontStyle}></div><div class="flip-card-back ${c.color}">${backContent}</div></div>`;
            
            card.onclick = () => {
                // No mobile: abrir modais de texto (type="text") e modais normais (type="modal")
                if (!isDesktop && c.modal && (c.type === 'text' || c.type === 'modal')) {
                    document.getElementById(c.modal).classList.add('show');
                } else if (isDesktop && c.type === 'modal') {
                    // No desktop: apenas modais normais (não texto)
                    document.getElementById(c.modal).classList.add('show');
                } else if (c.link) {
                    window.location.href = c.link;
                }
            };
            
            grid.appendChild(card);
        });
    }

    function fillModals() {
        // Filmes - ordenar por ano (mais recente primeiro)
        const filmes = [...siteData.site.modals.filmes].sort((a, b) => parseInt(b.y) - parseInt(a.y));
        document.getElementById('filmesList').innerHTML = filmes.map(f => `<div class="modal-item"><span class="modal-item-title">${f.t}</span><span class="modal-item-type">${f.d}</span><div class="modal-item-artists">${f.y}</div>${f.a ? `<div class="modal-item-awards">${f.a}</div>` : ''}</div>`).join('');
        
        // Videoclipes - ordenar por ano e ajustar formato: Título + Artista, depois Ano + Função
        const vcs = [...siteData.site.modals.videoclipes].sort((a, b) => parseInt(b.y) - parseInt(a.y));
        document.getElementById('videoclipesList').innerHTML = vcs.map(v => `<div class="modal-item"><span class="modal-item-title">${v.t}</span><span class="modal-item-type">${v.d}</span><div class="modal-item-artists">${v.y} • direção</div>${v.a ? `<div class="modal-item-awards">${v.a}</div>` : ''}</div>`).join('');

        // Cenografia - ordenar por ano e ajustar formato
        const ceno = [...siteData.site.modals.cenografia].sort((a, b) => {
            const yearA = parseInt(a.y.split('-')[0]) || parseInt(a.y);
            const yearB = parseInt(b.y.split('-')[0]) || parseInt(b.y);
            return yearB - yearA;
        });
        document.getElementById('cenografiaList').innerHTML = ceno.map(c => `<div class="modal-item"><span class="modal-item-title">${c.t}</span><span class="modal-item-type">${c.d}</span><div class="modal-item-artists">${c.a} • ${c.y}</div></div>`).join('');
        
        // Prêmios - ordenar por ano (mais recente primeiro)
        const premios = [...siteData.site.modals.premios].sort((a, b) => parseInt(b.y) - parseInt(a.y));
        document.getElementById('premiosList').innerHTML = premios.map(p => `<div class="modal-item"><span class="modal-item-title">${p.t}</span><span class="modal-item-type">${p.d}</span><div class="modal-item-artists">${p.y}</div><div class="modal-item-awards">${p.a}</div></div>`).join('');

        // Textos Mobile
        document.getElementById('quemSouEuText').innerHTML = `<p class="modal-item-text-p">${siteData.site.aboutCards[0].text}</p>`;
        document.getElementById('processoCriativoText').innerHTML = `<p class="modal-item-text-p">${siteData.site.aboutCards[3].text}</p>`;
        document.getElementById('direcaoText').innerHTML = `<p class="modal-item-text-p">${siteData.site.aboutCards[7].text}</p>`;
        document.getElementById('cinemaAutoralText').innerHTML = `<p class="modal-item-text-p">${siteData.site.aboutCards[8].text}</p>`;
    }

    document.querySelectorAll('.modal-close').forEach(b => b.onclick = () => b.closest('.modal').classList.remove('show'));
    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.classList.remove('show'); };

    // --- MENU HAMBÚRGUER E NAVEGAÇÃO ---
    function initializeMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Toggle do menu hambúrguer
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Navegação suave para as seções
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Verifica se é um link de âncora na mesma página
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        // Scroll suave até a seção
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Fecha o menu após clicar (mobile)
                        if (hamburger && navMenu) {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                        }
                    }
                }
            });
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (navMenu && hamburger) {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    // --- FILTROS DE PROJETOS ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderProjectsCarousel(filter);
        });
    });

    initializeHero();
    renderProjectsCarousel();
    renderAbout();
    fillModals();
    initializeMenu();
});
