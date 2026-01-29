// Script para interatividade do site

document.addEventListener('DOMContentLoaded', function() {
    const projects = siteData.projects;
    let currentProjectIndex = 0;
    let isDesktop = window.innerWidth > 768;
    
    // Variáveis do carrossel de títulos - Estilo A24
    const VISIBLE_TITLES = 4;

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

    // Renderizar lista de títulos na hero section (Desktop) - ESTILO A24
    function renderProjectsList() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        projectsList.innerHTML = '';
        
        // Mostrar apenas os primeiros VISIBLE_TITLES títulos
        const visibleProjects = projects.slice(0, VISIBLE_TITLES);
        
        visibleProjects.forEach((project, index) => {
            const titleElement = document.createElement('div');
            titleElement.className = `project-title ${index === 0 ? 'active' : ''}`;
            titleElement.dataset.projectIndex = index;
            titleElement.innerHTML = `
                <span class="title-text">${project.title.toUpperCase()}</span>
                <span class="title-year">${project.year}</span>
            `;
            titleElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectProject(index);
            });
            projectsList.appendChild(titleElement);
        });
    }

    // Selecionar projeto e rotacionar títulos
    function selectProject(clickedIndex) {
        if (clickedIndex === 0) {
            // Já é o primeiro, só atualiza o vídeo
            updateHeroMedia(currentProjectIndex);
            return;
        }
        
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;
        
        // Rotacionar array de projetos
        for (let i = 0; i < clickedIndex; i++) {
            const first = projects.shift();
            projects.push(first);
        }
        
        // Atualizar índice atual
        currentProjectIndex = 0;
        
        // Re-renderizar títulos com animação
        const titles = projectsList.querySelectorAll('.project-title');
        titles.forEach((title, i) => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-20px)';
        });
        
        setTimeout(() => {
            renderProjectsList();
            updateHeroMedia(0);
            
            // Animar entrada
            const newTitles = projectsList.querySelectorAll('.project-title');
            newTitles.forEach((title, i) => {
                title.style.opacity = '0';
                title.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    title.style.transition = 'all 0.3s ease';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, i * 50);
            });
        }, 200);
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

    // Renderizar grid de projetos na seção de projetos (SEM TAG DE TIPO)
    function renderProjectsGrid() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        siteData.projects.forEach((project) => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${project.id}`;
            card.className = 'project-card';
            card.innerHTML = `
                <img src="assets/cartazes/${project.cartazMobile}" alt="${project.title}" class="project-card-image">
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title.toUpperCase()}</h3>
                    <p class="project-card-meta">${project.year}</p>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Atualizar mídia do hero (vídeo ou cartaz)
    function updateHeroMedia(index) {
        const project = projects[index];
        const heroVideo = document.getElementById('heroVideo');

        if (heroVideo && project) {
            heroVideo.src = `assets/videos/${project.videoHome}`;
            heroVideo.play();
        }
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
        // Auto-rotação desabilitada
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
            if (!heroSection) return;
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
                location.reload();
            }
        });
    }

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
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? siteData.projects 
            : siteData.projects.filter(p => p.type === filter);

        filteredProjects.forEach(project => {
            const card = document.createElement('a');
            card.href = `projeto.html?id=${project.id}`;
            card.className = 'project-card';
            card.innerHTML = `
                <img src="assets/cartazes/${project.cartazMobile}" alt="${project.title}" class="project-card-image">
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title.toUpperCase()}</h3>
                    <p class="project-card-meta">${project.year}</p>
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
