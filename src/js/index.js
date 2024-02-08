import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImages } from './pixabay-api';

const form = document.querySelector('#search-form');
const searchInput = form.querySelector('[name=searchQuery]');
const searchButton = form.querySelector('[type=submit]');
const galleryElement = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');

searchButton.addEventListener('click', event => {
  event.preventDefault();
  const searchKeywords = searchInput.value;
  const keywords = searchKeywords.split(' ').join('+');
  console.log('keywords: ', keywords);
  getImages(keywords, 1)
    .then(result => {
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
      console.log(galleryImages);
      console.log(galleryAll);
      galleryElement.insertAdjacentHTML('beforeend', galleryAll);
    })
    .catch(error => console.log('error: ', error));
});

// webformatURL - link do małego obrazka.
// largeImageURL - link do dużego obrazka.
// tags - wiersz z opisem obrazka. Będzie pasować do atrybutu alt.
// likes - liczba “lajków”.
// views - liczba wyświetleń.
// comments - liczba komentarzy.
// downloads - liczba pobrań.
