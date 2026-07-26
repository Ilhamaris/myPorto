import './style.css';

// Sembunyikan layar loading setelah halaman selesai dimuat.
const loadingScreen = document.querySelector('#loading-screen');
window.addEventListener('load', () => {
  setTimeout(() => loadingScreen?.classList.add('hidden'), 700);
});

// Buka atau tutup menu navigasi mobile saat tombol hamburger diklik.
const menuBtn = document.querySelector('#menuBtn');
const mobileMenu = document.querySelector('#mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));

// Tutup menu mobile saat salah satu tautan navigasi dipilih.
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
});

// Efek ketik untuk teks headline hero.
const typingText = document.querySelector('.typing-text');
const phrases = ['Full Stack Developer', 'UI Engineer', 'Creative Coder'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!typingText) return;

  // Tambahkan karakter satu per satu, lalu hapus untuk menciptakan animasi mengetik.

  if (!deleting) {
    charIndex++;
    typingText.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex--;
    typingText.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 90);
}

typeLoop();

// Animasi counter statistik saat elemen masuk ke area tampilan.
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1200;
      const start = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        el.textContent = Math.round(progress * target).toString();
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Tampilkan bagian konten secara halus saat digulir masuk ke tampilan.
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Terapkan efek tilt hanya saat pointer berada di atas kartu atau panel hero yang interaktif.
const tiltEls = document.querySelectorAll('.tilt-card, .project-card, .skill-card, .hero-panel');
window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  const heroStage = document.querySelector('.hero-stage');
  const offsetX = (x - 0.5) * 28;
  const offsetY = (y - 0.5) * 28;

  if (heroStage) {
    heroStage.style.transform = `rotateX(${offsetY * -0.18}deg) rotateY(${offsetX * 0.22}deg)`;
  }

  document.querySelectorAll('.floating-cube, .orbit, .hero-ring').forEach((item) => {
    const depth = Number(item.dataset.depth || 1);
    const moveX = (x - 0.5) * 24 * depth;
    const moveY = (y - 0.5) * 24 * depth;
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });

  tiltEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -10;
    const rotateY = ((e.clientX - centerX) / rect.width) * 10;
    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
});

// Sorot tautan navigasi aktif berdasarkan bagian yang sedang terlihat.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.createElement('div');
progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent z-[100]';
progressBar.style.width = '0%';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (window.scrollY / max) * 100;
  progressBar.style.width = `${percent}%`;

  let active = sections[0]?.id;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180) active = section.id;
  });
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${active}`;
    link.classList.toggle('text-white', isActive);
    link.classList.toggle('text-slate-300', !isActive);
  });
});

// Pindahkan cahaya cursor lembut mengikuti posisi pointer.
const cursorGlow = document.querySelector('#cursor-glow');
window.addEventListener('mousemove', (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
});

// Tambahkan efek magnetik halus pada tombol CTA saat dihover.
const buttons = document.querySelectorAll('.magnetic-btn');
buttons.forEach((button) => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

// Buat efek riak saat tombol atau tombol tutup modal diklik.
const rippleButtons = document.querySelectorAll('.magnetic-btn, .close-modal');
rippleButtons.forEach((button) => {
  button.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const radius = Math.max(this.clientWidth, this.clientHeight) * 0.7;
    circle.style.width = circle.style.height = `${radius}px`;
    circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius / 2}px`;
    circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius / 2}px`;
    circle.className = 'ripple';
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 500);
  });
});

// Validasi form kontak dan tampilkan pesan sukses setelah pengiriman.
const form = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = new FormData(form).get('name');
  if (!name || String(name).trim().length < 2) {
    alert('Please enter a valid name.');
    return;
  }
  formMessage?.classList.remove('hidden');
  form.reset();
});

// Buka dan tutup modal pratinjau sertifikat.
const modalButtons = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');
modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modal);
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  });
});

document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal')?.classList.add('hidden');
    button.closest('.modal')?.classList.remove('flex');
  });
});
