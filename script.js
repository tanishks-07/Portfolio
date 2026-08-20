// ---------- loader ----------
const loaderPct = document.querySelector('#loader .pct');
const loaderBar = document.querySelector('#loader .track i');
let pct = 0;
const loaderInterval = setInterval(() => {
  pct = Math.min(100, pct + Math.round(Math.random() * 18) + 6);
  if (loaderBar) loaderBar.style.width = pct + '%';
  if (loaderPct) loaderPct.textContent = pct + '%';
  if (pct >= 100) {
    clearInterval(loaderInterval);
    finishLoad();
  }
}, 140);

function finishLoad(){
  const loader = document.getElementById('loader');
  if (window.gsap) {
    gsap.to(loader, { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.15,
      onComplete: () => { loader.style.display = 'none'; playHeroReveal(); }
    });
  } else {
    loader.style.display = 'none';
    playHeroReveal();
  }
}

function playHeroReveal(){
  if (!window.gsap) {
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  gsap.to('.hero .reveal', { y: 0, opacity: 1, duration: 1, stagger: 0.09, ease: 'power4.out' });
}

// Safety net: if fonts/network delay things, never trap the user behind the loader.
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none' && pct < 100) {
      pct = 100;
      finishLoad();
    }
  }, 2500);
});

// ---------- scroll reveals for the rest of the page ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('section:not(.hero)').forEach((sec) => {
    const targets = sec.querySelectorAll('.path, h2, .lede, .stat, .tl-item, .exp-card, .proj-card, .proj-more, .ach-card, .skill-col, .goal-item, .email-big, .social-card');
    if (targets.length) {
      gsap.from(targets, {
        y: 32, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 78%' }
      });
    }
  });
}

// ---------- mobile nav ----------
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
if (menuBtn && sidebar) {
  menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ---------- active section highlight in sidebar ----------
const navLinks = document.querySelectorAll('.sidebar .tree a');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function setActive(){
  let current = sections[0];
  const y = window.scrollY + window.innerHeight * 0.35;
  sections.forEach(sec => { if (sec.offsetTop <= y) current = sec; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', setActive, { passive: true });
setActive();
