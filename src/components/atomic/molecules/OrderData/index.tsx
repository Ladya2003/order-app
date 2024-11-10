import { colors } from '../../../../theme/theme';

import { Fieldset, Box, Textarea } from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import { SelectAtom } from '../../atoms/Select';
import { Controller } from 'react-hook-form';
import { Field } from '../../../ui/field';
import { OrderSchema } from '../../organisms/OrderForm';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Client } from '../../../../features/clients/clientTypes';
import { formatPhone } from '../../../../utils/phone';

interface IOrderData {
  errors: FieldErrors<OrderSchema>;
  control: Control<OrderSchema, any>;
  clients: Client[];
  setValue: UseFormSetValue<OrderSchema>;
}

export const OrderDataMolecule = ({
  errors,
  control,
  clients,
  setValue,
}: IOrderData) => {
  const options = clients.map((client) => ({
    label: client.name,
    value: client.name,
  }));

  return (
    <Fieldset.Content>
      <Fieldset.Legend fontSize="16px" color={colors.primary.main}>
        Данные заказа
      </Fieldset.Legend>

      <Field
        label="Имя клиента"
        invalid={!!errors.client?.name}
        errorText={errors.client?.name?.message}
      >
        <Controller
          control={control}
          name="client.name"
          render={({ field: { value, onChange } }) => {
            return (
              <SelectAtom
                options={options}
                value={value}
                onChange={(name) => {
                  const newClient = clients.find(
                    (client) => client.name === name,
                  );

                  onChange(name);

                  if (newClient) {
                    const { phone, address } = newClient;

                    setValue('client.phone', formatPhone(phone));
                    setValue('client.address', address);
                  }
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
  );
};
