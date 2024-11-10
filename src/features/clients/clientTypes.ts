export interface Client {
  id?: number;
  name?: string;
  phone: string;
  address: string;
}

export interface ClientState {
  clients: Client[];
}
