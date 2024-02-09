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

async function getImages(keywords, page) {
  const apiKey = '42261128-30c11368cc5a6bd0852de3244';

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${keywords}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response.data;
  } catch {
    Notiflix.Notify.failure(error.response);
  }
}

function showImages(result) {
  console.log('result: ', result);
  const hits = result.totalHits;
  console.log('hits: ', hits);
  const images = result.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    })
  );
  console.log('images: ', images);
  // result2.unschift({ result.totalHits });
  // console.log(result2);
  const galleryImages = images.map(
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
  galleryElement.innerHTML = ``;
  galleryElement.insertAdjacentHTML('beforeend', galleryAll);
  moreButton.style.display = 'block';
}

async function showGallery(event) {
  event.preventDefault();
  const searchKeywords = searchInput.value;
  const keywords = searchKeywords.split(' ').join('+');
  getImages(keywords, 1)
  .then(result => showImages(result))
  .catch(error => Notiflix.Notify.failure(error));
}

searchButton.addEventListener('click', showGallery);

function showMore() {
  
}

moreButton.addEventListener('click', showMore);