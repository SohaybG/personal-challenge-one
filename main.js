import './style.scss'

let imageList = document.querySelector('.image-list');
let diff = getDiffBetweenItemsToShowAndExisting(imageList);
adaptItemCountClasses(imageList);

if (diff <= 0) {
  let firstEl = imageList.firstElementChild;
  let clonedFirstEl = firstEl.cloneNode(true);
  clonedFirstEl.classList.add('cloned');
  
  if (diff < 0) {
    clonedFirstEl.classList.add('cloned--cropped');
  }

  imageList.appendChild(clonedFirstEl);
}

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
  document.querySelectorAll(`.${activeClass}`).forEach(item => item.classList.remove(activeClass));
  document.querySelectorAll(`.${lastActiveClass}`).forEach(item => item.classList.remove(lastActiveClass));

  console.log(parent.children.length)

  for (let i = 0; i < numberOfItemsToShow && i < parent.children.length; i++) {
    parent.children[i].classList.add(activeClass);
    
    if (i == numberOfItemsToShow - 1) {
      parent.children[i].classList.add(lastActiveClass);
    }
  }
}

function updateItemCount(count) {
  let imageList = document.querySelector('.image-list');
  imageList.style.setProperty('--_items-shown', count);
  adaptItemCountClasses(imageList);
}