import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './pixabay-api';
import { handleError, handleMessage, handleInfo } from './feedback';

const top = document.querySelector('.top');
const form = document.querySelector('#search-form');
const errorInfo = document.querySelector('.error');
const hitsInfo = document.querySelector('.hits');
const galleryElement = document.querySelector('.gallery');
const message = document.querySelector('.message');
// const moreButton = document.querySelector('.load-more-btn');
const bottom = document.querySelector('.bottom');

const perPage = 40;
let searchWords;
let keywords;
let page;
let pages;
const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt' });
const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

resetForNewSearch();

// if there was an error "You didn't enter what you are looking for...",
// hide the error when the input is active
form.searchQuery.addEventListener('focus', () => nazwaFunkcji);
form.searchQuery.addEventListener('click', () => nazwaFunkcji);

function nazwaFunkcji() {
  errorInfo.innerHTML = '';
  errorInfo.classList.add('hidden');
  form.searchQuery.value = '';
}

// send new words for new searching
form.addEventListener('submit', showGallery);

// get and show more images
// moreButton.addEventListener('click', showMore);

function resetForNewSearch() {
  page = 1;
  pages = 0;
  top.classList.add('full');
  hitsInfo.innerHTML = '';
  message.innerHTML = '';
  galleryElement.innerHTML = ``;
  hitsInfo.classList.add('hidden');
  galleryElement.classList.add('hidden');
  // moreButton.classList.add('hidden');
}

// show images with keywords in gallery, if it is possible
async function showGallery(event) {
  event.preventDefault();
  // reset variables
  resetForNewSearch();
  searchWords = form.searchQuery.value.trim();
  try {
    // if no words to searching
    if (!searchWords) {
      handleError(
        errorInfo,
        `You didn't enter what you are looking for...
      Please, try again.`
      );
      return;
    }
    keywords = searchWords.split(' ').join('+');
    const images = await getImages(keywords, page, perPage);
    console.log('images: ', images);
    const hits = images.totalHits;
    if (!hits) {
      handleMessage(
        message,
        `Sorry, there are no images matching your search query.
        Please try again.`
      );
      return;
    }
    handleInfo(hitsInfo, `We found ${hits} image(s).`);
    pages = Math.floor(hits / 40) + (hits % 40 ? 1 : 0);
    showImages(images);
    galleryElement.classList.remove('hidden');
    if (pages === 1) {
      handleMessage(
        message,
        `We're sorry, but you've reached the end of search results.`
      );
    }
    // if (pages > 1) {
    //   moreButton.classList.remove('hidden');
    // }
  } catch (error) {
    handleError(errorInfo, error.message);
  }
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
        <b>Likes</b>
        <br>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        <br>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        <br>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <br>${downloads}
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
  const images = await getImages(keywords, page, perPage);
  showImages(images);
  if (page === pages) {
    handleMessage(
      message,
      `We're sorry, but you've reached the end of search results.`
    );
    // moreButton.classList.add('hidden');
  }
}

// infinity scroll
// get and show more images, when you go to then end of page
window.addEventListener(
  'scroll',
  () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && page < pages) {
      showMore();
    }
  },
  {
    passive: true,
  }
);
