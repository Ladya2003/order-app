import { useState } from 'react';
import { Fieldset, Flex, Box } from '@chakra-ui/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '../../../../theme/theme';
import { formatPhone } from '../../../../utils/phone';
import { OrderDataMolecule } from '../../molecules/OrderData';
import { OrderDeliveryMolecule } from '../../molecules/OrderDelivery';
import { ProductTableMolecule } from '../../molecules/ProductTable';

interface IOrderFormProps {
  setIsCreating: (state: boolean) => void;
}

const productSchema = z.object({
  name: z.string().trim().min(1, 'Выберите название товара'),
  article: z.string().trim().min(1, 'Выберите название артикула'),
  count: z.number().min(1, 'Цена должна быть больше нуля'),
  cost: z.number().min(1, 'Кол-во должно быть больше нуля'),
  comment: z.string().trim().optional(),
});

const clientSchema = z.object({
  name: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .min(1, 'Введите телефон клиента')
    .regex(
      /(^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$)/,
      'Введите телефон в формате +7 (999) 999-99-99',
    ),
  address: z.string().trim().min(1, 'Введите адрес клиента'),
});

const orderSchema = z.object({
  client: clientSchema,
  comments: z.string().trim().optional(),
  deliveryDate: z.date(),
  shippingCost: z.number().optional(),
  products: z.array(productSchema),
});

export type OrderSchema = z.infer<typeof orderSchema>;

export const OrderFormOrganism = ({ setIsCreating }: IOrderFormProps) => {
  const [shippingPrice, setShippingPrice] = useState(0);

  const clients = useSelector((state: RootState) => state.clients.clients);

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
          setIsCreating={setIsCreating}
          handleSubmit={handleSubmit}
        />
      </Flex>
    </Fieldset.Root>
  );
};
