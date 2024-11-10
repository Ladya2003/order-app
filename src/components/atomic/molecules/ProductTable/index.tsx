import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from '../../../../features/orders/orderSlice';
import { Input, Button, Fieldset, Flex, Table, Text } from '@chakra-ui/react';
import {
  Controller,
  useFieldArray,
  FieldErrors,
  Control,
} from 'react-hook-form';
import { OrderStatus } from '../../../../features/orders/orderTypes';
import { Field } from '../../../ui/field';
import { colors } from '../../../../theme/theme';
import { OrderSchema } from '../../organisms/OrderForm';
import { formatArticle } from '../../../../utils/article';
import {
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form/dist/types/form';

interface IProductTable {
  errors: FieldErrors<OrderSchema>;
  control: Control<OrderSchema, any>;
  shippingPrice?: number;
  trigger: UseFormTrigger<OrderSchema>;
  getValues: UseFormGetValues<OrderSchema>;
  isValid: boolean;
  setIsCreating: (state: boolean) => void;
  handleSubmit: UseFormHandleSubmit<OrderSchema>;
}

export const ProductTableMolecule = ({
  errors,
  control,
  shippingPrice,
  trigger,
  getValues,
  isValid,
  setIsCreating,
  handleSubmit,
}: IProductTable) => {
  const dispatch = useDispatch();

  const [isAdding, setIsAdding] = useState(false);

  const { fields: productFields } = useFieldArray({
    control,
    name: 'products',
  });

  const totalCost = productFields.reduce(
    (acc, cur) => (acc += cur.cost * cur.count),
    0,
  );

  const totalCostWithShipping = totalCost + (shippingPrice || 0);

  const handleAddProduct = async () => {
    const newIndex = productFields.length;

    const isProductValid = await trigger(`products.${newIndex}`);

    if (isProductValid) {
      const newProduct = getValues(`products.${newIndex}`);

      const formattedArticle = formatArticle(newProduct.article);

      productFields[productFields.length] = {
        ...newProduct,
        id: newProduct.article,
        article: formattedArticle,
      };

      setIsAdding(false);
    }
  };

  const handleSave = (formValues: OrderSchema) => {
    if (isValid) {
      dispatch(
        addOrder({
          ...formValues,
          id: Date.now(),
          status: OrderStatus.Created,
          deliveryDate: new Date(formValues.deliveryDate).toISOString(),
        }),
      );

      setIsCreating(false);
    }
  };
  return (
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
                        display="flex"
                        alignItems="flex-start"
                        invalid={
                          !!errors.products?.[productFields.length]?.name
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
                        invalid={
                          !!errors.products?.[productFields.length]?.article
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
                        invalid={
                          !!errors.products?.[productFields.length]?.count
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
                        invalid={
                          !!errors.products?.[productFields.length]?.cost
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
                        invalid={
                          !!errors.products?.[productFields.length]?.comment
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
                        onClick={handleAddProduct}
                      >
                        Добавить
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>

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
  );
};
