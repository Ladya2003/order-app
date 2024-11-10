import { OrderStatus } from '../features/orders/orderTypes';
import { colors } from '../theme/theme';

interface IStatusProps {
  status: OrderStatus;
}

export const statusColors = ({ status }: IStatusProps) => {
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
