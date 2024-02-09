import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const searchInput = form.querySelector('[name=searchQuery]');
const searchButton = form.querySelector('[type=submit]');
const galleryElement = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');

moreButton.style.display = 'none';

const perPage = 40;
let keywords = searchInput.value;
let page = 1;
let pages = 0;

searchButton.addEventListener('click', showGallery);

moreButton.addEventListener('click', showMore);

async function getImages() {
  const apiKey = '42261128-30c11368cc5a6bd0852de3244';

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${keywords}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch {
    Notiflix.Notify.failure(error.response);
  }
}

const showImages = (result) => {
  const galleryImages = result.hits.map(
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
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
}

async function showGallery(event) {
  event.preventDefault();
  const searchKeywords = searchInput.value;
  keywords = searchKeywords.split(' ').join('+');
  galleryElement.innerHTML = ``;
  getImages(keywords, 1)
    .then(result => {
      const hits = result.totalHits;
      if (!hits) {
        Promise.reject(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      pages = Math.floor(hits / 40) + (hits % 40 ? 1 : 0);
      console.log('pages: ', pages);
      showImages(result);
      if (pages > 1) {
        moreButton.style.display = 'block';
      }
    })
    .catch(error => Notiflix.Notify.failure(error));
}

function showMore() {
  // debugger;
  page++;
  getImages()
    .then(result => {
      showImages(result);
      console.log(`Page ${page} of ${pages} pages`);
      if ((page === pages)) {
        moreButton.style.display = 'none';
      }
    })
    .catch(error => Notiflix.Notify.failure(error));
}
