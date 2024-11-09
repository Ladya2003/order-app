import { Client } from '../clients/clientTypes';

export enum OrderStatus {
  Created = 'Создан',
  Completed = 'Завершен',
  Rejected = 'Отменен',
}

export interface IProduct {
  name: string;
  article: string;
  count: number;
  cost: number;
  comment?: string;
}

export interface Order {
  id: number;
  client: Client;
  deliveryDate: string;
  shippingCost: number;
  products: IProduct[];
  status: OrderStatus;
  comments?: string;
}

export interface OrderState {
  orders: Order[];
}
