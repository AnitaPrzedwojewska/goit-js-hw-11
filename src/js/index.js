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

getImages('owl', 1)
  .then(result => {
    console.log(result);
    const hits = result.totalHits;
    console.log(hits);
    const result2 = result.hits.map(
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
    console.log(result2);
    // result2.unschift({ result.totalHits });
    // console.log(result2);
    // webformatURL - link do małego obrazka.
    // largeImageURL - link do dużego obrazka.
    // tags - wiersz z opisem obrazka. Będzie pasować do atrybutu alt.
    // likes - liczba “lajków”.
    // views - liczba wyświetleń.
    // comments - liczba komentarzy.
    // downloads - liczba pobrań.
  })
  .catch(error => console.log(error));
