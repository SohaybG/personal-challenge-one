import './style.scss'
const cloneClasses = {
  base: 'cloned',
  first: 'cloned--first',
  last: 'cloned--last',
  cropped: 'cloned--cropped'
}

document.querySelectorAll('.image-list').forEach(slider => {
  initSlider(slider);
});

document.querySelectorAll('.js-prev').forEach(button => {
  button.addEventListener('click', function() {
    let slider = document.querySelector(this.dataset.target);
    moveSlide(slider, 'prev');
  });
});

document.querySelectorAll('.js-next').forEach(button => {
  button.addEventListener('click', function() {
    let slider = document.querySelector(this.dataset.target);
    moveSlide(slider, 'next');
  });
});

document.querySelectorAll('.item-amount-changer button').forEach(button => button.addEventListener('click', function() {
  updateItemCount(this.dataset.count);
}));

function initSlider(slider) {
  slider.classList.add('image-list--initialised');
  adaptClones(slider);
  adaptItemCountClasses(slider);
}

function moveSlide(slider, direction = 'next') {
  if (slider.className.indexOf(`move-`) > -1) return;
  if (!slider.classList.contains('image-list--initialised')) return;

  let itemsDiff = getDiffBetweenItemsToShowAndExisting(slider);
  let hasClone = itemsDiff <= 0;
  let hasCroppedClone = itemsDiff < 0;
  let transitionDuration = getComputedStyle(slider).getPropertyValue('--_transition-duration');
  let originalItems = getOriginalItems(slider);
  transitionDuration = transitionDuration.indexOf('ms') ? parseInt(transitionDuration) : parseInt(transitionDuration) * 1000;

  slider.classList.add(`move-${direction}`);

  let data = {
    hasClone: hasClone,
    hasCroppedClone: hasCroppedClone,
    transitionDuration: transitionDuration,
    originalItems: originalItems,
    direction: direction,
    slider: slider
  }

  if (direction == 'next') {
    sliderNext(data);
  } else {
    sliderPrev(data);
  }
}

function sliderNext(data) {
  let { hasClone, hasCroppedClone, transitionDuration, originalItems, direction, slider } = data;
  let croppedClone;

  if (hasCroppedClone) {
    croppedClone = slider.querySelector(`.${cloneClasses.cropped}`);
    croppedClone.classList.add('entering');
  }

  setTimeout(() => {
    slider.classList.remove(`move-${direction}`);

    let firstEl = originalItems[0];
    let secondEl = originalItems[1];
    let elementToAppend = hasClone ? secondEl.cloneNode(true) : firstEl.cloneNode(true);
    
    firstEl.classList.add(cloneClasses.base, cloneClasses.first);
    slider.removeChild(slider.querySelector(`.${cloneClasses.first}`));

    if (hasClone) {
      slider.querySelector(`.${cloneClasses.last}`).classList.remove(cloneClasses.base, cloneClasses.last);
      elementToAppend.classList.add(cloneClasses.base, cloneClasses.last);

      if (hasCroppedClone) {
        croppedClone.classList.remove(cloneClasses.cropped);
        croppedClone.classList.remove('entering');
        elementToAppend.classList.add(cloneClasses.cropped);
      }
    }

    slider.appendChild(elementToAppend);
    
    adaptItemCountClasses(slider);
  }, transitionDuration);
}

function sliderPrev(data) {
  let { hasClone, hasCroppedClone, transitionDuration, originalItems, direction, slider } = data;
  let lastEl = originalItems[originalItems.length - 1];

  if (hasCroppedClone) {
    lastEl.classList.add('exiting');
  }

  setTimeout(() => {
    slider.classList.remove(`move-${direction}`);
    let clonedSecondLastEl = originalItems[originalItems.length - 2].cloneNode(true);
    let elementToRemove = hasClone ? slider.querySelector(`.${cloneClasses.last}`) : lastEl;

    slider.querySelector(`.${cloneClasses.first}`).classList.remove(cloneClasses.base, cloneClasses.first);
    clonedSecondLastEl.classList.add(cloneClasses.base, cloneClasses.first);

    if (hasClone) {
      lastEl.classList.add(cloneClasses.base, cloneClasses.last);

      if (hasCroppedClone) {
        lastEl.classList.add(cloneClasses.cropped);
        lastEl.classList.remove('exiting');
      }
    }
    
    slider.removeChild(elementToRemove);
    slider.prepend(clonedSecondLastEl);
    
    adaptItemCountClasses(slider);
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
  parent.querySelectorAll(`.${firstActiveClass}`).forEach(item => item.classList.remove(firstActiveClass));
  parent.querySelectorAll(`.${lastActiveClass}`).forEach(item => item.classList.remove(lastActiveClass));
  parent.querySelectorAll(`.${activeClass}`).forEach(item => item.classList.remove(activeClass));

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
  adaptClones(imageList);
  adaptItemCountClasses(imageList);
}

function adaptClones(slider) {
  let diff = getDiffBetweenItemsToShowAndExisting(slider);
  
  let originalItems = getOriginalItems(slider);
  let firstEl = originalItems[0];

  let clonedLastEl = originalItems[originalItems.length - 1].cloneNode(true);
  clonedLastEl.classList.add(cloneClasses.base, cloneClasses.first);
  slider.prepend(clonedLastEl);

  if (diff <= 0) {
    let clonedFirstEl = firstEl.cloneNode(true);
    clonedFirstEl.classList.add(cloneClasses.base, cloneClasses.last);
    
    if (diff < 0) {
      clonedFirstEl.classList.add(cloneClasses.cropped);
    }
  
    slider.appendChild(clonedFirstEl);
  } else {
    document.querySelectorAll(`.${cloneClasses.last}`).forEach(item => item.classList.remove(cloneClasses.base));
    document.querySelectorAll(`.${cloneClasses.cropped}`).forEach(item => item.classList.remove(cloneClasses.cropped));
  }
}