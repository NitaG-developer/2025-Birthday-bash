document.addEventListener('DOMContentLoaded', function() {
  // ==================== CARRUSEL ====================
  const carousel = document.getElementById('carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const images = Array.from(carousel.children);
  let currentIndex = 0;

  function updateCarousel() {
    const offset = -currentIndex * (images[0].offsetWidth + 10);
    carousel.style.transform = `translateX(${offset}px)`;
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= images.length - 1;

    const disabledStyle = {
      opacity: "0.5",
      cursor: "not-allowed",
      backgroundColor: "#cccccc"
    };

    const enabledStyle = {
      opacity: "1",
      cursor: "pointer",
      backgroundColor: "#ff4081"
    };

    Object.assign(prevBtn.style, prevBtn.disabled ? disabledStyle : enabledStyle);
    Object.assign(nextBtn.style, nextBtn.disabled ? disabledStyle : enabledStyle);
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  updateCarousel();

  // ==================== CUENTA REGRESIVA ====================
  const fechaFiesta = new Date('2025-07-03T15:00:00').getTime();
  const diasElement = document.getElementById('dias');
  const horasElement = document.getElementById('horas');
  const minutosElement = document.getElementById('minutos');
  const segundosElement = document.getElementById('segundos');
  
  function actualizarCuentaRegresiva() {
    const ahora = new Date().getTime();
    const distancia = fechaFiesta - ahora;
    
    if (distancia < 0) {
      clearInterval(intervalo);
      document.querySelector('.countdown-box').innerHTML = `
        <h3 style="color: #ff4081;">🎉 ¡La fiesta está en marcha! 🎉</h3>
        <p>¡Ven ahora mismo!</p>
      `;
      return;
    }
    
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
    
    diasElement.textContent = String(dias).padStart(2, '0');
    horasElement.textContent = String(horas).padStart(2, '0');
    minutosElement.textContent = String(minutos).padStart(2, '0');
    segundosElement.textContent = String(segundos).padStart(2, '0');
  }
  
  const intervalo = setInterval(actualizarCuentaRegresiva, 1000);
  actualizarCuentaRegresiva();

  // ==================== AUDIO ====================
  const audio = document.getElementById('bg-music');
  const audioOverlay = document.getElementById('audio-overlay');

  // Configuración inicial de audio
  audio.volume = 0.3;
  audio.muted = true;

  function activateAudio() {
    audio.muted = false;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioOverlay.classList.add('hidden');
        })
        .catch(error => {
          audioOverlay.textContent = "Toca de nuevo para activar el audio";
          console.error("Error al reproducir:", error);
        });
    }
  }

  // Eventos para activar audio
  audioOverlay.addEventListener('click', activateAudio);
  audioOverlay.addEventListener('touchstart', activateAudio, { passive: true });

  // Mostrar overlay si el audio está bloqueado
  setTimeout(() => {
    if (audio.paused) {
      audioOverlay.classList.remove('hidden');
    }
  }, 1000);

  // ==================== LIGHTBOX ====================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  // Configuración del lightbox
  document.querySelectorAll('.carousel img').forEach(img => {
    img.style.pointerEvents = 'auto';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Oculta el overlay de audio si está visible
      if (!audioOverlay.classList.contains('hidden')) {
        audioOverlay.classList.add('hidden');
      }
    });
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
});