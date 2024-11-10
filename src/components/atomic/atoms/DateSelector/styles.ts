import { colors } from '../../../../theme';

const commonStyles = {
  borderColor: colors.status.createdColor,
};

export const styles = {
  active: {
    bgColor: colors.status.createdColor,
    color: colors.primary.paper,
    ...commonStyles,
  },
  inactive: {
    bgColor: 'transparent',
    color: colors.status.createdColor,
    ...commonStyles,
  },
};
