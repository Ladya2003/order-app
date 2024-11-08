import axios from 'axios';

const DADATA_API_KEY = '84e4ac66b6e9a8eee59bb64e66cf3ebad1d37b93';

export const fetchAddressSuggestions = async (query: string) => {
  const response = await axios.post(
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
    { query, count: 5 },
    { headers: { Authorization: `Token ${DADATA_API_KEY}` } }
  );
  return response.data.suggestions;
};
