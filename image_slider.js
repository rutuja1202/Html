const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;
const totalImages = images.length;

// Function to update slide position
function updateSlide() {
  slides.style.transform = 'translateX(${-index * 100}%)';
}

// Show previous image
function prevImage() {
  index = (index - 1 + totalImages) % totalImages;
  updateSlide();
}

// Event listeners
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

// Auto slideshow (every 3 seconds)
setInterval(nextImage, 3000);

// Initialize first image
updateSlide();