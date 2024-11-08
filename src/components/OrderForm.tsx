import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from '../features/orders/orderSlice';
import {
  Input,
  Button,
  Fieldset,
  Flex,
  Table,
  Box,
  Text,
  Textarea,
  List,
  ListItem,
  ClipboardRoot,
} from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import { fetchAddressSuggestions } from '../services/dadataService';
import { IOption, Select } from './Select';
import { z } from 'zod';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderStatus } from '../features/orders/orderTypes';
import { Field } from './ui/field';
import { colors } from '../theme/theme';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ClipboardIconButton } from './ui/clipboard';
import DateSelector from './atomic/atoms/DateSelector';

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
  name: z.string().trim().min(1, 'Выберите имя клиента'),
  phone: z.string().trim().min(1, 'Введите телефон клиента'),
  address: z.string().trim().min(1, 'Введите адрес клиента'),
});

type ClientSchema = z.infer<typeof clientSchema>;

const orderSchema = z.object({
  client: clientSchema,
  comments: z.string().trim().optional(),
  deliveryDate: z.date(),
  shippingCost: z.number(),
  products: z.array(productSchema),
});

type OrderSchema = z.infer<typeof orderSchema>;

export const OrderForm = ({ setIsCreating }: IOrderFormProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<[{ value?: string }]>([{}]); // Store suggestions here
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.clients.clients);

  const options = clients.map((client) => ({
    label: client.name,
    value: client.name,
  }));

  const firstClient = clients[0];

  const {
    control,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<OrderSchema>({
    mode: 'onChange',
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client: {
        name: firstClient.name,
        phone: firstClient.phone,
        address: firstClient.address,
      },
      comments: '',
      products: [],
      deliveryDate: new Date(),
    },
  });

  const { fields: productFields, append } = useFieldArray({
    control,
    name: 'products',
  });

  const totalCost = productFields.reduce((acc, cur) => (acc += cur.cost), 0);
  const totalCostWithShipping = totalCost + (getValues('shippingCost') ?? 0);

  console.log('totalCost', totalCost);
  console.log('totalCostWithShipping', totalCostWithShipping);

  const handleSave = (formValues: OrderSchema) => {
    console.log('formValues', formValues);
    if (isValid) {
      dispatch(
        addOrder({
          ...formValues,
          id: Date.now(),
          status: OrderStatus.Created,
        }),
      );

      setIsCreating(false);
    }
  };

  const handleInputChange = async (value: string) => {
    if (value) {
      const suggestions = await fetchAddressSuggestions(value);

      setSuggestions(suggestions);
      setDropdownVisible(true);
    } else {
      setSuggestions([{}]);
      setDropdownVisible(false);
    }
  };

  // TODO: somewhy adds two times
  const handleAddProduct = (formState: OrderSchema) => {
    console.log('formState', formState);
    append(formState.products[productFields.length]);

    setIsAdding(false);
  };

  return (
    <Fieldset.Root color={colors.primary.main}>
      <Flex gap="40px">
        <Flex gap="40px" direction="column">
          <Fieldset.Content>
            <Fieldset.Legend fontSize="16px" color={colors.primary.main}>
              Данные заказа
            </Fieldset.Legend>

            <Field
              label="Имя клиента *"
              invalid={!!errors.client?.name}
              errorText={errors.client?.name?.message}
            >
              <Controller
                control={control}
                name="client.name"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      options={options}
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        console.log(e);
                      }}
                      placeholder="Выберите постоянного клиента"
                    />
                  );
                }}
              />
            </Field>

            <Field
              label="Номер телефона *"
              invalid={!!errors.client?.phone}
              errorText={errors.client?.phone?.message}
            >
              <Controller
                control={control}
                name="client.phone"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Box width="100%">
                      <InputMask
                        mask="+7 (999) 999-99-99"
                        name={value}
                        value={value}
                        onChange={onChange}
                        color={colors.primary.secondary}
                        style={{
                          border: `1px solid ${!errors.client?.phone ? colors.primary.inputBorder : colors.status.rejectedColor}`,
                          borderRadius: '4px',
                          width: '100%',
                          padding: '8px',
                        }}
                      />
                    </Box>
                  );
                }}
              />
            </Field>

            <Field label="Комментарий">
              <Controller
                control={control}
                name="comments"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Textarea
                      name={value}
                      value={value}
                      onChange={onChange}
                      color={colors.primary.secondary}
                      placeholder="Введите комментарий"
                      rows={4}
                    />
                  );
                }}
              />
            </Field>
          </Fieldset.Content>

          <Fieldset.Content>
            <Fieldset.Legend fontSize="16px" color={colors.primary.main}>
              Доставка
            </Fieldset.Legend>

            <Field
              label="Адрес *"
              invalid={!!errors.client?.address}
              errorText={errors.client?.address?.message}
            >
              <Controller
                control={control}
                name="client.address"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Flex justifyContent="space-between" gap="8px" width="100%">
                      <Input
                        width="100%"
                        name={value}
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          handleInputChange(e.target.value);
                        }}
                        placeholder="Введите адрес"
                        color={colors.primary.secondary}
                        onBlur={() =>
                          setTimeout(() => setDropdownVisible(false), 100)
                        }
                        onFocus={() => value && setDropdownVisible(true)}
                      />

                      <ClipboardRoot value={value}>
                        <ClipboardIconButton
                          style={{ height: '100%', aspectRatio: 1 }}
                        />
                      </ClipboardRoot>
                    </Flex>

                    <Box position="relative" width="100%">
                      {isDropdownVisible && suggestions.length > 0 && (
                        <Box
                          position="absolute"
                          bg="white"
                          boxShadow="md"
                          zIndex="10"
                          width="100%"
                          top={0}
                        >
                          <List.Root>
                            {suggestions.map((suggestion, index) => (
                              <ListItem
                                key={index}
                                p={2}
                                cursor="pointer"
                                _hover={{ bg: 'gray.100' }}
                                onClick={() => {
                                  onChange(suggestion.value);
                                  setDropdownVisible(false);
                                }}
                              >
                                {suggestion.value}
                              </ListItem>
                            ))}
                          </List.Root>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              />
            </Field>

            {/* TODO: ADD RUB TO THE RIGHT */}
            <Field
              label="Стоимость доставки *"
              invalid={!!errors.shippingCost}
              errorText={errors.shippingCost?.message}
            >
              <Controller
                control={control}
                name="shippingCost"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      name={value?.toString()}
                      value={value}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        onChange(value ? value : e.target.value);
                      }}
                      placeholder="Введите сумму"
                      color={colors.primary.secondary}
                      type="number"
                    />
                  );
                }}
              />
            </Field>

            <Field
              label="Дата *"
              invalid={!!errors.deliveryDate}
              errorText={errors.deliveryDate?.message}
            >
              <Controller
                control={control}
                name="deliveryDate"
                render={({ field: { value, onChange } }) => {
                  return <DateSelector value={value} onChange={onChange} />;
                }}
              />
            </Field>
          </Fieldset.Content>
        </Flex>

        <Box minHeight="100%" bgColor={colors.secondary.divider} width="1px" />

        <Fieldset.Content flex={1}>
          <Fieldset.Root>
            <Flex gap="40px" direction="column">
              <Flex gap="16px" direction="column">
                <Fieldset.Legend fontSize="16px" color={colors.primary.main}>
                  Товары к заказу
                </Fieldset.Legend>

                <Table.Root>
                  <Table.Header>
                    <Table.Row bg={colors.primary.tableHeader}>
                      <Table.ColumnHeader color={colors.primary.main}>
                        №
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color={colors.primary.main}>
                        НАЗВАНИЕ
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color={colors.primary.main}>
                        АРТИКУЛ
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color={colors.primary.main}>
                        КОЛИЧЕСТВО
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color={colors.primary.main}>
                        ЦЕНА (RUB)
                      </Table.ColumnHeader>
                      <Table.ColumnHeader color={colors.primary.main}>
                        КОММЕНТАРИЙ
                      </Table.ColumnHeader>
                      <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {productFields.map((product, index) => (
                      <Table.Row>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.article}</Table.Cell>
                        <Table.Cell>{product.count}</Table.Cell>
                        <Table.Cell>{product.cost}</Table.Cell>
                        <Table.Cell>{product.comment}</Table.Cell>
                      </Table.Row>
                    ))}

                    {!isAdding && (
                      <Table.Row>
                        <Table.Cell
                          colSpan={10}
                          color={colors.primary.placeholder}
                          onClick={() => setIsAdding(true)}
                          textAlign="center"
                          cursor="pointer"
                        >
                          Заполните данные по товару
                        </Table.Cell>
                      </Table.Row>
                    )}

                    {isAdding && (
                      <Table.Row>
                        <Table.Cell>{productFields.length + 1}</Table.Cell>

                        <Table.Cell>
                          <Field
                            mt={
                              errors.products?.[productFields.length]?.name
                                ? '40px'
                                : 0
                            }
                            display="flex"
                            alignItems="flex-start"
                            invalid={
                              !!errors.products?.[productFields.length]?.name
                            }
                            errorText={
                              errors.products?.[productFields.length]?.name
                                ?.message
                            }
                          >
                            <Controller
                              control={control}
                              name={`products.${productFields.length}.name`}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <Input
                                    name={value}
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Название товара"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                  />
                                );
                              }}
                            />
                          </Field>
                        </Table.Cell>

                        <Table.Cell>
                          <Field
                            mt={
                              errors.products?.[productFields.length]?.article
                                ? '40px'
                                : 0
                            }
                            invalid={
                              !!errors.products?.[productFields.length]?.article
                            }
                            errorText={
                              errors.products?.[productFields.length]?.article
                                ?.message
                            }
                          >
                            <Controller
                              control={control}
                              name={`products.${productFields.length}.article`}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <Input
                                    name={value}
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Название артикула"
                                  />
                                );
                              }}
                            />
                          </Field>
                        </Table.Cell>

                        <Table.Cell>
                          <Field
                            mt={
                              errors.products?.[productFields.length]?.count
                                ? '40px'
                                : 0
                            }
                            invalid={
                              !!errors.products?.[productFields.length]?.count
                            }
                            errorText={
                              errors.products?.[productFields.length]?.count
                                ?.message
                            }
                          >
                            <Controller
                              control={control}
                              name={`products.${productFields.length}.count`}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <Input
                                    name={value?.toString()}
                                    value={value}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      onChange(value ? value : e.target.value);
                                    }}
                                    placeholder="Кол-во товара"
                                    type="number"
                                  />
                                );
                              }}
                            />
                          </Field>
                        </Table.Cell>

                        <Table.Cell>
                          <Field
                            mt={
                              errors.products?.[productFields.length]?.cost
                                ? '40px'
                                : 0
                            }
                            invalid={
                              !!errors.products?.[productFields.length]?.cost
                            }
                            errorText={
                              errors.products?.[productFields.length]?.cost
                                ?.message
                            }
                          >
                            <Controller
                              control={control}
                              name={`products.${productFields.length}.cost`}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <Input
                                    name={value?.toString()}
                                    value={value}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      onChange(value ? value : e.target.value);
                                    }}
                                    placeholder="Стоимость товара"
                                    type="number"
                                  />
                                );
                              }}
                            />
                          </Field>
                        </Table.Cell>

                        <Table.Cell>
                          <Field
                            mt={
                              errors.products?.[productFields.length]?.comment
                                ? '40px'
                                : 0
                            }
                            invalid={
                              !!errors.products?.[productFields.length]?.comment
                            }
                            errorText={
                              errors.products?.[productFields.length]?.comment
                                ?.message
                            }
                          >
                            <Controller
                              control={control}
                              name={`products.${productFields.length}.comment`}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <Input
                                    name={value}
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Комментарий"
                                  />
                                );
                              }}
                            />
                          </Field>
                        </Table.Cell>

                        <Table.Cell>
                          <Button
                            bgColor={colors.secondary.button}
                            onClick={handleSubmit(handleAddProduct)}
                          >
                            Добавить
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>

                {/* TODO: make this a countable component */}
                <Flex
                  alignItems="center"
                  width="50%"
                  justifyContent="space-between"
                >
                  <Text fontSize="14px">СУММА</Text>
                  <Text fontSize="14px">{totalCost}</Text>
                </Flex>

                <Flex
                  alignItems="center"
                  width="50%"
                  justifyContent="space-between"
                >
                  <Text fontSize="14px">СУММА С ДОСТАВКОЙ</Text>
                  <Text fontSize="14px">{totalCostWithShipping}</Text>
                </Flex>
              </Flex>

              <Flex gap="16px" alignItems="center" justifyContent="flex-end">
                <Button
                  onClick={() => setIsCreating(false)}
                  bgColor="transparent"
                  color={colors.secondary.buttonColor}
                  padding="10px"
                  minWidth="140px"
                >
                  Отменить
                </Button>

                <Button
                  onClick={handleSubmit(handleSave)}
                  bgColor={colors.secondary.button}
                  padding="10px"
                  minWidth="140px"
                >
                  Создать
                </Button>
              </Flex>
            </Flex>
          </Fieldset.Root>
        </Fieldset.Content>
      </Flex>
    </Fieldset.Root>
  );
};
