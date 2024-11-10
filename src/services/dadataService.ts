import axios from 'axios';

const DADATA_API_KEY = process.env.REACT_APP_DADATA_API_KEY;

export const fetchAddressSuggestions = async (query: string) => {
  const response = await axios.post(
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
    { query, count: 5 },
  );
  return response.data.suggestions;
};

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Token ${DADATA_API_KEY}`;

  return config;
});
