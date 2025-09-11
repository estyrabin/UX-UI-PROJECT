// ===== Burger =====
(function(){
  const burger = document.querySelector('.burger');
  if (!burger) return;
  burger.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
})();

// ===== Accordion (FAQ) =====
(function(){
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      // close others
      items.forEach(i => i.setAttribute('aria-expanded', 'false'));
      // toggle this
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });
})();

// ===== Contact form validation =====
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const msgEl = document.getElementById('message');

  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const msgErr = document.getElementById('messageError');
  const status = document.getElementById('formStatus');

  function validateEmail(value){
    // must contain @ and . in a reasonable position
    if (!value.includes('@') || !value.includes('.')) return false;
    // very loose pattern to avoid over-rejecting
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(value);
  }

  form.addEventListener('submit', (e) => {
  let ok = true;
  nameErr.textContent = '';
  emailErr.textContent = '';
  msgErr.textContent = '';
  status.textContent = '';

  if (!nameEl.value.trim()) {
    ok = false; 
    nameErr.textContent = 'Please enter your full name.';
  }
  if (!emailEl.value.trim()) {
    ok = false; 
    emailErr.textContent = 'Please enter your email.';
  } else if (!validateEmail(emailEl.value.trim())) {
    ok = false; 
    emailErr.textContent = 'Email must contain @ and a dot, and follow a valid format.';
  }
  if (!msgEl.value.trim()) {
    ok = false; 
    msgErr.textContent = 'Please enter a short message.';
  }

  if (!ok) {
    e.preventDefault();
    status.textContent = 'Please complete the required fields.';
    status.className = 'error';
  } else {
    status.textContent = 'Message sent successfully!';
    status.className = 'success';
    // allow normal navigation to thankyou.html
  }
});

})();

// Gallery
(function(){
  const grid = document.getElementById('gallery');
  if (!grid) return;
  
  const frag = document.createDocumentFragment();
  
  // Images
  for (let i = 1; i <= 12; i++){
    const fig = document.createElement('figure');
    fig.className = 'tile';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `Image ${i}`;
    img.src = `images/img${i}.jpg`;
    img.dataset.index = i - 1;
    img.onclick = () => openLightbox(img.src, i - 1);
    fig.appendChild(img);
    frag.appendChild(fig);
  }

  // Videos
  for (let i = 1; i <= 3; i++) {
    const fig = document.createElement('figure');
    fig.className = 'tile';
    const video = document.createElement('video');
    video.muted = video.loop = video.playsInline = true;
    video.preload = 'metadata';
    video.src = `images/Video${i}.mp4`;
    video.dataset.index = 11 + i;
    video.onclick = () => openLightbox(video.src, 11 + i, 'video');
    video.onloadeddata = () => {
      fig.onmouseenter = () => video.play().catch(() => {});
      fig.onmouseleave = () => { video.pause(); video.currentTime = 0; };
    };
    fig.appendChild(video);
    frag.appendChild(fig);
  }
  
  grid.appendChild(frag);
  window.__TOTAL_IMAGES__ = 15;
})();

// Lightbox
let currentIndex = 0, currentType = 'image';

function openLightbox(src, index, type = 'image') {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  
  currentIndex = index;
  currentType = type;
  
  const existingVideo = lb.querySelector('#lightbox-video');
  if (existingVideo) existingVideo.remove();
  
  if (type === 'video') {
    const video = document.createElement('video');
    video.id = 'lightbox-video';
    video.className = 'lightbox-img';
    video.src = src;
    video.controls = video.autoplay = video.loop = true;
    img.style.display = 'none';
    lb.insertBefore(video, img.nextSibling);
  } else {
    img.style.display = 'block';
    img.src = src;
    img.alt = `Image ${index + 1}`;
  }
  
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('body-no-scroll');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const video = lb.querySelector('#lightbox-video');
  if (video) { video.pause(); video.remove(); }
  document.getElementById('lightbox-img').style.display = 'block';
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('body-no-scroll');
}

function changeImage(dir) {
  currentIndex = (currentIndex + dir + 15) % 15;
  const isVideo = currentIndex >= 12;
  const src = isVideo ? `images/Video${currentIndex - 11}.mp4` : `images/img${currentIndex + 1}.jpg`;
  openLightbox(src, currentIndex, isVideo ? 'video' : 'image');
}

// Events
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => changeImage(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => changeImage(1));
document.getElementById('lightbox')?.addEventListener('click', e => e.target === e.currentTarget && closeLightbox());
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});