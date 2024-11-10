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
import { colors } from '../../../../theme';
import { ClipboardIconButton } from '../../../ui/clipboard';
import DateSelectorAtom from '../../atoms/DateSelector';
import { OrderSchema } from '../../organisms/OrderForm/validationSchemas';
import { useToggle } from '../../../../hooks';

type Props = {
  errors: FieldErrors<OrderSchema>;
  control: Control<OrderSchema, any>;
  setShippingPrice: (price: number) => void;
};

const initialSuggestions: [{ value?: string }] = [{}];

export const OrderDeliveryMolecule = ({
  errors: {
    client: clientError,
    shippingCost: shippingCostError,
    deliveryDate: deliveryDateError,
  },
  control,
  setShippingPrice,
}: Props) => {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const {
    isToggledOn: isDropdownVisible,
    setToggleOn: showDropdown,
    setToggleOff: hideDropdown,
  } = useToggle();

  const hasSuggestions =
    suggestions.length > 1 ||
    (suggestions.length === 1 && Object.keys(suggestions[0]).length > 0);
  const shouldSuggestionsShow = isDropdownVisible && hasSuggestions;

  const handleInputChange = async (value: string) => {
    if (!value) {
      setSuggestions(initialSuggestions);
      hideDropdown();

      return;
    }

    const suggestions = await fetchAddressSuggestions(value);

    setSuggestions(suggestions);
    showDropdown();
  };

  return (
    <Fieldset.Content>
      <Fieldset.Legend fontSize="16px" color={colors.primary.main}>
        Доставка
      </Fieldset.Legend>

      <Field
        label="Адрес *"
        invalid={!!clientError?.address}
        errorText={clientError?.address?.message}
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
                  onBlur={() => setTimeout(() => hideDropdown(), 100)}
                  onFocus={() => value && showDropdown()}
                />

                <ClipboardRoot value={value}>
                  <ClipboardIconButton
                    style={{ height: '100%', aspectRatio: 1 }}
                  />
                </ClipboardRoot>
              </Flex>

              <Box position="relative" width="100%">
                {shouldSuggestionsShow && (
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
                            hideDropdown();
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
        invalid={!!shippingCostError}
        errorText={shippingCostError?.message}
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
        invalid={!!deliveryDateError}
        errorText={deliveryDateError?.message}
      >
        <Controller
          control={control}
          name="deliveryDate"
          render={({ field: { value, onChange } }) => (
            <DateSelectorAtom value={value} onChange={onChange} />
          )}
        />
      </Field>
    </Fieldset.Content>
  );
};
