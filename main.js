import './style.scss'
const cloneClasses = {
  base: 'cloned',
  first: 'cloned--first',
  last: 'cloned--last',
  cropped: 'cloned--cropped'
}
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

  if (imageList.className.indexOf(`move-`) > -1) return;

  let itemsDiff = getDiffBetweenItemsToShowAndExisting(imageList);
  let hasClone = itemsDiff <= 0;
  let hasCroppedClone = itemsDiff < 0;
  let transitionDuration = getComputedStyle(imageList).getPropertyValue('--_transition-duration');
  let originalItems = getOriginalItems(imageList);
  let croppedClone;
  let lastEl = originalItems[originalItems.length - 1];
  transitionDuration = transitionDuration.indexOf('ms') ? parseInt(transitionDuration) : parseInt(transitionDuration) * 1000;

  imageList.classList.add(`move-${direction}`);

  if (hasCroppedClone) {
    if (direction == 'next') {
      croppedClone = imageList.querySelector(`.${cloneClasses.cropped}`);
      croppedClone.classList.add('entering');
    } else {
      lastEl.classList.add('exiting');
    }
  }

  setTimeout(() => {
    imageList.classList.remove(`move-${direction}`);

    if (direction == 'next') {
      let firstEl = originalItems[0];
      let secondEl = originalItems[1];
      let elementToAppend = hasClone ? secondEl : firstEl;
      elementToAppend = elementToAppend.cloneNode(true);
      
      firstEl.classList.add(cloneClasses.base, cloneClasses.first);
      imageList.removeChild(imageList.querySelector(`.${cloneClasses.first}`));

      if (hasClone) {
        imageList.querySelector(`.${cloneClasses.last}`).classList.remove(cloneClasses.base, cloneClasses.last);
        elementToAppend.classList.add(cloneClasses.base, cloneClasses.last);
  
        if (hasCroppedClone) {
          croppedClone.classList.remove(cloneClasses.cropped);
          croppedClone.classList.remove('entering');
          elementToAppend.classList.add(cloneClasses.cropped);
        }
      }

      imageList.appendChild(elementToAppend);
    } else {
      let clonedSecondLastEl = originalItems[originalItems.length - 2].cloneNode(true);

      imageList.querySelector(`.${cloneClasses.first}`).classList.remove(cloneClasses.base, cloneClasses.first);
      clonedSecondLastEl.classList.add(cloneClasses.base, cloneClasses.first);

      if (hasClone) {
        imageList.removeChild(imageList.querySelector(`.${cloneClasses.last}`));
        lastEl.classList.add(cloneClasses.base, cloneClasses.last);

        if (hasCroppedClone) {
          lastEl.classList.add(cloneClasses.cropped);
          lastEl.classList.remove('exiting');
        }
      } else {
        imageList.removeChild(lastEl);
      }

      imageList.prepend(clonedSecondLastEl);
    }
    
    adaptItemCountClasses(imageList);
  }, transitionDuration);
}

function getDiffBetweenItemsToShowAndExisting(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  return getNumberOfOriginalItems(parent) - numberOfItemsToShow;
}

function getOriginalItems(parent) {
  return parent.querySelectorAll(':scope > :not(.cloned)');
}

function getNumberOfOriginalItems(parent) {
  return getOriginalItems(parent).length;
}

function adaptItemCountClasses(parent) {
  let numberOfItemsToShow = getComputedStyle(parent).getPropertyValue('--_items-shown');
  let activeClass = 'image-list__item--active';
  let firstActiveClass = 'image-list__item--first-active';
  let lastActiveClass = 'image-list__item--last-active';
  document.querySelectorAll(`.${firstActiveClass}`).forEach(item => item.classList.remove(firstActiveClass));
  document.querySelectorAll(`.${lastActiveClass}`).forEach(item => item.classList.remove(lastActiveClass));
  document.querySelectorAll(`.${activeClass}`).forEach(item => item.classList.remove(activeClass));

  let originalItems = parent.querySelectorAll(':scope > :not(.cloned)');

  for (let i = 0; i < originalItems.length; i++) {
    const item = originalItems[i];
    item.classList.add(activeClass);

    if (i == 0) {
      item.classList.add(firstActiveClass);
    } else if (i == numberOfItemsToShow - 1) {
      item.classList.add(lastActiveClass);

      {break}
    }
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
  
  let originalItems = getOriginalItems(imageList);
  let firstEl = originalItems[0];

  let clonedLastEl = originalItems[originalItems.length - 1].cloneNode(true);
  clonedLastEl.classList.add(cloneClasses.base, cloneClasses.first);
  imageList.prepend(clonedLastEl);

  if (diff <= 0) {
    let clonedFirstEl = firstEl.cloneNode(true);
    clonedFirstEl.classList.add(cloneClasses.base, cloneClasses.last);
    
    if (diff < 0) {
      clonedFirstEl.classList.add(cloneClasses.cropped);
    }
  
    imageList.appendChild(clonedFirstEl);
  } else {
    document.querySelectorAll(`.${cloneClasses.last}`).forEach(item => item.classList.remove(cloneClasses.base));
    document.querySelectorAll(`.${cloneClasses.cropped}`).forEach(item => item.classList.remove(cloneClasses.cropped));
  }
}