import axios from 'axios';

async function getImages(keywords, page) {
  const apiKey = '42261128-30c11368cc5a6bd0852de3244';

  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${keywords}&image_type=photo&safesearch=true&page=${page}&per_page=40`
  );
  return response.data;
}

export { getImages };
