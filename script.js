/* =========================================================================
   MD. Marzanul Islam — Portfolio Scripts
   1. Typing effect        5. Particle background
   2. Scroll reveal + nav  6. SQL terminal
   3. Mobile navigation    7. Contact form (Formspree)
   4. Theme switching      8. Scroll-to-top + footer year
   ========================================================================= */

'use strict';

// Honour users who prefer reduced motion (disables heavy animations)
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------- 1. Typing effect ---------------------------- */
const typedTextSpan = document.querySelector('#typed');
const words = [
  'Database Applications',
  'Oracle APEX Apps',
  'SQL & PL/SQL Scripts',
  'Relational Schemas',
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typedTextSpan) return;
  const currentWord = words[wordIndex];

  typedTextSpan.textContent = isDeleting
    ? currentWord.substring(0, --charIndex)
    : currentWord.substring(0, ++charIndex);

  let typeSpeed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000; // pause at the end of a word
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 400; // pause before the next word
  }

  setTimeout(type, typeSpeed);
}

/* ---------------------- 2. Scroll reveal + active nav --------------------- */
function reveal() {
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, header');
  const windowHeight = window.innerHeight;

  // Fade sections in as they scroll into view
  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      el.classList.add('active');

      // Animate progress bars
      el.querySelectorAll('.progress').forEach((bar) => {
        bar.style.width = bar.getAttribute('data-width');
      });

      // Animate number counters (once)
      el.querySelectorAll('.counter').forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const update = () => {
          const count = +counter.innerText;
          const inc = Math.ceil(target / 100);
          if (count < target) {
            counter.innerText = Math.min(count + inc, target);
            setTimeout(update, 15);
          } else {
            counter.innerText = target;
          }
        };
        update();
        counter.classList.remove('counter'); // prevent re-running
      });
    }
  });

  // Highlight the nav link for the section currently in view
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  sections.forEach((section) => {
    const id = section.getAttribute('id');
    if (!id) return;
    const top = section.offsetTop - 120;
    if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ------------------------- 3. Mobile navigation --------------------------- */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinksContainer = document.getElementById('nav-links');

function setMenu(open) {
  if (!navLinksContainer || !mobileMenuBtn) return;
  navLinksContainer.classList.toggle('active', open);
  mobileMenuBtn.setAttribute('aria-expanded', String(open));
  mobileMenuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  const icon = mobileMenuBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-times', open);
  }
}

if (mobileMenuBtn && navLinksContainer) {
  mobileMenuBtn.addEventListener('click', () =>
    setMenu(!navLinksContainer.classList.contains('active'))
  );
  // Close the menu after choosing a destination
  navLinksContainer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
}

/* --------------------------- 4. Theme switching --------------------------- */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  body.classList.toggle('dark-theme', !isLight);
  if (themeToggle) {
    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  }
  if (window.updateParticleColors) window.updateParticleColors(theme);
}

// First visit falls back to the OS colour scheme, then defaults to dark
const savedTheme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = body.classList.contains('light-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* ----------------------- 5. Interactive particles ------------------------- */
const canvas = document.getElementById('particles-canvas');
if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId = null;

  const darkColors = ['#0ea5e9', '#a855f7', '#ec4899', '#f97316', '#ef4444'];
  const lightColors = ['#0284c7', '#7c3aed', '#db2777', '#ea580c', '#dc2626'];
  let activeColors = savedTheme === 'light' ? lightColors : darkColors;

  const mouse = { x: -1000, y: -1000, radius: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.updateParticleColors = (theme) => {
    activeColors = theme === 'light' ? lightColors : darkColors;
    particles.forEach((p) => {
      p.color = activeColors[Math.floor(Math.random() * activeColors.length)];
    });
  };

  class Particle {
    constructor(x, y, size, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = size;
      this.color = color;
      this.density = Math.random() * 25 + 1;
      this.angle = Math.random() * 360;
      this.speed = Math.random() * 0.02 - 0.01;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      if (ctx.roundRect) {
        ctx.roundRect(-this.size, -this.size / 2, this.size * 3, this.size, this.size);
      } else {
        ctx.rect(-this.size, -this.size / 2, this.size * 3, this.size);
      }
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.angle += this.speed;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max((mouse.radius - distance) / mouse.radius, 0);

      if (distance < mouse.radius) {
        this.x -= (dx / distance) * force * this.density;
        this.y -= (dy / distance) * force * this.density;
      } else {
        if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 15;
        if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 15;
      }
    }
  }

  function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    // Cap the count so low-end / large screens stay smooth
    const count = Math.min(Math.floor((width * height) / 11000), 160);
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1.2;
      const color = activeColors[Math.floor(Math.random() * activeColors.length)];
      particles.push(new Particle(Math.random() * width, Math.random() * height, size, color));
    }
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
  }

  initParticles();
  animate();

  // Pause the loop when the tab is hidden to save CPU / battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initParticles, 200);
  });
}

/* --------------------------- 6. SQL terminal ------------------------------ */
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const quickQueries = document.querySelectorAll('.quick-query-list li');

const dbData = {
  bio: [
    { column: 'ATTRIBUTE', type: 'VARCHAR2(50)', value: 'DETAILS' },
    { column: 'FULL_NAME', type: 'VARCHAR2(50)', value: 'MD. Marzanul Islam' },
    { column: 'PROFESSION', type: 'VARCHAR2(50)', value: 'Oracle Database & APEX Developer' },
    { column: 'EMAIL', type: 'VARCHAR2(50)', value: 'marzanul60@gmail.com' },
    { column: 'MOBILE', type: 'VARCHAR2(20)', value: '01869220070' },
    { column: 'LOCATION', type: 'VARCHAR2(50)', value: 'Agargaon, Dhaka, Bangladesh' },
  ],
  skills: [
    { category: 'DATABASES', skills: 'Oracle Database 19c, SQL, PL/SQL, DBA Basics' },
    { category: 'ORACLE APEX', skills: 'Forms Builder 11g, Reports Builder, Dynamic Action' },
    { category: 'WEB DEVELOPMENT', skills: 'HTML5, CSS3, JavaScript (ES6+), Responsive UI' },
    { category: 'MULTIMEDIA DESIGN', skills: 'Adobe Photoshop, Illustrator, Premiere Pro' },
  ],
  experience: [
    { role: 'DATA ENTRY OPERATOR', company: 'Bangladesh Election Commission', tenure: '2025' },
    { role: 'MANUAL CODER', company: 'Bangladesh Bureau of Statistics (BBS)', tenure: '2024' },
    { role: 'CUSTOMER REPRESENTATIVE', company: 'Sygnius IT Solutions', tenure: '2024' },
    { role: 'AGENCY MANAGER', company: 'Travel Mate, Mirpur', tenure: '2022' },
    { role: 'ASSISTANT ICT TEACHER', company: 'Kafrul Model High School', tenure: '2021-2022' },
  ],
  projects: [
    { name: 'Electronics Sales & Services', type: 'Oracle APEX ERP Application', demo: 'MARZAN / 123' },
    { name: 'Database Ecosystem', type: 'Inventory & Warranty compound trigger system', demo: 'PL/SQL Backend' },
    { name: 'Forms & Reports Tutorial', type: 'YouTube video demonstration', demo: 'Live Guide' },
  ],
  education: [
    { degree: 'BA (HONS) ENGLISH', institute: 'BUBT', passing_year: 'Passing 2025', result: 'CGPA 2.94 / 4.00' },
    { degree: 'HSC SCIENCE', institute: 'BCIC College', passing_year: '2018', result: 'GPA 3.92 / 5.00' },
    { degree: 'SSC SCIENCE', institute: 'Sher-E-Bangla Boys School', passing_year: '2016', result: 'GPA 4.94 / 5.00' },
  ],
};

function renderTerminalTable(columns, rows) {
  let html = '<table class="terminal-table"><thead><tr>';
  columns.forEach((col) => (html += `<th>${col.toUpperCase()}</th>`));
  html += '</tr></thead><tbody>';
  rows.forEach((row) => {
    html += '<tr>';
    columns.forEach((col) => (html += `<td>${row[col] ?? ''}</td>`));
    html += '</tr>';
  });
  return html + '</tbody></table>';
}

function processSQLQuery(query) {
  const cleanQuery = query.trim().replace(/;+$/, '').toLowerCase();
  if (cleanQuery === '') return '';

  if (cleanQuery === 'help') {
    return `<div class="line result">Available database tables:
- BIO        : Primary information and profile details.
- SKILLS     : Core technical and design proficiencies.
- EXPERIENCE : Professional employment and tenure history.
- PROJECTS   : Featured enterprise and web deployments.
- EDUCATION  : Academic backgrounds and certifications.

Other commands:
- HELP  : Show this worksheet instruction list.
- CLEAR : Erase the command screen display history.

Standard SELECT syntax:
SELECT * FROM table_name;</div>`;
  }

  if (cleanQuery === 'clear') {
    if (terminalOutput) terminalOutput.innerHTML = '';
    return 'CLEARED';
  }

  const selectMatch = cleanQuery.match(
    /^select\s+(\*|\w+(?:,\s*\w+)*)\s+from\s+(\w+)(?:\s+where\s+.*)?$/
  );

  if (selectMatch) {
    const table = selectMatch[2];
    if (dbData[table]) {
      const data = dbData[table];
      const cols = Object.keys(data[0]);
      return `<div class="line result">${renderTerminalTable(cols, data)}</div>
<div class="line system-msg">${data.length} rows selected.</div>`;
    }
    return `<div class="line error-msg">ORA-00942: table or view '${table.toUpperCase()}' does not exist</div>`;
  }

  if (cleanQuery.startsWith('select')) {
    return `<div class="line error-msg">ORA-00923: FROM keyword not found where expected</div>`;
  }

  return `<div class="line error-msg">ORA-00900: invalid SQL statement</div>`;
}

function runQuery(query) {
  if (query.trim() === '') return;

  const echoLine = document.createElement('div');
  echoLine.className = 'line input-echo';
  echoLine.innerHTML = `<span>SQL&gt;</span> ${query}`;
  terminalOutput.appendChild(echoLine);

  const result = processSQLQuery(query);
  if (result !== 'CLEARED' && result !== '') {
    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = result;
    terminalOutput.appendChild(resultDiv);
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

if (terminalInput) {
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runQuery(terminalInput.value);
      terminalInput.value = '';
    }
  });
}

quickQueries.forEach((item) => {
  item.addEventListener('click', () => {
    const query = item.getAttribute('data-query');
    if (query.toUpperCase() === 'CLEAR;') {
      processSQLQuery('clear');
    } else {
      runQuery(query);
    }
  });
});

/* ----------------------- 7. Contact form (Formspree) ---------------------- */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSuccessMsg = document.getElementById('form-success-msg');
const formResetBtn = document.getElementById('form-reset-btn');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Your Formspree endpoint — the single source of truth for where the
// message is delivered. This works even if the HTML form action differs.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdnworn';

function setStatus(message, type = 'info') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

function validateForm() {
  let ok = true;
  // Reference fields by ID — note `form.name` returns the form's own
  // name attribute, not the <input name="name">, so avoid that trap.
  const fields = [
    { el: document.getElementById('form-name'), test: (v) => v.trim().length > 0 },
    { el: document.getElementById('form-email'), test: (v) => EMAIL_RE.test(v.trim()) },
    { el: document.getElementById('form-message'), test: (v) => v.trim().length > 0 },
  ];
  fields.forEach(({ el, test }) => {
    if (!el) return;
    const valid = test(el.value);
    el.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

if (contactForm) {
  // Clear the invalid flag as the user corrects a field
  contactForm.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    // Silently drop bot submissions caught by the honeypot
  

    if (!validateForm()) {
      setStatus('Please fill in every field with a valid email.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('.form-submit-btn');
    submitBtn.classList.add('is-sending');
    submitBtn.disabled = true;
    setStatus('Sending your message…', 'info');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        setStatus('');
        if (formSuccessMsg) formSuccessMsg.classList.add('active');
      } else {
        // Surface Formspree's validation errors when present
        const data = await response.json().catch(() => ({}));
        const msg =
          data.errors && data.errors.length
            ? data.errors.map((e) => e.message).join(', ')
            : 'Something went wrong. Please try again or email me directly.';
        setStatus(msg, 'error');
      }
    } catch (err) {
      setStatus('Network error — please check your connection and try again.', 'error');
    } finally {
      submitBtn.classList.remove('is-sending');
      submitBtn.disabled = false;
    }
  });
}

// "Send another" resets the success overlay
if (formResetBtn && formSuccessMsg) {
  formResetBtn.addEventListener('click', () => {
    formSuccessMsg.classList.remove('active');
    setStatus('');
  });
}

/* ------------------- 8. Scroll-to-top + footer year ----------------------- */
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  );
}

function onScroll() {
  reveal();
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }
}

// Populate the footer year
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ------------------------------- Init ------------------------------------- */
window.addEventListener('scroll', onScroll, { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  reveal();
  if (typedTextSpan) setTimeout(type, 800);
});
