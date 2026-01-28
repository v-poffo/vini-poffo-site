// Script para interatividade do site

document.addEventListener('DOMContentLoaded', function() {
    const projects = siteData.projects;
    let currentProjectIndex = 0;

    // Inicializar página
    initializeHome();
    setupHamburgerMenu();
    setupProjectNavigation();
    setupResponsiveMedia();

    // Função para inicializar a home
    function initializeHome() {
        renderProjectsList();
        renderProjectsGrid();
        updateHeroMedia(currentProjectIndex);
    }

    // Renderizar lista de títulos na hero section
    function renderProjectsList() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        projectsList.innerHTML = '';
        projects.forEach((project, index) => {
            const titleElement = document.createElement('div');
            titleElement.className = `project-title ${index === 0 ? 'active' : ''}`;
            titleElement.textContent = project.title;
            titleElement.addEventListener('click', () => {
                setActiveProject(index);
            });
            projectsList.appendChild(titleElement);
        });
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

    // Atualizar mídia do hero (vídeo ou cartaz)
    function updateHeroMedia(index) {
        const project = projects[index];
        const heroVideo = document.getElementById('heroVideo');
        const heroCartaz = document.getElementById('heroCartaz');

        if (heroVideo) {
            heroVideo.src = `assets/videos/${project.videoHome}`;
            heroVideo.play();
        }

        if (heroCartaz) {
            heroCartaz.src = `assets/cartazes/${project.cartazMobile}`;
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
        // Auto-rotação de vídeos a cada 10 segundos (opcional)
        // setInterval(() => {
        //     currentProjectIndex = (currentProjectIndex + 1) % projects.length;
        //     setActiveProject(currentProjectIndex);
        // }, 10000);
    }

    // Setup de mídia responsiva
    function setupResponsiveMedia() {
        window.addEventListener('resize', () => {
            // Ajustar mídia conforme o tamanho da tela
            updateHeroMedia(currentProjectIndex);
        });
    }

    // Atualizar link ativo na navegação
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateActiveNavLink();
});

// Função para extrair parâmetros da URL
function getUrlParameter(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}
