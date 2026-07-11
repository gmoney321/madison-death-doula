const overlay = document.querySelector('.menu-overlay');
const hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
    overlay.classList.toggle('active');
})