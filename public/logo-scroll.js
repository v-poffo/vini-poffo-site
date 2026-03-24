/**
 * logo-scroll.js
 * Animação de scroll da logo — inspirada no site da Rockstar Games (GTA VI)
 *
 * Comportamento:
 * 1. Ao carregar a página, a logo fica invisível e o hint de scroll aparece
 * 2. Quando o usuário começa a rolar, a logo aparece grande e centralizada
 * 3. Conforme o scroll avança, a logo diminui e sobe em direção ao navbar
 * 4. Quando a logo chega ao navbar (posição final), a logo do navbar aparece
 *    e a animação de intro termina — a página continua rolando normalmente
 * 5. O vídeo de fundo continua rodando durante toda a animação
 */

(function () {
    'use strict';

    /* -------------------------------------------------------
       Utilitários
    ------------------------------------------------------- */
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // Easing suave (ease-in-out quadrático)
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    /* -------------------------------------------------------
       Animação do canvas dentro da logo (efeito vídeo/luz)
    ------------------------------------------------------- */
    var offCanvas = document.createElement('canvas');
    offCanvas.width = 960;
    offCanvas.height = 502;
    var offCtx = offCanvas.getContext('2d');
    var frameCount = 0;

    var logoVideoFrame = document.getElementById('logoVideoFrame');
    var logoSolid = document.getElementById('logoSolid');

    function drawLogoFrame() {
        frameCount++;
        var t = frameCount * 0.008;
        var w = offCanvas.width;
        var h = offCanvas.height;

        // Fundo base
        offCtx.fillStyle = '#0d1610';
        offCtx.fillRect(0, 0, w, h);

        // Blobs de luz animados — tons verdes/esmeralda
        var blobs = [
            { x: 0.25, y: 0.55, r: 220, hue: 155 },
            { x: 0.65, y: 0.35, r: 180, hue: 168 },
            { x: 0.45, y: 0.75, r: 150, hue: 142 },
            { x: 0.78, y: 0.60, r: 140, hue: 160 },
            { x: 0.15, y: 0.30, r: 120, hue: 148 },
            { x: 0.55, y: 0.20, r: 100, hue: 172 }
        ];

        blobs.forEach(function (b, i) {
            var bx = (b.x + Math.sin(t * 0.55 + i * 1.4) * 0.18) * w;
            var by = (b.y + Math.cos(t * 0.45 + i * 1.1) * 0.20) * h;
            var radius = b.r + Math.sin(t + i) * 35;
            var g = offCtx.createRadialGradient(bx, by, 0, bx, by, radius);
            var hue = b.hue + Math.sin(t * 0.18) * 18;
            g.addColorStop(0, 'hsla(' + hue + ',32%,24%,0.80)');
            g.addColorStop(1, 'transparent');
            offCtx.fillStyle = g;
            offCtx.fillRect(0, 0, w, h);
        });

        // Atualizar o frame no SVG
        if (logoVideoFrame) {
            logoVideoFrame.setAttribute('href', offCanvas.toDataURL('image/jpeg', 0.65));
        }

        requestAnimationFrame(drawLogoFrame);
    }

    /* -------------------------------------------------------
       Lógica principal de scroll
    ------------------------------------------------------- */
    var heroLogoContainer = document.getElementById('heroLogoContainer');
    var scrollHint = document.getElementById('scrollHint');
    var mainNavbar = document.getElementById('mainNavbar');
    var navLogoImg = document.getElementById('navLogoImg');
    var heroIntroWrapper = document.getElementById('hero'); // section.hero-intro-wrapper

    // Duração do scroll de intro em pixels
    // (deve corresponder ao height da .hero-intro-wrapper menos 100vh)
    // hero-intro-wrapper = 350vh, então o espaço de animação = 250vh
    var SCROLL_DURATION = 0; // calculado dinamicamente
    var NAVBAR_HEIGHT = 0;   // calculado dinamicamente

    function recalcDimensions() {
        var vh = window.innerHeight;
        // A seção tem 350vh, o sticky ocupa 100vh.
        // Então o scroll disponível para animação = 350vh - 100vh = 250vh
        SCROLL_DURATION = vh * 2.5;
        NAVBAR_HEIGHT = mainNavbar ? mainNavbar.offsetHeight : 60;
    }

    // Escala inicial (logo grande) e final (logo no navbar)
    var SCALE_START = 1.0;   // 100% do tamanho do SVG (já definido por CSS como 70vw)
    var SCALE_END_DESKTOP = 0.075; // tamanho final no navbar (desktop)
    var SCALE_END_MOBILE = 0.12;   // tamanho final no navbar (mobile)

    var isAnimationDone = false;
    var lastScrollY = -1;

    function getScaleEnd() {
        return window.innerWidth <= 768 ? SCALE_END_MOBILE : SCALE_END_DESKTOP;
    }

    function updateLogoAnimation() {
        if (!heroLogoContainer || !heroIntroWrapper) return;

        var scrollY = window.scrollY || window.pageYOffset;

        // Evitar recalcular se o scroll não mudou
        if (scrollY === lastScrollY) return;
        lastScrollY = scrollY;

        recalcDimensions();

        var vh = window.innerHeight;

        // scrollY relativo ao início da seção de intro
        var sectionTop = heroIntroWrapper.offsetTop;
        var relativeScroll = scrollY - sectionTop;

        // Progresso da animação: 0 = início, 1 = fim
        var progress = clamp(relativeScroll / SCROLL_DURATION, 0, 1);
        var easedProgress = easeInOut(progress);

        // --- Visibilidade ---
        if (relativeScroll < 5) {
            // No topo: logo invisível, hint visível
            heroLogoContainer.style.opacity = '0';
            if (scrollHint) scrollHint.style.opacity = '1';
            isAnimationDone = false;
            // Mostrar logo do navbar ao voltar ao topo
            if (mainNavbar) mainNavbar.classList.add('navbar-logo-hidden');
            return;
        }

        // Logo aparece
        var logoOpacity = clamp(relativeScroll / 80, 0, 1);
        heroLogoContainer.style.opacity = String(logoOpacity);

        // Hint desaparece
        if (scrollHint) {
            scrollHint.style.opacity = relativeScroll > 30 ? '0' : '1';
        }

        // --- Escala ---
        var scaleEnd = getScaleEnd();
        var scale = SCALE_START + (scaleEnd - SCALE_START) * easedProgress;

        // --- Posição vertical ---
        // A logo começa no centro (translateY = 0 relativo ao translate(-50%,-50%))
        // e sobe até o navbar
        // Posição Y do centro da viewport: 0
        // Posição Y do navbar: -(vh/2) + NAVBAR_HEIGHT/2 + alguns pixels de margem
        var targetNavY = -(vh / 2) + NAVBAR_HEIGHT / 2 + 8;
        var ty = targetNavY * easedProgress;

        heroLogoContainer.style.transform =
            'translate(-50%, calc(-50% + ' + ty + 'px)) scale(' + scale + ')';

        // --- Quando a animação termina ---
        if (progress >= 0.95) {
            // Fade out suave da logo animada nos últimos 5% do scroll
            var fadeOut = clamp((progress - 0.95) / 0.05, 0, 1);
            heroLogoContainer.style.opacity = String(1 - fadeOut);
            
            // Revelar logo do navbar progressivamente
            if (mainNavbar) mainNavbar.classList.remove('navbar-logo-hidden');
            
            if (progress >= 0.98 && !isAnimationDone) {
                isAnimationDone = true;
            }
        } else if (progress < 0.95 && isAnimationDone) {
            isAnimationDone = false;
            if (mainNavbar) mainNavbar.classList.add('navbar-logo-hidden');
        }
    }

    /* -------------------------------------------------------
       Inicialização
    ------------------------------------------------------- */
    function init() {
        recalcDimensions();

        // Garantir estado inicial
        if (heroLogoContainer) {
            heroLogoContainer.style.opacity = '0';
            heroLogoContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        }

        if (mainNavbar) {
            mainNavbar.classList.add('navbar-logo-hidden');
        }

        // Iniciar animação do canvas
        drawLogoFrame();

        // Listener de scroll
        window.addEventListener('scroll', updateLogoAnimation, { passive: true });

        // Recalcular dimensões ao redimensionar
        window.addEventListener('resize', function () {
            recalcDimensions();
            updateLogoAnimation();
        });

        // Executar uma vez para o estado inicial
        updateLogoAnimation();
    }

    // Aguardar DOM pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
