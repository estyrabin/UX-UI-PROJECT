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

// ===== CAROUSEL =====
(function(){
  let currentSlideIndex = 0;
  let autoPlayInterval;
  let isAutoPlaying = true;
  const carousel = document.querySelector('.carousel');
  
  if (!carousel) return; 
  
  const slides = carousel.querySelectorAll('.slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const playPauseBtn = carousel.querySelector('.play-pause');
  const prevBtn = carousel.querySelector('.prev-btn');
  const nextBtn = carousel.querySelector('.next-btn');

  if (!slides.length) return; // אם אין slides, יוצא

  // Start auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      changeSlide(1);
    }, 4000); // Change slide every 4 seconds
  }

  // Stop auto-play
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Toggle auto-play
  function toggleAutoPlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
      if (playPauseBtn) playPauseBtn.textContent = '▶️';
      isAutoPlaying = false;
    } else {
      startAutoPlay();
      if (playPauseBtn) playPauseBtn.textContent = '⏸️';
      isAutoPlaying = true;
    }
  }

  // Change slide function
  function changeSlide(direction) {
    // Remove active class from current slide and indicator
    slides[currentSlideIndex].classList.remove('is-active');
    if (indicators[currentSlideIndex]) {
      indicators[currentSlideIndex].classList.remove('active');
    }

    // Calculate new slide index
    currentSlideIndex += direction;

    // Loop back to beginning or end
    if (currentSlideIndex >= slides.length) {
      currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
      currentSlideIndex = slides.length - 1;
    }

    // Add active class to new slide and indicator
    slides[currentSlideIndex].classList.add('is-active');
    if (indicators[currentSlideIndex]) {
      indicators[currentSlideIndex].classList.add('active');
    }
  }

  // Go to specific slide
  function goToSlide(slideIndex) {
    // Remove active class from current slide and indicator
    slides[currentSlideIndex].classList.remove('is-active');
    if (indicators[currentSlideIndex]) {
      indicators[currentSlideIndex].classList.remove('active');
    }

    // Set new slide index
    currentSlideIndex = slideIndex;

    // Add active class to new slide and indicator
    slides[currentSlideIndex].classList.add('is-active');
    if (indicators[currentSlideIndex]) {
      indicators[currentSlideIndex].classList.add('active');
    }

    // Restart auto-play if it was running
    if (isAutoPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  }

  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeSlide(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeSlide(1));
  }

  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });

  // Event listener for play/pause button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', toggleAutoPlay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // בדיקה אם הקרוסלה נמצאת בתוך הviewport
    const rect = carousel.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isInView) return; 
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      changeSlide(1);
    } else if (e.key === ' ') {
      e.preventDefault();
      toggleAutoPlay();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      changeSlide(1); // Swipe left - next slide
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      changeSlide(-1); // Swipe right - previous slide
    }
  }

  // Pause auto-play when user hovers over the carousel
  carousel.addEventListener('mouseenter', () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    }
  });

  carousel.addEventListener('mouseleave', () => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
  });

  // Start the carousel
  startAutoPlay();

  // Make functions globally accessible if needed
  window.carouselChangeSlide = changeSlide;
  window.carouselGoToSlide = goToSlide;
  window.carouselToggleAutoPlay = toggleAutoPlay;
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