import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const searchInput = form.querySelector('[name=searchQuery]');
const searchButton = form.querySelector('[type=submit]');
const errorInfo = document.querySelector('.error');
const hitsInfo = document.querySelector('.hits');
const galleryElement = document.querySelector('.gallery');
const message = document.querySelector('.message');
const moreButton = document.querySelector('.load-more');
const bottom = document.querySelector('.bottom');

hitsInfo.classList.add('hidden');
galleryElement.classList.add('hidden');
bottom.classList.add('hidden');
moreButton.classList.add('hidden');

const perPage = 40;
let searchWords;
let keywords;
let page;
let pages;

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt' });

searchInput.addEventListener('focus', () => {
  errorInfo.innerHTML = '';
  errorInfo.classList.add('hidden');
});
searchButton.addEventListener('click', showGallery);
// moreButton.addEventListener('click', showMore);

const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

async function showGallery(event) {
  event.preventDefault();
  // reset variables
  page = 1;
  pages = 0;
  hitsInfo.innerHTML = '';
  message.innerHTML = '';
  searchWords = searchInput.value;
  try {
    if (!searchWords) {
      errorInfo.innerHTML = `You didn't enter what you are looking for...
      Please, try again.`;
      Notiflix.Notify.warning(`You didn't enter what you are looking for...
      Please, try again.`);
      return;
    }
    keywords = searchWords.split(' ').join('+');
    galleryElement.innerHTML = ``;
    const images = await getImages();
    const hits = images.totalHits;
    if (!hits) {
      message.innerHTML = `Sorry, there are no images matching your search query.
        Please try again.`;
      Notiflix.Notify.warning(
        `Sorry, there are no images matching your search query.
        Please try again.`
      );
      return;
    }
    hitsInfo.innerHTML = `Hooray! We found ${hits} image(s).`;
    hitsInfo.classList.remove('hidden');
    Notiflix.Notify.info(`Hooray! We found ${hits} image(s).`);
    pages = Math.floor(hits / 40) + (hits % 40 ? 1 : 0);
    showImages(images);
    galleryElement.classList.remove('hidden');
    bottom.classList.remove('hidden');
    if (pages === 1) {
      message.innerHTML = `We're sorry, but you've reached the end of search results.`;
    }
    // if (pages > 1) {
    //   moreButton.classList.remove('hidden');
    // }
  } catch (error) {
    errorInfo.innerHTML = error.message;
    errorInfo.classList.remove('hidden');
    Notiflix.Notify.failure(error.message);
  }
}

async function getImages() {
  const apiKey = '42261128-30c11368cc5a6bd0852de3244';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${keywords}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

function showImages(images) {
  const galleryImages = images.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `
  <div class="photo-card">
    <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div>`
  );
  const galleryAll = galleryImages.join('');
  galleryElement.insertAdjacentHTML('beforeend', galleryAll);
  lightbox.refresh();
}

async function showMore() {
  page++;
  const images = await getImages();
  showImages(images);
  if (page === pages) {
    message.innerHTML = `We're sorry, but you've reached the end of search results.`;
    moreButton.classList.add('hidden');
  }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if ((scrollTop + clientHeight >= scrollHeight - 5) && ( page < pages )) {
      showMore();
    }
  },
  {
    passive: true,
  }
);
