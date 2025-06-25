// ======= 1. Navbar: Hamburger Menu Toggle =======
const menuIcon = document.getElementById("menu-icon");
const navLinks = document.getElementById("navLinks");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


// ======= 2. Carousel Functionality =======

const slides = document.querySelectorAll('.slide');
const slideTrack = document.querySelector('.carousel-slides');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;
let interval = null;

// Create dots dynamically
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll('button');

function updateCarousel() {
  const offset = -currentIndex * 100;
  slideTrack.style.transform = `translateX(${offset}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = (index + slides.length) % slides.length;
  updateCarousel();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
}

// Auto Slide
function startAutoSlide() {
  interval = setInterval(nextSlide, 5000);
}
function stopAutoSlide() {
  clearInterval(interval);
}
slideTrack.addEventListener('mouseover', stopAutoSlide);
slideTrack.addEventListener('mouseout', startAutoSlide);

// Swipe Support (mobile)
let touchStartX = 0;
let touchEndX = 0;

slideTrack.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
slideTrack.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchStartX - touchEndX;
  const minSwipe = 50;

  if (swipeDistance > minSwipe) nextSlide();       // Swipe Left
  else if (swipeDistance < -minSwipe) prevSlide(); // Swipe Right
}

updateCarousel();
startAutoSlide();


// ======= 3. Footer Show on Scroll =======
const footer = document.getElementById('footer');

window.addEventListener('scroll', () => {
  const scrollThreshold = 550; // Show footer after scrolling 300px
  if (window.scrollY > scrollThreshold) {
    footer.classList.add('show');
  } else {
    footer.classList.remove('show');
  }
});
