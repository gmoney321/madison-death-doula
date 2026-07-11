const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.navbar ul');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
})