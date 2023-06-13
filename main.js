import './style.scss'

let imageList = document.querySelector('.image-list');
if (getDiffBetweenItemsToShowAndExisting(imageList) == 0) {
  let firstEl = imageList.firstElementChild;
  let clonedFirstEl = firstEl.cloneNode(true);
  clonedFirstEl.classList.add('cloned');
  imageList.appendChild(clonedFirstEl);
}

document.querySelector('.js-prev').addEventListener('click', () => moveSlide('prev'));
document.querySelector('.js-next').addEventListener('click', () => moveSlide('next'));

function moveSlide(direction = 'next') {
  let imageList = document.querySelector('.image-list');
  
  if (imageList.classList.contains(`move-${direction}`)) return;

  let itemsQuota = getDiffBetweenItemsToShowAndExisting(imageList);
  let transitionDuration = getComputedStyle(imageList).getPropertyValue('--_transition-duration');
  transitionDuration = transitionDuration.indexOf('ms') ? parseInt(transitionDuration) : parseInt(transitionDuration) * 1000;
  imageList.classList.add(`move-${direction}`);

  let firstEl = imageList.firstElementChild;
  let secondEl = imageList.children[1];
  let elementToAppend = itemsQuota == 0 ? secondEl : firstEl;
  elementToAppend = elementToAppend.cloneNode(true);

  if (itemsQuota < 0) {
    elementToAppend.classList.add('entering');
    imageList.appendChild(elementToAppend);
  }

  setTimeout(() => {
    imageList.classList.remove(`move-${direction}`);
    imageList.removeChild(firstEl);
    elementToAppend.classList.remove('entering');

    if (itemsQuota == 0) {
      imageList.querySelector('.cloned').classList.remove('cloned');
      elementToAppend.classList.add('cloned');
    }

    if (itemsQuota >= 0) {
      imageList.appendChild(elementToAppend);
    }
  }, transitionDuration);
}

function getDiffBetweenItemsToShowAndExisting(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  return getNumberOfOriginalItems(parent) - numberOfItemsToShow;
}

function getNumberOfOriginalItems(parent) {
  return parent.querySelectorAll(':scope > :not(.cloned)').length;
}