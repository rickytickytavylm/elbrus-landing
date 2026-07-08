// ===================== HEADER on scroll =====================
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll);
onScroll();

// ===================== MOBILE TAB BAR (scrollspy) =====================
const tabbar = document.getElementById('tabbar');
if (tabbar) {
  const tabs = Array.from(tabbar.querySelectorAll('.tabbar__item'));
  const sections = tabs
    .map((t) => document.getElementById(t.dataset.section))
    .filter(Boolean);

  const setActive = (id) => {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.section === id));
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

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
    // При удалении ничего не переформатируем, чтобы можно было свободно
    // стирать любой символ (в т.ч. первую цифру и скобки).
    if (e.inputType && e.inputType.startsWith('delete')) return;

    const hasPlus = e.target.value.trimStart().startsWith('+');
    let raw = e.target.value.replace(/\D/g, '');

    if (raw === '') {
      e.target.value = hasPlus ? '+' : '';
      return;
    }

    // Международный номер: пользователь сам ввёл + с не-российским кодом.
    // Не навязываем +7, оставляем как есть.
    if (hasPlus && !raw.startsWith('7')) {
      e.target.value = '+' + raw;
      return;
    }

    // Российский формат (ввод без +, либо начинается с 7/8).
    let d = raw;
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);

    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length > 4) out += ') ' + d.slice(4, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    if (d.length > 9) out += '-' + d.slice(9, 11);
    e.target.value = out;
  });
}

// ===================== FORM SUBMIT =====================
const TELEGRAM_TOKEN = '8776882062:AAGJMV3cMdzcqJrAQHc5EgIt4dz2Lh0XURM';
const TELEGRAM_CHAT_ID = '-5368114000';

const form = document.getElementById('leadForm');
if (form) {
  const name = document.getElementById('name');
  const consent = document.getElementById('consent');
  const note = document.getElementById('formNote');
  const errNote = document.getElementById('formError');
  const submitBtn = document.getElementById('formSubmit');

  const syncSubmitState = () => {
    submitBtn.disabled = !consent.checked;
  };
  consent.addEventListener('change', syncSubmitState);
  syncSubmitState();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;

    const nameValid = name.value.trim().length > 1;
    name.classList.toggle('invalid', !nameValid);
    if (!nameValid) ok = false;

    const phoneValid = phone.value.replace(/\D/g, '').length >= 10;
    phone.classList.toggle('invalid', !phoneValid);
    if (!phoneValid) ok = false;

    if (!consent.checked) ok = false;

    if (!ok) return;

    note.hidden = true;
    errNote.hidden = true;

    const text =
      '🏔 Новая заявка с сайта\n\n' +
      'Имя: ' + name.value.trim() + '\n' +
      'Телефон: ' + phone.value.trim() + '\n' +
      'Время: ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ' (МСК)';

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    try {
      const res = await fetch(
        'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage',
        {
          method: 'POST',
          body: new URLSearchParams({ chat_id: TELEGRAM_CHAT_ID, text }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('Telegram API error');

      note.hidden = false;
      form.reset();
    } catch (err) {
      errNote.hidden = false;
    } finally {
      submitBtn.textContent = originalLabel;
      syncSubmitState();
    }
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
