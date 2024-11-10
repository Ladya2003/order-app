import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../../../features/orders/orderSlice';
import { Table, Button, Text } from '@chakra-ui/react';
import { Order, OrderStatus } from '../../../../features/orders/orderTypes';
import { colors } from '../../../../theme';
import dayjs from 'dayjs';
import { statusColors } from '../../../../utils';

interface OrderItemProps {
  order: Order;
  index: number;
}

const OrderItemMolecule = ({
  order: {
    id,
    client: { name, phone, address },
    deliveryDate,
    shippingCost,
    status,
    products,
    comments,
  },
  index,
}: OrderItemProps) => {
  const dispatch = useDispatch();

  const handleStatusChange = (status: Order['status']) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const { color, bgColor, borderColor } = statusColors({ status });

  return (
    <Table.Row color={colors.primary.secondary}>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{phone}</Table.Cell>
      <Table.Cell>
        <Text
          bgColor={bgColor}
          color={color}
          borderColor={borderColor}
          borderWidth="1px"
          borderStyle="solid"
          padding="4px 10px"
          borderRadius="4px"
          textAlign="center"
        >
          {status}
        </Text>
      </Table.Cell>
      <Table.Cell>{dayjs(deliveryDate).format('DD.MM.YYYY')}</Table.Cell>
      <Table.Cell>{address}</Table.Cell>

      {products.length < 1 ? (
        <Table.Cell colSpan={4}></Table.Cell>
      ) : (
        <>
          <Table.Cell>
            {products.map((product) => (
              <Text>{product.count}</Text>
            ))}
          </Table.Cell>

          <Table.Cell>
            {products.map((product) => (
              <Text>{product.cost}</Text>
            ))}
          </Table.Cell>

          <Table.Cell>
            {products.map(() => (
              <Text>{shippingCost}</Text>
            ))}
          </Table.Cell>

          <Table.Cell>
            {products.map((product) => (
              <Text>{product.count * product.count + (shippingCost || 0)}</Text>
            ))}
          </Table.Cell>
        </>
      )}

      <Table.Cell>{comments}</Table.Cell>
      <Table.Cell display="flex" alignItems="center">
        <Button
          onClick={() => handleStatusChange(OrderStatus.Rejected)}
          color={colors.secondary.buttonColor}
          bgColor="transparent"
        >
          Отменить
        </Button>

        <Button
          onClick={() => handleStatusChange(OrderStatus.Completed)}
          bgColor={colors.secondary.button}
        >
          Завершить
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default OrderItemMolecule;
