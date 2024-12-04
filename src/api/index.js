const BASE_URL = 'https://productapi-umber.vercel.app/api';

const API_URLS = {
  PRODUCTS: `${BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${BASE_URL}/products/${id}`,
};

export default API_URLS;
