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



// ===== GALLERY (Dynamic tiles) =====
(function(){
  const COUNT = 12;
  const BASE_PATH = 'images/'; 
  const EXT = '.jpg';
  
  const grid = document.getElementById('gallery');
  if (!grid) return;

  const frag = document.createDocumentFragment();
  
  for (let i = 1; i <= COUNT; i++){
    const fig = document.createElement('figure');
    fig.className = 'tile';
    
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = `Image ${i}`;
    img.src = `${BASE_PATH}img${i}${EXT}`;
    img.dataset.index = i - 1;
    
    img.addEventListener('click', function() {
      openLightbox(this.src, parseInt(this.dataset.index, 10));
    });
    
    fig.appendChild(img);
    frag.appendChild(fig);
  }
  
  grid.appendChild(frag);

  if (window.AOS) AOS.refresh();

  window.__TOTAL_IMAGES__ = COUNT;
})();

// ===== LIGHTBOX =====
let currentImageIndex = 0;

function openLightbox(src, index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = src;
  lightboxImg.alt = `Image ${index + 1}`;
  currentImageIndex = index;
  lightbox.classList.add('is-open');            
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('body-no-scroll');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('body-no-scroll');
}

function changeImage(direction) {
  const total = window.__TOTAL_IMAGES__ || 12;
  currentImageIndex = (currentImageIndex + direction + total) % total;
  const newSrc = `images/img${currentImageIndex + 1}.jpg`;
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = newSrc;
  lightboxImg.alt = `Image ${currentImageIndex + 1}`;
}

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => changeImage(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => changeImage(1));

document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});


