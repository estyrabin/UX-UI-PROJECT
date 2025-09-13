// ================== CONTACT FORM VALIDATION ==================
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // form fields
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const msgEl = document.getElementById('message');

  // error messages + status area
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const msgErr = document.getElementById('messageError');
  const status = document.getElementById('formStatus');

  // helper: basic email validation
  function validateEmail(value) {
    if (!value.includes('@') || !value.includes('.')) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // loose pattern
    return re.test(value);
  }

  // form submit handler
  form.addEventListener('submit', (e) => {
    let ok = true;
    nameErr.textContent = '';
    emailErr.textContent = '';
    msgErr.textContent = '';
    status.textContent = '';

    // validate name
    if (!nameEl.value.trim()) {
      ok = false;
      nameErr.textContent = 'Please enter your full name.';
    }

    // validate email
    if (!emailEl.value.trim()) {
      ok = false;
      emailErr.textContent = 'Please enter your email.';
    } else if (!validateEmail(emailEl.value.trim())) {
      ok = false;
      emailErr.textContent = 'Email must contain @ and a dot, and follow a valid format.';
    }

    // validate message
    if (!msgEl.value.trim()) {
      ok = false;
      msgErr.textContent = 'Please enter a short message.';
    }

    // final status
    if (!ok) {
      e.preventDefault();
      status.textContent = 'Please complete the required fields.';
      status.className = 'error';
    } else {
      status.textContent = 'Message sent successfully!';
      status.className = 'success';
    }
  });
})(); 


// ================== GALLERY WITH GLIGHTBOX ==================
(function () {
  const grid = document.getElementById('gallery');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  // create image tiles
  for (let i = 1; i <= 12; i++) {
    const fig = document.createElement('figure');
    fig.className = 'tile';

    const a = document.createElement('a');
    a.href = `images/img${i}.jpg`;
    a.className = 'glightbox';
    a.setAttribute('data-gallery', 'main');
    a.setAttribute('data-type', 'image');

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `Image ${i}`;
    img.src = `images/img${i}.jpg`;
    img.dataset.index = i - 1;

    a.appendChild(img);
    fig.appendChild(a);
    frag.appendChild(fig);
  }

  // create video tiles (local files)
  for (let i = 1; i <= 3; i++) {
    const fig = document.createElement('figure');
    fig.className = 'tile';

    const a = document.createElement('a');
    a.href = `images/Video${i}.mp4`;
    a.className = 'glightbox';
    a.setAttribute('data-gallery', 'main');
    a.setAttribute('data-type', 'video');
    a.setAttribute('data-source', 'local');

    // preview video inside tile
    const video = document.createElement('video');
    video.muted = video.loop = video.playsInline = true;
    video.preload = 'metadata';
    video.src = `images/Video${i}.mp4`;
    video.dataset.index = 11 + i;

    // play on hover
    video.onloadeddata = () => {
      fig.onmouseenter = () => video.play().catch(() => {});
      fig.onmouseleave = () => {
        video.pause();
        video.currentTime = 0;
      };
    };

    a.appendChild(video);
    fig.appendChild(a);
    frag.appendChild(fig);
  }

  // append all items before initializing lightbox
  grid.appendChild(frag);

  // initialize GLightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    loop: true,
    autoplayVideos: true,
    touchNavigation: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
  });
})();