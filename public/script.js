// Script para interatividade do site

document.addEventListener('DOMContentLoaded', function() {
    const projects = siteData.projects;
    let currentProjectIndex = 0;
    let isDesktop = window.innerWidth > 768;

    // Inicializar página
    initializeHome();
    setupHamburgerMenu();
    setupProjectNavigation();
    setupScrollIndicator();
    setupResponsiveMedia();
    setupMobileCarousel();

    // Função para inicializar a home
    function initializeHome() {
        if (isDesktop) {
            renderProjectsList();
        }
        renderProjectsGrid();
        updateHeroMedia(currentProjectIndex);
    }

    // Renderizar lista de títulos na hero section (Desktop) - CARROSSEL
    let titleScrollOffset = 0;
    const VISIBLE_TITLES = 4;
    const TITLE_HEIGHT = 60; // Aproximado em pixels

    function renderProjectsList() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        projectsList.innerHTML = '';
        projectsList.style.overflow = 'hidden';
        projectsList.style.height = `${VISIBLE_TITLES * TITLE_HEIGHT}px`;

        projects.forEach((project, index) => {
            const titleElement = document.createElement('div');
            titleElement.className = `project-title ${index === 0 ? 'active' : ''}`;
            titleElement.textContent = project.title;
            titleElement.style.transition = 'transform 0.3s ease';
            titleElement.addEventListener('click', () => {
                setActiveProject(index);
                scrollTitleIntoView(index);
            });
            projectsList.appendChild(titleElement);
        });

        setupTitleCarousel();
    }

    function setupTitleCarousel() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        // Scroll com mouse wheel
        projectsList.addEventListener('wheel', (e) => {
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            scrollTitles(direction);
        });

        // Scroll com mouse move (para cima/baixo)
        projectsList.addEventListener('mousemove', (e) => {
            const rect = projectsList.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const threshold = 30;

            if (relativeY < threshold) {
                // Mouse perto do topo - scroll para cima
                scrollTitles(-1);
            } else if (relativeY > rect.height - threshold) {
                // Mouse perto do fundo - scroll para baixo
                scrollTitles(1);
            }
        });
    }

    function scrollTitles(direction) {
        const titles = document.querySelectorAll('.project-title');
        const maxScroll = Math.max(0, titles.length - VISIBLE_TITLES);

        titleScrollOffset += direction;
        titleScrollOffset = Math.max(0, Math.min(titleScrollOffset, maxScroll));

        titles.forEach((title, index) => {
            const offset = (index - titleScrollOffset) * TITLE_HEIGHT;
            title.style.transform = `translateY(${-offset}px)`;
        });
    }

    function scrollTitleIntoView(index) {
        const maxScroll = Math.max(0, projects.length - VISIBLE_TITLES);
        titleScrollOffset = Math.max(0, Math.min(index, maxScroll));

        const titles = document.querySelectorAll('.project-title');
        titles.forEach((title, i) => {
            const offset = (i - titleScrollOffset) * TITLE_HEIGHT;
            title.style.transform = `translateY(${-offset}px)`;
        });
    }

    // Renderizar carrossel vertical para mobile
    function setupMobileCarousel() {
        const carouselItems = document.getElementById('carouselItems');
        if (!carouselItems) return;

        // Criar items do carrossel
        projects.forEach((project, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `<img src="assets/cartazes/${project.cartazMobile}" alt="${project.title}">`;
            carouselItems.appendChild(item);
        });

        // Atualizar título ao rolar
        const carouselContainer = document.querySelector('.carousel-items');
        if (carouselContainer) {
            carouselContainer.addEventListener('scroll', () => {
                const scrollPosition = carouselContainer.scrollTop;
                const itemHeight = carouselContainer.offsetHeight;
                const newIndex = Math.round(scrollPosition / itemHeight);
                
                if (newIndex !== currentProjectIndex && newIndex < projects.length) {
                    currentProjectIndex = newIndex;
                    updateMobileTitle(currentProjectIndex);
                }
            });
        }

        // Atualizar título inicial
        updateMobileTitle(0);
    }

    // Atualizar título no mobile
    function updateMobileTitle(index) {
        const project = projects[index];
        const titleContainer = document.getElementById('heroTitleMobile');
        
        if (titleContainer) {
            titleContainer.innerHTML = `
                <div class="project-info">
                    <div class="project-title-large">${project.title}</div>
                    <div class="project-year">${project.year}</div>
                </div>
            `;
        }
    }

    // Renderizar grid de projetos na seção de projetos
    function renderProjectsGrid() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        projects.forEach((project) => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${project.id}`;
            card.className = 'project-card';
            card.innerHTML = `
                <img src="assets/cartazes/${project.cartazMobile}" alt="${project.title}" class="project-card-image">
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-meta">${project.year}</p>
                    <span class="project-card-type">${project.type}</span>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Atualizar mídia do hero (vídeo ou cartaz) - SEM EFEITO
    function updateHeroMedia(index) {
        const project = projects[index];
        const heroVideo = document.getElementById('heroVideo');

        if (heroVideo) {
            heroVideo.src = `assets/videos/${project.videoHome}`;
            heroVideo.play();
        }
    }

    // Definir projeto ativo
    function setActiveProject(index) {
        currentProjectIndex = index;
        updateHeroMedia(index);

        // Atualizar classe ativa nos títulos
        const titles = document.querySelectorAll('.project-title');
        titles.forEach((title, i) => {
            title.classList.toggle('active', i === index);
        });
    }

    // Setup do menu hamburger
    function setupHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Fechar menu ao clicar em um link
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    }

    // Setup da navegação de projetos
    function setupProjectNavigation() {
        // Você pode adicionar auto-rotação aqui se quiser
        // setInterval(() => {
        //     currentProjectIndex = (currentProjectIndex + 1) % projects.length;
        //     setActiveProject(currentProjectIndex);
        // }, 10000);
    }

    // Setup da seta de scroll
    function setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        // Clicar na seta leva para a próxima seção
        scrollIndicator.addEventListener('click', () => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Esconder seta quando rolar para baixo
        window.addEventListener('scroll', () => {
            const heroSection = document.getElementById('hero');
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight;

            if (scrollPosition > heroBottom - 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }

    // Setup de mídia responsiva
    function setupResponsiveMedia() {
        window.addEventListener('resize', () => {
            const wasDesktop = isDesktop;
            isDesktop = window.innerWidth > 768;
            
            if (wasDesktop !== isDesktop) {
                // Reinicializar quando mudar de desktop para mobile ou vice-versa
                location.reload();
            }
        });
    }

    // Atualizar link ativo na navegação
    function updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Marcar "Home" como ativo por padrão
        navLinks[0].classList.add('active');
    }

    updateActiveNavLink();

    // Setup de filtro de projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });

    function filterProjects(filter) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(p => p.type === filter);

        filteredProjects.forEach(project => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${project.id}`;
            card.className = 'project-card';
            card.innerHTML = `
                <img src="assets/cartazes/${project.cartazMobile}" alt="${project.title}" class="project-card-image">
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-meta">${project.year}</p>
                    <span class="project-card-type">${project.type}</span>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }
});

// Função para extrair parâmetros da URL
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}
