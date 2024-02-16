import axios from 'axios';

export async function getImages(keywords, page, perPage) {
  const apiKey = '42261128-30c11368cc5a6bd0852de3244';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${keywords}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

// export { getImages };
