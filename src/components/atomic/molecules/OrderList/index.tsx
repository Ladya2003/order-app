import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { Table } from '@chakra-ui/react';
import OrderItemMolecule from './OrderItem';
import { useDispatch } from 'react-redux';
import { fetchClients } from '../../../../features/clients/clientSlice';
import { colors } from '../../../../theme';

const selectOrders = (state: RootState) => state.orders?.orders;

const OrderListMolecule = () => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

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
        {orders.map((order, index) => (
          <OrderItemMolecule key={order.id} order={order} index={index} />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default OrderListMolecule;
