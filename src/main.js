import './style.css';

const componentMap = [
  { placeholderId: 'component-loading-screen', filePath: '/component/loading-screen.html' },
  { placeholderId: 'component-cursor-glow', filePath: '/component/cursor-glow.html' },
  { placeholderId: 'component-header', filePath: '/component/header.html' },
  { placeholderId: 'component-hero', filePath: '/component/hero.html' },
  { placeholderId: 'component-about', filePath: '/component/about.html' },
  { placeholderId: 'component-skills', filePath: '/component/skills.html' },
  { placeholderId: 'component-projects', filePath: '/component/projects.html' },
  { placeholderId: 'component-experience', filePath: '/component/experience.html' },
  { placeholderId: 'component-certificates', filePath: '/component/certificates.html' },
  { placeholderId: 'component-contact', filePath: '/component/contact.html' },
  { placeholderId: 'component-footer', filePath: '/component/footer.html' },
  { placeholderId: 'component-modals', filePath: '/component/modals.html' },
];

let componentsLoaded = false;
let windowLoaded = false;

function hideLoadingScreen() {
  const loadingScreen = document.querySelector('#loading-screen');
  if (!loadingScreen) return;
  loadingScreen.classList.add('hidden');
}

async function loadComponents() {
  await Promise.all(
    componentMap.map(async ({ placeholderId, filePath }) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          console.error(`Failed to load component ${filePath}: ${response.status}`);
          return;
        }
        const html = await response.text();
        const container = document.getElementById(placeholderId);
        if (container) container.innerHTML = html;
      } catch (error) {
        console.error(`Error loading component ${filePath}:`, error);
      }
    })
  );
  componentsLoaded = true;
  if (windowLoaded) {
    setTimeout(hideLoadingScreen, 200);
  }
}

function markWindowLoaded() {
  windowLoaded = true;
  if (componentsLoaded) {
    setTimeout(hideLoadingScreen, 200);
  }
}

if (document.readyState === 'complete') {
  markWindowLoaded();
} else {
  window.addEventListener('load', markWindowLoaded);
}

await loadComponents();

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
const phrases = ['Website Developer', 'Mobile Developer', 'Vibe Coding', 'Quality Assurance'];
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
// Gunakan handler pointer per-elemen sehingga hanya elemen yang dihover yang bereaksi.
// (Catatan: `.hero-panel` dikeluarkan dari daftar ini — ia akan mengikuti kursor secara global.)
const tiltTargets = document.querySelectorAll('.tilt-card, .project-card, .skill-card');
tiltTargets.forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -10;
    const rotateY = ((e.clientX - centerX) / rect.width) * 10;
    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', () => {
    // Kembalikan transform saat pointer keluar elemen
    el.style.transform = '';
  });
});

// Hero stage: hanya bereaksi saat pointer berada di area hero-stage
const heroStage = document.querySelector('.hero-stage');
if (heroStage) {
  heroStage.addEventListener('pointermove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const offsetX = (x - 0.5) * 28;
    const offsetY = (y - 0.5) * 28;
    heroStage.style.transform = `rotateX(${offsetY * -0.18}deg) rotateY(${offsetX * 0.22}deg)`;
  });
  heroStage.addEventListener('pointerleave', () => {
    heroStage.style.transform = '';
  });
}

// Buat `.hero-panel` mengikuti kursor secara global — bereaksi ke posisi kursor walau bukan di atas elemen.
const heroPanel = document.querySelector('.hero-panel');
if (heroPanel) {
  window.addEventListener('mousemove', (e) => {
    const rect = heroPanel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -10;
    const rotateY = ((e.clientX - centerX) / rect.width) * 10;
    heroPanel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  // Reset transform saat pointer meninggalkan jendela/viewport
  window.addEventListener('mouseout', (ev) => {
    if (!ev.relatedTarget) heroPanel.style.transform = '';
  });
}

// Floating elements (kubus, orbit, ring) bereaksi hanya saat pointer berada di atasnya
document.querySelectorAll('.floating-cube, .orbit, .hero-ring').forEach((item) => {
  item.addEventListener('pointermove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const depth = Number(item.dataset.depth || 1);
    const moveX = (x - 0.5) * 24 * depth;
    const moveY = ((e.clientY - rect.top) / rect.height - 0.5) * 24 * depth;
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
  item.addEventListener('pointerleave', () => {
    item.style.transform = '';
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
