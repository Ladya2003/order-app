// components/OrderItem.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../features/orders/orderSlice';
import { Table, Button, Text } from '@chakra-ui/react';
import { Order, OrderState, OrderStatus } from '../features/orders/orderTypes';
import { colors } from '../theme/theme';
import dayjs from 'dayjs';

interface OrderItemProps {
  order: Order;
}

interface IStatusProps {
  status: OrderStatus;
}

const statusColors = ({ status }: IStatusProps) => {
  switch (status) {
    case OrderStatus.Created:
      return {
        color: colors.status.createdColor,
        borderColor: colors.status.createdColor,
        bgColor: colors.status.createdBgColor,
      };
    case OrderStatus.Rejected:
      return {
        color: colors.status.rejectedColor,
        borderColor: colors.status.rejectedColor,
        bgColor: colors.status.rejectedBgColor,
      };
    case OrderStatus.Completed:
      return {
        color: colors.status.completedColor,
        borderColor: colors.status.completedColor,
        bgColor: colors.status.completedBgColor,
      };
    default:
      return {
        color: colors.status.createdColor,
        borderColor: colors.status.createdColor,
        bgColor: colors.status.createdBgColor,
      };
  }
};

const OrderItem: React.FC<OrderItemProps> = ({
  order: {
    id,
    client: { name, phone, address },
    deliveryDate,
    shippingCost,
    status,
    products,
    comments,
  },
}) => {
  const dispatch = useDispatch();

  const handleStatusChange = (status: Order['status']) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const { color, bgColor, borderColor } = statusColors({ status });

  return (
    <Table.Row color={colors.primary.secondary}>
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
              <Text>{product.count * product.count + shippingCost}</Text>
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

export default OrderItem;
