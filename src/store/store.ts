import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../features/orders/orderSlice';
import clientReducer from '../features/clients/clientSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    clients: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
