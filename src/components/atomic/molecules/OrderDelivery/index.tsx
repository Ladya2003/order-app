import { useState } from 'react';
import {
  Input,
  Fieldset,
  Flex,
  Box,
  List,
  ListItem,
  ClipboardRoot,
} from '@chakra-ui/react';
import { fetchAddressSuggestions } from '../../../../services/dadataService';
import { Controller, FieldErrors, Control } from 'react-hook-form';
import { Field } from '../../../ui/field';
import { colors } from '../../../../theme/theme';
import { ClipboardIconButton } from '../../../ui/clipboard';
import DateSelectorAtom from '../../atoms/DateSelector';
import { OrderSchema } from '../../organisms/OrderForm';

interface IOrderDelivery {
  errors: FieldErrors<OrderSchema>;
  control: Control<OrderSchema, any>;
  setShippingPrice: (price: number) => void;
}

export const OrderDeliveryMolecule = ({
  errors,
  control,
  setShippingPrice,
}: IOrderDelivery) => {
  const [suggestions, setSuggestions] = useState<[{ value?: string }]>([{}]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

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

  return (
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
                {isDropdownVisible &&
                  (suggestions.length > 1 ||
                    (suggestions.length === 1 &&
                      Object.keys(suggestions[0]).length > 0)) && (
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

      <Field
        label="Стоимость доставки"
        invalid={!!errors.shippingCost}
        errorText={errors.shippingCost?.message}
      >
        <Controller
          control={control}
          name="shippingCost"
          render={({ field: { value, onChange } }) => {
            return (
              <Flex alignItems="center" width="100%" gap="1px">
                <Input
                  name={value?.toString()}
                  value={value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);

                    onChange(value ? value : e.target.value);
                    setShippingPrice(value);
                  }}
                  placeholder="Введите сумму"
                  color={colors.primary.secondary}
                  type="number"
                />

                <Box
                  bgColor={colors.secondary.rubBgColor}
                  height="100%"
                  borderEndRadius="4px"
                  aspectRatio={1.4}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="14px"
                >
                  RUB
                </Box>
              </Flex>
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
            return <DateSelectorAtom value={value} onChange={onChange} />;
          }}
        />
      </Field>
    </Fieldset.Content>
  );
};
