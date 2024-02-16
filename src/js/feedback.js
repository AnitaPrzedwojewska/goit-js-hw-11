import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';

export function handleError(element, error) {
  element.innerHTML = error;
  Notiflix.Notify.warning(error);
  element.classList.remove('hidden');
}

export function handleMessage(element, message) {
  element.innerHTML = message;
  Notiflix.Notify.warning(message);
  element.classList.remove('hidden');
}

export function handleInfo(element, info) {
  element.innerHTML = info;
  Notiflix.Notify.info(info);
  element.classList.remove('hidden');
}