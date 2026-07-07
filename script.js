// ===================== HEADER on scroll =====================
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll);
onScroll();

// ===================== MOBILE NAV =====================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('.nav__link').forEach((link) =>
  link.addEventListener('click', () => nav.classList.remove('open'))
);

// ===================== SLIDERS (программа + отзывы) =====================
function initSlider(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (!track || !prev || !next) return;

  const step = () => {
    const first = track.querySelector(':scope > *');
    if (!first) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24);
    return first.getBoundingClientRect().width + gap;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}
initSlider('progTrack', 'progPrev', 'progNext');
initSlider('revTrack', 'revPrev', 'revNext');

// ===================== PHONE MASK (простая) =====================
const phone = document.getElementById('phone');
if (phone) {
  phone.addEventListener('input', (e) => {
    let d = e.target.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 4) out += ') ' + d.slice(4, 7);
    if (d.length >= 7) out += '-' + d.slice(7, 9);
    if (d.length >= 9) out += '-' + d.slice(9, 11);
    e.target.value = out;
  });
}

// ===================== FORM SUBMIT =====================
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const consent = document.getElementById('consent');
    let ok = true;

    [name, phone].forEach((f) => {
      const valid = f.value.trim().length > (f === phone ? 15 : 1);
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!consent.checked) ok = false;

    if (!ok) return;

    // ЗДЕСЬ: отправка данных на сервер / в CRM / Telegram-бот.
    // Пока просто показываем сообщение об успехе.
    document.getElementById('formNote').hidden = false;
    form.reset();
  });
}

// ===================== REVEAL ON SCROLL =====================
const revealEls = document.querySelectorAll(
  '.about__lead, .about__block, .day-card, .guide-card, .pricing__panel, .pricing__details, .review, .form-card, .groupshot__caption'
);
revealEls.forEach((el) => el.classList.add('reveal'));
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));
