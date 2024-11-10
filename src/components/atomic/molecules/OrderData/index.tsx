import { colors } from '../../../../theme';
import { Fieldset, Box, Textarea } from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import { SelectAtom } from '../../atoms/Select';
import { Controller } from 'react-hook-form';
import { Field } from '../../../ui/field';
import { OrderSchema } from '../../organisms/OrderForm/validationSchemas';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Client } from '../../../../features/clients/clientTypes';
import { formatPhone } from '../../../../utils';

type Props = {
  errors: FieldErrors<OrderSchema>;
  control: Control<OrderSchema, any>;
  clients: Client[];
  setValue: UseFormSetValue<OrderSchema>;
};

export const OrderDataMolecule = ({
  errors: { client: clientError },
  control,
  clients,
  setValue,
}: Props) => {
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
        invalid={!!clientError?.name}
        errorText={clientError?.name?.message}
      >
        <Controller
          control={control}
          name="client.name"
          render={({ field: { value, onChange } }) => (
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
          )}
        />
      </Field>

      <Field
        label="Номер телефона *"
        invalid={!!clientError?.phone}
        errorText={clientError?.phone?.message}
      >
        <Controller
          control={control}
          name="client.phone"
          render={({ field: { value, onChange } }) => (
            <Box width="100%">
              <InputMask
                mask="+7 (999) 999-99-99"
                name={value}
                value={value}
                onChange={onChange}
                color={colors.primary.secondary}
                style={{
                  border: `1px solid ${!clientError?.phone ? colors.primary.inputBorder : colors.status.rejectedColor}`,
                  borderRadius: '4px',
                  width: '100%',
                  padding: '8px',
                }}
              />
            </Box>
          )}
        />
      </Field>

      <Field label="Комментарий">
        <Controller
          control={control}
          name="comments"
          render={({ field: { value, onChange } }) => (
            <Textarea
              name={value}
              value={value}
              onChange={onChange}
              color={colors.primary.secondary}
              placeholder="Введите комментарий"
              rows={4}
            />
          )}
        />
      </Field>
    </Fieldset.Content>
  );
};
