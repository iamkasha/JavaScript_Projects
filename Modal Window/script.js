'use strict';

const modal = document.querySelector('.modal');
const overLay = document.querySelector('.overlay');
const btncloseModal = document.querySelector('.close-modal');
const btnShowModal = document.querySelectorAll('.show-modal');

console.log(btnShowModal);

const closeModal = function () {
  modal.classList.add('hidden');
  overLay.classList.add('hidden');
};

const openModal = function () {
  modal.classList.remove('hidden');
  overLay.classList.remove('hidden');
};

for (let i = 0; i < btnShowModal.length; i++)
  btnShowModal[i].addEventListener('click', openModal);

btncloseModal.addEventListener('click', closeModal);

overLay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
