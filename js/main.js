// ===== DTecBiz 2026 — interactions =====
(function () {
    'use strict';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile navigation ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
        });
        mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mainNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }));
    }

    /* ---------- Header shrink + scroll progress ---------- */
    const header = document.querySelector('.site-header');
    const progress = document.getElementById('scrollProgress');
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 30);
        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        }
        const st = document.getElementById('scrollTop');
        if (st) st.classList.toggle('show', y > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll-to-top ---------- */
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ---------- Countdown to 7 July 2026, 08:00 (UTC+5:30) ---------- */
    const countdownEl = document.querySelector('.countdown');
    if (countdownEl) {
        const target = new Date('2026-07-07T08:00:00+05:30').getTime();
        const pad = n => String(n).padStart(2, '0');
        const set = (u, v) => { const el = countdownEl.querySelector('[data-unit="' + u + '"]'); if (el) el.textContent = pad(v); };
        const tick = () => {
            const diff = Math.max(0, target - Date.now());
            set('days', Math.floor(diff / 86400000));
            set('hours', Math.floor(diff / 3600000) % 24);
            set('minutes', Math.floor(diff / 60000) % 60);
            set('seconds', Math.floor(diff / 1000) % 60);
        };
        tick();
        setInterval(tick, 1000);
    }

    /* ---------- Scroll reveal (auto-applied) ---------- */
    const revealSelectors = ['.section-head', '.split > div', '.card', '.theme', '.count-box',
        '.speaker', '.pub-box', '.contact-card', '.logo-card', '.table-wrap', '.venue-block',
        '.gallery-grid .img-ph', '.content > h2', '.content > h3', '.content > p', '.content > ul',
        '.note', '.hero-cobrand', '.hero h1', '.hero-meta', '.hero-tagline', '.hero-cta'];
    const revealEls = [];
    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.hasAttribute('data-reveal')) { el.setAttribute('data-reveal', ''); revealEls.push(el); }
        });
    });
    // stagger siblings within grids
    document.querySelectorAll('.cards, .themes-grid, .speakers, .gallery-grid, .countdown, .contact-grid, .hostband .logos').forEach(grid => {
        [...grid.children].forEach((child, i) => {
            if (child.hasAttribute('data-reveal')) child.classList.add('d' + (Math.min(i % 5, 4) + 1));
        });
    });

    if (reduce) {
        revealEls.forEach(el => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(el => io.observe(el));
    }

    /* ---------- 3D tilt on cards ---------- */
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        const tiltEls = document.querySelectorAll('.card, .speaker, .contact-card, .count-box, .logo-card');
        tiltEls.forEach(el => {
            el.classList.add('tilt');
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = 'perspective(760px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg) translateY(-6px)';
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; });
        });
    }

    /* ---------- Hero circuit-network canvas ---------- */
    const canvas = document.getElementById('heroCanvas');
    if (canvas && !reduce) {
        const ctx = canvas.getContext('2d');
        let w, h, dpr, nodes, raf;
        const mouse = { x: -9999, y: -9999 };

        function size() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(90, Math.floor(w * h / 14000));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.8
            }));
        }
        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
                if (dm < 130) { n.x += (n.x - mouse.x) / dm * 0.6; n.y += (n.y - mouse.y) / dm * 0.6; }
                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const d = Math.hypot(n.x - m.x, n.y - m.y);
                    if (d < 128) {
                        ctx.strokeStyle = 'rgba(70,214,223,' + (1 - d / 128) * 0.30 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
                    }
                }
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(120,205,240,0.85)'; ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }
        const hero = canvas.closest('.hero');
        if (hero) {
            hero.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
            hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
        }
        window.addEventListener('resize', () => { cancelAnimationFrame(raf); size(); draw(); });
        size(); draw();
    }
})();
