// Населяем слайдер тремя наборами карт продуктов
const template = document.getElementById('card-set-template');
const slider = document.getElementById('slider');
const cardSet = [];
for (let i = 0; i < 3; i++) {
  cardSet.push(template.content.cloneNode(true));
}
slider.append(...cardSet);

// Определяем базовую позицию слайдера и корректируем ее при изменении размера окна
const productCard = document.querySelector('.product-card');
let cardWidth = 300;
let sliderPosition = 4 * cardWidth;

window.addEventListener('load', calcPosition);

window.addEventListener('resize', calcPosition);

function calcPosition() {
  let cardStyles = window.getComputedStyle(productCard);
  let cardMargin = parseInt(cardStyles.marginRight);
  cardWidth = productCard.offsetWidth + cardMargin;
  sliderPosition = 4 * cardWidth;
  slider.style.right = `${sliderPosition}px`;
}

// Определяем колбэк функции для нажатия кнопок "вправо"-"влево"
const btnPrevious = document.getElementById('btn-previous');
btnPrevious.addEventListener('click', previous);

const btnNext = document.getElementById('btn-next');
btnNext.addEventListener('click', next);

function next() {
  if (sliderPosition >= 8 * cardWidth) return;
  slider.classList.add('animated');
  sliderPosition += cardWidth;
  slider.style.right = `${sliderPosition}px`;
  restartInterval();
}

function previous() {
  if (sliderPosition <= 0) return;
  slider.classList.add('animated');
  sliderPosition -= cardWidth;
  slider.style.right = `${sliderPosition}px`;
  restartInterval();
}

slider.addEventListener('transitionend', checkPosition);

function checkPosition() {
  if (sliderPosition <= 0 || sliderPosition >= 8 * cardWidth) {
    slider.classList.remove('animated');
    sliderPosition = 4 * cardWidth;
    slider.style.right = `${sliderPosition}px`;
  }
}

// Запускаем автоматический показ слайдов через каждые 4с.
let intervalID = setInterval(next, 4000);

function restartInterval() {
  clearInterval(intervalID);
  intervalID = setInterval(next, 4000);
}

// Определяем функционал перемещения слайдера при "перетягивании" на touch устройствах
let posX1, posX2;
let isDragging = false;

const sliderFrame = document.querySelector('.slider-frame');
sliderFrame.addEventListener('touchstart', dragStart);
sliderFrame.addEventListener('touchmove', dragAction);
sliderFrame.addEventListener('touchend', dragEnd);

function dragStart(e) {
  posX1 = e.touches[0].clientX;
  isDragging = true;
}

function dragAction(e) {
  if (isDragging) {
    slider.classList.remove('animated');
    restartInterval();
    posX2 = e.touches[0].clientX;
    let move = posX1 - posX2;
    posX1 = posX2;
    sliderPosition += 1.4 * move;
    slider.style.right = `${sliderPosition}px`;
  }
}

function dragEnd(e) {
  isDragging = false;
  slider.classList.add('animated');
  sliderPosition = Math.round(sliderPosition / cardWidth) * cardWidth;
  slider.style.right = `${sliderPosition}px`;
}
