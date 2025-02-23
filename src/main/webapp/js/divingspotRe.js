// DOM Elements
const cardsContainer = document.getElementById('cardsContainer');
const leftButton = document.querySelector('.nav-button-left');
const rightButton = document.querySelector('.nav-button-right');

// Initialize button visibility
updateNavigationButtons();

// Scroll amount for each click
const scrollAmount = 300;

// Add click event listeners to navigation buttons
leftButton.addEventListener('click', () => {
    cardsContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
});

rightButton.addEventListener('click', () => {
    cardsContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
});

// Update button visibility on scroll
cardsContainer.addEventListener('scroll', updateNavigationButtons);

// Update button visibility based on scroll position
function updateNavigationButtons() {
    // Show/hide left button
    leftButton.style.display = 
        cardsContainer.scrollLeft > 0 ? 'flex' : 'none';

    // Show/hide right button
    rightButton.style.display = 
        cardsContainer.scrollLeft < cardsContainer.scrollWidth - cardsContainer.clientWidth 
        ? 'flex' : 'none';
}

// Update navigation buttons on window resize
window.addEventListener('resize', updateNavigationButtons);

// Optional: Add touch/swipe support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

cardsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

cardsContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent page scroll while swiping carousel
});

cardsContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left
            cardsContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            // Swipe right
            cardsContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('mapModal');
    const modalImg = document.getElementById('modalImage');
    const mapImage = document.querySelector('.map-image');
    const closeBtn = document.querySelector('.close');

    // 點擊地圖時打開 Modal
    mapImage.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
    });

    // 點擊關閉按鈕關閉 Modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 點擊 Modal 外部區域也可以關閉
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});