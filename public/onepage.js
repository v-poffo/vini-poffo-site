// Lógica para a página única (One Page)
document.addEventListener('DOMContentLoaded', function() {
    const projects = siteData.projects;
    let currentProjectIndex = 0;
    let isDesktop = window.innerWidth > 768;

    // --- 1. INICIALIZAÇÃO DA HERO (Baseado no script.js original) ---
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
        // Animação simples
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

    // --- 2. SEÇÃO PROJETOS (CARROSSEL HORIZONTAL) ---
    function renderProjectsCarousel() {
        const container = document.getElementById('projectsCarousel');
        if (!container) return;
        
        projects.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            // Rotação orgânica
            const rot = (i % 2 === 0 ? -1.5 : 1.5) * (Math.random() + 0.5);
            card.style.transform = `rotate(${rot}deg)`;
            
            card.innerHTML = `
                <div class="polaroid-wrapper">
                    <div class="polaroid-image-container">
                        <img src="assets/cartazes/${p.cartazMobile}" class="polaroid-image">
                    </div>
                    <div class="polaroid-label">
                        <h3 class="polaroid-title">${p.title}</h3>
                        <p class="polaroid-year">${p.year}</p>
                    </div>
                </div>
            `;
            
            card.onclick = () => {
                if (p.trailerUrl) window.open(p.trailerUrl, '_blank');
            };
            
            container.appendChild(card);
        });

        // Lógica de Scroll Horizontal com Mouse (Drag)
        const wrapper = document.getElementById('carouselWrapper');
        let isDown = false;
        let startX;
        let scrollLeft;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.classList.add('active');
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });
        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
        });
        wrapper.addEventListener('mouseup', () => {
            isDown = false;
        });
        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });
    }

    // --- 3. SEÇÃO SOBRE (MOSAICO) ---
    function renderAboutMosaic() {
        const grid = document.getElementById('aboutGrid');
        if (!grid) return;

        const aboutData = [
            { title: "Direção Criativa", text: "Transformando conceitos em experiências visuais memoráveis.", color: "blue" },
            { title: "Cinema", text: "Narrativas que provocam e emocionam através da lente.", color: "green" },
            { title: "Cenografia", text: "Espaços que contam histórias e amplificam a performance.", color: "blue" },
            { title: "Interdisciplinar", text: "A união de artes visuais, política e afeto.", color: "green" },
            { title: "Premiações", text: "Reconhecido pela Funarte e Mostra SESC de Cinema.", color: "blue" },
            { title: "Festivais", text: "Exibido em mais de 20 festivais nacionais e internacionais.", color: "green" },
            { title: "Artesanal", text: "Processo cuidadoso em cada detalhe da produção.", color: "blue" },
            { title: "Símbolos", text: "Uma linguagem visual rica em significados e metáforas.", color: "green" },
            { title: "Cinema Autoral", text: "Obras que refletem a identidade e visão de mundo do diretor.", color: "green" },
            { title: "Vamos Conversar?", text: "Entre em contato para novos projetos e colaborações.", color: "blue" }
        ];

        aboutData.forEach(d => {
            const card = document.createElement('div');
            card.className = 'flip-card';
            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front"></div>
                    <div class="flip-card-back ${d.color}">
                        <h4 class="flip-card-back-title">${d.title}</h4>
                        <p class="flip-card-back-text">${d.text}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.onclick = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    // Scroll Indicator
    document.querySelector('.scroll-indicator').onclick = () => {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    };

    // Iniciar tudo
    initializeHero();
    renderProjectsCarousel();
    renderAboutMosaic();
});
