// components/OrderList.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { Table } from '@chakra-ui/react';
import OrderItem from './OrderItem';
import { useDispatch } from 'react-redux';
import ordersData from '../data/clients.json';
import { fetchClients } from '../features/clients/clientSlice';
import { colors } from '../theme/theme';

const OrderList = () => {
  const orders = useSelector((state: RootState) => state.orders?.orders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  return (
    <Table.Root variant="outline" borderRadius="4px" boxShadow="none">
      <Table.Header>
        <Table.Row bg={colors.primary.tableHeader}>
          <Table.ColumnHeader color={colors.primary.main}>№</Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            КЛИЕНТ
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            НОМЕР ТЕЛЕФОНА
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            СТАТУС
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            ДАТА ДОСТАВКИ
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            АДРЕС ДОСТАВКИ
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            КОЛ-ВО
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            СТОИМОСТЬ ТОВАРОВ (RUB)
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            СТОИМОСТЬ ДОСТАВКИ (RUB)
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            СТОИМОСТЬ ИТОГО (RUB)
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            КОММЕНТАРИЙ
          </Table.ColumnHeader>
          <Table.ColumnHeader color={colors.primary.main}>
            ДЕЙСТВИЯ
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default OrderList;