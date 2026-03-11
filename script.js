// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0.5)'
    : 'none';
});

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ── Technique tabs ──
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ── Checklist with localStorage ──
const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const total = checkboxes.length;

function updateProgress() {
  const checked = [...checkboxes].filter(cb => cb.checked).length;
  const pct = Math.round((checked / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = checked + ' / ' + total;
}

// Load saved state
checkboxes.forEach(cb => {
  const saved = localStorage.getItem('tennis_' + cb.dataset.key);
  if (saved === 'true') cb.checked = true;

  cb.addEventListener('change', () => {
    localStorage.setItem('tennis_' + cb.dataset.key, cb.checked);
    updateProgress();
  });
});

updateProgress();

// ── Reset button ──
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all checklist progress?')) return;
  checkboxes.forEach(cb => {
    cb.checked = false;
    localStorage.removeItem('tennis_' + cb.dataset.key);
  });
  updateProgress();
});

// ── Smooth-scroll active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--green-light)'
          : '';
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

sections.forEach(s => observer.observe(s));

// ── Animate cards on scroll ──
const cards = document.querySelectorAll(
  '.level-card, .fw-card, .mental-card, .ag-drill'
);
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeIn 0.5s ease ${i * 0.06}s both`;
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => {
  c.style.opacity = '0';
  cardObserver.observe(c);
});
