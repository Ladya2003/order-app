import { useState } from 'react';
import { Fieldset, Flex, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '../../../../theme';
import { formatPhone } from '../../../../utils';
import { OrderDataMolecule } from '../../molecules/OrderData';
import { OrderDeliveryMolecule } from '../../molecules/OrderDelivery';
import { ProductTableMolecule } from '../../molecules/ProductTable';
import { orderSchema, OrderSchema } from './validationSchemas';

type Props = {
  onHideCreation: () => void;
};

const selectClients = (state: RootState) => state.clients.clients;

export const OrderFormOrganism = ({ onHideCreation }: Props) => {
  const clients = useSelector(selectClients);
  const [shippingPrice, setShippingPrice] = useState(0);

  const firstClient = clients[0];

  const {
    control,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    trigger,
  } = useForm<OrderSchema>({
    mode: 'onChange',
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client: {
        name: firstClient.name,
        phone: formatPhone(firstClient.phone),
        address: firstClient.address,
      },
      comments: '',
      products: [],
      deliveryDate: new Date(),
    },
  });

  return (
    <Fieldset.Root color={colors.primary.main}>
      <Flex gap="40px">
        <Flex gap="40px" direction="column">
          <OrderDataMolecule
            errors={errors}
            control={control}
            clients={clients}
            setValue={setValue}
          />

          <OrderDeliveryMolecule
            errors={errors}
            control={control}
            setShippingPrice={setShippingPrice}
          />
        </Flex>

        <Box minHeight="100%" bgColor={colors.secondary.divider} width="1px" />

        <ProductTableMolecule
          errors={errors}
          control={control}
          shippingPrice={shippingPrice}
          trigger={trigger}
          getValues={getValues}
          isValid={isValid}
          onHideCreation={onHideCreation}
          handleSubmit={handleSubmit}
        />
      </Flex>
    </Fieldset.Root>
  );
};
