import './style.scss'

let imageList = document.querySelector('.image-list');
adaptClones();
adaptItemCountClasses(imageList);

document.querySelector('.js-prev').addEventListener('click', () => moveSlide('prev'));
document.querySelector('.js-next').addEventListener('click', () => moveSlide('next'));
document.querySelectorAll('.item-amount-changer button').forEach(button => button.addEventListener('click', function() {
  updateItemCount(this.dataset.count);
}));

function moveSlide(direction = 'next') {
  let imageList = document.querySelector('.image-list');
  
  if (imageList.classList.contains(`move-${direction}`)) return;

  let itemsQuota = getDiffBetweenItemsToShowAndExisting(imageList);
  let transitionDuration = getComputedStyle(imageList).getPropertyValue('--_transition-duration');
  transitionDuration = transitionDuration.indexOf('ms') ? parseInt(transitionDuration) : parseInt(transitionDuration) * 1000;
  imageList.classList.add(`move-${direction}`);

  let firstEl = imageList.firstElementChild;
  let secondEl = imageList.children[1];
  let elementToAppend = itemsQuota <= 0 ? secondEl : firstEl;
  elementToAppend = elementToAppend.cloneNode(true);

  setTimeout(() => {
    imageList.classList.remove(`move-${direction}`);
    imageList.removeChild(firstEl);

    if (itemsQuota <= 0) {
      imageList.querySelector('.cloned').classList.remove('cloned');
      elementToAppend.classList.add('cloned');

      if (itemsQuota < 0) {
        imageList.querySelector('.cloned--cropped').classList.remove('cloned--cropped');
        elementToAppend.classList.add('cloned--cropped');
      }
    }

    imageList.appendChild(elementToAppend);
    adaptItemCountClasses(imageList);
  }, transitionDuration);
}

function getDiffBetweenItemsToShowAndExisting(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  return getNumberOfOriginalItems(parent) - numberOfItemsToShow;
}

function getNumberOfOriginalItems(parent) {
  return parent.querySelectorAll(':scope > :not(.cloned)').length;
}

function adaptItemCountClasses(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  let activeClass = 'image-list__item--active';
  let lastActiveClass = 'image-list__item--last-active';
  document.querySelectorAll(`.${lastActiveClass}`).forEach(item => item.classList.remove(lastActiveClass));
  parent.querySelector(`:scope > :nth-child(${numberOfItemsToShow})`).classList.add(lastActiveClass);
  
  document.querySelectorAll(`.${activeClass}`).forEach(item => item.classList.remove(activeClass));

  for (let i = 0; i < numberOfItemsToShow && i < parent.children.length; i++) {
    parent.children[i].classList.add(activeClass);
  }
}

function updateItemCount(count) {
  let imageList = document.querySelector('.image-list');
  imageList.style.setProperty('--_items-shown', count);
  adaptClones();
  adaptItemCountClasses(imageList);
}

function adaptClones() {
  let imageList = document.querySelector('.image-list');
  let diff = getDiffBetweenItemsToShowAndExisting(imageList);
  let cloneClass = 'cloned';
  let croppedCloneClass = 'cloned--cropped';

  if (diff <= 0) {
    let firstEl = imageList.firstElementChild;
    let clonedFirstEl = firstEl.cloneNode(true);
    clonedFirstEl.classList.add(cloneClass);
    
    if (diff < 0) {
      clonedFirstEl.classList.add(croppedCloneClass);
    }
  
    imageList.appendChild(clonedFirstEl);
  } else {
    document.querySelectorAll(`.${cloneClass}`).forEach(item => item.classList.remove(cloneClass));
    document.querySelectorAll(`.${croppedCloneClass}`).forEach(item => item.classList.remove(croppedCloneClass));
  }
}