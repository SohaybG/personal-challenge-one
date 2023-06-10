import './style.scss'

let imageList = document.querySelector('.image-list');
if (needsClonedItem(imageList)) {
  let firstEl = imageList.firstElementChild;
  let clonedFirstEl = firstEl.cloneNode(true);
  clonedFirstEl.classList.add('cloned');
  imageList.appendChild(clonedFirstEl);
}

document.querySelector('.js-prev').addEventListener('click', () => moveSlide('prev'));
document.querySelector('.js-next').addEventListener('click', () => moveSlide('next'));

function moveSlide(direction = 'next') {
  let imageList = document.querySelector('.image-list');
  let listNeedsClone = needsClonedItem(imageList);

  if (imageList.classList.contains(`move-${direction}`)) return;
  
  imageList.classList.add(`move-${direction}`);

  let firstEl = imageList.firstElementChild;
  let secondEl = imageList.children[1];
  let elementToAppend = listNeedsClone ? secondEl : firstEl;

  setTimeout(() => {
    imageList.classList.remove(`move-${direction}`);
    imageList.removeChild(firstEl);
    elementToAppend = elementToAppend.cloneNode(true);

    if (listNeedsClone) {
      imageList.querySelector('.cloned').classList.remove('cloned');
      elementToAppend.classList.add('cloned');
    }

    imageList.appendChild(elementToAppend);
  }, 500);
  
}

function needsClonedItem(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  return getNumberOfOriginalItems(parent) == numberOfItemsToShow;
}

function getNumberOfOriginalItems(parent) {
  return parent.querySelectorAll(':scope > :not(.cloned)').length;
}