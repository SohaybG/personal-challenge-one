import './style.scss'

let imageList = document.querySelector('.image-list');
let firstEl = imageList.firstElementChild;
imageList.appendChild(firstEl.cloneNode(true));

document.querySelector('body').addEventListener('click', function() {
  let imageList = document.querySelector('.image-list');
  if (imageList.classList.contains('move')) return;
  
  imageList.classList.toggle('move');
  let firstEl = imageList.firstElementChild;
  let secondEl = imageList.children[1];

  setTimeout(() => {
    imageList.classList.toggle('move');
    imageList.removeChild(firstEl);
    imageList.appendChild(secondEl.cloneNode(true));
  }, 500);
});