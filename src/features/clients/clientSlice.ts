import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clientsData from '../../data/clients.json';
import { ClientState } from './clientTypes';

const initialState: ClientState = {
  clients: [],
};

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    return clientsData;
  },
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.clients = action.payload;
    });
  },
});

export default clientSlice.reducer;
