const overlay = document.querySelector('.menu-overlay');
const hamburger = document.querySelector('.hamburger');
const closeButton = document.querySelector('.close-menu');

hamburger.addEventListener('click', () => {
    overlay.classList.toggle('active');
})

closeButton.addEventListener('click', () => {
    overlay.classList.remove('active');
})